import api from "./axios";

// Backend2 profile endpoints live under /api/profile (ProfilesController)

export const getProfile = async () => {
  const res = await api.get("/api/profile/info");
  return res.data;
};

export const updateProfile = async (profile: any) => {
  const res = await api.put("/api/profile/info", profile);
  return res.data;
};

export const updateProfileImage = async (imageData: string) => {
  // Backend expects multipart/form-data with field name "file"
  const formData = new FormData();
  // Convert base64 string into a Blob; fall back to sending as text if conversion fails
  try {
    const base64 = imageData.split(",")[1] || imageData;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "image/png" });
    formData.append("file", blob, "profile.png");
  } catch {
    const blob = new Blob([imageData], { type: "text/plain" });
    formData.append("file", blob, "profile.txt");
  }

  const res = await api.post("/api/profile/info/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const res = await api.post("/api/profile/security/password", {
    oldPassword,
    newPassword,
  });
  return res.data;
};

export const getReports = async () => {
  const res = await api.get("/api/profile/reports");
  return res.data;
};

