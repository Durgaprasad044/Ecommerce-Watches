import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-tighter text-gray-900 mb-4">WatchVault</h3>
          <p className="text-sm text-gray-500 pr-4">Premium destination for luxury and everyday timepieces. Timeless elegance matters.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/catalog" className="hover:text-gray-900 transition-colors">All Watches</Link></li>
            <li><Link to="/catalog" className="hover:text-gray-900 transition-colors">Luxury Brands</Link></li>
            <li><Link to="/catalog" className="hover:text-gray-900 transition-colors">Smart Watches</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="#" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-gray-900 transition-colors">Shipping & Returns</Link></li>
            <li><Link to="#" className="hover:text-gray-900 transition-colors">Warranty</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Newsletter</h4>
          <p className="text-sm text-gray-500 mb-2">Subscribe for updates on new arrivals.</p>
          <div className="flex">
            <input type="email" placeholder="Your email" className="px-3 py-2 text-sm border border-gray-300 rounded-l-md w-full focus:outline-none focus:border-gray-900" />
            <button className="bg-gray-900 text-white px-4 py-2 text-sm rounded-r-md font-medium hover:bg-gray-800 transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} WatchVault. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-gray-700">Privacy Policy</Link>
          <Link to="#" className="hover:text-gray-700">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}