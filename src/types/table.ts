/**
 * Table Types
 * Type definitions for TanStack Table
 */

import type { ColumnDef, SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';

// Generic DataTable Props
export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  className?: string;
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
