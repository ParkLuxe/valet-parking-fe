/**
 * Host Schedules Page
 * Manage operating schedules for the host
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type {  RootState  } from '../redux';
import { Card } from '../components';
import { Button } from '../components';
import { LoadingSpinner } from '../components';
import { Modal } from '../components';
import { Input } from '../components';
import { useHostSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '../hooks/queries/useHostSchedules';
import { usePermissions } from '../hooks';

const DAYS_OF_WEEK = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const HostSchedules = () => {
  const { can } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [formData, setFormData] = useState({
    dayOfWeek: 'MONDAY',
    openTime: '09:00',
    closeTime: '18:00',
    isOpen: true,
  });

  // ✅ Use TanStack Query hooks
  const { data: schedules = [], isLoading } = useHostSchedules(user?.hostId || '');
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();
  const deleteMutation = useDeleteSchedule();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSchedule) {
      updateMutation.mutate({
        scheduleId: editingSchedule.scheduleId,
        ...formData,
      }, {
        onSuccess: () => {
          setShowModal(false);
          setEditingSchedule(null);
          setFormData({
            dayOfWeek: 'MONDAY',
            openTime: '09:00',
            closeTime: '18:00',
            isOpen: true,
          });
        },
      });
    } else {
      createMutation.mutate({
        hostId: user?.hostId || '',
        ...formData,
      }, {
        onSuccess: () => {
          setShowModal(false);
          setFormData({
            dayOfWeek: 'MONDAY',
            openTime: '09:00',
            closeTime: '18:00',
            isOpen: true,
          });
        },
      });
    }
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      openTime: schedule.openTime,
      closeTime: schedule.closeTime,
      isOpen: schedule.isOpen !== false,
    });
    setShowModal(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    deleteMutation.mutate(scheduleId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  if (!can('canManageSchedules') && !can('canViewSchedules')) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          You don't have permission to view schedules.
        </div>
      </div>
    );
  }

  if (isLoading && schedules.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const loading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operating Schedules</h1>
          <p className="text-gray-600 mt-1">Manage your business hours</p>
        </div>
        {can('canManageSchedules') && (
          <Button onClick={() => {
            setEditingSchedule(null);
            setFormData({
              dayOfWeek: 'MONDAY',
              openTime: '09:00',
              closeTime: '18:00',
              isOpen: true,
            });
            setShowModal(true);
          }}>
            Add Schedule
          </Button>
        )}
      </div>

      {/* Schedules Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Day of Week
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Open Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Close Time
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
                {can('canManageSchedules') && (
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule: any) => (
                <tr key={schedule.scheduleId || schedule.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {schedule.dayOfWeek}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {schedule.openTime}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {schedule.closeTime}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      schedule.isOpen !== false
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {schedule.isOpen !== false ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  {can('canManageSchedules') && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(schedule)}
                          className="text-sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDelete(schedule.scheduleId || schedule.id)}
                          className="text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {schedules.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No schedules found. Add a schedule to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day of Week
              </label>
              <select
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <Input
              label="Open Time"
              type="time"
              name="openTime"
              value={formData.openTime}
              onChange={handleChange}
              required
            />

            <Input
              label="Close Time"
              type="time"
              name="closeTime"
              value={formData.closeTime}
              onChange={handleChange}
              required
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isOpen"
                checked={formData.isOpen}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Open for business
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
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
              <Button type="submit" disabled={loading}>
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
