import axiosInstance from './axiosInstance';

const wishlistService = {
  getWishlist: async () => {
    const response = await axiosInstance.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (watchId) => {
    const response = await axiosInstance.post(`/wishlist/${watchId}`);
    return response.data;
  },

  removeFromWishlist: async (watchId) => {
    const response = await axiosInstance.delete(`/wishlist/${watchId}`);
    return response.data;
  },
};

export default wishlistService;
