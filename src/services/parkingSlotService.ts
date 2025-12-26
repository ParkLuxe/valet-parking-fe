/**
 * Parking Slot Service
 * Handles parking slot management operations
 */

import { apiHelper } from './api';

const parkingSlotService = {
  /**
   * Create parking slots for host
   * @param {string} hostId - Host ID
   * @param {object} slotData - Slot creation data
   * @returns {Promise} Created parking slots
   */
  createParkingSlots: async (hostId, slotData) => {
    try {
      const response = await apiHelper.post(`/v1/parking-slot/create?hostId=${hostId}`, slotData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default parkingSlotService;
