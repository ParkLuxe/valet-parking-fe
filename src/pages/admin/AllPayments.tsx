/**
 * All Payments Page (SuperAdmin)
 * View all invoices across all hosts (with optional status filtering)
 */

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DollarSign, Filter, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import invoiceService from '../../services/invoiceService';
import { addToast } from '../../redux/slices/notificationSlice';
import { formatCurrency, formatDate } from '../../utils/helpers';

const AllPayments = () => {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState(''); // Empty means all active invoices
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchAllInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, statusFilter]);

  const fetchAllInvoices = async () => {
    setLoading(true);
    try {
      const filters = {};
      
      // Add status filter if selected
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      const response = await invoiceService.filterInvoices(
        filters,
        pagination.currentPage,
        pagination.pageSize
      );
      
      // Handle different response structures
      if (response.content) {
        setInvoices(response.content);
        setPagination({
          currentPage: response.number || 0,
          totalPages: response.totalPages || 0,
          totalElements: response.totalElements || 0,
          pageSize: response.size || 10,
        });
      } else if (Array.isArray(response)) {
        setInvoices(response);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: err.message || 'Failed to fetch invoices',
      }));
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (invoiceId) => {
    try {
      const pdfBlob = await invoiceService.downloadPDF(invoiceId);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      dispatch(addToast({
        type: 'success',
        message: 'Invoice downloaded successfully',
      }));
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to download invoice',
      }));
    }
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({ ...prev, currentPage: Math.max(0, prev.currentPage - 1) }));
  };

  const handleNextPage = () => {
    setPagination(prev => ({ ...prev, currentPage: Math.min(pagination.totalPages - 1, prev.currentPage + 1) }));
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

  if (loading && !invoices.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
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
            {['', 'PAID', 'UNPAID', 'OVERDUE'].map((status) => (
              <Button
                key={status || 'all'}
                variant={statusFilter === status ? 'primary' : 'outline'}
                onClick={() => {
                  setStatusFilter(status);
                  setPagination(prev => ({ ...prev, currentPage: 0 }));
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
