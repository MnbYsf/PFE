import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081", // ✅ Spring Boot URL
  withCredentials: true,           // ✅ REQUIRED for session auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
