/**
 * Host Schedules — Valet Mobile Operations Design
 * Valet Schedule Management: cron schedule cards with time info
 * Preserves all existing TanStack Table, hooks, and CRUD logic
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
import { Button, LoadingSpinner, Modal, Input } from '../components';
import { useHostSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '../hooks/queries/useHostSchedules';
import { usePermissions } from '../hooks';
import { Edit2, Trash2, Plus, AlarmClock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Schedule {
  scheduleId?: string;
  id?: string;
  cronExpression: string;
  timeZone: string;
}

const HostSchedules = () => {
  const { can } = usePermissions();
  const { colors } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const [showModal, setShowModal]       = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [sorting, setSorting]           = useState<SortingState>([]);
  const [formData, setFormData]         = useState({ cronExpression: '', timeZone: 'Asia/Kolkata' });

  // ─── Hooks (unchanged) ────────────────────────────────────────────────
  const isSuperAdmin = user?.roleName === 'SUPERADMIN';
  const { data: schedules = [], isLoading } = useHostSchedules(user?.hostId || '');
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();
  const deleteMutation = useDeleteSchedule();

  // ─── Handlers (unchanged logic) ──────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule) {
      updateMutation.mutate(
        { scheduleId: editingSchedule.scheduleId || editingSchedule.id || '', ...formData },
        { onSuccess: () => { setShowModal(false); setEditingSchedule(null); resetForm(); } }
      );
    } else {
      createMutation.mutate(
        { ...(isSuperAdmin && user?.hostId ? { hostId: user.hostId } : {}), ...formData },
        { onSuccess: () => { setShowModal(false); resetForm(); } }
      );
    }
  };

  const resetForm = () => setFormData({ cronExpression: '', timeZone: 'Asia/Kolkata' });

  const handleEdit = React.useCallback((schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({ cronExpression: schedule.cronExpression, timeZone: schedule.timeZone });
    setShowModal(true);
  }, []);

  const handleDelete = React.useCallback(async (scheduleId: string) => {
    if (!window.confirm('Delete this schedule?')) return;
    deleteMutation.mutate(scheduleId);
  }, [deleteMutation]);

  const handleAddNew = () => { setEditingSchedule(null); resetForm(); setShowModal(true); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ─── Table columns ────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<Schedule>[]>(() => [
    {
      accessorKey: 'cronExpression',
      header: 'Cron Expression',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-bold" style={{ color: colors.primaryBtn }}>
          {row.original.cronExpression}
        </span>
      ),
    },
    {
      accessorKey: 'timeZone',
      header: 'Time Zone',
      cell: ({ row }) => (
        <span className="text-sm" style={{ color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
          {row.original.timeZone}
        </span>
      ),
    },
    {
      accessorKey: 'id',
      header: 'Schedule ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs" style={{ color: colors.textMuted }}>
          {row.original.id || row.original.scheduleId || '—'}
        </span>
      ),
    },
    ...(can('canManageSchedules') ? [{
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[0.375rem] text-xs font-medium transition-all"
            style={{ background: colors.activeItemBg, color: colors.primaryBtn, fontFamily: 'Outfit, sans-serif' }}
            onMouseEnter={e => (e.currentTarget.style.background = colors.activeIconBg)}
            onMouseLeave={e => (e.currentTarget.style.background = colors.activeItemBg)}
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => handleDelete(row.original.scheduleId || row.original.id || '')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[0.375rem] text-xs font-medium transition-all"
            style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
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
    state: { sorting },
  });

  // ─── Permission guard ─────────────────────────────────────────────────
  if (!can('canManageSchedules') && !can('canViewSchedules')) {
    return (
      <div className="p-8">
        <div className="p-4 rounded-[0.375rem]" style={{ background: 'rgba(233,195,73,0.08)', border: '1px solid rgba(233,195,73,0.2)' }}>
          <p className="text-sm" style={{ color: '#e9c349', fontFamily: 'Outfit, sans-serif' }}>
            You don't have permission to view schedules.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && schedules.length === 0) return <LoadingSpinner message="Loading schedules..." fullScreen />;

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: colors.primary, fontFamily: 'Inter, sans-serif' }}>SCHEDULING</p>
          <h1 className="text-4xl font-bold mb-1" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>Operating Schedules</h1>
          <p className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>Manage cron-based operational schedules and time zones</p>
        </div>
        {can('canManageSchedules') && (
          <Button onClick={handleAddNew} startIcon={<Plus className="w-4 h-4" />}>
            Add Schedule
          </Button>
        )}
      </motion.div>

      {/* Schedule table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-[18px] overflow-hidden"
        style={{ background: colors.surfaceCard, border: `1px solid ${colors.border}`, boxShadow: '0 10px 28px rgba(15,23,42,0.08)' }}
      >
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <AlarmClock className="w-16 h-16 mb-4 opacity-15" style={{ color: colors.primaryBtn }} />
            <p className="text-lg font-semibold mb-2" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>No schedules configured</p>
            <p className="text-sm mb-6" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>Add a schedule to manage operating hours</p>
            {can('canManageSchedules') && (
              <Button onClick={handleAddNew} startIcon={<Plus className="w-4 h-4" />}>Add First Schedule</Button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} style={{ borderBottom: `1px solid ${colors.divider}` }}>
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-5 py-3.5 text-left text-xs font-semibold cursor-pointer select-none"
                      style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif', background: colors.surfaceCardRaised }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span style={{ color: colors.primaryBtn }}>
                            {{ asc: '↑', desc: '↓' }[header.column.getIsSorted() as string] ?? '⇅'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: `1px solid ${colors.divider}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = colors.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-5 py-4 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal
          open={showModal}
          onClose={() => { setShowModal(false); setEditingSchedule(null); }}
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
            <p className="text-xs -mt-2" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
              Format: seconds minutes hours day month weekday
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
            <div className="flex justify-end gap-2 pt-4" style={{ borderTop: `1px solid ${colors.divider}` }}>
              <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingSchedule(null); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isMutating}>
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
