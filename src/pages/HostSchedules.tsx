/**
 * Host Schedules Page
 * Manage operating schedules for the host
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Card, Button, LoadingSpinner, Modal, Input } from '../components';
import { useHostSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '../hooks/queries/useHostSchedules';
import { usePermissions } from '../hooks';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { cn } from '../utils';
interface Schedule {
  scheduleId?: string;
  id?: string;
  cronExpression: string;
  timeZone: string;
}

const HostSchedules = () => {
  const { can } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [formData, setFormData] = useState({
    cronExpression: '',
    timeZone: 'Asia/Kolkata',
  });

  // ✅ Use TanStack Query hooks
  const isSuperAdmin = user?.roleName === 'SUPERADMIN';
  const { data: schedules = [], isLoading } = useHostSchedules(user?.hostId || '');
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();
  const deleteMutation = useDeleteSchedule();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSchedule) {
      updateMutation.mutate({
        scheduleId: editingSchedule.scheduleId || editingSchedule.id || '',
        ...formData,
      }, {
        onSuccess: () => {
          setShowModal(false);
          setEditingSchedule(null);
          resetForm();
        },
      });
    } else {
      createMutation.mutate({
        ...(isSuperAdmin && user?.hostId ? { hostId: user.hostId } : {}),
        ...formData,
      }, {
        onSuccess: () => {
          setShowModal(false);
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    setFormData({
      cronExpression: '',
      timeZone: 'Asia/Kolkata',
    });
  };

  const handleEdit = React.useCallback((schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      cronExpression: schedule.cronExpression,
      timeZone: schedule.timeZone,
    });
    setShowModal(true);
  }, []);

  const handleDelete = React.useCallback(async (scheduleId: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }
    deleteMutation.mutate(scheduleId);
  }, [deleteMutation]);

  const handleAddNew = () => {
    setEditingSchedule(null);
    resetForm();
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Define columns for TanStack Table
  const columns = useMemo<ColumnDef<Schedule>[]>(() => [
    {
      accessorKey: 'cronExpression',
      header: 'Cron Expression',
      cell: ({ row }) => (
        <span className="text-white font-mono">{row.original.cronExpression}</span>
      ),
    },
    {
      accessorKey: 'timeZone',
      header: 'Time Zone',
      cell: ({ row }) => (
        <span className="text-white/90">{row.original.timeZone}</span>
      ),
    },
    {
      accessorKey: 'id',
      header: 'Schedule ID',
      cell: ({ row }) => (
        <span className="text-white/60 text-xs font-mono">{row.original.id || row.original.scheduleId || '—'}</span>
      ),
    },
    ...(can('canManageSchedules') ? [{
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => handleEdit(row.original)}
            className="hover:bg-white/10"
            startIcon={<Edit2 className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => handleDelete(row.original.scheduleId || row.original.id || '')}
            className="text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
            startIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      ),
    } as ColumnDef<Schedule>] : []),
  ], [can, handleEdit, handleDelete]);

  const table = useReactTable({
    data: schedules,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (!can('canManageSchedules') && !can('canViewSchedules')) {
    return (
      <div className="p-6">
        <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-lg">
          You don't have permission to view schedules.
        </div>
      </div>
    );
  }

  if (isLoading && schedules.length === 0) {
    return <LoadingSpinner message="Loading schedules..." fullScreen />;
  }

  const loading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Operating Schedules</h1>
          <p className="text-white/70 mt-1">Manage your business hours</p>
        </div>
        {can('canManageSchedules') && (
          <Button 
            onClick={handleAddNew}
            variant="primary"
            startIcon={<Plus className="w-4 h-4" />}
          >
            Add Schedule
          </Button>
        )}
      </div>

      {/* Schedules Table */}
      <Card>
        <div className="overflow-x-auto">
          {schedules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">No schedules found</p>
              <p className="text-white/50 mt-2">Add a schedule to get started</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[5px] border border-white/10">
              <table className="w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-white/10">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-3 text-left text-sm font-semibold text-white/90',
                          header.column.getCanSort() && 'cursor-pointer select-none hover:text-white',
                          header.id === 'actions' && 'text-center',
                          header.id === 'isOpen' && 'text-center'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-white/50">
                              {{
                                asc: ' ↑',
                                desc: ' ↓',
                              }[header.column.getIsSorted() as string] ?? ' ⇅'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-white/10">
                {table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className={cn(
                          'px-4 py-3 text-sm',
                          cell.column.id === 'actions' && 'text-center',
                          cell.column.id === 'isOpen' && 'text-center'
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingSchedule(null);
          }}
          title={editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Cron Expression"
              type="text"
              name="cronExpression"
              value={formData.cronExpression}
              onChange={handleChange}
              placeholder="e.g. 0 0 5 * * ?"
              required
            />
            <p className="text-xs text-white/50 -mt-2">
              Standard cron format: seconds minutes hours day month weekday
            </p>

            <Input
              label="Time Zone"
              type="text"
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              placeholder="e.g. Asia/Kolkata"
              required
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setEditingSchedule(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {editingSchedule ? 'Update' : 'Create'} Schedule
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HostSchedules;
