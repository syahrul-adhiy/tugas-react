import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
   const location = useLocation();

   const isActive = (path) => location.pathname === path;

   return (
      <div
         className={`${
            sidebarOpen ? "block" : "hidden"
         } md:block w-64 bg-white shadow-md border-r border-gray-200 flex flex-col justify-between`}
      >
         <div>
            <div className="p-5 font-bold text-lg border-b border-gray-200 flex items-center justify-between">
               <span className="flex items-center gap-2">
                  <span>🧢</span> AlungStore Admin
               </span>
               <button
                  type="button"
                  className="md:hidden text-gray-500"
                  onClick={() => setSidebarOpen(false)}
               >
                  ✕
               </button>
            </div>
            <nav className="flex flex-col p-4 space-y-1.5">
               <Link
                  to="/admin/dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                     isActive("/admin/dashboard")
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
               >
                  <span>📦</span> Kelola Produk (CRUD)
               </Link>
               <Link
                  to="/admin/about"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                     isActive("/admin/about")
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
               >
                  <span>ℹ️</span> Tentang Admin
               </Link>
            </nav>
         </div>

         {/* Link kembali ke Toko */}
         <div className="p-4 border-t border-gray-200">
            <Link
               to="/"
               className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
               ← Kembali ke Toko
            </Link>
         </div>
      </div>
   );
}