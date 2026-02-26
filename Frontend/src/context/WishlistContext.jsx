import { createContext, useState, useCallback, useMemo } from 'react';
import wishlistService from '../api/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await wishlistService.getWishlist();
      // Backend returns { data: [...] }
      const list = res?.data || [];
      // Deduplicate by watch id
      const uniqueMap = new Map();
      list.forEach((item) => {
        const watch = item.watches || item;
        if (watch?.id && !uniqueMap.has(watch.id)) {
          uniqueMap.set(watch.id, { ...item, watches: watch });
        }
      });
      setItems(Array.from(uniqueMap.values()));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wishlist.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Toggle wishlist (add if not present, remove if present)
  const toggleWishlist = useCallback(async (watch) => {
    if (!isAuthenticated) return { redirectToLogin: true };

    const watchId = watch?.id;
    if (!watchId) return;

    try {
      const isCurrentlyInList = items.some(
        (item) => (item.watches?.id || item.watch_id) === watchId
      );

      if (isCurrentlyInList) {
        await wishlistService.removeFromWishlist(watchId);
        setItems((prev) =>
          prev.filter((item) => (item.watches?.id || item.watch_id) !== watchId)
        );
      } else {
        await wishlistService.addToWishlist(watchId);
        // Optimistically add to local state
        setItems((prev) => [
          ...prev,
          { watch_id: watchId, watches: watch, created_at: new Date().toISOString() },
        ]);
      }
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Wishlist action failed.');
      return { error: true };
    }
  }, [isAuthenticated, items]);

  // Check if a watch is in the wishlist
  const isInWishlist = useCallback(
    (watchId) => items.some((item) => (item.watches?.id || item.watch_id) === watchId),
    [items]
  );

  const value = useMemo(
    () => ({ items, loading, error, fetchWishlist, toggleWishlist, isInWishlist }),
    [items, loading, error, fetchWishlist, toggleWishlist, isInWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistContext;
