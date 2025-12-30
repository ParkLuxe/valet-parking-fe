/**
 * My Vehicles Page (Valet)
 * View and manage vehicles assigned to the valet
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type {  RootState  } from '../../redux';
import { Car, CheckCircle } from 'lucide-react';
import { Card } from '../../components';
import { Button } from '../../components';
import { LoadingSpinner } from '../../components';
import { DataTable } from '../../components';
import { Modal } from '../../components';
import { useValetVehicles, useMarkOutForDelivery, useDeliverVehicle } from '../../hooks/queries/useVehicles';
import {  VEHICLE_STATUS, VEHICLE_STATUS_DISPLAY  } from '../../utils';

const MyVehicles = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  interface VehicleItem {
    id: string;
    vehicleNumber: string;
    vehicleType?: string;
    status: string;
    customerName?: string;
    customerPhone?: string;
    parkingSlot?: string;
    parkedAt?: string;
    // Add other vehicle properties as needed
  }

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);

  // Use TanStack Query hooks
  const { data: vehicles = [], isLoading: loading } = useValetVehicles(user?.userId || '');
  const markOutForDeliveryMutation = useMarkOutForDelivery();
  const deliverVehicleMutation = useDeliverVehicle();

  const handleUpdateStatus = async (vehicleId: string, newStatus: string) => {
    try {
      if (newStatus === VEHICLE_STATUS.OUT_FOR_DELIVERY) {
        await markOutForDeliveryMutation.mutateAsync(vehicleId);
      } else if (newStatus === VEHICLE_STATUS.DELIVERED) {
        await deliverVehicleMutation.mutateAsync(vehicleId);
      }
      setSelectedVehicle(null);
    } catch (err) {
      // Error already handled by mutation
      console.error('Failed to update vehicle status:', err);
    }
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
      header: 'Parking Slot',
      accessor: 'parkingSlot',
      sortable: true,
      render: (value) => <span className="text-white">{value || 'Not assigned'}</span>,
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex gap-2">
          {row.status === VEHICLE_STATUS.PARKING_IN_PROGRESS && (
            <Button
              variant="primary"
              size="small"
              onClick={() =>
                handleUpdateStatus(row.id || row.customerId, VEHICLE_STATUS.PARKED)
              }
              startIcon={<CheckCircle className="w-4 h-4" />}
            >
              Mark as Parked
            </Button>
          )}
          {row.status === VEHICLE_STATUS.OUT_FOR_DELIVERY && (
            <Button
              variant="primary"
              size="small"
              onClick={() =>
                handleUpdateStatus(row.id || row.customerId, VEHICLE_STATUS.DELIVERED)
              }
              startIcon={<CheckCircle className="w-4 h-4" />}
            >
              Mark as Delivered
            </Button>
          )}
          <Button
            variant="ghost"
            size="small"
            onClick={() => setSelectedVehicle(row)}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  const activeVehicles = vehicles.filter(
    (v) =>
      v.status !== VEHICLE_STATUS.DELIVERED &&
      v.assignedValet === user?.id
  );

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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Vehicles</h1>
        <p className="text-white/60">Vehicles assigned to you</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">Total Assigned</div>
          <div className="text-2xl font-bold text-white">{activeVehicles.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">In Progress</div>
          <div className="text-2xl font-bold text-white">
            {
              activeVehicles.filter(
                (v) => v.status === VEHICLE_STATUS.PARKING_IN_PROGRESS
              ).length
            }
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">Parked</div>
          <div className="text-2xl font-bold text-white">
            {
              activeVehicles.filter((v) => v.status === VEHICLE_STATUS.PARKED)
                .length
            }
          </div>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card
        title={`${activeVehicles.length} Active Vehicle(s)`}
        headerAction={<Car className="w-5 h-5 text-white/50" />}
      >
        <DataTable
          columns={columns}
          data={activeVehicles}
          searchable={true}
          searchPlaceholder="Search vehicles..."
          emptyMessage="No vehicles assigned"
          pageSize={10}
        />
      </Card>

      {/* Vehicle Details Modal */}
      <Modal
        open={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title="Vehicle Details"
      >
        {selectedVehicle && (
          <div className="space-y-4">
            <div>
              <span className="text-white/50 text-sm">Vehicle Number</span>
              <div className="text-white font-semibold mt-1">
                {selectedVehicle.vehicleNumber || 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">Vehicle Type</span>
              <div className="text-white mt-1">
                {selectedVehicle.vehicleType || 'Car'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-white/50 text-sm">Customer Name</span>
                <div className="text-white mt-1">
                  {selectedVehicle.customerName || 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-white/50 text-sm">Customer Phone</span>
                <div className="text-white mt-1">
                  {selectedVehicle.customerPhone || 'N/A'}
                </div>
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">Status</span>
              <div className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedVehicle.status === VEHICLE_STATUS.PARKED
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {VEHICLE_STATUS_DISPLAY[selectedVehicle.status] ||
                    selectedVehicle.status ||
                    'Unknown'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">Parking Slot</span>
              <div className="text-white mt-1">
                {selectedVehicle.parkingSlot || 'Not assigned'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyVehicles;
