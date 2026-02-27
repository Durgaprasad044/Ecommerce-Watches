import React from "react";

export default function VendorOrders() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Orders</h2>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="py-4">#1234</td>
              <td>John</td>
              <td>$1200</td>
              <td className="text-green-400">Delivered</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}