import axiosInstance from "@/core/api/axiosInstance";

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data; // { token, expiresIn }
  },

  register: async (userData) => {
    const response = await axiosInstance.post("/auth/signup", userData);
    return response.data; // { token, expiresIn }
  },

  me: async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data; // user profile
  },
};
