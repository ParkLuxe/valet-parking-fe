/**
 * Payments Page
 * Display payment history and statistics
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux';
import { Card, Button, LoadingSpinner } from '../components';
import { useHostPayments, usePaymentStats } from '../hooks/queries/usePayments';
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDateStr = today.toISOString().slice(0, 19);
  const startDateObj = new Date(startDateStr);
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(endDateObj.getDate() + 1);
  const toDateTimeString = (d: Date) => d.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
  const { data: statsData } = usePaymentStats({
    hostId: user?.hostId || '',
    startDate: toDateTimeString(startDateObj),
    endDate: toDateTimeString(endDateObj),
  });

  // Extract data from response
  const payments = paymentsData?.content || [];
  const pagination = {
    totalPages: paymentsData?.totalPages || 0,
    totalElements: paymentsData?.totalElements || 0,
    pageSize,
  };
  const paymentStats = statsData || null;
  const loading = paymentsLoading;
  const error = paymentsError ? String((paymentsError as Error).message || 'Failed to load payments') : null;

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      SUCCESS: 'bg-green-500/20 text-green-400 border border-green-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      FAILED: 'bg-red-500/20 text-red-400 border border-red-500/30',
      REFUNDED: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    };
    return statusMap[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
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
    return <LoadingSpinner message="Loading payments..." fullScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Payment History</h1>
        <p className="text-white/70 mt-1">Track all your payment transactions</p>
      </div>

      {/* Stats Cards */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div>
              <p className="text-white/60 text-sm">Total Paid</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(paymentStats.totalPaid || 0)}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-white/60 text-sm">Total Payments</p>
              <p className="text-2xl font-bold text-primary">
                {paymentStats.totalPayments || 0}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-white/60 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(paymentStats.pendingAmount || 0)}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-white/60 text-sm">Refunded</p>
              <p className="text-2xl font-bold text-white/70">
                {formatCurrency(paymentStats.totalRefunded || 0)}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-[5px]">
          {error}
        </div>
      )}

      {/* Payment List */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-white">Recent Payments</h2>
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-[5px] border border-white/10">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">
                    Payment ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">
                    Invoice
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">
                    Method
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-white/90">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white/90">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-white/90">
                    {payment.paymentId || payment.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/90">
                    {formatDate(payment.paymentDate || payment.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/90">
                    {payment.invoiceNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/90">
                    {payment.paymentMethod || 'Razorpay'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-white">
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
                  <td colSpan={6} className="px-4 py-12 text-center text-white/50">
                    No payment records found
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
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
          <span className="px-4 py-2 text-white/70">
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
