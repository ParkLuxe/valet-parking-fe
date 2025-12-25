/**
 * Invoices Page
 * Display and manage invoices with TanStack Query and TanStack Table
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DataTable } from '../components/tables/DataTable';
import { invoiceColumns } from '../components/tables/columns/invoiceColumns';
import { useInvoices, useUnpaidInvoices } from '../hooks/queries/useInvoices';
import { useGenerateInvoice } from '../hooks/mutations/useInvoiceMutations';
import { addToast } from '../redux/slices/notificationSlice';
import { useDispatch } from 'react-redux';
import type { InvoiceStatus } from '../types/api';
import type { RootState } from '../types/store';
import { Plus } from 'lucide-react';

type StatusFilter = InvoiceStatus | 'ALL';

const Invoices: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('UNPAID');
  const [currentPage, setCurrentPage] = useState(0);

  // Build filters object
  const filters = {
    hostId: user?.hostId,
    ...(statusFilter !== 'ALL' && { status: statusFilter as InvoiceStatus }),
  };

  // Fetch invoices using TanStack Query
  const { data, isLoading, error } = useInvoices(filters, currentPage, 10);

  // Generate invoice mutation
  const generateInvoice = useGenerateInvoice({
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'Invoice generated successfully',
      }));
    },
    onError: () => {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to generate invoice',
      }));
    },
  });

  const handleRowClick = (invoice: any) => {
    navigate(`/invoices/${invoice.id}`);
  };

  const handleGenerateInvoice = () => {
    if (user?.hostId) {
      generateInvoice.mutate(user.hostId);
    }
  };

  if (isLoading && !data) {
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
          <p className="text-white/60 mt-1">Manage your billing and payments</p>
        </div>
        <Button
          variant="primary"
          onClick={handleGenerateInvoice}
          loading={generateInvoice.isPending}
          startIcon={<Plus className="w-5 h-5" />}
        >
          Generate Invoice
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-2 flex-wrap">
          {(['UNPAID', 'PAID', 'OVERDUE', 'ALL'] as StatusFilter[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'secondary'}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(0);
              }}
              size="small"
            >
              {status}
            </Button>
          ))}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg">
          {(error as Error).message || 'Failed to load invoices'}
        </div>
      )}

      {/* Invoice Table */}
      <DataTable
        columns={invoiceColumns}
        data={data?.content || []}
        manualPagination
        pageCount={data?.totalPages}
        onPaginationChange={({ pageIndex }) => setCurrentPage(pageIndex)}
        onRowClick={handleRowClick}
        loading={isLoading}
        emptyMessage="No invoices found"
      />
    </div>
  );
};

export default Invoices;
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
