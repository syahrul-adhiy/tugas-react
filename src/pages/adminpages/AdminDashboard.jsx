import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../utils/ProductContext";

const PRESET_IMAGES = [
   { label: "NY Black Fitted", url: "/caps/cap_ny_black.jpg" },
   { label: "NY Heather Gray", url: "/caps/cap_ny_gray.jpg" },
   { label: "LA Matte Black", url: "/caps/cap_la_black.jpg" },
   { label: "LA Two-Tone Charcoal", url: "/caps/cap_la_gray.jpg" },
   { label: "White Sox Classic", url: "/caps/cap_mlb_sox.jpg" },
   { label: "Red Sox Graphite", url: "/caps/cap_mlb_redsox.jpg" },
   { label: "NBA Bulls Snapback", url: "/caps/cap_nba_bulls.jpg" },
   { label: "NBA Lakers Stealth", url: "/caps/cap_nba_lakers.jpg" },
];

const INITIAL_FORM_STATE = {
   name: "",
   category_name: "MLB",
   model: "59FIFTY Fitted",
   color: "Black / White",
   price: "",
   stock: "",
   img: "/caps/cap_ny_black.jpg",
   customImg: "",
   description: "",
};

export default function AdminDashboard() {
   const {
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      resetProducts,
   } = useProducts();

   // State untuk Search & Filter di Admin
   const [search, setSearch] = useState("");
   const [selectedCat, setSelectedCat] = useState("Semua Kategori");

   // State untuk Modal Form (Create / Edit)
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [currentId, setCurrentId] = useState(null);
   const [formData, setFormData] = useState(INITIAL_FORM_STATE);

   // State untuk Modal Konfirmasi Hapus
   const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

   // State Notifikasi / Toast
   const [toast, setToast] = useState({ show: false, message: "", type: "success" });

   const showToast = (message, type = "success") => {
      setToast({ show: true, message, type });
      setTimeout(() => {
         setToast({ show: false, message: "", type: "success" });
      }, 3000);
   };

   // Format Rupiah
   const formatPrice = (price) => {
      return typeof price === "number"
         ? `Rp ${price.toLocaleString("id-ID")}`
         : `Rp ${Number(price || 0).toLocaleString("id-ID")}`;
   };

   // Ringkasan Statistik
   const stats = useMemo(() => {
      const total = products.length;
      const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
      const totalValue = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);
      const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
      return { total, totalStock, totalValue, lowStock };
   }, [products]);

   // Filter Data Produk
   const filteredProducts = useMemo(() => {
      return products.filter((p) => {
         const matchName = (p.name || "").toLowerCase().includes(search.toLowerCase());
         const matchCat =
            selectedCat === "Semua Kategori" ||
            p.category_name?.toUpperCase() === selectedCat.toUpperCase();
         return matchName && matchCat;
      });
   }, [products, search, selectedCat]);

   // Buka Modal Tambah Produk (Create)
   const handleOpenCreateModal = () => {
      setIsEditing(false);
      setCurrentId(null);
      setFormData(INITIAL_FORM_STATE);
      setIsModalOpen(true);
   };

   // Buka Modal Edit Produk (Update)
   const handleOpenEditModal = (item) => {
      setIsEditing(true);
      setCurrentId(item.id);
      const isPreset = PRESET_IMAGES.some((img) => img.url === item.img);
      setFormData({
         name: item.name || "",
         category_name: item.category_name || "MLB",
         model: item.model || "59FIFTY Fitted",
         color: item.color || "",
         price: item.price ?? "",
         stock: item.stock ?? "",
         img: isPreset ? item.img : "custom",
         customImg: isPreset ? "" : item.img || "",
         description: item.description || "",
      });
      setIsModalOpen(true);
   };

   // Tutup Modal Form
   const handleCloseModal = () => {
      setIsModalOpen(false);
      setFormData(INITIAL_FORM_STATE);
      setIsEditing(false);
      setCurrentId(null);
   };

   // Handle Submit (Create atau Update)
   const handleSubmit = (e) => {
      e.preventDefault();

      if (!formData.name.trim()) {
         alert("Nama produk wajib diisi!");
         return;
      }
      if (formData.price === "" || Number(formData.price) <= 0) {
         alert("Harga produk harus lebih besar dari 0!");
         return;
      }
      if (formData.stock === "" || Number(formData.stock) < 0) {
         alert("Stok produk tidak boleh negatif!");
         return;
      }

      // Tentukan gambar
      const finalImg =
         formData.img === "custom"
            ? (formData.customImg.trim() || "/caps/cap_ny_black.jpg")
            : formData.img;

      const payload = {
         name: formData.name.trim(),
         category_name: formData.category_name,
         model: formData.model.trim() || "Cap",
         color: formData.color.trim() || "Standard",
         price: Number(formData.price),
         stock: Number(formData.stock),
         img: finalImg,
         description: formData.description.trim() || "Deskripsi produk belum ditambahkan.",
      };

      if (isEditing) {
         updateProduct(currentId, payload);
         showToast("Produk berhasil diperbarui!");
      } else {
         addProduct(payload);
         showToast("Produk baru berhasil ditambahkan!");
      }

      handleCloseModal();
   };

   // Handle Hapus Produk (Delete)
   const handleConfirmDelete = () => {
      if (!deleteModal.item) return;
      deleteProduct(deleteModal.item.id);
      showToast(`Produk "${deleteModal.item.name}" berhasil dihapus!`, "info");
      setDeleteModal({ isOpen: false, item: null });
   };

   // Handle Reset Produk
   const handleReset = () => {
      if (window.confirm("Apakah Anda yakin ingin mengembalikan semua produk ke data default awal? Semua produk tambahan akan dihapus.")) {
         resetProducts();
         showToast("Data produk berhasil dikembalikan ke default!", "info");
      }
   };

   return (
      <div className="space-y-6">
         {/* Toast Notification */}
         {toast.show && (
            <div
               className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2 transition-all transform animate-bounce ${
                  toast.type === "info"
                     ? "bg-blue-600 text-white"
                     : "bg-emerald-600 text-white"
               }`}
            >
               <span>{toast.type === "info" ? "ℹ️" : "✅"}</span>
               <span>{toast.message}</span>
            </div>
         )}

         {/* Header Title & Breadcrumb */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Manajemen Produk (CRUD)
               </h1>
               <p className="text-sm text-gray-500 mt-1">
                  Kelola data inventaris toko AlungStore secara langsung (Data tersimpan di LocalStorage).
               </p>
            </div>
            <div className="flex items-center gap-2">
               <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer shadow-sm"
                  title="Kembalikan ke produk awal"
               >
                  ↺ Reset ke Default
               </button>
               <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition flex items-center gap-2 cursor-pointer shadow-md"
               >
                  <span className="text-lg leading-none">+</span> Tambah Produk
               </button>
            </div>
         </div>

         {/* Kartu Statistik */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     Total Produk
                  </span>
                  <span className="text-xl">🧢</span>
               </div>
               <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
               <span className="text-xs text-gray-500">Item terdaftar</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     Total Stok
                  </span>
                  <span className="text-xl">📦</span>
               </div>
               <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalStock}</p>
               <span className="text-xs text-gray-500">Unit tersedia</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     Nilai Inventaris
                  </span>
                  <span className="text-xl">💰</span>
               </div>
               <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatPrice(stats.totalValue)}
               </p>
               <span className="text-xs text-gray-500">Estimasi total harga</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     Stok Kritis (≤5)
                  </span>
                  <span className="text-xl">⚠️</span>
               </div>
               <p
                  className={`text-2xl font-bold mt-2 ${
                     stats.lowStock > 0 ? "text-amber-600" : "text-gray-900"
                  }`}
               >
                  {stats.lowStock}
               </p>
               <span className="text-xs text-gray-500">Perlu restock segera</span>
            </div>
         </div>

         {/* Toolbar Filter & Pencarian */}
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="w-full md:w-80 relative">
               <input
                  type="text"
                  placeholder="Cari nama produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-gray-50 focus:bg-white"
               />
               <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
               <label className="text-xs text-gray-500 font-medium whitespace-nowrap">
                  Kategori:
               </label>
               <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white cursor-pointer"
               >
                  <option value="Semua Kategori">Semua Kategori</option>
                  <option value="MLB">MLB</option>
                  <option value="NY">NY</option>
                  <option value="LA">LA</option>
                  <option value="NBA">NBA</option>
               </select>
            </div>
         </div>

         {/* Tabel Produk (READ) */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Produk</th>
                        <th className="py-3.5 px-4">Kategori</th>
                        <th className="py-3.5 px-4">Model & Warna</th>
                        <th className="py-3.5 px-4">Harga</th>
                        <th className="py-3.5 px-4 text-center">Stok</th>
                        <th className="py-3.5 px-4 text-center">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                     {filteredProducts.length === 0 ? (
                        <tr>
                           <td colSpan="6" className="py-12 text-center text-gray-500">
                              <p className="text-3xl mb-2">🔍</p>
                              <p className="font-medium">Tidak ada produk yang sesuai.</p>
                              <p className="text-xs text-gray-400 mt-1">
                                 Coba ubah kata kunci pencarian atau tambahkan produk baru.
                              </p>
                           </td>
                        </tr>
                     ) : (
                        filteredProducts.map((p) => {
                           const imgSrc = p.img?.startsWith("/") ? p.img : `/${p.img}`;
                           const isLow = Number(p.stock) <= 5;
                           const isZero = Number(p.stock) === 0;

                           return (
                              <tr
                                 key={p.id}
                                 className="hover:bg-gray-50/80 transition-colors"
                              >
                                 {/* Kolom Produk & Gambar */}
                                 <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-200 p-1 flex items-center justify-center">
                                          <img
                                             src={imgSrc}
                                             alt={p.name}
                                             className="w-full h-full object-contain rounded"
                                             onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/caps/cap_ny_black.jpg";
                                             }}
                                          />
                                       </div>
                                       <div className="max-w-xs">
                                          <p className="font-semibold text-gray-900 line-clamp-1">
                                             {p.name}
                                          </p>
                                          <Link
                                             to={`/product/${p.slug}`}
                                             className="text-xs text-blue-600 hover:underline"
                                             target="_blank"
                                             rel="noreferrer"
                                          >
                                             Lihat di Toko ↗
                                          </Link>
                                       </div>
                                    </div>
                                 </td>

                                 {/* Kolom Kategori */}
                                 <td className="py-3 px-4">
                                    <span
                                       className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                          p.category_name === "NY"
                                             ? "bg-blue-100 text-blue-800"
                                             : p.category_name === "LA"
                                             ? "bg-purple-100 text-purple-800"
                                             : p.category_name === "NBA"
                                             ? "bg-red-100 text-red-800"
                                             : "bg-emerald-100 text-emerald-800"
                                       }`}
                                    >
                                       {p.category_name}
                                    </span>
                                 </td>

                                 {/* Kolom Model & Warna */}
                                 <td className="py-3 px-4">
                                    <p className="font-medium text-gray-800">{p.model || "-"}</p>
                                    <p className="text-xs text-gray-500">{p.color || "-"}</p>
                                 </td>

                                 {/* Kolom Harga */}
                                 <td className="py-3 px-4 font-semibold text-gray-900">
                                    {formatPrice(p.price)}
                                 </td>

                                 {/* Kolom Stok */}
                                 <td className="py-3 px-4 text-center">
                                    <span
                                       className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                                          isZero
                                             ? "bg-red-100 text-red-700"
                                             : isLow
                                             ? "bg-amber-100 text-amber-700"
                                             : "bg-gray-100 text-gray-800"
                                       }`}
                                    >
                                       {p.stock} pcs
                                    </span>
                                 </td>

                                 {/* Kolom Aksi (Edit & Hapus) */}
                                 <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                       <button
                                          type="button"
                                          onClick={() => handleOpenEditModal(p)}
                                          className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-black hover:text-white rounded-md transition cursor-pointer"
                                          title="Edit produk"
                                       >
                                          ✏️ Edit
                                       </button>
                                       <button
                                          type="button"
                                          onClick={() => setDeleteModal({ isOpen: true, item: p })}
                                          className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition cursor-pointer"
                                          title="Hapus produk"
                                       >
                                          🗑️ Hapus
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })
                     )}
                  </tbody>
               </table>
            </div>

            {/* Footer Tabel */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2">
               <span>
                  Menampilkan {filteredProducts.length} dari {products.length} produk
               </span>
               <span className="text-gray-400">
                  Data otomatis tersimpan di LocalStorage browser
               </span>
            </div>
         </div>

         {/* MODAL FORM: CREATE & UPDATE */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
               <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                     <h2 className="text-xl font-bold text-gray-900">
                        {isEditing ? "Edit Data Produk" : "Tambah Produk Baru"}
                     </h2>
                     <button
                        type="button"
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
                     >
                        ×
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                     {/* Nama Produk */}
                     <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                           Nama Produk *
                        </label>
                        <input
                           type="text"
                           required
                           placeholder="Contoh: New Era 59FIFTY NY Yankees Navy..."
                           value={formData.name}
                           onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                           }
                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                     </div>

                     {/* Kategori & Model */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                              Kategori
                           </label>
                           <select
                              value={formData.category_name}
                              onChange={(e) =>
                                 setFormData({ ...formData, category_name: e.target.value })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white cursor-pointer"
                           >
                              <option value="MLB">MLB</option>
                              <option value="NY">NY</option>
                              <option value="LA">LA</option>
                              <option value="NBA">NBA</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                              Model Topi
                           </label>
                           <input
                              type="text"
                              placeholder="59FIFTY Fitted / 9FORTY Curved"
                              value={formData.model}
                              onChange={(e) =>
                                 setFormData({ ...formData, model: e.target.value })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                           />
                        </div>
                     </div>

                     {/* Harga, Stok, dan Warna */}
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                           <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                              Harga (Rp) *
                           </label>
                           <input
                              type="number"
                              required
                              min="1000"
                              placeholder="899000"
                              value={formData.price}
                              onChange={(e) =>
                                 setFormData({ ...formData, price: e.target.value })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                              Stok *
                           </label>
                           <input
                              type="number"
                              required
                              min="0"
                              placeholder="15"
                              value={formData.stock}
                              onChange={(e) =>
                                 setFormData({ ...formData, stock: e.target.value })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                              Warna
                           </label>
                           <input
                              type="text"
                              placeholder="Black / White"
                              value={formData.color}
                              onChange={(e) =>
                                 setFormData({ ...formData, color: e.target.value })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                           />
                        </div>
                     </div>

                     {/* Pilihan Gambar */}
                     <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                           Gambar Produk
                        </label>
                        <select
                           value={formData.img}
                           onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white cursor-pointer"
                        >
                           {PRESET_IMAGES.map((img) => (
                              <option key={img.url} value={img.url}>
                                 {img.label} ({img.url})
                              </option>
                           ))}
                           <option value="custom">URL Gambar Kustom...</option>
                        </select>

                        {formData.img === "custom" && (
                           <input
                              type="text"
                              placeholder="https://contoh.com/gambar-topi.jpg atau /caps/..."
                              value={formData.customImg}
                              onChange={(e) =>
                                 setFormData({ ...formData, customImg: e.target.value })
                              }
                              className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                           />
                        )}

                        {/* Preview Gambar Kecil */}
                        <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                           <div className="w-10 h-10 bg-white rounded border flex items-center justify-center p-0.5">
                              <img
                                 src={
                                    formData.img === "custom"
                                       ? formData.customImg || "/caps/cap_ny_black.jpg"
                                       : formData.img
                                 }
                                 alt="Preview"
                                 className="w-full h-full object-contain rounded"
                                 onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/caps/cap_ny_black.jpg";
                                 }}
                              />
                           </div>
                           <span className="text-xs text-gray-500">
                              Preview Thumbnail Produk
                           </span>
                        </div>
                     </div>

                     {/* Deskripsi */}
                     <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                           Deskripsi Produk
                        </label>
                        <textarea
                           rows="3"
                           placeholder="Jelaskan detail material, visor, siluet topi..."
                           value={formData.description}
                           onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                           }
                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        ></textarea>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                           type="button"
                           onClick={handleCloseModal}
                           className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                        >
                           Batal
                        </button>
                        <button
                           type="submit"
                           className="px-5 py-2 text-sm font-semibold text-white bg-black hover:bg-gray-800 rounded-lg transition cursor-pointer shadow-md"
                        >
                           {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* MODAL KONFIRMASI HAPUS (DELETE) */}
         {deleteModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl mb-3">
                     🗑️
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                     Konfirmasi Hapus Produk
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                     Apakah Anda yakin ingin menghapus produk{" "}
                     <span className="font-semibold text-gray-900">
                        "{deleteModal.item?.name}"
                     </span>
                     ? Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex justify-center gap-3">
                     <button
                        type="button"
                        onClick={() => setDeleteModal({ isOpen: false, item: null })}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                     >
                        Batal
                     </button>
                     <button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition cursor-pointer shadow-md"
                     >
                        Ya, Hapus
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}