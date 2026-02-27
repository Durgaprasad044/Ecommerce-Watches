import React from "react";
import { FiTrendingUp, FiShoppingBag, FiDollarSign, FiUsers } from "react-icons/fi";

export default function Dashboard() {
  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-white">Welcome Back 👋</h1>
        <p className="text-indigo-100 mt-2">
          Here’s what’s happening with your store today.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">Total Products</h3>
            <FiShoppingBag className="text-indigo-400 text-xl" />
          </div>
          <p className="text-3xl font-bold mt-3">24</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">Total Orders</h3>
            <FiUsers className="text-purple-400 text-xl" />
          </div>
          <p className="text-3xl font-bold mt-3">78</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">Revenue</h3>
            <FiDollarSign className="text-green-400 text-xl" />
          </div>
          <p className="text-3xl font-bold mt-3">$12,540</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">Growth</h3>
            <FiTrendingUp className="text-pink-400 text-xl" />
          </div>
          <p className="text-3xl font-bold mt-3">+18%</p>
        </div>

      </div>

      {/* Charts + Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-6">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will appear here (Recharts later)
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>#1234</span>
              <span className="text-green-400">$450</span>
            </div>

            <div className="flex justify-between">
              <span>#1235</span>
              <span className="text-green-400">$890</span>
            </div>

            <div className="flex justify-between">
              <span>#1236</span>
              <span className="text-green-400">$1200</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}