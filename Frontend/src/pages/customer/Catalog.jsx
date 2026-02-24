import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import WatchGrid from '../../components/watch/WatchGrid';
import { FiFilter } from 'react-icons/fi';
import Spinner from '../../components/common/Spinner';

export default function Catalog() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // TODO: Fetch watches and filters from API
    // example: watchService.getWatches().then(setWatches).finally(() => setLoading(false))
    setLoading(false);
  }, []);

  return (
    <PageWrapper>
      <div className="mb-8 border-b border-gray-200 pb-5 pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">All Watches</h1>
        <p className="mt-2 text-gray-500 text-lg">Browse our complete collection of fine timepieces.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky top-24">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
              <FiFilter /> <span>Filters</span>
            </div>
            {/* Filter segments */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Brands</h3>
                <div className="space-y-2">
                  {brands.length > 0 ? brands.map(b => (
                    <label key={b.id || b} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                      <span className="text-sm text-gray-600">{b.name || b}</span>
                    </label>
                  )) : <p className="text-xs text-gray-500">No brands found.</p>}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold mb-3">Price Range</h3>
                <input type="range" className="w-full" min="0" max="50000" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$0</span><span>$50k+</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500 font-medium">{watches.length} Results</span>
            <select className="border-gray-300 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <>
              <WatchGrid watches={watches} />
              {watches.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition">
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}