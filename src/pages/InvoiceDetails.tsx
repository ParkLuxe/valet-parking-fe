/**
 * Invoice Details Page
 * Displays detailed invoice information with payment option
 */

import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux';
import { addToast } from '../redux';
import { Card, Button, LoadingSpinner, RazorpayButton } from '../components';
import { useInvoices, useDownloadInvoicePDF, useSendInvoiceEmail } from '../hooks/queries/useInvoices';
import { queryKeys } from '../lib/queryKeys';
import { formatCurrency, formatDate } from '../utils';
import { usePermissions } from '../hooks';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // ✅ Use filter API to fetch invoices
  const filters = useMemo(() => {
    const baseFilters: any = {
      page: 0,
      size: 1000, // Large size to ensure we get the invoice
    };
    
    // Always include hostId if available
    if (user?.hostId) {
      baseFilters.hostId = user.hostId;
    }
    
    return baseFilters;
  }, [user?.hostId]);

  const { data: invoiceData, isLoading: loading, error } = useInvoices(filters);
  
  // Extract invoices from response and find the matching invoice
  const invoices = useMemo(() => {
    return Array.isArray(invoiceData) ? invoiceData : (invoiceData?.content || []);
  }, [invoiceData]);
  
  const currentInvoice = useMemo(() => {
    if (!id) return null;
    // Try to match by invoiceId first, then by id field
    return invoices.find((inv: any) => 
      String(inv.invoiceId) === String(id) || 
      String(inv.id) === String(id) ||
      inv.invoiceNumber === id
    ) || null;
  }, [invoices, id]);

  // Show error toast but don't block rendering
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load invoice details';
      dispatch(addToast({
        type: 'error',
        message: errorMessage,
      }));
    }
  }, [error, dispatch]);

  const downloadPDFMutation = useDownloadInvoicePDF();
  const sendEmailMutation = useSendInvoiceEmail();

  const handleDownloadPDF = () => {
    if (currentInvoice) {
      const invoiceId = currentInvoice.invoiceId || currentInvoice.id;
      if (invoiceId) {
        downloadPDFMutation.mutate(String(invoiceId));
      }
    }
  };

  const handleSendEmail = () => {
    if (currentInvoice) {
      const invoiceId = currentInvoice.invoiceId || currentInvoice.id;
      if (invoiceId) {
        sendEmailMutation.mutate(String(invoiceId));
      }
    }
  };

  const handlePaymentSuccess = () => {
    // Invalidate invoices queries to refetch updated data
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
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

  if (loading && !invoiceData) {
    return <LoadingSpinner message="Loading invoice details..." fullScreen />;
  }

  if (!currentInvoice && !loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">Invoice not found</p>
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
          <h1 className="text-3xl font-bold text-white mt-4">
            Invoice #{currentInvoice.invoiceNumber}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(currentInvoice.paymentStatus)}`}>
              {currentInvoice.paymentStatus}
            </span>
            <span className="text-white/70">
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
          {(currentInvoice.paymentStatus === 'UNPAID' || currentInvoice.paymentStatus === 'PENDING') && can('canMakePayments') && (
            <RazorpayButton
              invoiceId={currentInvoice.invoiceId || currentInvoice.id}
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
        <h2 className="text-xl font-semibold mb-4 text-white">Invoice Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-white/60 text-sm">Invoice Number</p>
            <p className="font-semibold text-white">{currentInvoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Invoice Date</p>
            <p className="font-semibold text-white">{formatDate(currentInvoice.invoiceDate)}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Due Date</p>
            <p className="font-semibold text-white">
              {currentInvoice.dueDate ? formatDate(currentInvoice.dueDate) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Billing Period</p>
            <p className="font-semibold text-white">
              {currentInvoice.billingPeriodStart && currentInvoice.billingPeriodEnd
                ? `${formatDate(currentInvoice.billingPeriodStart)} - ${formatDate(currentInvoice.billingPeriodEnd)}`
                : currentInvoice.billingPeriod || 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-white">Invoice Details</h2>
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-[5px] border border-white/10">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-white/90">Quantity</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-white/90">Rate</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-white/90">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
              {currentInvoice.lineItems && Array.isArray(currentInvoice.lineItems) && currentInvoice.lineItems.length > 0 ? (
                currentInvoice.lineItems.map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-white/90">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-right text-white/90">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right text-white/90">{formatCurrency(item.rate)}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-white">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-white/50">
                    No line items available
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-white/5 border-t border-white/10">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-white/90">Subtotal:</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                  {formatCurrency(currentInvoice.subtotal || currentInvoice.totalAmount)}
                </td>
              </tr>
              {(currentInvoice.cgstAmount && currentInvoice.cgstAmount > 0) && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm text-white/70">CGST:</td>
                  <td className="px-4 py-3 text-right text-sm text-white/90">
                    {formatCurrency(currentInvoice.cgstAmount)}
                  </td>
                </tr>
              )}
              {(currentInvoice.sgstAmount && currentInvoice.sgstAmount > 0) && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm text-white/70">SGST:</td>
                  <td className="px-4 py-3 text-right text-sm text-white/90">
                    {formatCurrency(currentInvoice.sgstAmount)}
                  </td>
                </tr>
              )}
              {(currentInvoice.igstAmount && currentInvoice.igstAmount > 0) && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm text-white/70">IGST:</td>
                  <td className="px-4 py-3 text-right text-sm text-white/90">
                    {formatCurrency(currentInvoice.igstAmount)}
                  </td>
                </tr>
              )}
              {(currentInvoice.taxAmount && currentInvoice.taxAmount > 0 && !currentInvoice.cgstAmount && !currentInvoice.sgstAmount && !currentInvoice.igstAmount) && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm text-white/70">Tax:</td>
                  <td className="px-4 py-3 text-right text-sm text-white/90">
                    {formatCurrency(currentInvoice.taxAmount)}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={3} className="px-4 py-4 text-right text-lg font-bold text-white">Total:</td>
                <td className="px-4 py-4 text-right text-lg font-bold text-primary">
                  {formatCurrency(currentInvoice.totalAmount)}
                </td>
              </tr>
            </tfoot>
            </table>
          </div>
        </div>
      </Card>

      {/* Payment Information */}
      {currentInvoice.paymentStatus === 'PAID' && currentInvoice.paidDate && (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-green-400">Payment Received</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-white/60 text-sm">Payment Date</p>
              <p className="font-semibold text-white">{formatDate(currentInvoice.paidDate)}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Amount Paid</p>
              <p className="font-semibold text-green-400">
                {formatCurrency(currentInvoice.totalAmount)}
              </p>
            </div>
            {currentInvoice.paymentMethod && (
              <div>
                <p className="text-white/60 text-sm">Payment Method</p>
                <p className="font-semibold text-white">{currentInvoice.paymentMethod}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Notes */}
      {currentInvoice.notes && (
        <Card>
          <h2 className="text-xl font-semibold mb-2 text-white">Notes</h2>
          <p className="text-white/70">{currentInvoice.notes}</p>
        </Card>
      )}
    </div>
  );
};

export default InvoiceDetails;
