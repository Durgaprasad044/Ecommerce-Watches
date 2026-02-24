import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Link } from 'react-router-dom';
import WatchGrid from '../../components/watch/WatchGrid';
import { FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const featured = [
    { id: '1', name: 'Oyster Perpetual', brand: 'Rolex', price: 6100, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80' },
    { id: '2', name: 'Speedmaster Pro', brand: 'Omega', price: 5300, image: 'https://images.unsplash.com/photo-1623998021450-85c29c644e0d?auto=format&fit=crop&q=80' },
    { id: '3', name: 'Carrera Calibre', brand: 'TAG Heuer', price: 4200, image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80' },
    { id: '4', name: 'Royal Oak', brand: 'Audemars Piguet', price: 21000, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80' },
  ];

  return (
    <PageWrapper className="py-0 px-0 max-w-none">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548169874-53ce86f44e22?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="relative z-10 text-center max-w-3xl px-4 py-32">
          <span className="block text-sm tracking-[0.2em] uppercase text-gray-300 mb-4">The ultimate collection</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">Invest in Time.</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 mx-auto max-w-2xl font-light">
            Discover our curated selection of premium timepieces from the world's most renowned watchmakers.
          </p>
          <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all hover:gap-3">
            Shop Collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Watches</h2>
            <p className="text-gray-500 mt-2">Hand-picked selections for you.</p>
          </div>
          <Link to="/catalog" className="hidden sm:flex text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors items-center gap-1">
            View All <FiArrowRight className="w-4 h-4"/>
          </Link>
        </div>
        <WatchGrid watches={featured} />
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/catalog?category=luxury" className="group relative h-80 rounded-2xl overflow-hidden block">
              <img src="https://images.unsplash.com/photo-1614164185128-e4b10b0e5155?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Luxury" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Luxury</div>
            </Link>
            <Link to="/catalog?category=sports" className="group relative h-80 rounded-2xl overflow-hidden block">
              <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Sports" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Sports & Activity</div>
            </Link>
            <Link to="/catalog?category=vintage" className="group relative h-80 rounded-2xl overflow-hidden block">
              <img src="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Vintage" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Vintage</div>
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}