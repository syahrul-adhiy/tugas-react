import { Link } from "react-router-dom";
import { useCart } from "../../utils/CartContext";

export default function Cart() {
   // Mengambil cart, updateQty, removeFromCart, totalPrice, totalQty dari context useCart
   const { cart, updateQty, removeFromCart, totalPrice, totalQty, clearCart } = useCart();

   if (cart.length === 0) {
      return (
         <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto my-8">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Keranjang Masih Kosong</h2>
            <p className="text-gray-500 mb-6">Pilih produk favorit Anda dan tambahkan ke keranjang.</p>
            <Link
               to="/dashboard"
               className="inline-block px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
               Mulai Belanja
            </Link>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
               Keranjang Belanja ({totalQty} item)
            </h1>
            <button
               onClick={clearCart}
               className="text-sm text-red-600 hover:text-red-700 hover:underline cursor-pointer"
            >
               Kosongkan Keranjang
            </button>
         </div>

         <div className="space-y-4 mb-8">
            {/* Menampilkan item di cart */}
            {cart.map((item) => {
               const imgSrc = item.img?.startsWith("/") ? item.img : `/${item.img}`;
               return (
                  <div
                     key={item.id}
                     className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 p-4 rounded-xl shadow-sm bg-white gap-4"
                  >
                     <div className="flex items-center gap-4">
                        <img
                           src={imgSrc}
                           alt={item.name}
                           className="w-16 h-16 rounded-lg object-contain border p-1 bg-gray-50 flex-shrink-0"
                           onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/caps/cap_ny_black.jpg";
                           }}
                        />

                        <div>
                           <h2 className="font-semibold text-gray-900 line-clamp-1">
                              {item.name}
                           </h2>
                           <p className="text-sm text-gray-500">
                              Rp {item.price.toLocaleString("id-ID")} / item
                           </p>
                           <p className="text-sm font-medium text-gray-800 sm:hidden mt-1">
                              Subtotal: Rp {(item.price * item.qty).toLocaleString("id-ID")}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="hidden sm:block text-right">
                           <span className="text-sm font-semibold text-gray-900">
                              Rp {(item.price * item.qty).toLocaleString("id-ID")}
                           </span>
                        </div>

                        <div className="flex items-center border rounded-lg overflow-hidden">
                           <button
                              type="button"
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                              onClick={() => updateQty(item.id, item.qty - 1)}
                           >
                              -
                           </button>
                           <input
                              type="number"
                              value={item.qty}
                              min="1"
                              className="w-12 text-center text-sm py-1 border-x border-gray-200 focus:outline-none"
                              onChange={(e) =>
                                 updateQty(
                                    item.id,
                                    parseInt(e.target.value) || 1
                                 )
                              }
                           />
                           <button
                              type="button"
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                              onClick={() => updateQty(item.id, item.qty + 1)}
                           >
                              +
                           </button>
                        </div>

                        {/* Button untuk remove item dari cart */}
                        <button
                           onClick={() => removeFromCart(item.id)}
                           className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer text-sm font-medium transition"
                        >
                           Hapus
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Ringkasan Belanja */}
         <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               <p className="text-sm text-gray-500">Total Pembayaran ({totalQty} item):</p>
               <p className="text-2xl font-bold text-gray-900">
                  Rp {totalPrice.toLocaleString("id-ID")}
               </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <Link
                  to="/dashboard"
                  className="flex-1 md:flex-none text-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
               >
                  Lanjut Belanja
               </Link>
               <Link
                  to="/checkout"
                  className="flex-1 md:flex-none text-center px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium shadow"
               >
                  Checkout Sekarang →
               </Link>
            </div>
         </div>
      </div>
   );
}