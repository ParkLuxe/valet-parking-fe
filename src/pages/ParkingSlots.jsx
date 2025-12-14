/**
 * Parking Slots Page - BookMyShow Style Grid
 * Visual grid layout showing all parking slots with real-time status
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Car,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { cn } from '../utils/cn';

const ParkingSlots = () => {
  const { slots = [] } = useSelector((state) => state.parkingSlots || { slots: [] });
  
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSlotDetails, setShowSlotDetails] = useState(false);

  // Get unique floors from slots
  const floors = useMemo(() => {
    const floorSet = new Set(slots.map(slot => slot.floor || 1));
    return Array.from(floorSet).sort((a, b) => a - b);
  }, [slots]);

  // Filter slots by floor and search query
  const filteredSlots = useMemo(() => {
    return slots
      .filter(slot => (slot.floor || 1) === selectedFloor)
      .filter(slot => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          slot.id.toLowerCase().includes(query) ||
          slot.slotNumber.toLowerCase().includes(query) ||
          (slot.vehicleNumber && slot.vehicleNumber.toLowerCase().includes(query))
        );
      });
  }, [slots, selectedFloor, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const floorSlots = slots.filter(slot => (slot.floor || 1) === selectedFloor);
    const available = floorSlots.filter(slot => slot.status === 'available').length;
    const occupied = floorSlots.filter(slot => slot.status === 'occupied').length;
    const reserved = floorSlots.filter(slot => slot.status === 'reserved').length;
    const total = floorSlots.length;
    
    return { available, occupied, reserved, total };
  }, [slots, selectedFloor]);

  // Get slot color based on status
  const getSlotColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 border-green-500 hover:bg-green-500/30';
      case 'occupied':
        return 'bg-red-500/20 border-red-500 hover:bg-red-500/30';
      case 'reserved':
        return 'bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500 hover:bg-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return '🟢';
      case 'occupied':
        return '🔴';
      case 'reserved':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowSlotDetails(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Parking Slots
          </h1>
          <p className="text-white/70">
            Manage and monitor parking slot availability in real-time
          </p>
        </div>
        <Button
          variant="gradient"
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Slot
        </Button>
      </div>

      {/* Controls Bar */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6">
          {/* Floor Selector */}
          <div className="flex items-center gap-2">
            <span className="text-white/70 font-medium">Floor:</span>
            <div className="flex gap-2">
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={cn(
                    'px-4 py-2 rounded-button font-medium transition-all',
                    selectedFloor === floor
                      ? 'bg-gradient-primary text-white shadow-glow-primary'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  )}
                >
                  {floor}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search slot or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-button text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-6 items-center justify-center p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟢</span>
            <span className="text-white/70">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔴</span>
            <span className="text-white/70">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟡</span>
            <span className="text-white/70">Reserved</span>
          </div>
        </div>
      </Card>

      {/* Parking Grid */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredSlots.map((slot, index) => (
              <motion.button
                key={slot.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => handleSlotClick(slot)}
                className={cn(
                  'relative p-4 rounded-lg border-2 transition-all duration-300',
                  'flex flex-col items-center justify-center gap-2',
                  'hover:scale-105 hover:shadow-lg cursor-pointer',
                  getSlotColor(slot.status)
                )}
              >
                {/* Slot Number */}
                <div className="text-xl font-bold text-white">
                  {slot.slotNumber}
                </div>
                
                {/* Status Icon */}
                <div className="text-2xl">
                  {getStatusIcon(slot.status)}
                </div>

                {/* Vehicle indicator for occupied slots */}
                {slot.status === 'occupied' && (
                  <div className="absolute top-1 right-1">
                    <Car className="w-4 h-4 text-white/70" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {filteredSlots.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50">No parking slots found</p>
            </div>
          )}
        </div>

        {/* Entrance Indicator */}
        <div className="border-t-4 border-yellow-500/50 mx-6 my-4 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#1a1a2e] px-4">
            <span className="text-yellow-500 font-bold uppercase text-sm">
              ⬇ Entrance ⬇
            </span>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <Card>
        <div className="flex flex-wrap gap-6 items-center justify-center p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{stats.available}</div>
            <div className="text-white/70 text-sm">Available</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{stats.occupied}</div>
            <div className="text-white/70 text-sm">Occupied</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{stats.reserved}</div>
            <div className="text-white/70 text-sm">Reserved</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-white/70 text-sm">Total Slots</div>
          </div>
        </div>
      </Card>

      {/* Slot Details Modal */}
      <AnimatePresence>
        {showSlotDetails && selectedSlot && selectedSlot.slotNumber && (
          <Modal
            open={showSlotDetails}
            onClose={() => setShowSlotDetails(false)}
            title={`Slot ${selectedSlot.slotNumber} Details`}
          >
            <div className="space-y-4">
              {/* Slot Status */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Status</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getStatusIcon(selectedSlot?.status)}</span>
                  <span className="font-medium capitalize text-white">
                    {selectedSlot?.status || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Floor */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Floor</span>
                <span className="font-medium text-white">{selectedSlot?.floor || 1}</span>
              </div>

              {/* Vehicle Details (if occupied) */}
              {selectedSlot?.status === 'occupied' && selectedSlot?.vehicleNumber && (
                <>
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Vehicle Information</h4>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white/70">Vehicle Number</span>
                    <span className="font-medium text-white">{selectedSlot?.vehicleNumber || 'N/A'}</span>
                  </div>

                  {selectedSlot?.valetName && (
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <span className="text-white/70">Valet Assigned</span>
                      <span className="font-medium text-white">{selectedSlot?.valetName}</span>
                    </div>
                  )}

                  {selectedSlot?.parkedAt && (
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <span className="text-white/70">Parked Since</span>
                      <span className="font-medium text-white">
                        {new Date(selectedSlot.parkedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedSlot?.status === 'available' && (
                  <Button variant="gradient" className="flex-1">
                    Assign Vehicle
                  </Button>
                )}
                {selectedSlot?.status === 'occupied' && (
                  <Button variant="gradient" className="flex-1">
                    Release Slot
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowSlotDetails(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParkingSlots;
