import React from 'react';
import formatCurrency from '../../utils/formatCurrency';
export default function PriceTag({ price, discountPrice, className = '' }) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-lg font-bold text-gray-900">{formatCurrency(discountPrice || price)}</span>
      {discountPrice && <span className="text-sm line-through text-gray-500">{formatCurrency(price)}</span>}
    </div>
  );
}