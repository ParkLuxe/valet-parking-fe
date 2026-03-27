/**
 * Vehicle Management — Valet Mobile Operations Design
 * Vehicle Status Board (Kanban) — matching the Stitch "Vehicle Lifecycle Board" screen
 * Preserves all existing API hooks, VEHICLE_STATUS constants, and filter logic
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Filter } from 'lucide-react';
import { Button } from '../../components';
import { ExportButton } from '../../components';
import { DateRangePicker } from '../../components';
import { LoadingSpinner } from '../../components';
import { useParkedVehicles } from '../../hooks/queries/useVehicles';
import { VEHICLE_STATUS, VEHICLE_STATUS_DISPLAY } from '../../utils';

// ─── Status column config ───────────────────────────────────────────────
const KANBAN_COLUMNS = [
  {
    id: VEHICLE_STATUS.ASSIGNED,
    label: 'Assigned',
    accent: '#e9c349',
    bg: 'rgba(233,195,73,0.08)',
    border: 'rgba(233,195,73,0.2)',
    dot: '#e9c349',
  },
  {
    id: VEHICLE_STATUS.PARKING_IN_PROGRESS,
    label: 'Parking In Progress',
    accent: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    dot: '#8b5cf6',
  },
  {
    id: VEHICLE_STATUS.PARKED,
    label: 'Parked',
    accent: '#4ade80',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
    dot: '#4ade80',
  },
  {
    id: VEHICLE_STATUS.RETRIEVAL_REQUESTED,
    label: 'Retrieval Requested',
    accent: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.2)',
    dot: '#fb923c',
  },
  {
    id: VEHICLE_STATUS.OUT_FOR_DELIVERY,
    label: 'Out for Delivery',
    accent: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
    dot: '#a78bfa',
  },
  {
    id: VEHICLE_STATUS.DELIVERED,
    label: 'Delivered',
    accent: '#909097',
    bg: 'rgba(144,144,151,0.08)',
    border: 'rgba(144,144,151,0.2)',
    dot: '#909097',
  },
];

// ─── Vehicle Card ────────────────────────────────────────────────────────
const VehicleCard = ({ vehicle, accent, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ delay: index * 0.04 }}
    className="p-4 rounded-[0.375rem] cursor-default"
    style={{
      background: '#222a3d',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    <div className="flex items-center justify-between mb-2">
      <span
        className="text-base font-bold font-mono"
        style={{ color: accent, fontFamily: 'Manrope, sans-serif' }}
      >
        {vehicle.vehicleNumber || 'N/A'}
      </span>
      <Car className="w-4 h-4 opacity-40" style={{ color: accent }} />
    </div>
    {vehicle.customerName && (
      <p className="text-xs mb-0.5" style={{ color: '#c6c6cd', fontFamily: 'Inter, sans-serif' }}>
        {vehicle.customerName}
      </p>
    )}
    {vehicle.assignedValet && (
      <p className="text-xs" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>
        Valet: {vehicle.assignedValet}
      </p>
    )}
    {vehicle.parkingSlot && (
      <p className="text-xs mt-1" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>
        Slot: {vehicle.parkingSlot}
      </p>
    )}
  </motion.div>
);

// ─── Kanban Column ───────────────────────────────────────────────────────
const KanbanColumn = ({ column, vehicles }) => (
  <div className="flex flex-col min-w-[240px] flex-1">
    {/* Column header */}
    <div
      className="flex items-center justify-between px-4 py-3 rounded-t-[12px] mb-0"
      style={{
        background: column.bg,
        borderLeft: `2px solid ${column.border}`,
        borderRight: `2px solid ${column.border}`,
        borderTop: `2px solid ${column.border}`,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: column.accent, boxShadow: `0 0 8px ${column.accent}80` }}
        />
        <span
          className="text-xs font-semibold"
          style={{ color: column.accent, fontFamily: 'Inter, sans-serif' }}
        >
          {column.label}
        </span>
      </div>
      <span
        className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: `${column.accent}22`, color: column.accent }}
      >
        {vehicles.length}
      </span>
    </div>

    {/* Cards container */}
    <div
      className="flex-1 p-3 space-y-2 rounded-b-[12px] min-h-[200px]"
      style={{
        background: '#131b2e',
        borderLeft: `2px solid ${column.border}`,
        borderRight: `2px solid ${column.border}`,
        borderBottom: `2px solid ${column.border}`,
      }}
    >
      <AnimatePresence>
        {vehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-20"
          >
            <p className="text-xs" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>
              No vehicles
            </p>
          </motion.div>
        )}
        {vehicles.map((v, i) => (
          <VehicleCard key={v.id || i} vehicle={v} accent={column.accent} index={i} />
        ))}
      </AnimatePresence>
    </div>
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────
const VehicleManagement = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const { data: vehicles = [], isLoading: loading } = useParkedVehicles(user?.hostId || '');

  // Columns data
  const columnsWithVehicles = KANBAN_COLUMNS.map(col => ({
    ...col,
    vehicles: vehicles.filter(v => v.status === col.id),
  }));

  // Summary stats
  const activeCount   = vehicles.filter(v => [VEHICLE_STATUS.ASSIGNED, VEHICLE_STATUS.PARKING_IN_PROGRESS, VEHICLE_STATUS.RETRIEVAL_REQUESTED, VEHICLE_STATUS.OUT_FOR_DELIVERY].includes(v.status as any)).length;
  const parkedCount   = vehicles.filter(v => v.status === VEHICLE_STATUS.PARKED).length;
  const deliveredCount = vehicles.filter(v => v.status === VEHICLE_STATUS.DELIVERED).length;

  // Export columns for CSV
  const exportCols = [
    { header: 'Vehicle Number', accessor: 'vehicleNumber' },
    { header: 'Customer',       accessor: 'customerName'  },
    { header: 'Status',         accessor: 'status'        },
    { header: 'Valet',          accessor: 'assignedValet' },
    { header: 'Parking Slot',   accessor: 'parkingSlot'   },
    { header: 'Created At',     accessor: 'createdAt'     },
  ];

  if (loading && !vehicles.length) {
    return <LoadingSpinner message="Loading vehicles..." fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: '#8b5cf6', fontFamily: 'Inter, sans-serif' }}>VEHICLE LIFECYCLE</p>
          <h1 className="text-4xl font-bold mb-1" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>
            Status Board
          </h1>
          <p className="text-sm" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>
            Real-time vehicle lifecycle tracking across all stations
          </p>
        </div>
        <div className="flex gap-2 mt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<Filter className="w-4 h-4" />}
          >
            Filters
          </Button>
          <ExportButton
            data={vehicles}
            columns={exportCols}
            filename="vehicles"
            format="csv"
            variant="outline"
          />
        </div>
      </motion.div>

      {/* Summary stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-6 px-5 py-3 rounded-[0.375rem]"
        style={{ background: '#171f33', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
      >
        {[
          { label: 'Total Vehicles', value: vehicles.length, color: '#dae2fd' },
          { label: 'Active',         value: activeCount,     color: '#8b5cf6'  },
          { label: 'Parked',         value: parkedCount,     color: '#4ade80'  },
          { label: 'Delivered',      value: deliveredCount,  color: '#909097'  },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-2xl font-bold tabular-nums" style={{ color: stat.color, fontFamily: 'Manrope, sans-serif' }}>
              {stat.value}
            </span>
            <span className="text-xs" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>
              {stat.label}
            </span>
            <div className="w-px h-6 mx-2" style={{ background: 'rgba(139,92,246,0.08)' }} />
          </div>
        )).reduce((acc, el, i, arr) => (i < arr.length - 1 ? [...acc, el] : [...acc, el.props ? React.cloneElement(el, { key: `last-${i}` }) : el]), [] as React.ReactNode[])}
      </motion.div>

      {/* Filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-[12px]" style={{ background: '#171f33' }}>
          <DateRangePicker onDateChange={setDateRange} showPresets />
        </motion.div>
      )}

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columnsWithVehicles.map(col => (
            <KanbanColumn key={col.id} column={col} vehicles={col.vehicles} />
          ))}
        </div>
      </div>

      {vehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Car className="w-16 h-16 opacity-15 mb-4" style={{ color: '#8b5cf6' }} />
          <p className="text-lg font-semibold mb-2" style={{ color: '#c6c6cd', fontFamily: 'Manrope, sans-serif' }}>No vehicles on board</p>
          <p className="text-sm" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>Vehicles will appear here as they are assigned</p>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
