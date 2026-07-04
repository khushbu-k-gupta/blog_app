import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // assuming you store JWT in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // you can handle errors globally here
    return Promise.reject(error);
  }
);

export default axiosInstance;
