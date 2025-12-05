import api from "./axios";

// Matches backend2 AccountRestController (/api/auth)
export const login = async (username: string, password: string) => {
  const res = await api.post("/api/auth/signin", { username, password });
  return res.data; // AuthResponse { success, message, user }
};

export const register = async (data: {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  numberPhone?: string;
  capturedImage?: string;
}) => {
  // backend2 expects SignupRequest:
  // { username, password, email, firstName, lastName, numberPhone, capturedImage }
  const res = await api.post("/api/auth/signup", data);
  return res.data; // AuthResponse
};

export const getCurrentUser = async () => {
  const res = await api.get("/api/auth/me");
  return res.data; // AppUserDTO
};

export const logout = async () => {
  await api.post("/api/auth/signout");
};
