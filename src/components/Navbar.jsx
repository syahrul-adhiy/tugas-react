import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

export default function Navbar() {
    // Mengambil totalQty dari context UseCart
    const { totalQty } = useCart();

    return (
        <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
            {/* Logo */}
            <Link to="/" className="font-bold text-xl">
                AlungStore
            </Link>
            {/* Menu Navigasi */}
            <div className="flex gap-6 items-center">
                {/* Dashboard Links */}
                <Link to="/dashboard" className="hover:text-gray-300">
                    Dashboard
                </Link>
                <Link to="/cart" className="hover:text-gray-300">
                    Keranjang
                    {/* Menampilkan totalQty jika ada item di keranjang */}
                    {totalQty > 0 && (
                        <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full ml-1">
                            {totalQty}
                        </span>
                    )}
                </Link>
                <Link to="/checkout" className="hover:text-gray-300">
                    Checkout
                </Link>
                <Link
                    to="/admin/dashboard"
                    className="text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 transition flex items-center gap-1.5"
                >
                    <span>⚙️</span> Admin
                </Link>
            </div>
        </nav>
    );
}