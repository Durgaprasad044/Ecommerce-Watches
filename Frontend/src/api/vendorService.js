import axios from "axios";
import { auth } from "../firebase/firebase";

const API = "http://localhost:5000/api/v1";

const getToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Vendor not logged in");
  return await user.getIdToken();
};

const vendorService = {

  // 🔹 Get vendor's own products
  getMyProducts: async () => {
    const token = await getToken();
    return axios.get(`${API}/watches/vendor`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // 🔹 Add new product
  createProduct: async (formData) => {
    const token = await getToken();
    return axios.post(`${API}/watches`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 🔹 Update product
  updateProduct: async (id, formData) => {
    const token = await getToken();
    return axios.put(`${API}/watches/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 🔹 Delete product
  deleteProduct: async (id) => {
    const token = await getToken();
    return axios.delete(`${API}/watches/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default vendorService;