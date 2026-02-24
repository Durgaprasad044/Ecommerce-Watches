import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import PriceTag from '../../components/watch/PriceTag';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { FiCheck, FiTruck, FiShield, FiHeart } from 'react-icons/fi';

export default function WatchDetail() {
  const { id } = useParams();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch watch by ID from API
    // example: watchService.getWatchById(id).then(setWatch).catch(setError).finally(() => setLoading(false))
    setLoading(false);
  }, [id]);

  if (loading) {
    return <PageWrapper className="flex justify-center items-center"><Spinner className="mt-20" /></PageWrapper>;
  }

  if (error || !watch) {
    return <PageWrapper className="flex justify-center items-center"><p className="text-gray-500 mt-20">Watch not found or error loading details.</p></PageWrapper>;
  }

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <nav className="text-sm mb-6 text-gray-500 flex gap-2">
        <Link to="/" className="hover:text-gray-900">Home</Link> <span>/</span>
        <Link to="/catalog" className="hover:text-gray-900">Watches</Link> <span>/</span>
        <span className="text-gray-900 font-medium">{watch.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100 mb-16">
        {/* Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            {watch.images?.[0] ? <img src={watch.images[0]} alt={watch.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {watch.images?.slice(1, 5).map((img, i) => (
              <div key={i} className="aspect-square bg-gray-50 rounded-lg cursor-pointer border hover:border-gray-900 transition-colors">
                <img src={img} alt="thumb" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{watch.brand?.name || watch.brand}</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">{watch.name}</h1>
          <div className="mb-6"><PriceTag price={watch.price} discountPrice={watch.discountPrice} className="text-3xl" /></div>
          
          <Badge variant={watch.stock > 0 ? 'green' : 'red'} className="w-fit mb-6 px-3 py-1 text-sm">
            <FiCheck className="mr-1"/> {watch.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">{watch.description}</p>

          <div className="space-y-4 mb-8 text-sm font-medium text-gray-700">
            <div className="flex items-center gap-3"><FiTruck className="w-5 h-5 text-gray-400" /> Free overnight shipping</div>
            <div className="flex items-center gap-3"><FiShield className="w-5 h-5 text-gray-400" /> 5-Year international warranty</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-gray-100">
            <Button size="lg" className="flex-1 py-4 text-lg" disabled={!watch.stock}>Add to Cart</Button>
            <Button size="lg" variant="outline" className="px-6 border-2"><FiHeart className="w-6 h-6" /></Button>
          </div>
        </div>
      </div>

      {/* Tabs / Specifications */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8 text-lg font-medium">
          <button className="text-gray-900 border-b-2 border-gray-900 pb-4">Specifications</button>
          <button className="text-gray-500 hover:text-gray-900 pb-4">Reviews ({watch.reviews?.length || 0})</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-3xl">
        {watch.features?.map((f, i) => (
          <div key={i} className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500">Feature {i+1}</span>
            <span className="font-medium text-gray-900 text-right">{f}</span>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}