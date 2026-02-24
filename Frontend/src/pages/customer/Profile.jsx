import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { FiUser, FiPackage, FiSettings, FiLogOut } from 'react-icons/fi';
import Button from '../../components/common/Button';

export default function Profile() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64">
            <nav className="flex flex-col gap-2">
              <button className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium"><FiUser /> Profile Details</button>
              <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"><FiPackage /> Orders</button>
              <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"><FiSettings /> Settings</button>
              <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium mt-auto"><FiLogOut /> Logout</button>
            </nav>
          </aside>
          <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">First Name</label>
                <input type="text" defaultValue="John" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Last Name</label>
                <input type="text" defaultValue="Doe" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
                <input type="email" defaultValue="john.doe@example.com" disabled className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 cursor-not-allowed" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}