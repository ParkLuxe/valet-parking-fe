/**
 * Vehicle Management Page (Host)
 * Manage all vehicles - Active, Parked, Delivered
 */

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Car, Filter } from 'lucide-react';
import { Card } from '../../components';
import { Button } from '../../components';
import { LoadingSpinner } from '../../components';
import { DataTable } from '../../components';
import { ExportButton } from '../../components';
import { DateRangePicker } from '../../components';
import { vehicleService } from '../../services';
import {  addToast  } from '../../redux';
import {  VEHICLE_STATUS, VEHICLE_STATUS_DISPLAY  } from '../../utils';

const VehicleManagement = () => {
  const dispatch = useDispatch();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, dateRange]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      // This would normally call vehicleService with filters
      // For now, using mock data structure
      const response = await vehicleService.getVehicleStatus('mock-id');
      setVehicles(response ? [response] : []);
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to load vehicles',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const getFilteredVehicles = () => {
    let filtered = vehicles;

    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter(
        (v) =>
          v.status === VEHICLE_STATUS.BEING_ASSIGNED ||
          v.status === VEHICLE_STATUS.PARKING_IN_PROGRESS ||
          v.status === VEHICLE_STATUS.RETRIEVAL_REQUESTED ||
          v.status === VEHICLE_STATUS.OUT_FOR_DELIVERY
      );
    } else if (activeTab === 'parked') {
      filtered = filtered.filter((v) => v.status === VEHICLE_STATUS.PARKED);
    } else if (activeTab === 'delivered') {
      filtered = filtered.filter((v) => v.status === VEHICLE_STATUS.DELIVERED);
    }

    return filtered;
  };

  const columns = [
    {
      header: 'Vehicle Number',
      accessor: 'vehicleNumber',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-semibold text-white">{value || 'N/A'}</div>
          <div className="text-sm text-white/50 mt-1">{row.vehicleType || 'Car'}</div>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-white">{value || 'N/A'}</div>
          <div className="text-sm text-white/50 mt-1">{row.customerPhone || 'N/A'}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => {
        const statusColors = {
          [VEHICLE_STATUS.BEING_ASSIGNED]: 'bg-yellow-500/20 text-yellow-400',
          [VEHICLE_STATUS.PARKING_IN_PROGRESS]: 'bg-blue-500/20 text-blue-400',
          [VEHICLE_STATUS.PARKED]: 'bg-green-500/20 text-green-400',
          [VEHICLE_STATUS.RETRIEVAL_REQUESTED]: 'bg-orange-500/20 text-orange-400',
          [VEHICLE_STATUS.OUT_FOR_DELIVERY]: 'bg-purple-500/20 text-purple-400',
          [VEHICLE_STATUS.DELIVERED]: 'bg-gray-500/20 text-gray-400',
        };

        return (
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
              statusColors[value] || 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {VEHICLE_STATUS_DISPLAY[value] || value || 'Unknown'}
          </span>
        );
      },
    },
    {
      header: 'Valet',
      accessor: 'assignedValet',
      sortable: true,
      render: (value) => <span className="text-white">{value || 'Not assigned'}</span>,
    },
    {
      header: 'Parking Slot',
      accessor: 'parkingSlot',
      sortable: true,
      render: (value) => <span className="text-white">{value || 'Not assigned'}</span>,
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      render: (value) => (
        <span className="text-white/70 text-sm">
          {value ? new Date(value).toLocaleString() : 'N/A'}
        </span>
      ),
    },
  ];

  const filteredVehicles = getFilteredVehicles();

  const tabs = [
    { id: 'all', label: 'All', count: vehicles.length },
    {
      id: 'active',
      label: 'Active',
      count: vehicles.filter(
        (v) =>
          v.status === VEHICLE_STATUS.BEING_ASSIGNED ||
          v.status === VEHICLE_STATUS.PARKING_IN_PROGRESS ||
          v.status === VEHICLE_STATUS.RETRIEVAL_REQUESTED ||
          v.status === VEHICLE_STATUS.OUT_FOR_DELIVERY
      ).length,
    },
    {
      id: 'parked',
      label: 'Parked',
      count: vehicles.filter((v) => v.status === VEHICLE_STATUS.PARKED).length,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: vehicles.filter((v) => v.status === VEHICLE_STATUS.DELIVERED).length,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Vehicle Management</h1>
          <p className="text-white/60">Manage all vehicles and their status</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<Filter className="w-5 h-5" />}
          >
            Filters
          </Button>
          <ExportButton
            data={filteredVehicles}
            columns={columns}
            filename="vehicles"
            format="csv"
            variant="secondary"
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card title="Filters">
          <DateRangePicker onDateChange={setDateRange} showPresets={true} />
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-primary'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Vehicles Table */}
      <Card
        title={`${filteredVehicles.length} Vehicle(s)`}
        headerAction={<Car className="w-5 h-5 text-white/50" />}
      >
        <DataTable
          columns={columns}
          data={filteredVehicles}
          searchable={true}
          searchPlaceholder="Search vehicles..."
          emptyMessage="No vehicles found"
          pageSize={10}
        />
      </Card>
    </div>
  );
};

export default VehicleManagement;
