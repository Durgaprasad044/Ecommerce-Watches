import React from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import EmptyState from "../../components/common/EmptyState";
import WatchCard from "../../components/watch/WatchCard";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();

  if (!wishlist || wishlist.length === 0) {
    return (
      <PageWrapper>
        <EmptyState
          title="Your wishlist is empty"
          description="Browse our catalog and add watches you love."
          actionText="Shop Now"
          onAction={() => navigate("/catalog")}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((watch) => (
          <WatchCard key={watch.id} watch={watch} />
        ))}
      </div>
    </PageWrapper>
  );
}