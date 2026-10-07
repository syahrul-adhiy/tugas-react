import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

// Export Default menandai bahwa komponen ini nantinya dibaca sebagai AdminLayout
export default function AdminLayout() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   return (
      <div className="flex h-screen bg-gray-100">
         {/* Menggunakan Componen Sidebar */}
         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
         {/* Main content */}
         <div className="flex-1 flex flex-col">
            {/* Top bar (for mobile) */}
            <div className="md:hidden bg-white shadow p-4 flex justify-between">
               <h1 className="font-bold">My Admin</h1>
               <button
                  className="p-2 border rounded"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
               >
                  ☰
               </button>
            </div>
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6">
               <Outlet />
            </main>
            {/* Footer */}
            <footer className="bg-white border-t p-4 text-center text-sm text-gray-600">
               © 2026 AlungStore Admin — v1.0.0
            </footer>
         </div>
      </div>
   );
}