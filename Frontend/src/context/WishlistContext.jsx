import React, { createContext, useContext, useEffect, useState } from "react";
import wishlistService from "../api/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      // Ensure we extract the data array from the sendSuccess response payload wrapper
      setWishlist(res?.data?.data || []);
    } catch (err) {
      console.error("Wishlist load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (watchId) => {
    try {
      await wishlistService.addToWishlist(watchId);
      await loadWishlist();
    } catch (err) {
      console.error("Add wishlist error:", err);
    }
  };

  const removeFromWishlist = async (watchId) => {
    try {
      await wishlistService.removeFromWishlist(watchId);
      await loadWishlist();
    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

  const isInWishlist = (watchId) => {
    return wishlist.some(item => item.watch_id === watchId || item.id === watchId);
  };

  const toggleWishlist = async (watch) => {
    if (isInWishlist(watch.id)) {
      await removeFromWishlist(watch.id);
    } else {
      await addToWishlist(watch.id);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadWishlist();
    }

    if (!isAuthenticated) {
      setWishlist([]);
    }
  }, [isAuthenticated, authLoading]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);