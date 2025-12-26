/**
 * Redux slice for authentication state management
 * Manages user authentication, login, logout, and token storage
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  STORAGE_KEYS  } from '../../utils';
import type { User, AuthResponse } from '../../types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state with data from local storage if available
let storedUser: User | null = null;
try {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  storedUser = raw ? JSON.parse(raw) : null;
} catch (e) {
  storedUser = null;
}

const initialState: AuthState = {
  user: storedUser,
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null,
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    loginSuccess: (state, action: PayloadAction<AuthResponse | { data: AuthResponse }>) => {
      const resp = 'data' in action.payload ? action.payload.data : action.payload;
      const accessToken = resp.accessToken ?? resp.token ?? '';
      const refreshToken = resp.refreshToken ?? null;
      
      // Extract user object
      const { accessToken: _a, refreshToken: _r, token: _t, ...userObj } = resp;
      let user: User | null = null;
      
      if (Object.keys(userObj).length > 0) {
        user = userObj as User;
        if (!user.name && user.username) {
          user.name = user.username;
        }
        if (!user.email && user.username) {
          user.email = user.username;
        }
      }

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
    
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
      }
    },
    
    updateToken: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      const { accessToken, refreshToken } = action.payload;
      state.token = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    },
    
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
