/**
 * Invoices Page
 * Display and manage invoices with payment functionality
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner, RazorpayButton, DateRangePicker } from '../components';
import { useInvoices, useDownloadInvoicePDF } from '../hooks/queries/useInvoices';
import { queryKeys } from '../lib/queryKeys';
import { formatCurrency, formatDate } from '../utils';
import { usePermissions } from '../hooks';

const Invoices = () => {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  
  const [statusFilter, setStatusFilter] = useState('UNPAID'); // Default to UNPAID (active invoices)
  const [currentPage, setCurrentPage] = useState(0);
  
  // Helper functions to format dates with time
  const formatStartDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().slice(0, 19);
  };

  const formatEndDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setHours(23, 59, 59, 999);
    return date.toISOString().slice(0, 19);
  };

  // Set default date range to today
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const todayDateString = getTodayDate();
  // Store dates in YYYY-MM-DD format for DateRangePicker compatibility
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ 
    start: todayDateString, 
    end: todayDateString 
  });
  const pageSize = 10;

  // ✅ Use TanStack Query hooks
  const filters = useMemo(() => {
    const baseFilters: any = {
      page: currentPage,
      size: pageSize,
    };
    
    // Always include hostId if available
    if (user?.host?.hostId) {
      baseFilters.hostId = user.host.hostId;
    }
    
    // Add status filter if not ALL
    if (statusFilter !== 'ALL') {
      baseFilters.status = statusFilter;
    }
    
    // Add date range filters if provided (format with time)
    if (dateRange.start) {
      baseFilters.dueDateFrom = formatStartDate(dateRange.start);
    }
    if (dateRange.end) {
      baseFilters.dueDateTo = formatEndDate(dateRange.end);
    }
    
    return baseFilters;
  }, [user?.host?.hostId, currentPage, statusFilter, dateRange.start, dateRange.end]);

  const { data: invoiceData, isLoading: loading } = useInvoices(filters);
  const downloadPDFMutation = useDownloadInvoicePDF();

  // Extract invoices and pagination from response
  const invoices = Array.isArray(invoiceData) ? invoiceData : (invoiceData?.content || []);
  const pagination = invoiceData?.totalPages ? {
    totalPages: invoiceData.totalPages,
    totalElements: invoiceData.totalElements,
    pageSize: invoiceData.size || pageSize,
  } : null;

  const handleDownloadPDF = (invoiceId: string) => {
    downloadPDFMutation.mutate(invoiceId);
  };

  const handlePaymentSuccess = () => {
    // Invalidate invoices queries to refetch updated data
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
  };

  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setDateRange(range);
    setCurrentPage(0); // Reset to first page when changing date range
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      PAID: 'bg-green-500/20 text-green-400 border border-green-500/30',
      UNPAID: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      OVERDUE: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return statusMap[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  };

  if (loading && !invoices.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="text-white/70 mt-1">Manage your billing and payments</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          {/* Filters Row - Horizontal Layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
            {/* Status Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-white/90 mb-2">Status</label>
              <div className="flex gap-2 flex-wrap">
                {['UNPAID', 'PAID', 'OVERDUE', 'ALL'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'primary' : 'outline'}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(0); // Reset to first page when changing filter
                    }}
                    className="text-sm"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex-1 min-w-[300px] max-w-[500px]">
              <label className="block text-sm font-medium text-white/90 mb-2">Date Range</label>
              <DateRangePicker
                onDateChange={handleDateRangeChange}
                showPresets={true}
                initialStartDate={dateRange.start}
                initialEndDate={dateRange.end}
                showLabel={false}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice List */}
      <div className="space-y-4">
        {invoices?.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    Invoice #{invoice.invoiceNumber}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(invoice.paymentStatus)}`}>
                    {invoice.paymentStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Date</p>
                    <p className="font-medium text-white">{formatDate(invoice.invoiceDate)}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Amount</p>
                    <p className="font-medium text-lg text-white">{formatCurrency(invoice.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Period</p>
                    <p className="font-medium text-white">{invoice.billingPeriod || 'N/A'}</p>
                  </div>
                  {invoice.dueDate && (
                    <div>
                      <p className="text-white/60">Due Date</p>
                      <p className="font-medium text-white">{formatDate(invoice.dueDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/invoices/${invoice.invoiceId}`)}
                >
                  View Details
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF(invoice.invoiceId)}
                >
                  Download PDF
                </Button>

                {invoice.paymentStatus === 'UNPAID' && can('canMakePayments') && (
                  <RazorpayButton
                    invoiceId={invoice.id}
                    amount={invoice.totalAmount}
                    invoiceNumber={invoice.invoiceNumber}
                    onSuccess={handlePaymentSuccess}
                    buttonText="Pay Now"
                    buttonVariant="primary"
                  />
                )}
              </div>
            </div>
          </Card>
        ))}

        {invoices?.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">No invoices found</p>
              <p className="text-white/50 mt-2">
                {statusFilter === 'ALL' 
                  ? 'You don\'t have any invoices yet' 
                  : `No ${statusFilter.toLowerCase()} invoices`}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-white/70">
            Page {currentPage + 1} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages - 1, prev + 1))}
            disabled={currentPage >= pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Invoices;
