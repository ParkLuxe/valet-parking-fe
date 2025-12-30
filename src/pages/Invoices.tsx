/**
 * Invoices Page
 * Display and manage invoices with payment functionality
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner, RazorpayButton } from '../components';
import { useInvoices, useDownloadInvoicePDF } from '../api/invoices';
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
  const pageSize = 10;

  // ✅ Use TanStack Query hooks
  const filters = useMemo(() => {
    const baseFilters: any = {
      hostId: user?.hostUserId,
      page: currentPage,
      size: pageSize,
    };
    
    // Add status filter if not ALL
    if (statusFilter !== 'ALL') {
      baseFilters.status = statusFilter;
    }
    
    return baseFilters;
  }, [user?.hostUserId, currentPage, statusFilter]);

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

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      PAID: 'bg-green-100 text-green-800',
      UNPAID: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage your billing and payments</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-2">
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
      </Card>

      {/* Invoice List */}
      <div className="space-y-4">
        {invoices?.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">
                    Invoice #{invoice.invoiceNumber}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(invoice.paymentStatus)}`}>
                    {invoice.paymentStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(invoice.invoiceDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium text-lg">{formatCurrency(invoice.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Period</p>
                    <p className="font-medium">{invoice.billingPeriod || 'N/A'}</p>
                  </div>
                  {invoice.dueDate && (
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                >
                  View Details
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF(invoice.id)}
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
              <p className="text-gray-500 text-lg">No invoices found</p>
              <p className="text-gray-400 mt-2">
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
          <span className="px-4 py-2 text-gray-700">
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
