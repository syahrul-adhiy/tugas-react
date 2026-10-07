import { useCart } from "../../utils/CartContext";

export default function Cart() {
   // Mengambil cart, updateQty, removeFromCart dari context useCart
   const { cart, updateQty, removeFromCart } = useCart();

   if (cart.length === 0) {
      return (
         <div className="p-6 text-center text-gray-600">
               Cart is empty
         </div>
      );
   }

   return (
      <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">
               Your Cart
         </h1>

         <div className="space-y-4">
               {/* Menampilkan item di cart */}
               {cart.map((item) => {
                  const imgSrc = item.img?.startsWith("/") ? item.img : `/${item.img}`;
                  return (
                     <div
                        key={item.id}
                        className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
                     >
                        <div className="flex items-center gap-4">
                              <img
                                 src={imgSrc}
                                 alt={item.name}
                                 className="w-16 h-16 rounded-md object-contain border p-1 bg-gray-50"
                                 onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/caps/cap_ny_black.jpg";
                                 }}
                              />

                              <div>
                                 <h2 className="font-semibold text-gray-900">
                                    {item.name}
                                 </h2>

                                 <p className="text-gray-600">
                                    Rp {item.price.toLocaleString("id-ID")}
                                 </p>
                              </div>
                        </div>

                        <div className="flex items-center gap-2">
                              {/* Input untuk update qty */}
                              <input
                                 type="number"
                                 value={item.qty}
                                 min="1"
                                 className="w-16 border rounded text-center"
                                 onChange={(e) =>
                                    updateQty(
                                          item.id,
                                          parseInt(e.target.value) || 1
                                    )
                                 }
                              />

                              {/* Button untuk remove item dari cart */}
                              <button
                                 onClick={() => removeFromCart(item.id)}
                                 className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer text-sm transition"
                              >
                                 Delete
                              </button>
                        </div>
                     </div>
                  );
               })}
         </div>
      </div>
   );
}