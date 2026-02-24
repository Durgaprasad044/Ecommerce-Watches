import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import formatCurrency from '../../utils/formatCurrency';

export default function ManageWatches() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch vendor's products from API
    // vendorService.getInventory().then(setProducts).finally(() => setLoading(false))
    setLoading(false);
  }, []);

  if (loading) {
    return <DashboardLayout><div className="flex justify-center items-center h-full"><Spinner /></div></DashboardLayout>;
  }

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
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No products found. Click "Add New Watch" to create one.
                </td>
              </tr>
            ) : products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(p.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={p.stock > 10 ? 'green' : p.stock > 0 ? 'yellow' : 'red'}>
                    {p.stock > 10 ? 'Active' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}