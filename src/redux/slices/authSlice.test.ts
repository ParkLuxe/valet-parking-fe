/**
 * Tests for Auth Redux Slice
 */

import authReducer, {
  loginSuccess,
  setUserData,
  logout,
} from './authSlice';
import { STORAGE_KEYS } from '../../utils';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authSlice', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('loginSuccess', () => {
    it('should store tokens and update state on login success', () => {
      const initialState = {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

      const loginResponse = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      };

      const newState = authReducer(initialState, loginSuccess(loginResponse));

      // Check state updates
      expect(newState.token).toBe('test-access-token');
      expect(newState.refreshToken).toBe('test-refresh-token');
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.user).toBe(null); // User should not be set by loginSuccess

      // Check localStorage
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe('test-access-token');
      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe('test-refresh-token');
    });

    it('should handle login success without refresh token', () => {
      const initialState = {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

      // Only include accessToken, omit refreshToken
      const loginResponse = {
        accessToken: 'test-access-token',
      } as any;

      const newState = authReducer(initialState, loginSuccess(loginResponse));

      expect(newState.token).toBe('test-access-token');
      expect(newState.refreshToken).toBe(null);
      expect(newState.isAuthenticated).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe('test-access-token');
      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe(null);
    });

    it('should support legacy token field for backward compatibility', () => {
      const initialState = {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

      // Only include token field (legacy), omit accessToken
      const loginResponse = {
        token: 'legacy-token',
      } as any;

      const newState = authReducer(initialState, loginSuccess(loginResponse));

      expect(newState.token).toBe('legacy-token');
      expect(newState.isAuthenticated).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe('legacy-token');
    });
  });

  describe('setUserData', () => {
    it('should store user data in state and localStorage', () => {
      const initialState = {
        user: null,
        token: 'test-token',
        refreshToken: 'test-refresh',
        isAuthenticated: true,
        loading: false,
        error: null,
      };

      const userData = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        roleName: 'HOSTADMIN' as const,
      };

      const newState = authReducer(initialState, setUserData(userData));

      // Check state updates
      expect(newState.user).toEqual(userData);

      // Check localStorage
      expect(localStorage.getItem(STORAGE_KEYS.USER_DATA)).toBe(JSON.stringify(userData));
    });

    it('should normalize role object to string when setting user data', () => {
      const initialState = {
        user: null,
        token: 'test-token',
        refreshToken: 'test-refresh',
        isAuthenticated: true,
        loading: false,
        error: null,
      };

      const userData = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: { name: 'HOSTADMIN' } as any,
      };

      const newState = authReducer(initialState, setUserData(userData));

      // Check that role was normalized to `roleName` string
      expect(newState.user?.roleName).toBe('HOSTADMIN');
      expect(typeof newState.user?.roleName).toBe('string');

      // Check localStorage has normalized roleName
      const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || '{}');
      expect(storedUser.roleName).toBe('HOSTADMIN');
      expect(typeof storedUser.roleName).toBe('string');
    });

    it('should keep role as string when it is already a string', () => {
      const initialState = {
        user: null,
        token: 'test-token',
        refreshToken: 'test-refresh',
        isAuthenticated: true,
        loading: false,
        error: null,
      };

      const userData = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        roleName: 'HOSTADMIN' as const,
      };

      const newState = authReducer(initialState, setUserData(userData));

      // Check that roleName remains a string
      expect(newState.user?.roleName).toBe('HOSTADMIN');
      expect(typeof newState.user?.roleName).toBe('string');
    });
  });

  describe('logout', () => {
    it('should clear all auth data from state and localStorage', () => {
      const initialState = {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          roleName: 'HOSTADMIN' as const,
        },
        token: 'test-token',
        refreshToken: 'test-refresh',
        isAuthenticated: true,
        loading: false,
        error: null,
      };

      // Set localStorage values
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(initialState.user));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'test-token');
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'test-refresh');

      const newState = authReducer(initialState, logout());

      // Check state is cleared
      expect(newState.user).toBe(null);
      expect(newState.token).toBe(null);
      expect(newState.refreshToken).toBe(null);
      expect(newState.isAuthenticated).toBe(false);

      // Check localStorage is cleared
      expect(localStorage.getItem(STORAGE_KEYS.USER_DATA)).toBe(null);
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(null);
      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe(null);
    });
  });
});
