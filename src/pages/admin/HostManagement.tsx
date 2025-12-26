/**
 * Host Management Page (SuperAdmin)
 * Manage hosts - View, Create, Edit, Deactivate
 */

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Plus,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
  Building2,
  Users,
  Car,
} from 'lucide-react';
import { Card, Button, Modal, Input, LoadingSpinner, DataTable, ConfirmDialog } from '../../components';
import { hostService } from '../../services';
import { addToast } from '../../redux';

const HostManagement = () => {
  const dispatch = useDispatch();

  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingHost, setEditingHost] = useState(null);
  const [viewingHost, setViewingHost] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState({ isOpen: false, host: null });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',
    subscriptionPlanId: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHosts = async () => {
    setLoading(true);
    try {
      // Mock data until API is available
      const mockHosts = [
        {
          id: 1,
          businessName: 'Grand Hotel',
          name: 'John Doe',
          email: 'john@grandhotel.com',
          phone: '+91 9876543210',
          address: '123 Main St, City',
          isActive: true,
          usersCount: 5,
          vehiclesCount: 42,
        },
      ];
      setHosts(mockHosts);
      // Real implementation would be:
      // const response = await hostService.getAllHosts();
      // setHosts(response || []);
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to load hosts',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    }

    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleOpenCreateModal = () => {
    setEditingHost(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      businessName: '',
      address: '',
      subscriptionPlanId: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEditModal = (host) => {
    setEditingHost(host);
    setFormData({
      name: host.name || '',
      email: host.email || '',
      phone: host.phone || '',
      businessName: host.businessName || '',
      address: host.address || '',
      subscriptionPlanId: host.subscriptionPlanId || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const hostData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        businessName: formData.businessName.trim(),
        address: formData.address.trim(),
        subscriptionPlanId: formData.subscriptionPlanId || undefined,
      };

      if (editingHost) {
        // await hostService.updateHost(editingHost.id, hostData);
        console.log('Update host:', editingHost.id, hostData);
        dispatch(
          addToast({
            type: 'success',
            message: 'Host updated successfully',
          })
        );
      } else {
        // Use existing register method
        await hostService.register(hostData);
        dispatch(
          addToast({
            type: 'success',
            message: 'Host created successfully',
          })
        );
      }

      setShowModal(false);
      fetchHosts();
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: editingHost ? 'Failed to update host' : 'Failed to create host',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!toggleConfirm.host) return;

    setSubmitting(true);
    try {
      // Mock implementation - would use actual API
      console.log('Toggle host status:', toggleConfirm.host.id);
      dispatch(
        addToast({
          type: 'success',
          message: `Host ${toggleConfirm.host.isActive ? 'deactivated' : 'activated'} successfully`,
        })
      );
      setToggleConfirm({ isOpen: false, host: null });
      fetchHosts();
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to toggle host status',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Business Name',
      accessor: 'businessName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-semibold text-white">{value}</div>
          <div className="text-sm text-white/50 mt-1">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      accessor: 'name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-white">{value}</div>
          <div className="text-sm text-white/50 mt-1">{row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Users',
      accessor: 'usersCount',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-white/50" />
          <span className="text-white">{value || 0}</span>
        </div>
      ),
    },
    {
      header: 'Vehicles',
      accessor: 'vehiclesCount',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-white/50" />
          <span className="text-white">{value || 0}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
            value !== false
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {value !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => setViewingHost(row)}
            startIcon={<Eye className="w-4 h-4" />}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleOpenEditModal(row)}
            startIcon={<Edit className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setToggleConfirm({ isOpen: true, host: row })}
            startIcon={
              row.isActive !== false ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )
            }
          >
            {row.isActive !== false ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Host Management</h1>
          <p className="text-white/60">Manage all hosts and their details</p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenCreateModal}
          startIcon={<Plus className="w-5 h-5" />}
        >
          Create Host
        </Button>
      </div>

      {/* Hosts Table */}
      <Card
        title={`Total Hosts: ${hosts.length}`}
        subtitle={`Active: ${hosts.filter((h) => h.isActive !== false).length} | Inactive: ${
          hosts.filter((h) => h.isActive === false).length
        }`}
        headerAction={<Building2 className="w-5 h-5 text-white/50" />}
      >
        <DataTable
          columns={columns}
          data={hosts}
          searchable={true}
          searchPlaceholder="Search hosts..."
          emptyMessage="No hosts found"
          pageSize={10}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingHost ? 'Edit Host' : 'Create Host'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            error={!!formErrors.businessName} helperText={formErrors.businessName}
            placeholder="e.g., Grand Hotel"
            required
          />

          <Input
            label="Contact Person Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!formErrors.name} helperText={formErrors.name}
            placeholder="e.g., John Doe"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email} helperText={formErrors.email}
              placeholder="email@example.com"
              required
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone} helperText={formErrors.phone}
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Full business address..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingHost ? 'Update Host' : 'Create Host'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Host Modal */}
      <Modal
        open={!!viewingHost}
        onClose={() => setViewingHost(null)}
        title="Host Details"
      >
        {viewingHost && (
          <div className="space-y-4">
            <div>
              <span className="text-white/50 text-sm">Business Name</span>
              <div className="text-white font-semibold mt-1">
                {viewingHost.businessName}
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">Contact Person</span>
              <div className="text-white font-semibold mt-1">{viewingHost.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-white/50 text-sm">Email</span>
                <div className="text-white mt-1">{viewingHost.email}</div>
              </div>
              <div>
                <span className="text-white/50 text-sm">Phone</span>
                <div className="text-white mt-1">{viewingHost.phone}</div>
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">Address</span>
              <div className="text-white mt-1">{viewingHost.address || 'N/A'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-white/50 text-sm">Users Count</span>
                <div className="text-white font-semibold mt-1">
                  {viewingHost.usersCount || 0}
                </div>
              </div>
              <div>
                <span className="text-white/50 text-sm">Vehicles Count</span>
                <div className="text-white font-semibold mt-1">
                  {viewingHost.vehiclesCount || 0}
                </div>
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">Status</span>
              <div className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                    viewingHost.isActive !== false
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {viewingHost.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Toggle Confirmation Dialog */}
      <ConfirmDialog
        open={toggleConfirm.isOpen}
        onClose={() => setToggleConfirm({ isOpen: false, host: null })}
        onConfirm={handleToggleActive}
        title={`${toggleConfirm.host?.isActive !== false ? 'Deactivate' : 'Activate'} Host`}
        message={`Are you sure you want to ${
          toggleConfirm.host?.isActive !== false ? 'deactivate' : 'activate'
        } "${toggleConfirm.host?.businessName}"?`}
        confirmText={toggleConfirm.host?.isActive !== false ? 'Deactivate' : 'Activate'}
        loading={submitting}
      />
    </div>
  );
};

export default HostManagement;
