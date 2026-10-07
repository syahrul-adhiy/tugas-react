import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { products } from "../../utils/data";
import { useCart } from "../../utils/CartContext";

export default function ProductDetail() {
   /* Mengambil ID/slug produk dari URL */
   const { id } = useParams();

   // Mengambil state yang dikirim dari Link
   const location = useLocation();

   // state adalah objek produk yang dikirim dari Link, jika tidak ada cari dari data dummy
   const p = location.state || products.find(prod => prod.slug === id || prod.id.toString() === id);

   const { addToCart } = useCart();

   if (!p) {
      return <div className="p-6">Produk tidak ditemukan.</div>;
   }

   const formatPrice = (price) => {
      return typeof price === "number"
         ? `Rp ${price.toLocaleString("id-ID")}`
         : price;
   };

   const imgSrc = p.img?.startsWith("/") ? p.img : `/${p.img}`;

   // State untuk rating dan review
   const [rating, setRating] = useState(0);
   const [review, setReview] = useState("");
   const [reviews, setReviews] = useState([]);

   // Handle submit review
   const handleSubmit = (e) => {
      e.preventDefault();

      if (!rating || !review.trim()) return;

      // Membuat objek review baru
      const newReview = {
         id: Date.now(),
         rating,
         review,
      };

      // Menambahkan review baru ke daftar reviews
      setReviews([...reviews, newReview]);

      setRating(0);
      setReview("");
   };

   return (
      <div className="p-6 space-y-6 flex flex-col md:flex-row gap-6">

         <section className="flex-4 gap-6 space-y-6">
               <div className="border rounded-lg p-4 shadow hover:shadow-lg bg-white flex gap-6 items-center">
                  <div className="w-28 h-36 sm:w-36 sm:h-44 flex-shrink-0 bg-gray-50 border rounded-md p-2 flex items-center justify-center">
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
                  <div>
                     <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                        {p.category_name}
                     </span>
                     <h1 className="text-2xl font-bold mt-2">
                        {p.name}
                     </h1>

                     <p className="mt-2 text-xl font-semibold text-gray-700">
                        {formatPrice(p.price)}
                     </p>

                     <button
                        onClick={() => addToCart && addToCart(p)}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 cursor-pointer transition text-sm"
                     >
                        Add to Cart
                     </button>
                  </div>
               </div>

               <div>
                  <h2 className="text-xl font-semibold mb-3">
                     User Reviews
                  </h2>

                  {reviews.length === 0 ? (
                     <p className="text-gray-500">
                           Belum ada review.
                     </p>
                  ) : (
                     <ul className="space-y-4">
                           {reviews.map((r) => (
                              <li
                                 key={r.id}
                                 className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                              >
                                 <div className="flex items-center gap-2 mb-2">

                                       {/* Menampilkan bintang sesuai rating */}
                                       {[...Array(r.rating)].map((_, i) => (
                                          <span
                                             key={i}
                                             className="text-yellow-500"
                                          >
                                             ★
                                          </span>
                                       ))}

                                       {[...Array(5 - r.rating)].map((_, i) => (
                                          <span
                                             key={i}
                                             className="text-gray-300"
                                          >
                                             ★
                                          </span>
                                       ))}

                                 </div>

                                 <p className="text-gray-700">
                                       {r.review}
                                 </p>
                              </li>
                           ))}
                     </ul>
                  )}
               </div>
         </section>

         <section className="border rounded-lg p-4 shadow hover:shadow-lg flex-1 bg-white h-fit">
               <h2 className="text-xl font-semibold mt-2 mb-4">
                  Reviews
               </h2>

               {/* Form Rating & Review */}
               <form onSubmit={handleSubmit} className="mb-6">

                  <div className="mb-4">
                     <label className="block text-lg font-medium mb-2">
                           Rating:
                     </label>

                     <div className="flex gap-2">

                           {/* Menampilkan 5 bintang untuk rating */}
                           {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                 type="button"
                                 key={star}
                                 onClick={() => setRating(star)}
                                 className={`text-2xl cursor-pointer ${
                                       star <= rating
                                          ? "text-yellow-500"
                                          : "text-gray-300"
                                 }`}
                              >
                                 ★
                              </button>
                           ))}

                     </div>
                  </div>

                  <div className="mb-4">
                     <label className="block text-lg font-medium mb-2">
                           Review:
                     </label>

                     {/* Textarea untuk review */}
                     <textarea
                           value={review}
                           // Menampilkan textarea untuk review
                           onChange={(e) => setReview(e.target.value)}
                           className="w-full border rounded-lg p-3"
                           rows="3"
                           placeholder="Tulis pengalaman Anda..."
                     ></textarea>
                  </div>

                  <button
                     type="submit"
                     className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer transition text-sm"
                  >
                     Submit
                  </button>

               </form>
         </section>

      </div>
   );
}
