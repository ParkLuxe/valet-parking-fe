/**
 * Invoice Details Page
 * Displays detailed invoice information with payment option
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner, RazorpayButton } from '../components';
import { useInvoice, useDownloadInvoicePDF, useSendInvoiceEmail } from '../api/invoices';
import { queryKeys } from '../lib/queryKeys';
import { formatCurrency, formatDate } from '../utils';
import { usePermissions } from '../hooks';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const queryClient = useQueryClient();

  // ✅ Use TanStack Query hooks
  const { data: currentInvoice, isLoading: loading, error } = useInvoice(id || '');
  const downloadPDFMutation = useDownloadInvoicePDF();
  const sendEmailMutation = useSendInvoiceEmail();

  const handleDownloadPDF = () => {
    if (id) {
      downloadPDFMutation.mutate(id);
    }
  };

  const handleSendEmail = () => {
    if (id) {
      sendEmailMutation.mutate(id);
    }
  };

  const handlePaymentSuccess = () => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(id) });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      PAID: 'bg-green-100 text-green-800',
      UNPAID: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !currentInvoice) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error ? (error as any)?.message || 'Failed to load invoice details' : 'Invoice not found'}
        </div>
        <Button onClick={() => navigate('/invoices')} className="mt-4">
          Back to Invoices
        </Button>
      </div>
    );
  }

  if (!currentInvoice) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Invoice not found</p>
          <Button onClick={() => navigate('/invoices')} className="mt-4">
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={() => navigate('/invoices')}>
            ← Back to Invoices
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Invoice #{currentInvoice.invoiceNumber}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(currentInvoice.paymentStatus)}`}>
              {currentInvoice.paymentStatus}
            </span>
            <span className="text-gray-600">
              Issued: {formatDate(currentInvoice.invoiceDate)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            Send Email
          </Button>
          {currentInvoice.paymentStatus === 'UNPAID' && can('canMakePayments') && (
            <RazorpayButton
              invoiceId={currentInvoice.id}
              amount={currentInvoice.totalAmount}
              invoiceNumber={currentInvoice.invoiceNumber}
              onSuccess={handlePaymentSuccess}
              buttonText="Pay Now"
              buttonVariant="primary"
            />
          )}
        </div>
      </div>

      {/* Invoice Summary */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Invoice Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Invoice Number</p>
            <p className="font-semibold">{currentInvoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Invoice Date</p>
            <p className="font-semibold">{formatDate(currentInvoice.invoiceDate)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Due Date</p>
            <p className="font-semibold">
              {currentInvoice.dueDate ? formatDate(currentInvoice.dueDate) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Billing Period</p>
            <p className="font-semibold">{currentInvoice.billingPeriod || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Rate</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentInvoice.lineItems?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.rate)}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No line items available
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold">Subtotal:</td>
                <td className="px-4 py-3 text-right text-sm font-semibold">
                  {formatCurrency(currentInvoice.subtotal || currentInvoice.totalAmount)}
                </td>
              </tr>
              {currentInvoice.tax > 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm">Tax:</td>
                  <td className="px-4 py-3 text-right text-sm">
                    {formatCurrency(currentInvoice.tax)}
                  </td>
                </tr>
              )}
              {currentInvoice.discount > 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm text-green-600">Discount:</td>
                  <td className="px-4 py-3 text-right text-sm text-green-600">
                    -{formatCurrency(currentInvoice.discount)}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={3} className="px-4 py-4 text-right text-lg font-bold">Total:</td>
                <td className="px-4 py-4 text-right text-lg font-bold text-blue-600">
                  {formatCurrency(currentInvoice.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Payment Information */}
      {currentInvoice.paymentStatus === 'PAID' && currentInvoice.paidDate && (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-green-600">Payment Received</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Payment Date</p>
              <p className="font-semibold">{formatDate(currentInvoice.paidDate)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Amount Paid</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(currentInvoice.totalAmount)}
              </p>
            </div>
            {currentInvoice.paymentMethod && (
              <div>
                <p className="text-gray-500 text-sm">Payment Method</p>
                <p className="font-semibold">{currentInvoice.paymentMethod}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Notes */}
      {currentInvoice.notes && (
        <Card>
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <p className="text-gray-700">{currentInvoice.notes}</p>
        </Card>
      )}
    </div>
  );
};

export default InvoiceDetails;
