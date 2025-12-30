/**
 * Payments Page
 * Display payment history and statistics
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux';
import { Card, Button, LoadingSpinner } from '../components';
import { useHostPayments, usePaymentStats } from '../api/payments';
import { formatCurrency, formatDate } from '../utils';
import { usePermissions } from '../hooks';

const Payments = () => {
  const { can } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Use TanStack Query hooks
  const { data: paymentsData, isLoading: paymentsLoading, error: paymentsError } = useHostPayments(
    user?.hostId || '',
    currentPage,
    pageSize
  );
  const { data: statsData } = usePaymentStats(user?.hostId || '');

  // Extract data from response
  const payments = paymentsData?.content || [];
  const pagination = {
    totalPages: paymentsData?.totalPages || 0,
    totalElements: paymentsData?.totalElements || 0,
    pageSize,
  };
  const paymentStats = statsData || null;
  const loading = paymentsLoading;
  const error = paymentsError ? (paymentsError as any).message : null;

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      SUCCESS: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-blue-100 text-blue-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (!can('canViewPaymentHistory')) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          You don't have permission to view payment history.
        </div>
      </div>
    );
  }

  if (loading && !payments.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-1">Track all your payment transactions</p>
      </div>

      {/* Stats Cards */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div>
              <p className="text-gray-500 text-sm">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(paymentStats.totalPaid || 0)}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-gray-500 text-sm">Total Payments</p>
              <p className="text-2xl font-bold text-blue-600">
                {paymentStats.totalPayments || 0}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-gray-500 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(paymentStats.pendingAmount || 0)}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-gray-500 text-sm">Refunded</p>
              <p className="text-2xl font-bold text-gray-600">
                {formatCurrency(paymentStats.totalRefunded || 0)}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Payment List */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Payment ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Invoice
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Method
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">
                    {payment.paymentId || payment.id}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(payment.paymentDate || payment.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {payment.invoiceNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {payment.paymentMethod || 'Razorpay'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No payment records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage + 1} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages - 1, prev + 1))}
            disabled={currentPage >= pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Payments;
