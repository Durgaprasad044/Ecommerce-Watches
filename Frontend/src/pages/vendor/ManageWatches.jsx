import React from "react";

export default function ManageWatches() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map((item) => (
          <div key={item} className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-lg hover:scale-105 transition">
            <div className="h-40 bg-gray-800 rounded-xl mb-4"></div>
            <h3 className="font-semibold">Product Name</h3>
            <p className="text-gray-400 text-sm">$2500</p>

            <div className="flex gap-3 mt-4">
              <button className="px-3 py-2 bg-indigo-600 rounded-lg text-sm hover:bg-indigo-500">
                Edit
              </button>
              <button className="px-3 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}