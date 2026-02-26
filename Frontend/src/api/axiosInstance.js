const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Lightweight fetch wrapper that mimics axios behavior.
 * No external dependencies — uses the browser's native fetch API.
 */
const axiosInstance = {
  async request(method, url, data = null) {
    const headers = { 'Content-Type': 'application/json' };

    // Attach in-memory auth token if available
    const token = window.__authToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(json?.message || `Request failed with status ${response.status}`);
      error.response = { status: response.status, data: json };
      throw error;
    }

    return { data: json, status: response.status };
  },

  get(url) {
    return this.request('GET', url);
  },

  post(url, data) {
    return this.request('POST', url, data);
  },

  put(url, data) {
    return this.request('PUT', url, data);
  },

  patch(url, data) {
    return this.request('PATCH', url, data);
  },

  delete(url) {
    return this.request('DELETE', url);
  },
};

export default axiosInstance;
