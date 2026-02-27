import axios from "axios";
import { auth } from "../firebase/firebase";   // ✅ use initialized auth

const API = "http://localhost:5000/api/v1";

const getToken = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  return await user.getIdToken();
};

const wishlistService = {
  addToWishlist: async (watchId) => {
    const token = await getToken();

    return axios.post(
      `${API}/wishlist/${watchId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getWishlist: async () => {
    const token = await getToken();

    return axios.get(`${API}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  removeFromWishlist: async (watchId) => {
    const token = await getToken();

    return axios.delete(`${API}/wishlist/${watchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default wishlistService;