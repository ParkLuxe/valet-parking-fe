/**
 * Table Type Definitions
 * Types for TanStack Table columns and configurations
 */

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';

// ============================================================================
// Generic Table Types
// ============================================================================

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  pageSize?: number;
  manualPagination?: boolean;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  manualSorting?: boolean;
  onSortingChange?: (sorting: SortingState) => void;
  manualFiltering?: boolean;
  onFilterChange?: (filters: ColumnFiltersState) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  pagination: PaginationState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
}

// ============================================================================
// Column Helper Types
// ============================================================================

export interface ColumnMeta {
  headerClassName?: string;
  cellClassName?: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface ColumnFilter {
  id: string;
  value: any;
}

export interface GlobalFilter {
  searchTerm: string;
}

// ============================================================================
// Sorting Types
// ============================================================================

export interface SortConfig {
  id: string;
  desc: boolean;
}

// Re-export TanStack Table types for convenience
export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
  RowSelectionState,
};
