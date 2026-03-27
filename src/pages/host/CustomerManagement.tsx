/**
 * Customer Management Page (Host)
 * Manage all customers - with vehicle info, QR code, and parking slot details
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RootState } from '../../redux';
import { Users, Filter, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, Button, LoadingSpinner } from '../../components';
import { DataTable } from '../../components';
import { ExportButton } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';
import { useFilterCustomers } from '../../hooks/queries/useCustomers';
import type { CustomerFilters } from '../../hooks/queries/useCustomers';

const CustomerManagement = () => {
  const { colors } = useTheme();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.roleName === 'SUPERADMIN' || (user as any)?.role === 'SUPERADMIN';

  const searchParams = new URLSearchParams(location.search);
  const highlightCustomerId = searchParams.get('highlightCustomerId');
  const highlightedCustomerIdNum = highlightCustomerId ? Number(highlightCustomerId) : null;

  // Pagination state
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy] = useState('customerId');
  const [sortDirection] = useState<'ASC' | 'DESC'>('ASC');

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterInputs, setFilterInputs] = useState<CustomerFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<CustomerFilters>({});

  // Customer filter mutation
  const filterMutation = useFilterCustomers();
  const { data, isPending: loading } = filterMutation;

  const customers = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Keep a stable reference to the mutate function
  const mutateRef = React.useRef(filterMutation.mutate);
  mutateRef.current = filterMutation.mutate;

  // Fetch customers
  const fetchCustomers = useCallback(() => {
    const filters: CustomerFilters = { ...appliedFilters };

    // For hosts: send null hostId (backend gets it from token)
    // For superadmin: can optionally filter by hostId
    if (!isSuperAdmin) {
      filters.hostId = null;
    }

    mutateRef.current({ filters, page, size, sortBy, sortDirection });
  }, [page, size, sortBy, sortDirection, appliedFilters, isSuperAdmin]);

  // Fetch on mount and when pagination/sort/filters change
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // If user came from dashboard recent activity, focus the table on that customer.
  useEffect(() => {
    if (highlightedCustomerIdNum && !Number.isNaN(highlightedCustomerIdNum)) {
      setPage(0);
      setFilterInputs((prev) => ({
        ...prev,
        customerId: highlightedCustomerIdNum,
      }));
      setAppliedFilters((prev) => ({
        ...prev,
        customerId: highlightedCustomerIdNum,
      }));
    }
  }, [highlightedCustomerIdNum]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterInputs((prev) => ({ ...prev, [name]: value || undefined }));
  };

  const handleApplyFilters = () => {
    setPage(0);
    setAppliedFilters({ ...filterInputs });
  };

  const handleClearFilters = () => {
    setFilterInputs({});
    setAppliedFilters({});
    setPage(0);
  };

  const hasActiveFilters = Object.values(appliedFilters).some((v) => v !== undefined && v !== '');

  const columns = [
    {
      header: 'Vehicle',
      accessor: 'vehicleNumber',
      sortable: true,
      render: (value: any, row: any) => (
        <div>
          <div className="font-semibold" style={{ color: colors.text }}>{value || 'N/A'}</div>
          {(row.vehicleMake || row.vehicleModel) && (
            <div className="text-sm mt-1" style={{ color: colors.textMuted }}>
              {[row.vehicleMake, row.vehicleModel].filter(Boolean).join(' ')}
            </div>
          )}
          {row.vehicleColor && (
            <div className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{row.vehicleColor}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Vehicle Status',
      accessor: 'vehicleStatus',
      sortable: true,
      render: (value: any) => {
        if (!value) return <span style={{ color: colors.textMuted }}>—</span>;
        const vColors: Record<string, string> = {
          'PARKED': 'bg-blue-500/20 text-blue-400',
          'DELIVERED': 'bg-green-500/20 text-green-400',
          'ASSIGNED': 'bg-yellow-500/20 text-yellow-400',
          'OUT_FOR_DELIVERY': 'bg-purple-500/20 text-purple-400',
          'RETRIEVAL_REQUESTED': 'bg-orange-500/20 text-orange-400',
        };
        return (
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
              vColors[value] || 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {value.replace(/_/g, ' ')}
          </span>
        );
      },
    },
    {
      header: 'Parking Slot',
      accessor: 'parkingSlotNumber',
      sortable: false,
      render: (value: any) => <span style={{ color: colors.text }}>{value || 'Not assigned'}</span>,
    },
    {
      header: 'Parked By',
      accessor: 'parkedBy',
      sortable: true,
      render: (value: any) => <span style={{ color: colors.textSoft }}>{value || '—'}</span>,
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      render: (value: any) => (
        <span className="text-sm" style={{ color: colors.textSoft }}>
          {value ? new Date(value).toLocaleString() : 'N/A'}
        </span>
      ),
    },
  ];

  if (loading && !customers.length) {
    return <LoadingSpinner message="Loading customers..." fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>Customer Management</h1>
          <p style={{ color: colors.textMuted }}>Manage customers, vehicles, QR codes, and parking slots</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<Filter className="w-5 h-5" />}
          >
            {hasActiveFilters ? 'Filters (Active)' : 'Filters'}
          </Button>
          <ExportButton
            data={customers}
            columns={columns}
            filename="customers"
            format="csv"
            variant="secondary"
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card title="Filters">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Customer ID</label>
                <input
                  name="customerId"
                  type="number"
                  value={filterInputs.customerId ?? ''}
                  onChange={(e) => setFilterInputs((prev) => ({
                    ...prev,
                    customerId: e.target.value ? Number(e.target.value) : undefined,
                  }))}
                  placeholder="e.g. 102"
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Customer Name</label>
                <input
                  name="customerName"
                  type="text"
                  value={filterInputs.customerName || ''}
                  onChange={handleFilterChange}
                  placeholder="Search by name"
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Vehicle Number</label>
                <input
                  name="vehicleNumber"
                  type="text"
                  value={filterInputs.vehicleNumber || ''}
                  onChange={handleFilterChange}
                  placeholder="e.g. MH-01-AB-1234"
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Vehicle Make</label>
                <input
                  name="vehicleMake"
                  type="text"
                  value={filterInputs.vehicleMake || ''}
                  onChange={handleFilterChange}
                  placeholder="e.g. Toyota"
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Vehicle Model</label>
                <input
                  name="vehicleModel"
                  type="text"
                  value={filterInputs.vehicleModel || ''}
                  onChange={handleFilterChange}
                  placeholder="e.g. Camry"
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Vehicle Color</label>
                <input
                  name="vehicleColor"
                  type="text"
                  value={filterInputs.vehicleColor || ''}
                  onChange={handleFilterChange}
                  placeholder="e.g. White"
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>License Number</label>
                <input
                  name="licenseNumber"
                  type="text"
                  value={filterInputs.licenseNumber || ''}
                  onChange={handleFilterChange}
                  placeholder="DL number"
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Status</label>
                <select
                  name="status"
                  value={filterInputs.status || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                >
                  <option value="">All</option>
                  <option value="A">Active</option>
                  <option value="I">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Vehicle Status</label>
                <select
                  name="vehicleStatus"
                  value={filterInputs.vehicleStatus || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-button focus:outline-none"
                  style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                >
                  <option value="">All</option>
                  <option value="PARKED">Parked</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="RETRIEVAL_REQUESTED">Retrieval Requested</option>
                </select>
              </div>
              {isSuperAdmin && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Host ID</label>
                  <input
                    name="hostId"
                    type="number"
                    value={filterInputs.hostId ?? ''}
                    onChange={(e) => setFilterInputs(prev => ({
                      ...prev,
                      hostId: e.target.value ? Number(e.target.value) : undefined,
                    }))}
                    placeholder="Filter by host"
                    className="w-full px-3 py-2 rounded-button focus:outline-none"
                    style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, color: colors.text }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="gradient" onClick={handleApplyFilters}>
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={handleClearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Customers Table */}
      <Card
        title={`${totalElements} Customer(s)`}
        headerAction={<Users className="w-5 h-5" style={{ color: colors.textMuted }} />}
      >
        <DataTable
          columns={columns}
          data={customers}
          searchable={false}
          emptyMessage="No customers found. Adjust your filters and try again."
          pageSize={size}
          getRowClassName={(row) =>
            highlightedCustomerIdNum && row.customerId === highlightedCustomerIdNum
              ? 'bg-yellow-400/15 ring-1 ring-yellow-300/40'
              : ''
          }
        />

        {/* Server-side Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${colors.divider}` }}>
            <span className="text-sm" style={{ color: colors.textMuted }}>
              Page {page + 1} of {totalPages} · {totalElements} total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-button disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ background: colors.surfaceCardRaised, color: colors.text, border: `1px solid ${colors.border}` }}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-button disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ background: colors.surfaceCardRaised, color: colors.text, border: `1px solid ${colors.border}` }}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerManagement;
