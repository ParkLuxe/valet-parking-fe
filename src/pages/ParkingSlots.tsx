/**
 * Parking Slots Page - Enhanced UI/UX
 * Visual parking lot layout with real-time status monitoring
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import type { RootState } from '../redux';
import { addToast } from '../redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Car,
  MapPin,
  Clock,
  User,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
  Timer,
  Building2,
} from 'lucide-react';
import { Card } from '../components';
import { Button } from '../components';
import { Input } from '../components';
import { Modal } from '../components';
import { LoadingSpinner } from '../components';
import { useParkingSlots, useCreateParkingSlots } from '../hooks/queries/useParkingSlots';
import { cn } from '../utils';

const ParkingSlots = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const hostId = user?.hostId || '';

  const { data: slotsData, isLoading, error } = useParkingSlots(hostId);
  const createSlotsMutation = useCreateParkingSlots();

  const slots = useMemo(() => {
    if (!slotsData) return [];
    return Array.isArray(slotsData) ? slotsData : (slotsData?.data || slotsData?.content || []);
  }, [slotsData]);

  const [selectedFloor, setSelectedFloor] = useState<string | number>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [showSlotDetails, setShowSlotDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlotData, setNewSlotData] = useState({
    slotNumber: '',
    floor: '',
    section: '',
  });
  const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});

  // Show error toast
  useEffect(() => {
    if (error) {
      dispatch(addToast({
        type: 'error',
        message: (error as Error).message || 'Failed to load parking slots',
      }));
    }
  }, [error, dispatch]);

  // Get unique floors from slots
  const floors = useMemo<(string | number)[]>(() => {
    const floorSet = new Set(slots.map(slot => slot.floor || '1'));
    const floorArray = Array.from(floorSet) as (string | number)[];
    return floorArray.sort((a, b) => {
      const aNum = Number(a) || 0;
      const bNum = Number(b) || 0;
      return aNum - bNum;
    });
  }, [slots]);

  // Filter slots by floor, status, and search query
  const filteredSlots = useMemo(() => {
    return slots
      .filter(slot => {
        if (selectedFloor !== 'all' && (slot.floor || '1') !== selectedFloor) return false;
        if (statusFilter !== 'all') {
          const slotStatus = (slot.status || slot.isAvailable ? 'AVAILABLE' : 'OCCUPIED').toUpperCase();
          if (statusFilter.toUpperCase() !== slotStatus) return false;
        }
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          String(slot.slotNumber || '').toLowerCase().includes(query) ||
          String(slot.id || '').toLowerCase().includes(query) ||
          (slot.vehicleNumber && String(slot.vehicleNumber).toLowerCase().includes(query))
        );
      });
  }, [slots, selectedFloor, statusFilter, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const floorSlots = selectedFloor === 'all' 
      ? slots 
      : slots.filter(slot => (slot.floor || '1') === selectedFloor);
    
    const available = floorSlots.filter(slot => {
      const status = (slot.status || (slot.isAvailable ? 'AVAILABLE' : 'OCCUPIED')).toUpperCase();
      return status === 'AVAILABLE';
    }).length;
    
    const occupied = floorSlots.filter(slot => {
      const status = (slot.status || (slot.isAvailable ? 'AVAILABLE' : 'OCCUPIED')).toUpperCase();
      return status === 'OCCUPIED';
    }).length;
    
    const reserved = floorSlots.filter(slot => {
      const status = (slot.status || (slot.isAvailable ? 'AVAILABLE' : 'OCCUPIED')).toUpperCase();
      return status === 'RESERVED';
    }).length;
    
    const total = floorSlots.length;
    
    return { available, occupied, reserved, total };
  }, [slots, selectedFloor]);

  // Get slot status
  const getSlotStatus = (slot: any) => {
    if (slot.status) return slot.status.toUpperCase();
    return slot.isAvailable ? 'AVAILABLE' : 'OCCUPIED';
  };

  // Get slot color based on status
  const getSlotColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'AVAILABLE':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/50',
          hover: 'hover:bg-green-500/30 hover:border-green-500',
          text: 'text-green-400',
          icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
        };
      case 'OCCUPIED':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/50',
          hover: 'hover:bg-red-500/30 hover:border-red-500',
          text: 'text-red-400',
          icon: <Car className="w-5 h-5 text-red-400" />,
        };
      case 'RESERVED':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/50',
          hover: 'hover:bg-yellow-500/30 hover:border-yellow-500',
          text: 'text-yellow-400',
          icon: <Timer className="w-5 h-5 text-yellow-400" />,
        };
      case 'MAINTENANCE':
        return {
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/50',
          hover: 'hover:bg-gray-500/30 hover:border-gray-500',
          text: 'text-gray-400',
          icon: <AlertCircle className="w-5 h-5 text-gray-400" />,
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/50',
          hover: 'hover:bg-gray-500/30 hover:border-gray-500',
          text: 'text-gray-400',
          icon: <AlertCircle className="w-5 h-5 text-gray-400" />,
        };
    }
  };

  const handleSlotClick = (slot: any) => {
    setSelectedSlot(slot);
    setShowSlotDetails(true);
  };

  const handleNewSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSlotData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (slotErrors[name]) {
      setSlotErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateNewSlot = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newSlotData.slotNumber.trim()) {
      newErrors.slotNumber = 'Slot number is required';
    }
    
    setSlotErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNewSlot()) {
      return;
    }

    // Validate hostId is present
    if (!hostId) {
      dispatch(addToast({
        type: 'error',
        message: 'Host ID is missing. Please ensure you are logged in with a valid host account.',
      }));
      return;
    }

    try {
      // Only send hostId for now, slots are commented out as per requirements
      await createSlotsMutation.mutateAsync({
        hostId: String(hostId), // Ensure it's a string
        // slots: [{
        //   slotNumber: newSlotData.slotNumber.trim(),
        //   slotType: newSlotData.section || undefined,
        //   isAvailable: true,
        // }],
      });
      
      // Reset form and close modal
      setNewSlotData({
        slotNumber: '',
        floor: '',
        section: '',
      });
      setSlotErrors({});
      setShowAddModal(false);
    } catch (err) {
      // Error is handled by the mutation
      console.error('Failed to create slot:', err);
    }
  };

  const handleCloseAddModal = () => {
    setNewSlotData({
      slotNumber: '',
      floor: '',
      section: '',
    });
    setSlotErrors({});
    setShowAddModal(false);
  };

  if (isLoading && !slots.length) {
    return <LoadingSpinner message="Loading parking slots..." fullScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Parking Slots</h1>
          <p className="text-white/70">Manage and monitor parking slot availability in real-time</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          startIcon={<Plus className="w-5 h-5" />}
        >
          Add New Slot
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Floor Selector */}
          <div className="flex items-center gap-3 flex-1">
            <Building2 className="w-5 h-5 text-white/70" />
            <span className="text-white/90 font-medium whitespace-nowrap">Floor:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedFloor('all')}
                className={cn(
                  'px-4 py-2 rounded-[5px] font-medium text-sm transition-all',
                  selectedFloor === 'all'
                    ? 'bg-gradient-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                )}
              >
                All
              </button>
              {floors.map((floor) => (
                <button
                  key={String(floor)}
                  onClick={() => setSelectedFloor(floor)}
                  className={cn(
                    'px-4 py-2 rounded-[5px] font-medium text-sm transition-all',
                    selectedFloor === floor
                      ? 'bg-gradient-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  )}
                >
                  {String(floor)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-white/70" />
            <div className="flex gap-2">
              {['all', 'AVAILABLE', 'OCCUPIED', 'RESERVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all capitalize',
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  )}
                >
                  {status === 'all' ? 'All' : status.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="w-full lg:w-80">
            <Input
              type="text"
              placeholder="Search slot or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              showPlaceholder={true}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-500/10 border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Available</p>
              <p className="text-2xl font-bold text-green-400">{stats.available}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400/50" />
          </div>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Occupied</p>
              <p className="text-2xl font-bold text-red-400">{stats.occupied}</p>
            </div>
            <Car className="w-8 h-8 text-red-400/50" />
          </div>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Reserved</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.reserved}</p>
            </div>
            <Timer className="w-8 h-8 text-yellow-400/50" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Slots</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <MapPin className="w-8 h-8 text-white/30" />
          </div>
        </Card>
      </div>

      {/* Parking Grid */}
      <Card>
        <div className="p-6">
          {filteredSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
              <AnimatePresence>
                {filteredSlots.map((slot, index) => {
                  const status = getSlotStatus(slot);
                  const colors = getSlotColor(status);
                  return (
                    <motion.button
                      key={slot.id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleSlotClick(slot)}
                      className={cn(
                        'relative p-4 rounded-[5px] border-2 transition-all duration-200',
                        'flex flex-col items-center justify-center gap-2 min-h-[100px]',
                        'hover:scale-105 hover:shadow-lg cursor-pointer group',
                        colors.bg,
                        colors.border,
                        colors.hover
                      )}
                    >
                      {/* Status Icon */}
                      <div className="absolute top-2 right-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        {colors.icon}
                      </div>

                      {/* Slot Number */}
                      <div className={cn('text-lg font-bold', colors.text)}>
                        {slot.slotNumber || slot.name || `Slot ${index + 1}`}
                      </div>

                      {/* Vehicle indicator for occupied slots */}
                      {status === 'OCCUPIED' && (
                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <Car className="w-3 h-3" />
                          <span className="truncate max-w-[60px]">
                            {slot.vehicleNumber || 'Occupied'}
                          </span>
                        </div>
                      )}

                      {/* Section indicator */}
                      {slot.section && (
                        <div className="absolute bottom-1 left-2 text-xs text-white/40">
                          {slot.section}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/70 text-lg mb-2">No parking slots found</p>
              <p className="text-white/50 text-sm mb-6">
                {searchQuery || statusFilter !== 'all' || selectedFloor !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first parking slot to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && selectedFloor === 'all' && (
                <Button
                  variant="primary"
                  onClick={() => setShowAddModal(true)}
                  startIcon={<Plus className="w-4 h-4" />}
                >
                  Add New Slot
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Entrance Indicator */}
        {filteredSlots.length > 0 && (
          <div className="border-t-2 border-yellow-500/30 mx-6 my-4 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background-secondary px-4">
              <span className="text-yellow-400 font-semibold uppercase text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Entrance
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Slot Details Modal */}
      {showSlotDetails && selectedSlot && (
        <Modal
          open={showSlotDetails}
          onClose={() => {
            setShowSlotDetails(false);
            setSelectedSlot(null);
          }}
          title={`Slot ${selectedSlot.slotNumber || selectedSlot.name || 'Details'}`}
        >
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-[5px]">
              <span className="text-white/70">Status</span>
              <div className="flex items-center gap-2">
                {getSlotColor(getSlotStatus(selectedSlot)).icon}
                <span className={cn('font-semibold capitalize', getSlotColor(getSlotStatus(selectedSlot)).text)}>
                  {getSlotStatus(selectedSlot).toLowerCase()}
                </span>
              </div>
            </div>

            {/* Floor */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-[5px]">
              <span className="text-white/70 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Floor
              </span>
              <span className="font-semibold text-white">{selectedSlot.floor || '1'}</span>
            </div>

            {/* Section */}
            {selectedSlot.section && (
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-[5px]">
                <span className="text-white/70 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Section
                </span>
                <span className="font-semibold text-white">{selectedSlot.section}</span>
              </div>
            )}

            {/* Vehicle Details (if occupied) */}
            {getSlotStatus(selectedSlot) === 'OCCUPIED' && (
              <>
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Vehicle Information
                  </h4>
                </div>

                {selectedSlot.vehicleNumber && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-[5px]">
                    <span className="text-white/70">Vehicle Number</span>
                    <span className="font-semibold text-white">{selectedSlot.vehicleNumber}</span>
                  </div>
                )}

                {selectedSlot.valetName && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-[5px]">
                    <span className="text-white/70 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Valet Assigned
                    </span>
                    <span className="font-semibold text-white">{selectedSlot.valetName}</span>
                  </div>
                )}

                {selectedSlot.parkedAt && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-[5px]">
                    <span className="text-white/70 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Parked Since
                    </span>
                    <span className="font-semibold text-white text-sm">
                      {new Date(selectedSlot.parkedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              {getSlotStatus(selectedSlot) === 'AVAILABLE' && (
                <Button variant="primary" className="flex-1">
                  Assign Vehicle
                </Button>
              )}
              {getSlotStatus(selectedSlot) === 'OCCUPIED' && (
                <Button variant="primary" className="flex-1">
                  Release Slot
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setShowSlotDetails(false);
                  setSelectedSlot(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <Modal
          open={showAddModal}
          onClose={handleCloseAddModal}
          title="Add New Parking Slot"
        >
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div className="space-y-4">
              <Input
                label="Slot Number"
                name="slotNumber"
                value={newSlotData.slotNumber}
                onChange={handleNewSlotChange}
                placeholder="e.g., A-101, B-205"
                error={!!slotErrors.slotNumber}
                helperText={slotErrors.slotNumber}
                icon={<MapPin className="w-5 h-5" />}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Floor"
                  name="floor"
                  value={newSlotData.floor}
                  onChange={handleNewSlotChange}
                  placeholder="e.g., 1, 2, Ground"
                  icon={<Building2 className="w-5 h-5" />}
                />

                <Input
                  label="Section"
                  name="section"
                  value={newSlotData.section}
                  onChange={handleNewSlotChange}
                  placeholder="e.g., A, B, North"
                  icon={<MapPin className="w-5 h-5" />}
                />
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-[5px]">
                <p className="text-blue-300 text-xs">
                  💡 Tip: Use a clear naming convention like "A-101" (Section-Floor-Number) for easy identification.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseAddModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={createSlotsMutation.isPending}
                className="flex-1"
              >
                Add Slot
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ParkingSlots;
