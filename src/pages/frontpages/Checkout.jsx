import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../utils/CartContext";
import { useProducts } from "../../utils/ProductContext";

export default function Checkout() {
   const { cart, totalPrice, totalQty, clearCart } = useCart();
   const { decreaseStock } = useProducts();

   const [formData, setFormData] = useState({
      fullName: "",
      phone: "",
      address: "",
      paymentMethod: "QRIS",
   });

   const [orderSuccess, setOrderSuccess] = useState(false);
   const [orderId, setOrderId] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();

      if (cart.length === 0) {
         alert("Keranjang belanja Anda kosong!");
         return;
      }

      if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
         alert("Silakan lengkapi formulir pengiriman!");
         return;
      }

      // Kurangi stok untuk setiap item di keranjang
      cart.forEach((item) => {
         decreaseStock(item.id, item.qty);
      });

      const generatedId = `ALUNG-${Date.now().toString().slice(-6)}`;
      setOrderId(generatedId);
      setOrderSuccess(true);
      clearCart();
   };

   if (orderSuccess) {
      return (
         <div className="max-w-md mx-auto p-8 my-8 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
               ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h2>
            <p className="text-sm text-gray-500 mb-4">
               Terima kasih, <span className="font-semibold text-gray-800">{formData.fullName}</span>. Pesanan Anda telah diterima dan stok produk telah diperbarui.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-left text-sm mb-6 space-y-1.5 border border-gray-100">
               <div className="flex justify-between">
                  <span className="text-gray-500">ID Pesanan:</span>
                  <span className="font-mono font-semibold text-gray-800">{orderId}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">Metode:</span>
                  <span className="font-semibold text-gray-800">{formData.paymentMethod}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">Total Dibayar:</span>
                  <span className="font-bold text-gray-900">
                     Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
               </div>
            </div>
            <Link
               to="/dashboard"
               className="inline-block w-full py-2.5 px-4 bg-black text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition"
            >
               Belanja Lagi
            </Link>
         </div>
      );
   }

   if (cart.length === 0) {
      return (
         <div className="max-w-md mx-auto p-8 my-8 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
            <div className="text-4xl mb-3">🛍️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Produk untuk Checkout</h2>
            <p className="text-sm text-gray-500 mb-6">Keranjang Anda masih kosong. Silakan pilih produk terlebih dahulu.</p>
            <Link
               to="/dashboard"
               className="inline-block py-2.5 px-6 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition"
            >
               Lihat Katalog Produk
            </Link>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
         <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout Pesanan</h1>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form Informasi Pengiriman */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Data Pengiriman
               </h2>

               <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                     Nama Lengkap *
                  </label>
                  <input
                     type="text"
                     required
                     placeholder="Nama lengkap penerima..."
                     value={formData.fullName}
                     onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
               </div>

               <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                     Nomor WhatsApp / HP *
                  </label>
                  <input
                     type="tel"
                     required
                     placeholder="08123456789..."
                     value={formData.phone}
                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
               </div>

               <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                     Alamat Lengkap *
                  </label>
                  <textarea
                     rows="3"
                     required
                     placeholder="Jalan, Nomor Rumah, RT/RW, Kota/Kabupaten..."
                     value={formData.address}
                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  ></textarea>
               </div>

               <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                     Metode Pembayaran
                  </label>
                  <select
                     value={formData.paymentMethod}
                     onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white cursor-pointer"
                  >
                     <option value="QRIS">QRIS (BCA, Mandiri, GoPay, OVO)</option>
                     <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                     <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                     <option value="COD (Bayar di Tempat)">COD (Bayar di Tempat)</option>
                  </select>
               </div>

               <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold text-sm transition shadow cursor-pointer"
               >
                  Bayar Sekarang — Rp {totalPrice.toLocaleString("id-ID")}
               </button>
            </form>

            {/* Ringkasan Belanja */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit space-y-4">
               <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Ringkasan Belanja
               </h2>

               <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                     <div key={item.id} className="flex justify-between items-start text-sm">
                        <div className="pr-2">
                           <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                           <p className="text-xs text-gray-500">
                              {item.qty} × Rp {item.price.toLocaleString("id-ID")}
                           </p>
                        </div>
                        <span className="font-semibold text-gray-900 whitespace-nowrap">
                           Rp {(item.price * item.qty).toLocaleString("id-ID")}
                        </span>
                     </div>
                  ))}
               </div>

               <div className="border-t pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                     <span>Total Item</span>
                     <span>{totalQty} pcs</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                     <span>Ongkos Kirim</span>
                     <span className="text-emerald-600 font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                     <span>Total</span>
                     <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}