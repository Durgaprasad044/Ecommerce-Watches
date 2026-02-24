import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import PriceTag from '../../components/watch/PriceTag';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  // Dummy
  const items = [
    { id: '1', name: 'Oyster Perpetual', brand: 'Rolex', price: 6100, qty: 1, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80' }
  ];

  if (!items.length) {
    return (
      <PageWrapper>
        <EmptyState title="Your cart is empty" description="Looks like you haven't added any watches yet." actionText="Shop Now" onAction={() => navigate('/catalog')} />
      </PageWrapper>
    );
  }

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <PageWrapper>
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Bag</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Items */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-sm md:text-base">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 hidden sm:grid">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
                <div className="col-span-1 border-b pb-4 sm:border-0 sm:pb-0 sm:col-span-6 flex gap-4 items-center">
                  <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{item.name}</p>
                    <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                    <button className="text-red-500 text-sm flex items-center gap-1 hover:underline"><FiTrash2 /> Remove</button>
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-3 flex justify-center items-center gap-3">
                  <button className="p-1 border rounded-md hover:bg-gray-50"><FiMinus /></button>
                  <span className="font-medium text-lg w-6 text-center">{item.qty}</span>
                  <button className="p-1 border rounded-md hover:bg-gray-50"><FiPlus /></button>
                </div>
                <div className="col-span-1 sm:col-span-3 text-right font-bold text-lg">
                  $<PriceTag price={item.price * item.qty} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${(subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="font-extrabold text-2xl text-gray-900">${(subtotal).toLocaleString()}</span>
            </div>
            <Button size="lg" className="w-full mb-4">Proceed to Checkout</Button>
            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
              <FiShield /> Secure SSL checkout
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}