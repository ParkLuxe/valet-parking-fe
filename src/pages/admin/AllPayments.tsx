/**
 * All Payments Page (SuperAdmin)
 * View all invoices across all hosts (with optional status filtering)
 */

import React, { useState, useMemo } from 'react';
import { DollarSign, Filter, Download } from 'lucide-react';
import { Card } from '../../components';
import { Button } from '../../components';
import { DataTable } from '../../components';
import { LoadingSpinner } from '../../components';
import { useInvoices, useDownloadInvoicePDF } from '../../hooks/queries/useInvoices';
import { formatCurrency, formatDate } from '../../utils';
import type { InvoiceStatus } from '../../types/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux';

const AllPayments = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL' | ''>(''); // Empty means all active invoices
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDateStr = today.toISOString().slice(0, 19);
  const startDateObj = new Date(startDateStr);
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(endDateObj.getDate() + 1);
  const toDateTimeString = (d: Date) => d.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"

  // Use TanStack Query hooks
  // For SuperAdmin, don't filter by hostId (show all hosts)
  const filters: any = {
    status: statusFilter === '' ? undefined : (statusFilter === 'ALL' ? 'ALL' : statusFilter),
    page: currentPage,
    size: pageSize,
    dueDateFrom: toDateTimeString(startDateObj),
    dueDateTo: toDateTimeString(endDateObj),
  };
  
  // Only include hostId if user is not SuperAdmin
  if (user?.hostId && user?.roleName !== 'SUPERADMIN') {
    filters.hostId = user.hostId;
  }
  
  const { data: invoicesResponse, isLoading } = useInvoices(filters);

  const downloadPDFMutation = useDownloadInvoicePDF();

  // Extract data from response - ensure it's always an array
  const invoices = useMemo(() => {
    if (!invoicesResponse) return [];
    // If response is already an array, use it
    if (Array.isArray(invoicesResponse)) return invoicesResponse;
    // If response has content property that's an array, use it
    if (invoicesResponse.content && Array.isArray(invoicesResponse.content)) {
      return invoicesResponse.content;
    }
    // Default to empty array
    return [];
  }, [invoicesResponse]);
  const pagination = invoicesResponse?.content
    ? {
        currentPage: invoicesResponse.number || 0,
        totalPages: invoicesResponse.totalPages || 0,
        totalElements: invoicesResponse.totalElements || 0,
        pageSize: invoicesResponse.size || 10,
      }
    : {
        currentPage: 0,
        totalPages: 0,
        totalElements: invoices.length,
        pageSize: pageSize,
      };

  const handleDownloadPDF = async (invoiceId: string) => {
    downloadPDFMutation.mutate(invoiceId);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(pagination.totalPages - 1, prev + 1));
  };

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
      render: (value, row) => value || row.host?.name || 'N/A',
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      sortable: true,
      render: (value) => <span className="text-white font-semibold">{formatCurrency(value)}</span>,
    },
    {
      header: 'Date',
      accessor: 'invoiceDate',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      sortable: true,
      render: (value) => value ? formatDate(value) : 'N/A',
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
            value === 'PAID'
              ? 'bg-green-500/20 text-green-400'
              : value === 'UNPAID'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownloadPDF(value)}
          startIcon={<Download className="w-4 h-4" />}
        >
          PDF
        </Button>
      ),
    },
  ];

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const unpaidAmount = invoices
    .filter(inv => inv.paymentStatus === 'UNPAID')
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  if (isLoading && !invoices.length) {
    return <LoadingSpinner message="Loading payments..." fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">All Invoices</h1>
          <p className="text-white/60">View all invoices across all hosts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<Filter className="w-5 h-5" />}
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card title="Filters">
          <div className="flex gap-2">
            {(['', 'PAID', 'UNPAID', 'OVERDUE'] as const).map((status) => (
              <Button
                key={status || 'all'}
                variant={statusFilter === status ? 'primary' : 'outline'}
                onClick={() => {
                  setStatusFilter(status as InvoiceStatus | 'ALL' | '');
                  setCurrentPage(0);
                }}
                className="text-sm"
              >
                {status || 'ALL'}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">Total Invoices</div>
          <div className="text-2xl font-bold text-white">{pagination.totalElements || invoices.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-white/70 text-sm mb-1">Unpaid Amount</div>
          <div className="text-2xl font-bold text-yellow-400">{formatCurrency(unpaidAmount)}</div>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card
        title="Invoice List"
        headerAction={<DollarSign className="w-5 h-5 text-white/50" />}
      >
        <DataTable
          columns={columns}
          data={invoices}
          searchable={true}
          searchPlaceholder="Search invoices..."
          emptyMessage="No invoices found"
          pageSize={pagination.pageSize}
        />
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={pagination.currentPage === 0}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-white">
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={pagination.currentPage >= pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllPayments;
