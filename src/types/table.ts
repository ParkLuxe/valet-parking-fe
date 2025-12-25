/**
<<<<<<< HEAD
 * Table Type Definitions
 * Defines types for TanStack Table columns and data
 */

import type { ColumnDef } from '@tanstack/react-table';

// Generic Table Props
export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
=======
 * Table Types
 * Type definitions for TanStack Table
 */

import type { ColumnDef, SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';

// Generic DataTable Props
export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
>>>>>>> master
  data: TData[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  className?: string;
<<<<<<< HEAD
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
=======
  actions?: React.ReactNode;
  bulkActions?: React.ReactNode;
  pageSize?: number;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onFilteringChange?: (filters: ColumnFiltersState) => void;
}

// Table State
export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  pagination: PaginationState;
  rowSelection: Record<string, boolean>;
}

// Column Helper Types
export interface ColumnMeta {
  headerClassName?: string;
  cellClassName?: string;
  align?: 'left' | 'center' | 'right';
}
>>>>>>> master
