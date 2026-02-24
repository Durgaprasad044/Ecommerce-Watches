import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiList, FiBarChart2, FiSettings } from 'react-icons/fi';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/vendor', icon: <FiHome /> },
    { name: 'Products', path: '/vendor/products', icon: <FiBox /> },
    { name: 'Orders', path: '/vendor/orders', icon: <FiList /> },
    { name: 'Analytics', path: '/vendor/analytics', icon: <FiBarChart2 /> },
    { name: 'Settings', path: '/vendor/settings', icon: <FiSettings /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex-shrink-0 min-h-screen p-4 flex flex-col hidden lg:flex">
      <div className="text-2xl font-bold tracking-tighter text-white uppercase mb-8 ml-2 mt-2">
        Watch<span className="text-gray-500">Vendor</span>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(link => (
          <NavLink 
            key={link.path} 
            to={link.path}
            end
            className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
          >
            {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}