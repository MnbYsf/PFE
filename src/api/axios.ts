import axios from "axios";

// Axios instance configured to talk to backend2 (CyberGuard) on port 8081
const api = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true, // session-based auth via cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Centralized auth error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or unauthenticated – send user back to auth page
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;
