/**
 * WebSocket Service
 * Manages WebSocket connection for real-time updates
 * TODO: Replace with actual WebSocket server URL
 */

import { io } from 'socket.io-client';
import { WS_URL, STORAGE_KEYS } from '../utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.socket?.connected) {
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // TODO: Replace with actual WebSocket server URL
    this.socket = io(WS_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function (optional)
   */
  off(event, callback) {
    if (!this.socket) {
      return;
    }

    if (callback) {
      this.socket.off(event, callback);
      
      // Remove from listeners
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    } else {
      this.socket.off(event);
      delete this.listeners[event];
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Data to send
   */
  emit(event, data) {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit(event, data);
  }

  /**
   * Subscribe to vehicle status updates
   * @param {Function} callback - Callback function
   */
  onVehicleStatusUpdate(callback) {
    this.on('vehicle:status:update', callback);
  }

  /**
   * Subscribe to new parking requests
   * @param {Function} callback - Callback function
   */
  onNewParkingRequest(callback) {
    this.on('vehicle:new:request', callback);
  }

  /**
   * Subscribe to valet assignments
   * @param {Function} callback - Callback function
   */
  onValetAssignment(callback) {
    this.on('valet:assignment', callback);
  }

  /**
   * Subscribe to notifications
   * @param {Function} callback - Callback function
   */
  onNotification(callback) {
    this.on('notification', callback);
  }

  /**
   * Emit vehicle status update
   * @param {string} vehicleId - Vehicle ID
   * @param {string} status - New status
   */
  updateVehicleStatus(vehicleId, status) {
    this.emit('vehicle:status:update', { vehicleId, status });
  }

  /**
   * Join a room (for host-specific updates)
   * @param {string} roomId - Room ID (usually host ID)
   */
  joinRoom(roomId) {
    this.emit('room:join', { roomId });
  }

  /**
   * Leave a room
   * @param {string} roomId - Room ID
   */
  leaveRoom(roomId) {
    this.emit('room:leave', { roomId });
  }

  /**
   * Clean up all listeners
   */
  cleanup() {
    Object.keys(this.listeners).forEach(event => {
      this.off(event);
    });
    this.listeners = {};
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
