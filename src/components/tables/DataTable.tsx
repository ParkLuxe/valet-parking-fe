/**
 * TanStack DataTable Component
 * Modern table component using TanStack Table v8
 */

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import type { DataTableProps } from '../../types/table';

export function DataTable<TData>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  onRowClick,
  pageSize = 10,
  manualPagination = false,
  pageCount,
  onPaginationChange,
  manualSorting = false,
  onSortingChange,
  manualFiltering = false,
  onFilterChange,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Input */}
      {searchable && (
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            type="text"
            name="search"
            label=""
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            onBlur={() => {}}
            className="pl-10"
            icon={undefined}
            children={undefined}
          />
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-white/10">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-3 text-left text-sm font-semibold text-white/70',
                          header.column.getCanSort() && 'cursor-pointer hover:text-white'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span>
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ChevronUp className="w-4 h-4 text-white/70" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ChevronDown className="w-4 h-4 text-white/70" />
                                ) : (
                                  <ChevronsUpDown className="w-4 h-4 text-white/30" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      className={cn(
                        'border-b border-white/5 transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-white/5'
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-white">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-white/50"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/50">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              manualPagination ? (pageCount ?? 0) * pageSize : table.getFilteredRowModel().rows.length
            )}{' '}
            of {manualPagination ? (pageCount ?? 0) * pageSize : table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              startIcon={<ChevronLeft className="w-4 h-4" />}
              endIcon={undefined}
              className=""
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(table.getPageCount(), 5) }, (_, i) => {
                const totalPages = table.getPageCount();
                const currentPage = table.getState().pagination.pageIndex + 1;
                let pageNum;

                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? 'primary' : 'ghost'}
                    size="small"
                    onClick={() => table.setPageIndex(pageNum - 1)}
                    startIcon={undefined}
                    endIcon={undefined}
                    className=""
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="secondary"
              size="small"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              endIcon={<ChevronRight className="w-4 h-4" />}
              startIcon={undefined}
              className=""
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
