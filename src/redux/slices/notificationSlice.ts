/**
 * Redux slice for notification state management
 * Manages real-time alerts and toast notifications
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: number;
  timestamp: string;
  isRead: boolean;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
}

interface ToastNotification {
  id: number | string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  toastQueue: ToastNotification[];
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  toastQueue: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'isRead'>>) => {
      const notification: Notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        ...action.payload,
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
      
      if (state.notifications.length > 100) {
        state.notifications = state.notifications.slice(0, 100);
      }
    },
    
    markAsRead: (state, action: PayloadAction<number>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    
    deleteNotification: (state, action: PayloadAction<number>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    addToast: (state, action: PayloadAction<Omit<ToastNotification, 'id'>>) => {
      const toast: ToastNotification = {
        id: Date.now() + Math.random(),
        ...action.payload,
      };
      state.toastQueue.push(toast);
    },
    
    removeToast: (state, action: PayloadAction<number | string>) => {
      const toastId = action.payload;
      state.toastQueue = state.toastQueue.filter(t => t.id !== toastId);
    },
    
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  addToast,
  removeToast,
  setNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
