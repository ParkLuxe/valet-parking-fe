/**
 * Invoice Table Column Definitions
 * TanStack Table column definitions for invoices
 */

import { createColumnHelper } from '@tanstack/react-table';
import type { Invoice } from '../../../types/api';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import Button from '../../common/Button';
import { Download, Mail } from 'lucide-react';
import { useDownloadInvoicePDF, useSendInvoiceEmail } from '../../../hooks/mutations/useInvoiceMutations';
import { cn } from '../../../utils/cn';

const columnHelper = createColumnHelper<Invoice>();

export const invoiceColumns = [
  columnHelper.accessor('invoiceNumber', {
    header: 'Invoice #',
    cell: (info) => (
      <span className="font-medium text-white">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),

  columnHelper.accessor('invoiceDate', {
    header: 'Date',
    cell: (info) => (
      <span className="text-white/80">{formatDate(info.getValue())}</span>
    ),
    enableSorting: true,
  }),

  columnHelper.accessor('dueDate', {
    header: 'Due Date',
    cell: (info) => (
      <span className="text-white/80">{formatDate(info.getValue())}</span>
    ),
    enableSorting: true,
  }),

  columnHelper.accessor('totalAmount', {
    header: 'Amount',
    cell: (info) => (
      <span className="text-lg font-semibold text-white">
        {formatCurrency(info.getValue())}
      </span>
    ),
    enableSorting: true,
  }),

  columnHelper.accessor('scansUsed', {
    header: 'Scans Used',
    cell: (info) => (
      <span className="text-white/80">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),

  columnHelper.accessor('paymentStatus', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      const badgeClass = {
        PAID: 'bg-green-500/20 text-green-300 border-green-500/30',
        UNPAID: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        OVERDUE: 'bg-red-500/20 text-red-300 border-red-500/30',
      }[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';

      return (
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold border',
            badgeClass
          )}
        >
          {status}
        </span>
      );
    },
    enableSorting: true,
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => {
      const invoice = info.row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const downloadPDF = useDownloadInvoicePDF();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const sendEmail = useSendInvoiceEmail();

      return (
        <div className="flex gap-2">
          <Button
            size="small"
            variant="secondary"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              downloadPDF.mutate(invoice.id);
            }}
            loading={downloadPDF.isPending}
            startIcon={<Download className="w-4 h-4" />}
            title="Download PDF"
            endIcon={undefined}
            className=""
          >
            PDF
          </Button>
          <Button
            size="small"
            variant="ghost"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              sendEmail.mutate(invoice.id);
            }}
            loading={sendEmail.isPending}
            startIcon={<Mail className="w-4 h-4" />}
            title="Send Email"
            endIcon={undefined}
            className=""
          >
            Email
          </Button>
        </div>
      );
    },
  }),
];

// Simplified version without action buttons (for readonly views)
export const invoiceColumnsReadonly = invoiceColumns.filter(
  (col) => 'id' in col && col.id !== 'actions'
);
