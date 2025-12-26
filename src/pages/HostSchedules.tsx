/**
 * Host Schedules Page
 * Manage operating schedules for the host
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {  RootState  } from '../redux';
import { Card } from '../components';
import { Button } from '../components';
import { LoadingSpinner } from '../components';
import { Modal } from '../components';
import { Input } from '../components';
import { hostSchedulesService } from '../services';
import {  addToast  } from '../redux';
import { usePermissions } from '../hooks';

const DAYS_OF_WEEK = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const HostSchedules = () => {
  const dispatch = useDispatch();
  const { can } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    dayOfWeek: 'MONDAY',
    openTime: '09:00',
    closeTime: '18:00',
    isOpen: true,
  });

  useEffect(() => {
    if (user?.hostUserId) {
      fetchSchedules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await hostSchedulesService.getSchedulesByHost(user.hostUserId);
      setSchedules(response || []);
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load schedules',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (editingSchedule) {
        await hostSchedulesService.updateSchedule(editingSchedule.id, formData);
        dispatch(addToast({
          type: 'success',
          message: 'Schedule updated successfully',
        }));
      } else {
        await hostSchedulesService.createSchedule(user.hostId, formData);
        dispatch(addToast({
          type: 'success',
          message: 'Schedule created successfully',
        }));
      }
      setShowModal(false);
      setEditingSchedule(null);
      setFormData({
        dayOfWeek: 'MONDAY',
        openTime: '09:00',
        closeTime: '18:00',
        isOpen: true,
      });
      fetchSchedules();
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: `Failed to ${editingSchedule ? 'update' : 'create'} schedule`,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      openTime: schedule.openTime,
      closeTime: schedule.closeTime,
      isOpen: schedule.isOpen !== false,
    });
    setShowModal(true);
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      setLoading(true);
      await hostSchedulesService.deleteSchedule(scheduleId);
      dispatch(addToast({
        type: 'success',
        message: 'Schedule deleted successfully',
      }));
      fetchSchedules();
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to delete schedule',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  if (loading && schedules.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

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
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
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
                          onClick={() => handleDelete(schedule.id)}
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
