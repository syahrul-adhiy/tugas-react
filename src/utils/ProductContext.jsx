import { createContext, useContext, useState, useMemo } from "react";
import { initialProducts } from "./data";

const ProductContext = createContext();

export function ProductProvider({ children }) {
   // State untuk manipulasi data produk dummy
   const [products, setProducts] = useState(initialProducts);
   const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
   const [searchQuery, setSearchQuery] = useState("");

   // Fungsi manipulasi data dummy: Menambah produk baru
   const addProduct = (newProduct) => {
      const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const productToAdd = {
         ...newProduct,
         id,
         slug,
         price: Number(newProduct.price) || 0,
         stock: Number(newProduct.stock) || 0,
         rating: 5.0,
         reviewsCount: 0,
         img: newProduct.img || "/caps/cap_ny_black.jpg",
      };
      setProducts((prev) => [productToAdd, ...prev]);
   };

   // Fungsi manipulasi data dummy: Mengedit produk
   const updateProduct = (id, updatedFields) => {
      setProducts((prev) =>
         prev.map((item) =>
            item.id === id ? { ...item, ...updatedFields } : item
         )
      );
   };

   // Fungsi manipulasi data dummy: Menghapus produk
   const deleteProduct = (id) => {
      setProducts((prev) => prev.filter((item) => item.id !== id));
   };

   // Fungsi manipulasi data dummy: Mengurangi stok saat pembelian / checkout
   const decreaseStock = (id, qty) => {
      setProducts((prev) =>
         prev.map((item) =>
            item.id === id
               ? { ...item, stock: Math.max(0, item.stock - qty) }
               : item
         )
      );
   };

   // Reset ke data dummy awal
   const resetProducts = () => {
      setProducts(initialProducts);
   };

   // Menghitung produk yang difilter berdasarkan query pencarian dan kategori (MLB, NY, LA, NBA)
   const filteredProducts = useMemo(() => {
      return products.filter((product) => {
         const matchesQuery = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
         const matchesCategory =
            selectedCategory === "Semua Kategori" ||
            product.category_name.toUpperCase() === selectedCategory.toUpperCase();
         return matchesQuery && matchesCategory;
      });
   }, [products, searchQuery, selectedCategory]);

   return (
      <ProductContext.Provider
         value={{
            products,
            filteredProducts,
            selectedCategory,
            setSelectedCategory,
            searchQuery,
            setSearchQuery,
            addProduct,
            updateProduct,
            deleteProduct,
            decreaseStock,
            resetProducts,
         }}
      >
         {children}
      </ProductContext.Provider>
   );
}

export const useProducts = () => {
   const context = useContext(ProductContext);
   if (!context) {
      throw new Error("useProducts must be used within a ProductProvider");
   }
   return context;
};
