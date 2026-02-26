import { Outlet, Link } from "react-router-dom";

export default function VendorLayout() {
  return (
    <div className="min-h-screen flex bg-zinc-950 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-zinc-800 p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Vendor Panel</h2>

        <Link to="/vendor/dashboard">Dashboard</Link>
        <Link to="/vendor/manage">Manage Watches</Link>
        <Link to="/vendor/add">Add Watch</Link>
        <Link to="/vendor/orders">Orders</Link>
        <Link to="/vendor/analytics">Analytics</Link>
        <Link to="/vendor/inventory">Inventory</Link>
      </aside>

      {/* Page Area */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>

    </div>
  );
}