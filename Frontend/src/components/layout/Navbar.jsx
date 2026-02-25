import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiHeart } from "react-icons/fi";
import useCart from "../../hooks/useCart";

export default function Navbar() {

  // ⭐ Get cart count from context
  const { cartCount } = useCart() || { cartCount: 0 };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-gray-900 ${
      isActive ? "text-gray-900" : "text-gray-500"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xl font-bold tracking-tighter text-gray-900 uppercase"
            >
              Watch<span className="text-gray-400">Vault</span>
            </Link>

            <div className="hidden md:flex gap-6">
              <NavLink to="/home" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/catalog" className={linkClass}>
                Catalog
              </NavLink>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiHeart className="w-5 h-5" />
            </Link>

            {/* ⭐ CART ICON WITH DYNAMIC NUMBER */}
            <Link
              to="/cart"
              className="text-gray-600 hover:text-gray-900 transition-colors relative"
            >
              <FiShoppingCart className="w-5 h-5" />

              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* PROFILE */}
            <Link
              to="/profile"
              className="text-gray-600 hover:text-gray-900 transition-colors pl-2 border-l border-gray-200"
            >
              <FiUser className="w-5 h-5" />
            </Link>

            {/* LOGIN BUTTON */}
            <Link
              to="/auth/login"
              className="ml-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Login
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}