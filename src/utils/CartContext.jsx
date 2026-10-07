import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
   const [cart, setCart] = useState([]);

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