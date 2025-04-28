import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
