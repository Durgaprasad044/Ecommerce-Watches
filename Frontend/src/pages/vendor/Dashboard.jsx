import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiTrendingUp, FiDollarSign, FiPackage, FiUsers } from 'react-icons/fi';

export default function Dashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', icon: <FiDollarSign />, trend: '+20.1%' },
    { label: 'Orders', value: '156', icon: <FiPackage />, trend: '+12.5%' },
    { label: 'Conversion Rate', value: '3.2%', icon: <FiTrendingUp />, trend: '-1.1%' },
    { label: 'Total Views', value: '4,231', icon: <FiUsers />, trend: '+5.4%' }
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              <p className={`text-xs mt-2 font-medium ${s.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {s.trend} from last month
              </p>
            </div>
            <div className="p-3 bg-gray-50 text-gray-700 rounded-lg">{React.cloneElement(s.icon, {className: 'w-6 h-6'})}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
          <div className="flex items-center justify-center h-full text-gray-400">[Chart Component Placeholder]</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0 border-gray-100">
                <span className="font-medium text-gray-800">#ORD-00{i}</span>
                <span className="text-gray-500">$1,200</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}