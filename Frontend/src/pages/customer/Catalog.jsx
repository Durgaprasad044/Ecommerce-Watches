// import React, { useState, useEffect, useMemo } from 'react';
// import PageWrapper from '../../components/layout/PageWrapper';
// import WatchGrid from '../../components/watch/WatchGrid';
// import { FiFilter, FiSearch } from 'react-icons/fi';
// import Spinner from '../../components/common/Spinner';
// import { watches as mockWatches } from '../../data/watches';

// export default function Catalog() {
//   const [loading, setLoading] = useState(true);
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [priceMax, setPriceMax] = useState(50000);
//   const [sortBy, setSortBy] = useState('recommended');

//   useEffect(() => {
//     // Simulate API delay
//     const timer = setTimeout(() => setLoading(false), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // Dynamically derive brands from the mock data
//   const brands = useMemo(() => {
//     return [...new Set(mockWatches.map(w => w.brand))].sort();
//   }, []);

//   const handleBrandChange = (brand) => {
//     setSelectedBrands(prev => 
//       prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
//     );
//   };

//   const filteredWatches = useMemo(() => {
//     let result = mockWatches;

//     // Search filter
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       result = result.filter(w => 
//         w.name.toLowerCase().includes(q) || 
//         w.brand.toLowerCase().includes(q)
//       );
//     }

//     // Brand filter
//     if (selectedBrands.length > 0) {
//       result = result.filter(w => selectedBrands.includes(w.brand));
//     }

//     // Price filter
//     result = result.filter(w => w.price <= priceMax);

//     // Sorting
//     if (sortBy === 'price-low') {
//       result.sort((a, b) => a.price - b.price);
//     } else if (sortBy === 'price-high') {
//       result.sort((a, b) => b.price - a.price);
//     }

//     return result;
//   }, [searchQuery, selectedBrands, priceMax, sortBy]);

//   return (
//     <PageWrapper>
//       <div className="mb-8 border-b border-gray-200 pb-5 pt-4">
//         <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">All Watches</h1>
//         <p className="mt-2 text-gray-500 text-lg">Browse our complete collection of fine timepieces.</p>
//       </div>
      
//       <div className="flex flex-col lg:flex-row gap-8 items-start">
//         {/* Sidebar Filters */}
//         <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky top-24">
//           <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//             <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
//               <FiFilter /> <span>Filters</span>
//             </div>
            
//             <div className="space-y-6">
//               {/* Search */}
//               <div>
//                 <h3 className="text-sm font-semibold mb-3">Search</h3>
//                 <div className="relative">
//                   <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input 
//                     type="text" 
//                     placeholder="Search watches..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-gray-900 focus:border-gray-900" 
//                   />
//                 </div>
//               </div>

//               {/* Brands */}
//               <div className="border-t border-gray-100 pt-6">
//                 <h3 className="text-sm font-semibold mb-3">Brands</h3>
//                 <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
//                   {brands.map(brand => (
//                     <label key={brand} className="flex items-center gap-2 cursor-pointer">
//                       <input 
//                         type="checkbox" 
//                         checked={selectedBrands.includes(brand)}
//                         onChange={() => handleBrandChange(brand)}
//                         className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" 
//                       />
//                       <span className="text-sm text-gray-600">{brand}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div className="border-t border-gray-100 pt-6">
//                 <h3 className="text-sm font-semibold mb-3">Max Price: ${priceMax.toLocaleString()}</h3>
//                 <input 
//                   type="range" 
//                   className="w-full accent-gray-900" 
//                   min="0" 
//                   max="50000" 
//                   step="1000"
//                   value={priceMax}
//                   onChange={(e) => setPriceMax(Number(e.target.value))}
//                 />
//                 <div className="flex justify-between text-xs text-gray-500 mt-2">
//                   <span>$0</span><span>$50k+</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Product Grid */}
//         <div className="flex-1 w-full">
//           <div className="flex justify-between items-center mb-6">
//             <span className="text-sm text-gray-500 font-medium">{filteredWatches.length} Results</span>
//             <select 
//               className="border-gray-300 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="recommended">Sort by: Recommended</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//             </select>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center py-12"><Spinner /></div>
//           ) : (
//             <>
//               <WatchGrid watches={filteredWatches} />
//               {filteredWatches.length === 0 && (
//                 <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-gray-100 mt-4">
//                   No watches found matching your criteria. Try adjusting your filters.
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import WatchGrid from "../../components/watch/WatchGrid";
import { FiFilter, FiSearch } from "react-icons/fi";
import Spinner from "../../components/common/Spinner";
import { watches as mockWatches } from "../../data/watches";

export default function Catalog() {
  const [loading, setLoading] = useState(true);
  const [backendWatches, setBackendWatches] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMax, setPriceMax] = useState(50000);
  const [sortBy, setSortBy] = useState("recommended");

  // 🔥 FETCH WATCHES FROM BACKEND
  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/watches");
        const data = await res.json();
        setBackendWatches(data || []);
      } catch (err) {
        console.error("Error fetching watches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatches();
  }, []);

  // 🔥 MERGE MOCK + BACKEND WATCHES
  const allWatches = useMemo(() => {
    const normalizedBackend = backendWatches.map((w) => ({
      ...w,
      image: w.image_url, // normalize field
    }));

    return [...mockWatches, ...normalizedBackend];
  }, [backendWatches]);

  // 🔥 DYNAMIC BRANDS FROM ALL WATCHES
  const brands = useMemo(() => {
    return [...new Set(allWatches.map((w) => w.brand))].sort();
  }, [allWatches]);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  // 🔥 FILTERING + SORTING
  const filteredWatches = useMemo(() => {
    let result = [...allWatches];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.brand.toLowerCase().includes(q)
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((w) =>
        selectedBrands.includes(w.brand)
      );
    }

    result = result.filter((w) => w.price <= priceMax);

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allWatches, searchQuery, selectedBrands, priceMax, sortBy]);

  return (
    <PageWrapper>
      <div className="mb-8 border-b border-gray-200 pb-5 pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          All Watches
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          Browse our complete collection of fine timepieces.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky top-24">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
              <FiFilter /> <span>Filters</span>
            </div>

            <div className="space-y-6">
              {/* SEARCH */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Search</h3>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search watches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
              </div>

              {/* BRANDS */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold mb-3">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-600">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PRICE */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold mb-3">
                  Max Price: ₹{priceMax.toLocaleString()}
                </h3>
                <input
                  type="range"
                  className="w-full accent-gray-900"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceMax}
                  onChange={(e) =>
                    setPriceMax(Number(e.target.value))
                  }
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>₹0</span>
                  <span>₹50k+</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500 font-medium">
              {filteredWatches.length} Results
            </span>
            <select
              className="border-gray-300 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">
                Sort by: Recommended
              </option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <>
              <WatchGrid watches={filteredWatches} />
              {filteredWatches.length === 0 && (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-gray-100 mt-4">
                  No watches found matching your criteria.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}