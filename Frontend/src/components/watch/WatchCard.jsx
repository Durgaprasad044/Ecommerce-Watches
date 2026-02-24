import React from 'react';
import { Link } from 'react-router-dom';
import PriceTag from './PriceTag';
import { FiHeart, FiStar } from 'react-icons/fi';

export default function WatchCard({ watch }) {
  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500 transition-colors z-10">
        <FiHeart />
      </button>
      <Link to={`/watch/${watch.id}`} className="relative block h-64 bg-gray-50 overflow-hidden flex-shrink-0">
        <img src={watch.image || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80'} alt={watch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{watch.brand}</div>
        <Link to={`/watch/${watch.id}`} className="text-base flex-grow font-bold text-gray-900 leading-snug hover:underline line-clamp-2 mb-2">
          {watch.name}
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{watch.rating || '4.5'}</span>
          <span className="text-xs text-gray-400">({watch.reviews || 12})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <PriceTag price={watch.price} discountPrice={watch.discountPrice} />
        </div>
      </div>
    </div>
  );
}