import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function ManageWatches() {
  const dummyProducts = [
    { id: '1', name: 'Chronograph PRO', price: 1200, stock: 45, status: 'Active' },
    { id: '2', name: 'Diver Black', price: 900, stock: 2, status: 'Low Stock' }
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <Button>Add New Watch</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Product Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dummyProducts.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">${p.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={p.stock > 10 ? 'green' : 'yellow'}>{p.status}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                  <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}