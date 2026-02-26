import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import PriceTag from '../../components/watch/PriceTag';
import useCart from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../api/orderService';
import formatCurrency from '../../utils/formatCurrency';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SKr2HJWhhFxlyn';

/**
 * Load Razorpay SDK script dynamically.
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shipping, setShipping] = useState({
    full_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  if (!cartItems || cartItems.length === 0) {
    return (
      <PageWrapper>
        <EmptyState
          title="Nothing to checkout"
          description="Add some watches to your cart first."
          actionText="Shop Now"
          onAction={() => navigate('/catalog')}
        />
      </PageWrapper>
    );
  }

  const handleInputChange = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayWithRazorpay = async () => {
    // Validate shipping
    const requiredFields = ['full_name', 'phone', 'street', 'city', 'state', 'zip', 'country'];
    for (const field of requiredFields) {
      if (!shipping[field]?.trim()) {
        setError(`Please fill in ${field.replace('_', ' ')}.`);
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Failed to load Razorpay. Check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Create order on backend
      const orderPayload = {
        items: cartItems.map((item) => ({
          watch_id: item.id,
          quantity: item.quantity || 1,
        })),
        shipping_address: shipping,
        payment_method: 'razorpay',
      };

      const res = await orderService.createOrder(orderPayload);
      const { order_id, razorpay_order_id, amount, razorpay_key_id } = res.data;

      // 3. Open Razorpay Checkout
      const options = {
        key: razorpay_key_id || RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        name: 'WatchVault',
        description: 'Watch Purchase',
        order_id: razorpay_order_id,
        prefill: {
          name: shipping.full_name,
          email: currentUser?.email || '',
          contact: shipping.phone,
        },
        theme: { color: '#0f172a' },
        handler: async function (response) {
          // 4. Verify payment on backend
          try {
            await orderService.verifyPayment(order_id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 5. Clear cart and redirect
            clearCart();
            navigate(`/orders/${order_id}`, { state: { success: true } });
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment was cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Shipping Form */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'full_name', label: 'Full Name', type: 'text' },
                { name: 'phone', label: 'Phone', type: 'tel' },
                { name: 'street', label: 'Street Address', type: 'text', full: true },
                { name: 'city', label: 'City', type: 'text' },
                { name: 'state', label: 'State', type: 'text' },
                { name: 'zip', label: 'ZIP Code', type: 'text' },
                { name: 'country', label: 'Country', type: 'text' },
              ].map((field) => (
                <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={shipping[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary + Pay */}
        <div className="w-full lg:w-96">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700 truncate flex-1 pr-2">
                    {item.name || item.model} × {item.quantity || 1}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {formatCurrency((Number(item.price) || 0) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handlePayWithRazorpay}
              disabled={loading}
            >
              {loading ? <Spinner className="w-5 h-5" /> : `Pay ${formatCurrency(cartTotal)} with Razorpay`}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-3">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
