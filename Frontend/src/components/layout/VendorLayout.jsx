import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function VendorLayout() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg font-medium transition ${
      isActive
        ? "bg-white text-black"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 space-y-3">
        <h2 className="text-xl font-bold mb-6 tracking-wide">
          Vendor Panel
        </h2>

        <NavLink to="/vendor/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/vendor/add" className={linkClass}>
          Add Product
        </NavLink>

        <NavLink to="/vendor/manage" className={linkClass}>
          Manage Watches
        </NavLink>

        <NavLink to="/vendor/orders" className={linkClass}>
          Orders
        </NavLink>

        <NavLink to="/vendor/inventory" className={linkClass}>
          Inventory
        </NavLink>

        <NavLink to="/vendor/analytics" className={linkClass}>
          Analytics
        </NavLink>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 bg-zinc-900">
        <Outlet />
      </main>
    </div>
  );
}