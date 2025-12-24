/**
 * All Payments Page (SuperAdmin)
 * View all payments across all hosts
 */

import React, { useState } from 'react';
import { DollarSign, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import ExportButton from '../../components/common/ExportButton';
import DateRangePicker from '../../components/common/DateRangePicker';

const AllPayments = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [, setDateRange] = useState({ start: '', end: '' });

  // Mock data - would be fetched from API
  const payments = [
    {
      id: 1,
      invoiceNumber: 'INV-001',
      hostName: 'Grand Hotel',
      amount: 1000,
      status: 'completed',
      transactionId: 'TXN123456',
      date: '2024-01-15',
    },
    {
      id: 2,
      invoiceNumber: 'INV-002',
      hostName: 'Luxury Resort',
      amount: 2500,
      status: 'pending',
      transactionId: 'TXN123457',
      date: '2024-01-16',
    },
  ];

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'invoiceNumber',
      sortable: true,
    },
    {
      header: 'Host',
      accessor: 'hostName',
      sortable: true,
    },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      render: (value) => <span className="text-white">₹{value.toLocaleString()}</span>,
    },
    {
      header: 'Transaction ID',
      accessor: 'transactionId',
      sortable: true,
    },
    {
      header: 'Date',
      accessor: 'date',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
            value === 'completed'
              ? 'bg-green-500/20 text-green-400'
              : value === 'pending'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">All Payments</h1>
          <p className="text-white/60">View all payments across all hosts</p>
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
            data={payments}
            columns={columns}
            filename="all-payments"
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">Total Payments</div>
          <div className="text-2xl font-bold text-white">{payments.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-white">
            ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-white">
            {Math.round(
              (payments.filter((p) => p.status === 'completed').length /
                payments.length) *
                100
            )}
            %
          </div>
        </Card>
      </div>

      {/* Payments Table */}
      <Card
        title="Payment History"
        headerAction={<DollarSign className="w-5 h-5 text-white/50" />}
      >
        <DataTable
          columns={columns}
          data={payments}
          searchable={true}
          searchPlaceholder="Search payments..."
          emptyMessage="No payments found"
          pageSize={10}
        />
      </Card>
    </div>
  );
};

export default AllPayments;
