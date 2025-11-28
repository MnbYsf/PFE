import api from "./axios";

export const login = async (username: string, password: string) => {
  const res = await api.post("/api/auth/login", { username, password });
  return res.data;
};

export const register = async (data: {
  username: string;
  email: string;
  password: string;
  company?: string;
}) => {
  const res = await api.post("/api/auth/signup", data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};

export const logout = async () => {
  await api.post("/api/auth/logout");
};
