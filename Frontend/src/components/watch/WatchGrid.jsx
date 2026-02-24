import React from 'react';
import WatchCard from './WatchCard';

export default function WatchGrid({ watches = [] }) {
  if (!watches.length) return <div className="py-12 text-center text-gray-500">No watches found.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {watches.map(w => <WatchCard key={w.id} watch={w} />)}
    </div>
  );
}