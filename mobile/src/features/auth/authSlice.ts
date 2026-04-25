import { showInfoToast } from "@/constants/Toast-message";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

export interface User {
  id: string;
  email: string;
  name: string;
  availablePoints?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface DecodedToken {
  userId: string;
  exp: number; // in seconds
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Login user
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);

    if (!response.data.success) {
      return rejectWithValue(response.data.error || "Login failed");
    }

    const { token, user } = response.data.data;

    // Store securely
    await SecureStore.setItemAsync("userToken", token);
    await SecureStore.setItemAsync("userData", JSON.stringify(user));

    return { user, token };
  } catch (error: any) {
    const message =
      error.response?.data?.error || error.message || "Login failed";
    return rejectWithValue(message);
  }
});

//  restore token on app launch
export const restoreToken = createAsyncThunk<
  { user: User; token: string } | null,
  void,
  { rejectValue: string }
>("auth/restoreToken", async (_, { rejectWithValue }) => {
  try {
    const token = await SecureStore.getItemAsync("userToken");
    const userData = await SecureStore.getItemAsync("userData");

    if (!token || !userData) {
      return null;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        showInfoToast("Session expired. Please log in again.");
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userData");
        return null;
      }
    } catch (decodeError: any) {
      showInfoToast("Session expired. Please log in again.");
      await SecureStore.deleteItemAsync("userToken");
      return null;
    }

    return {
      token,
      user: JSON.parse(userData),
    };
  } catch (error) {
    return rejectWithValue("Failed to restore token");
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logoutUser",
  async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUserPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        const newBalance = (state.user.availablePoints || 0) - action.payload;
        state.user.availablePoints = newBalance;

        const updatedUser = { ...state.user, availablePoints: newBalance };
        SecureStore.setItemAsync("userData", JSON.stringify(updatedUser));
      }
    },
    finishLoading: (state) => {
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      });

    // Restore Token
    builder
      .addCase(restoreToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreToken.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(restoreToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { setCredentials, updateUserPoints, finishLoading, clearError } =
  authSlice.actions;
export default authSlice.reducer;
