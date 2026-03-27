/**
 * DataTable Component
 * Reusable table with sorting, filtering, pagination, and search
 */

import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils';
import Button from './Button';
import Input from './Input';
import { useTheme } from '../../contexts/ThemeContext';



const DataTable = ({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  onRowClick = null,
  emptyMessage = 'No data available',
  className = '',
  actions = null,
  bulkActions = null,
  pageSize = 10,
  getRowClassName = null,
}) => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = column.accessor ? row[column.accessor] : '';
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;

      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = (accessor) => {
    if (!accessor) return;

    if (sortColumn === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowId)) {
      newSelectedRows.delete(rowId);
    } else {
      newSelectedRows.add(rowId);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((row, index) => index)));
    }
  };

  // Get sort icon
  const getSortIcon = (accessor) => {
    if (sortColumn !== accessor) {
      return <ChevronsUpDown className="w-4 h-4" style={{ color: colors.textMuted }} />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" style={{ color: colors.primary }} />
    ) : (
      <ChevronDown className="w-4 h-4" style={{ color: colors.primary }} />
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {searchable && (
          <div className="w-full sm:w-96">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              icon={<Search className="w-5 h-5" />}
              showPlaceholder={true}
              className="w-full"
            />
          </div>
        )}

        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Bulk actions */}
      {bulkActions && selectedRows.size > 0 && (
        <div
          className="rounded-[16px] p-3"
          style={{
            background: colors.activeItemBg,
            border: `1px solid ${colors.activeItemBorder}`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: colors.text }}>
              {selectedRows.size} row(s) selected
            </span>
            <div className="flex gap-2">{bulkActions}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="glass-card overflow-hidden rounded-[22px]"
        style={{ border: `1px solid ${colors.border}` }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                {bulkActions && (
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        selectedRows.size === paginatedData.length
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                      style={{ borderColor: colors.border, background: colors.surfaceCardRaised }}
                    />
                  </th>
                )}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      'px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em]',
                      column.sortable && 'cursor-pointer'
                    )}
                    style={{
                      color: colors.primary,
                      background: colors.surfaceCardRaised,
                      fontFamily: 'Outfit, sans-serif',
                    }}
                    onClick={() => column.sortable && handleSort(column.accessor)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && getSortIcon(column.accessor)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      'transition-colors',
                      onRowClick && 'cursor-pointer',
                      getRowClassName && getRowClassName(row, rowIndex)
                    )}
                    style={{
                      borderBottom: `1px solid ${colors.divider}`,
                      background: selectedRows.has(rowIndex) ? colors.activeItemBg : 'transparent',
                    }}
                    onClick={() => onRowClick && onRowClick(row)}
                    onMouseEnter={(event) => {
                      if (!selectedRows.has(rowIndex)) {
                        event.currentTarget.style.background = colors.hoverBg;
                      }
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = selectedRows.has(rowIndex)
                        ? colors.activeItemBg
                        : 'transparent';
                    }}
                  >
                    {bulkActions && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(rowIndex);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded"
                          style={{ borderColor: colors.border, background: colors.surfaceCardRaised }}
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-5 py-4 text-sm"
                        style={{ color: colors.text, fontFamily: 'Outfit, sans-serif' }}
                      >
                        {column.render
                          ? column.render(row[column.accessor], row)
                          : row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (bulkActions ? 1 : 0)}
                    className="px-4 py-10 text-center"
                    style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              startIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              endIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
