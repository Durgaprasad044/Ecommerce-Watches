import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi';
import useCart from '../../hooks/useCart';   // ⭐ IMPORTANT: use hook, NOT context

export default function Navbar() {

  // ⭐ SAFE cart access (prevents blank screen crash)
  const cartState = useCart();
  const cart = cartState?.cart || [];

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-gray-900 ${
      isActive ? 'text-gray-900' : 'text-gray-500'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold tracking-tighter text-gray-900 uppercase">
              Watch<span className="text-gray-400">Vault</span>
            </Link>

            <div className="hidden md:flex gap-6">
              <NavLink to="/home" className={linkClass}>Home</NavLink>
              <NavLink to="/catalog" className={linkClass}>Catalog</NavLink>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>

            <Link to="/wishlist" className="text-gray-600 hover:text-gray-900 transition-colors">
              <FiHeart className="w-5 h-5" />
            </Link>

            {/* ⭐ CART ICON WITH DYNAMIC COUNT */}
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              <FiShoppingCart className="w-5 h-5" />

              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition-colors pl-2 border-l border-gray-200">
              <FiUser className="w-5 h-5" />
            </Link>

            <Link to="/auth/login" className="ml-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">
              Login
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}