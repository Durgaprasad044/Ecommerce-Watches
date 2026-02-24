import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Link, useNavigate } from 'react-router-dom';
import WatchGrid from '../../components/watch/WatchGrid';
import { FiArrowRight, FiSearch, FiShoppingCart, FiCheck } from 'react-icons/fi';
import Spinner from '../../components/common/Spinner';
import { watches as mockWatches } from '../../data/watches';
import { useCart } from '../../context/CartContext';

const BrandCard = ({ brand, tagline, onSelected }) => {
  return (
    <div 
      className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-black border border-gray-800 hover:border-gray-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-700"
      onClick={() => onSelected(brand)}
    >
      <div className="absolute inset-0 bg-gray-900 group-hover:scale-105 transition-transform duration-1000">
         <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-4xl font-black uppercase tracking-widest text-white text-center px-4">{brand}</span>
         </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-3xl font-bold text-white mb-2">{brand}</h3>
        <p className="text-gray-400 font-light mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{tagline}</p>
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
          View Models <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
};

const FeaturedWatchCard = ({ watch }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(watch);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-300 flex flex-col group">
      <div className="h-64 bg-zinc-800 overflow-hidden relative flex-shrink-0">
        <img src={watch.image} alt={watch.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
          ${watch.price.toLocaleString()}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{watch.brand}</div>
        <h4 className="text-lg font-bold text-white mb-4 line-clamp-2">{watch.model}</h4>
        
        <button 
          onClick={handleAddToCart}
          className={`mt-auto w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            added ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {added ? <><FiCheck /> Added</> : <><FiShoppingCart /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dynamic brand selection state
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const featuredBrands = [
    { name: 'Rolex', tagline: 'The crown of achievement.' },
    { name: 'Omega', tagline: 'Exacting standards since 1848.' },
    { name: 'Patek Philippe', tagline: 'Begin your own tradition.' },
    { name: 'Audemars Piguet', tagline: 'To break the rules, you must first master them.' },
  ];

  // Filter watches by selected brand and search query
  const displayedWatches = mockWatches.filter(watch => {
    if (selectedBrand && watch.brand !== selectedBrand) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!watch.brand.toLowerCase().includes(q) && !watch.model.toLowerCase().includes(q)) {
        return false;
      }
    }
    // if no brand is selected, we could show none, or show all. Task implies show 3-4 for THAT brand when clicked.
    // If we want to hide until clicked, we can do that. Let's only render Watch section if selectedBrand is true.
    return true;
  });

  return (
    <PageWrapper className="py-0 px-0 max-w-none">
      {/* Featured Watches */}
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

      {/* Featured Luxury Brands */}
      <section className="bg-zinc-950 py-32 border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm tracking-[0.2em] font-bold text-zinc-500 uppercase mb-4">The Pinnacle</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white">Featured Luxury Brands</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBrands.map((brand, idx) => (
              <BrandCard key={idx} brand={brand.name} tagline={brand.tagline} onSelected={setSelectedBrand} />
            ))}
          </div>

          {/* Dynamic Brand Models Section */}
          {selectedBrand && (
            <div className="mt-24 pt-16 border-t border-zinc-800 animate-fade-in-up">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedBrand} Collection</h3>
                  <p className="text-zinc-400">Discover handpicked models available now.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search models..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              {displayedWatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedWatches.map(watch => (
                    <FeaturedWatchCard key={watch.id} watch={watch} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-zinc-500 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  No models found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
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
