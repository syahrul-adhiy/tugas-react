import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { CategoryContext } from "../../layouts/MainLayout";
import { products } from "../../utils/data";

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() || "";
    const { selectedCategory } = useContext(CategoryContext);

    const filteredProducts = products.filter((product) => {
        const matchesQuery = product.name.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === "Semua Kategori" || product.category_name === selectedCategory;
        return matchesQuery && matchesCategory;
    });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Dashboard Produk
            </h1>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                        // p adalah props untuk mengirim data produk ke komponen ProductCard
                        <ProductCard key={item.id} p={item} />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center">Produk tidak ditemukan.</p>
                )}
            </div>
        </div>
    );
}