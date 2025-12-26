/**
 * Tests for useRazorpay custom hook
 */

import { renderHook, act } from '@testing-library/react';
import useRazorpay from './useRazorpay';
import { apiHelper } from '../services/api';

// Mock the API helper
jest.mock('../services/api');

describe('useRazorpay', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock window.Razorpay
    global.window.Razorpay = jest.fn();
  });

  test('should initialize with correct default values', () => {
    const { result } = renderHook(() => 
      useRazorpay({ 
        invoiceId: 1, 
        onSuccess: jest.fn(), 
        onFailure: jest.fn() 
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.initiatePayment).toBe('function');
  });

  test('should set loading state when initiating payment', async () => {
    const mockOrderData = {
      orderId: 'order_123',
      amount: 100000,
      currency: 'INR',
      keyId: 'rzp_test_key',
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      customerPhone: '1234567890',
    };

    apiHelper.post.mockResolvedValueOnce(mockOrderData);

    const mockRazorpayInstance = {
      open: jest.fn(),
    };
    global.window.Razorpay.mockReturnValue(mockRazorpayInstance);

    const { result } = renderHook(() => 
      useRazorpay({ 
        invoiceId: 1, 
        onSuccess: jest.fn(), 
        onFailure: jest.fn() 
      })
    );

    await act(async () => {
      await result.current.initiatePayment();
    });

    expect(apiHelper.post).toHaveBeenCalledWith('/v1/payment/create-order?invoiceId=1');
    expect(mockRazorpayInstance.open).toHaveBeenCalled();
  });

  test('should handle payment creation error', async () => {
    const errorMessage = 'Failed to create payment order';
    apiHelper.post.mockRejectedValueOnce({ message: errorMessage });

    const onFailureMock = jest.fn();

    const { result } = renderHook(() => 
      useRazorpay({ 
        invoiceId: 1, 
        onSuccess: jest.fn(), 
        onFailure: onFailureMock 
      })
    );

    await act(async () => {
      await result.current.initiatePayment();
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
    expect(onFailureMock).toHaveBeenCalledWith(errorMessage);
  });
});
