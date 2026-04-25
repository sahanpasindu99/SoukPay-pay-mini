import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { logoutUser } from "../features/auth/authSlice";
import { store } from "../store/store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log("Error fetching token from SecureStore", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Session expired.");
      store.dispatch(logoutUser() as any);
    }
    return Promise.reject(error);
  },
);
export default api;
