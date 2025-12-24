/**
 * Redux slice for authentication state management
 * Manages user authentication, login, logout, and token storage
 */

import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';

// Initial state with data from local storage if available
let storedUser = null;
try {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  storedUser = raw ? JSON.parse(raw) : null;
} catch (e) {
  storedUser = null;
}

const initialState = {
  user: storedUser,
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || "",
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    loginSuccess: (state, action) => {
      const resp = action.payload?.data ?? action.payload ?? {};
      const accessToken = resp.accessToken ?? resp.token ?? "";
      const refreshToken = resp.refreshToken ?? null;
      const { accessToken: _a, refreshToken: _r, ...userObj } = resp;
      if (Object.keys(userObj).length) {
        if (userObj.username) {
          userObj.name = userObj.username;
          userObj.email = userObj.username;
        }
      }
      const user = Object.keys(userObj).length ? userObj : null;

      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }
      if (accessToken) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      }
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    },
    
    // Login failure - set error
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Logout - clear all auth data
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    
    // Update user profile
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
    },
    
    // Update token (for refresh token flow)
    updateToken: (state, action) => {
      const { accessToken: token, refreshToken } = action.payload;
      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  updateToken,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
