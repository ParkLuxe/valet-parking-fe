/**
 * Invoices Page
 * Display and manage invoices with payment functionality
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RazorpayButton from '../components/payment/RazorpayButton';
import invoiceService from '../services/invoiceService';
import {
  setInvoicesWithPagination,
  setLoading,
  setError,
} from '../redux/slices/invoiceSlice';
import { addToast } from '../redux/slices/notificationSlice';
import { formatCurrency, formatDate } from '../utils/helpers';
import usePermissions from '../hooks/usePermissions';

const Invoices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { user } = useSelector((state) => state.auth);
  const { invoices, loading, error, pagination } = useSelector((state) => state.invoices);
  
  const [statusFilter, setStatusFilter] = useState('UNPAID'); // Default to UNPAID (active invoices)
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (user?.hostId) {
      fetchInvoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentPage, statusFilter]);

  const fetchInvoices = async () => {
    dispatch(setLoading(true));
    try {
      // Use filter API to fetch invoices
      const filters = {
        hostId: user.hostId,
      };
      
      // Add status filter if not ALL
      if (statusFilter !== 'ALL') {
        filters.status = statusFilter;
      }
      
      const response = await invoiceService.filterInvoices(
        filters,
        currentPage,
        pagination.pageSize
      );
      dispatch(setInvoicesWithPagination(response));
    } catch (err) {
      dispatch(setError(err.message || 'Failed to fetch invoices'));
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load invoices',
      }));
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

  const getStatusBadgeClass = (status) => {
    const statusMap = {
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Invoice List */}
      <div className="space-y-4">
        {invoices.map((invoice) => (
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
                    onSuccess={() => fetchInvoices()}
                    buttonText="Pay Now"
                    buttonVariant="primary"
                  />
                )}
              </div>
            </div>
          </Card>
        ))}

        {invoices.length === 0 && (
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
      {pagination.totalPages > 1 && (
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
