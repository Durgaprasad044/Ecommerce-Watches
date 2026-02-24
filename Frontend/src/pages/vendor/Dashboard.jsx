import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import { FiTrendingUp, FiDollarSign, FiPackage, FiUsers } from 'react-icons/fi';
import formatCurrency from '../../utils/formatCurrency';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch analytics and orders from API
    // vendorService.getDashboardStats().then(setStats).finally(() => setLoading(false))
    setLoading(false);
  }, []);

  if (loading) {
    return <DashboardLayout><div className="flex justify-center items-center h-full"><Spinner /></div></DashboardLayout>;
  }

  const statCards = [
    { label: 'Total Revenue', value: stats?.revenue ? formatCurrency(stats.revenue) : '$0', icon: <FiDollarSign />, trend: stats?.revenueTrend || '0%' },
    { label: 'Orders', value: stats?.orderCount || '0', icon: <FiPackage />, trend: stats?.orderTrend || '0%' },
    { label: 'Conversion Rate', value: stats?.conversionRate || '0%', icon: <FiTrendingUp />, trend: stats?.conversionTrend || '0%' },
    { label: 'Total Views', value: stats?.views || '0', icon: <FiUsers />, trend: stats?.viewsTrend || '0%' }
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              {s.trend !== '0%' && (
                <p className={`text-xs mt-2 font-medium ${s.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {s.trend} from last month
                </p>
              )}
            </div>
            <div className="p-3 bg-gray-50 text-gray-700 rounded-lg">{React.cloneElement(s.icon, {className: 'w-6 h-6'})}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
          {!stats?.chartData ? <div className="flex flex-col items-center justify-center h-full text-gray-400">No revenue data available</div> : <div>[Chart Component]</div>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
               <p className="text-sm text-gray-500">No recent orders found.</p>
            ) : recentOrders.map((ord, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0 border-gray-100">
                <span className="font-medium text-gray-800">#{ord.id}</span>
                <span className="text-gray-500">{formatCurrency(ord.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}