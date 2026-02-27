import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiHome, FiPlus, FiBox, FiShoppingCart, FiBarChart2 } from "react-icons/fi";

export default function VendorLayout() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      
      {/* Sidebar */}
      <aside className="w-64 p-6 border-r border-gray-800 backdrop-blur-xl bg-white/5">
        <h1 className="text-2xl font-bold mb-10 tracking-wide">
          Watch<span className="text-indigo-500">Vendor</span>
        </h1>

        <nav className="space-y-3">
          <NavLink to="/vendor/dashboard" className={linkClass}>
            <FiHome /> Dashboard
          </NavLink>

          <NavLink to="/vendor/add" className={linkClass}>
            <FiPlus /> Add Product
          </NavLink>

          <NavLink to="/vendor/manage" className={linkClass}>
            <FiBox /> Manage Products
          </NavLink>

          <NavLink to="/vendor/orders" className={linkClass}>
            <FiShoppingCart /> Orders
          </NavLink>

          <NavLink to="/vendor/analytics" className={linkClass}>
            <FiBarChart2 /> Analytics
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}