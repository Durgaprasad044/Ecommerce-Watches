import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Link } from 'react-router-dom';
import WatchGrid from '../../components/watch/WatchGrid';
import { FiArrowRight } from 'react-icons/fi';
import Spinner from '../../components/common/Spinner';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch featured watches from API
    // example: watchService.getFeatured().then(setFeatured).finally(() => setLoading(false))
    setLoading(false);
  }, []);

  return (
    <PageWrapper className="py-0 px-0 max-w-none">
      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Watches</h2>
            <p className="text-gray-500 mt-2">Hand-picked selections for you.</p>
          </div>
          <Link to="/catalog" className="hidden sm:flex text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors items-center gap-1">
            View All <FiArrowRight className="w-4 h-4"/>
          </Link>
        </div>
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : <WatchGrid watches={featured} />}
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/catalog?category=luxury" className="group relative h-80 rounded-2xl overflow-hidden block bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Luxury</div>
            </Link>
            <Link to="/catalog?category=sports" className="group relative h-80 rounded-2xl overflow-hidden block bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Sports & Activity</div>
            </Link>
            <Link to="/catalog?category=vintage" className="group relative h-80 rounded-2xl overflow-hidden block bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Vintage</div>
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
