import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

export default function ProductCard({ p }) {
      const { addToCart } = useCart();

      const formatPrice = (price) => {
            return typeof price === "number"
                  ? `Rp ${price.toLocaleString("id-ID")}`
                  : price;
      };

      const imgSrc = p.img?.startsWith("/") ? p.img : `/${p.img}`;

      return (
            <div key={p.id} className="border rounded-lg p-4 shadow hover:shadow-lg flex justify-between gap-4 bg-white">
                  <div className="flex-1 flex flex-col justify-between">
                        <div>
                              <h2 className="font-semibold text-gray-900 line-clamp-2">{p.name}</h2>
                              <p className="text-gray-600 mt-1">{formatPrice(p.price)}</p>

                              <Link
                                    to={`/product/${p.slug}`}
                                    state={p}
                                    className="text-gray-800 hover:text-black hover:underline mt-2 block text-sm font-medium"
                              >
                                    Lihat Detail
                              </Link>
                        </div>

                        {/* Fungsi Tambah ke cart */}
                        <button
                              onClick={() => addToCart(p)}
                              className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 cursor-pointer w-fit text-sm transition"
                        >
                              Add to Cart
                        </button>
                  </div>

                  <div className="w-24 h-32 flex-shrink-0 flex items-center justify-center p-1 bg-gray-50 border rounded-md">
                        <img 
                              src={imgSrc} 
                              alt={p.name} 
                              className="w-full h-full object-contain rounded-md"
                              onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/caps/cap_ny_black.jpg";
                              }}
                        />
                  </div>
            </div>
      );
}
