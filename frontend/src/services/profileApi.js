import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/profile",
});

// Interceptor to automatically attach the JWT token to every request header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;