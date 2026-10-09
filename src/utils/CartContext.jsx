/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const CART_STORAGE_KEY = "alungstore_cart";

export function CartProvider({ children }) {
   // State cart dengan inisialisasi dari localStorage
   const [cart, setCart] = useState(() => {
      try {
         const saved = localStorage.getItem(CART_STORAGE_KEY);
         if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
         }
      } catch (err) {
         console.error("Gagal membaca cart dari localStorage:", err);
      }
      return [];
   });

   // Sinkronisasi data cart ke localStorage
   useEffect(() => {
      try {
         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (err) {
         console.error("Gagal menyimpan cart ke localStorage:", err);
      }
   }, [cart]);

   // Tambah ke cart (dengan qty opsional)
   const addToCart = (product, quantity = 1) => {
      const addQty = Math.max(1, quantity);
      setCart((prev) => {
         const existing = prev.find((item) => item.id === product.id);

         if (existing) {
            return prev.map((item) =>
               item.id === product.id
                  ? { ...item, qty: item.qty + addQty }
                  : item
            );
         }

         return [...prev, { ...product, qty: addQty }];
      });
   };

   // Update qty
   const updateQty = (id, qty) => {
      if (qty <= 0) {
         removeFromCart(id);
         return;
      }
      setCart((prev) =>
         prev.map((item) =>
            item.id === id
               ? { ...item, qty: qty }
               : item
         )
      );
   };

   // Hapus item
   const removeFromCart = (id) => {
      setCart((prev) => prev.filter((item) => item.id !== id));
   };

   // Bersihkan cart setelah checkout
   const clearCart = () => {
      setCart([]);
   };

   const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
   const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

   return (
      <CartContext.Provider
         value={{
            cart,
            addToCart,
            updateQty,
            removeFromCart,
            clearCart,
            totalQty,
            totalPrice,
         }}
      >
         {children}
      </CartContext.Provider>
   );
}

export const useCart = () => {
   const context = useContext(CartContext);
   if (!context) {
      throw new Error("useCart must be used within a CartProvider");
   }
   return context;
};