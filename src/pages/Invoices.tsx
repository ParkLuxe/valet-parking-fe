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
import { useInvoices } from '../hooks/queries/useInvoices';
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
          endIcon={undefined}
          className=""
        >
          Generate Invoice
        </Button>
      </div>

      {/* Filters */}
      <Card
        title=""
        subtitle=""
        actions={null}
        headerAction={null}
        className=""
      >
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
              startIcon={undefined}
              endIcon={undefined}
              className=""
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
