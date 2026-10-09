/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { initialProducts } from "./data";

const ProductContext = createContext();
const PRODUCT_STORAGE_KEY = "alungstore_products";

export function ProductProvider({ children }) {
   // State untuk data produk dengan inisialisasi dari localStorage
   const [products, setProducts] = useState(() => {
      try {
         const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
         if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
               return parsed;
            }
         }
      } catch (err) {
         console.error("Gagal membaca produk dari localStorage:", err);
      }
      return initialProducts;
   });

   // Sinkronisasi data produk ke localStorage setiap kali state products berubah
   useEffect(() => {
      try {
         localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
      } catch (err) {
         console.error("Gagal menyimpan produk ke localStorage:", err);
      }
   }, [products]);

   const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
   const [searchQuery, setSearchQuery] = useState("");

   // Fungsi CRUD: Create (Menambah produk baru)
   const addProduct = (newProduct) => {
      const id = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
      const slug = (newProduct.name || `product-${id}`)
         .toLowerCase()
         .replace(/[^a-z0-9]+/g, "-")
         .replace(/^-+|-+$/g, "");

      const productToAdd = {
         id,
         name: newProduct.name?.trim() || `Produk Baru #${id}`,
         slug: `${slug}-${id}`,
         price: Number(newProduct.price) || 0,
         stock: Number(newProduct.stock) || 0,
         category: newProduct.category || 1,
         category_name: newProduct.category_name || "MLB",
         model: newProduct.model || "59FIFTY Fitted",
         color: newProduct.color || "Black / White",
         rating: Number(newProduct.rating) || 5.0,
         reviewsCount: Number(newProduct.reviewsCount) || 0,
         description: newProduct.description?.trim() || "Deskripsi produk belum tersedia.",
         img: newProduct.img || "/caps/cap_ny_black.jpg",
      };

      setProducts((prev) => [productToAdd, ...prev]);
      return productToAdd;
   };

   // Fungsi CRUD: Update (Mengedit produk)
   const updateProduct = (id, updatedFields) => {
      setProducts((prev) =>
         prev.map((item) => {
            if (item.id === id || item.id === Number(id)) {
               const newName = updatedFields.name !== undefined ? updatedFields.name : item.name;
               let newSlug = item.slug;
               if (updatedFields.name && updatedFields.name !== item.name) {
                  const baseSlug = updatedFields.name
                     .toLowerCase()
                     .replace(/[^a-z0-9]+/g, "-")
                     .replace(/^-+|-+$/g, "");
                  newSlug = `${baseSlug}-${item.id}`;
               }

               return {
                  ...item,
                  ...updatedFields,
                  name: newName,
                  slug: newSlug,
                  price: updatedFields.price !== undefined ? Number(updatedFields.price) || 0 : item.price,
                  stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) || 0 : item.stock,
               };
            }
            return item;
         })
      );
   };

   // Fungsi CRUD: Delete (Menghapus produk)
   const deleteProduct = (id) => {
      setProducts((prev) => prev.filter((item) => item.id !== id && item.id !== Number(id)));
   };

   // Fungsi manipulasi data dummy: Mengurangi stok saat pembelian / checkout
   const decreaseStock = (id, qty) => {
      setProducts((prev) =>
         prev.map((item) =>
            item.id === id || item.id === Number(id)
               ? { ...item, stock: Math.max(0, item.stock - qty) }
               : item
         )
      );
   };

   // Reset ke data default awal
   const resetProducts = () => {
      setProducts(initialProducts);
      try {
         localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(initialProducts));
      } catch (err) {
         console.error("Gagal mereset produk di localStorage:", err);
      }
   };

   // Menghitung produk yang difilter berdasarkan query pencarian dan kategori (MLB, NY, LA, NBA)
   const filteredProducts = useMemo(() => {
      return products.filter((product) => {
         const matchesQuery = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
         const matchesCategory =
            selectedCategory === "Semua Kategori" ||
            product.category_name?.toUpperCase() === selectedCategory.toUpperCase();
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
