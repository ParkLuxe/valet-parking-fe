/**
 * Table Type Definitions
 * Defines types for TanStack Table columns and data
 */

import type { ColumnDef } from '@tanstack/react-table';

// Generic Table Props
export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  className?: string;
  manualPagination?: boolean;
  pageCount?: number;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
}

// Column Helper Types for different entities
export type InvoiceColumnDef = ColumnDef<import('./api').Invoice>;
export type PaymentColumnDef = ColumnDef<import('./api').Payment>;
export type VehicleColumnDef = ColumnDef<import('./api').Vehicle>;
export type UserColumnDef = ColumnDef<import('./api').User>;
export type HostColumnDef = ColumnDef<import('./api').Host>;
export type ParkingSlotColumnDef = ColumnDef<import('./api').ParkingSlot>;
