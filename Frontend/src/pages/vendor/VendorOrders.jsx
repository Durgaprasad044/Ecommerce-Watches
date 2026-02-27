import React from "react";

const orders = [
  {
    id: "#1001",
    customer: "John Doe",
    amount: "$1,250",
    status: "Delivered",
  },
  {
    id: "#1002",
    customer: "Sarah Smith",
    amount: "$980",
    status: "Processing",
  },
  {
    id: "#1003",
    customer: "Michael Lee",
    amount: "$2,300",
    status: "Cancelled",
  },
];

export default function VendorOrders() {
  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-400 mt-2">
          Manage and track all customer orders.
        </p>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-white/5 transition"
                >
                  <td className="py-4 font-medium">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "Processing"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}