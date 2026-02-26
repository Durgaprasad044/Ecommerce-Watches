import React, { useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import WatchCard from '../../components/watch/WatchCard';
import { useNavigate } from 'react-router-dom';
import useWishlist from '../../hooks/useWishlist';

export default function Wishlist() {
  const navigate = useNavigate();
  const { items, loading, error, fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading) {
    return (
      <PageWrapper className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <ErrorMessage message={error} />
      </PageWrapper>
    );
  }

  if (!items || items.length === 0) {
    return (
      <PageWrapper>
        <EmptyState
          title="Your wishlist is empty"
          description="Browse our catalog and add watches you love."
          actionText="Shop Now"
          onAction={() => navigate('/catalog')}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => {
          const watch = item.watches || item;
          return <WatchCard key={watch.id} watch={watch} />;
        })}
      </div>
    </PageWrapper>
  );
}
