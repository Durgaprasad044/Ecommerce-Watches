import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PriceTag from './PriceTag';
import { FiHeart, FiStar, FiShoppingCart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';

export default function WatchCard({ watch }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const wishlisted = isInWishlist(watch.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(watch);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    await toggleWishlist(watch);
  };

  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full transition-colors z-10 ${
          wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
      >
        {wishlisted ? <FaHeart /> : <FiHeart />}
      </button>
      <Link to={`/watch/${watch.id}`} className="relative block h-64 bg-gray-50 overflow-hidden flex-shrink-0">
        <img src={watch.image || watch.images?.[0] || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80'} alt={watch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{watch.brand}</div>
        <Link to={`/watch/${watch.id}`} className="text-base flex-grow font-bold text-gray-900 leading-snug hover:underline line-clamp-2 mb-2">
          {watch.name || watch.model}
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{watch.average_rating || watch.rating || '4.5'}</span>
          <span className="text-xs text-gray-400">({watch.review_count || watch.reviews || 0})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <PriceTag price={watch.price} discountPrice={watch.discountPrice} />
          <button
            onClick={handleAddToCart}
            className="p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            title="Add to Cart"
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}