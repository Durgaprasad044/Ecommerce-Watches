import axiosInstance from './axiosInstance';

const orderService = {
  createOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },

  verifyPayment: async (orderId, paymentData) => {
    const response = await axiosInstance.post(`/orders/${orderId}/verify-payment`, paymentData);
    return response.data;
  },

  getOrders: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get(`/orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  getTracking: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}/tracking`);
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel`);
    return response.data;
  },

  getInvoice: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}/invoice`);
    return response.data;
  },
};

export default orderService;
