/**
 * Tests for Authentication Service
 */

import authService from './authService';
import { apiHelper } from './api';

// Mock axios to avoid import issues
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  })),
  post: jest.fn()
}));

// Mock the API helper
jest.mock('./api', () => ({
  apiHelper: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiHelper = apiHelper as jest.Mocked<typeof apiHelper>;

describe('authService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  describe('login', () => {
    test('should send login request with userName key (camelCase)', async () => {
      const mockResponse = {
        token: 'mock_token',
        user: { id: 1, name: 'Test User' }
      };
      
      mockedApiHelper.post.mockResolvedValueOnce(mockResponse);

      const credentials = {
        username: 'testuser',
        password: 'testpassword123',
        role: 'SUPERADMIN'
      };

      const result = await authService.login(credentials);

      // Verify the API was called with userName (camelCase) not username
      expect(mockedApiHelper.post).toHaveBeenCalledWith('/v1/auth/login', {
        userName: 'testuser',
        password: 'testpassword123',
        role: 'SUPERADMIN'
      });
      expect(result).toEqual(mockResponse);
    });

    test('should use email as userName when provided', async () => {
      const mockResponse = {
        token: 'mock_token',
        user: { id: 1, name: 'Test User' }
      };
      
      mockedApiHelper.post.mockResolvedValueOnce(mockResponse);

      const credentials = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        role: 'USER'
      };

      await authService.login(credentials);

      // Verify email is preferred over username
      expect(mockedApiHelper.post).toHaveBeenCalledWith('/v1/auth/login', {
        userName: 'test@example.com',
        password: 'password123',
        role: 'USER'
      });
    });

    test('should handle login errors', async () => {
      const errorMessage = 'Invalid credentials';
      mockedApiHelper.post.mockRejectedValueOnce(new Error(errorMessage));

      const credentials = {
        username: 'testuser',
        password: 'wrongpassword',
        role: 'USER'
      };

      await expect(authService.login(credentials)).rejects.toThrow(errorMessage);
    });
  });
});
