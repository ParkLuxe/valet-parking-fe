/**
 * Host Management Page (SuperAdmin)
 * Manage hosts - View, Create, Edit, Deactivate
 */

import React, { useState } from 'react';
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
import { Card } from '../../components';
import { Button } from '../../components';
import { Modal } from '../../components';
import { Input } from '../../components';
import { LoadingSpinner } from '../../components';
import { DataTable } from '../../components';
import { ConfirmDialog } from '../../components';
import { useHosts, useRegisterHost, useUpdateHost } from '../../hooks/queries/useHosts';

const HostManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Use TanStack Query hooks
  const { data: hostsResponse, isLoading: loading, refetch: refetchHosts } = useHosts(currentPage, pageSize);
  const registerHostMutation = useRegisterHost();
  const updateHostMutation = useUpdateHost();

  // Extract hosts from response
  const hosts = hostsResponse?.content || hostsResponse || [];

  const [showModal, setShowModal] = useState(false);
  const [editingHost, setEditingHost] = useState(null);
  const [viewingHost, setViewingHost] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState({ isOpen: false, host: null });
  const [formData, setFormData] = useState({
    // Host Basic Information
    hostName: '',
    hostType: 'ORGANIZATION',
    hostEmail: '',
    phoneNumber: '',
    
    // Address Details
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: 'IN',
    
    // Business Details
    hostSize: '',
    parkingSlots: '',
    website: '',
    gstInNumber: '',
    
    // Social Media
    instagramProfileUrl: '',
    twitterProfileUrl: '',
    linkedInProfileUrl: '',
    
    // Master Admin Details
    username: '',
    masterFirstName: '',
    masterLastName: '',
    masterPassword: '',
    masterPhoneNumber: '',
    designation: '',
    
    // Legacy fields (for backward compatibility)
    name: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',
    subscriptionPlanId: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const submitting = registerHostMutation.isPending || updateHostMutation.isPending;


  const validateForm = () => {
    const errors: any = {};

    // Host Basic Information
    if (!formData.hostName.trim()) {
      errors.hostName = 'Host name is required';
    }

    if (!formData.hostEmail.trim()) {
      errors.hostEmail = 'Host email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.hostEmail)) {
      errors.hostEmail = 'Email is invalid';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }

    // Address Details
    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'Address line 1 is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }

    // Master Admin Details
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.masterFirstName.trim()) {
      errors.masterFirstName = 'Master first name is required';
    }

    if (!formData.masterLastName.trim()) {
      errors.masterLastName = 'Master last name is required';
    }

    if (!editingHost && !formData.masterPassword.trim()) {
      errors.masterPassword = 'Master password is required';
    } else if (!editingHost && formData.masterPassword.trim().length < 8) {
      errors.masterPassword = 'Password must be at least 8 characters';
    }

    if (!formData.masterPhoneNumber.trim()) {
      errors.masterPhoneNumber = 'Master phone number is required';
    }

    // Business Details
    if (!formData.parkingSlots.trim()) {
      errors.parkingSlots = 'Parking slots is required';
    } else if (isNaN(Number(formData.parkingSlots)) || Number(formData.parkingSlots) <= 0) {
      errors.parkingSlots = 'Parking slots must be a positive number';
    }

    if (formData.hostSize && (isNaN(Number(formData.hostSize)) || Number(formData.hostSize) <= 0)) {
      errors.hostSize = 'Host size must be a positive number';
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
      hostName: '',
      hostType: 'ORGANIZATION',
      hostEmail: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      countryCode: 'IN',
      hostSize: '',
      parkingSlots: '',
      website: '',
      gstInNumber: '',
      instagramProfileUrl: '',
      twitterProfileUrl: '',
      linkedInProfileUrl: '',
      username: '',
      masterFirstName: '',
      masterLastName: '',
      masterPassword: '',
      masterPhoneNumber: '',
      designation: '',
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
      hostName: host.hostName || host.businessName || '',
      hostType: host.hostType || 'ORGANIZATION',
      hostEmail: host.hostEmail || host.email || '',
      phoneNumber: host.phoneNumber || host.phone || '',
      addressLine1: host.addressLine1 || host.address?.split(',')[0] || '',
      addressLine2: host.addressLine2 || host.address?.split(',')[1] || '',
      city: host.city || '',
      state: host.state || '',
      postalCode: host.postalCode || '',
      countryCode: host.countryCode || 'IN',
      hostSize: host.hostSize?.toString() || '',
      parkingSlots: host.parkingSlots?.toString() || '',
      website: host.website || '',
      gstInNumber: host.gstInNumber || host.gstNumber || '',
      instagramProfileUrl: host.instagramProfileUrl || '',
      twitterProfileUrl: host.twitterProfileUrl || '',
      linkedInProfileUrl: host.linkedInProfileUrl || '',
      username: host.username || '',
      masterFirstName: host.masterFirstName || '',
      masterLastName: host.masterLastName || '',
      masterPassword: '',
      masterPhoneNumber: host.masterPhoneNumber || '',
      designation: host.designation || '',
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

    try {
      const hostData: any = {
        hostName: formData.hostName.trim(),
        hostType: formData.hostType,
        phoneNumber: formData.phoneNumber.trim(),
        hostEmail: formData.hostEmail.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        countryCode: formData.countryCode,
        parkingSlots: Number(formData.parkingSlots),
        username: formData.username.trim(),
        masterFirstName: formData.masterFirstName.trim(),
        masterLastName: formData.masterLastName.trim(),
        masterPhoneNumber: formData.masterPhoneNumber.trim(),
      };

      // Optional fields - only include if they have values
      if (formData.hostSize.trim()) {
        hostData.hostSize = Number(formData.hostSize);
      }
      if (formData.website.trim()) {
        hostData.website = formData.website.trim();
      }
      if (formData.gstInNumber.trim()) {
        hostData.gstInNumber = formData.gstInNumber.trim();
      }
      if (formData.instagramProfileUrl.trim()) {
        hostData.instagramProfileUrl = formData.instagramProfileUrl.trim();
      }
      if (formData.twitterProfileUrl.trim()) {
        hostData.twitterProfileUrl = formData.twitterProfileUrl.trim();
      }
      if (formData.linkedInProfileUrl.trim()) {
        hostData.linkedInProfileUrl = formData.linkedInProfileUrl.trim();
      }
      if (formData.designation.trim()) {
        hostData.designation = formData.designation.trim();
      }
      if (!editingHost && formData.masterPassword.trim()) {
        hostData.masterPassword = formData.masterPassword.trim();
      }

      if (editingHost) {
        await updateHostMutation.mutateAsync({
          hostId: editingHost.id,
          ...hostData,
        });
      } else {
        await registerHostMutation.mutateAsync(hostData);
      }

      setShowModal(false);
      // The mutation hooks will automatically invalidate queries and refetch
    } catch (err) {
      // Error toast is handled by the mutation hooks
    }
  };

  const handleToggleActive = async () => {
    if (!toggleConfirm.host) return;

    try {
      // Update host with toggled active status
      await updateHostMutation.mutateAsync({
        hostId: toggleConfirm.host.id,
        isActive: !toggleConfirm.host.isActive,
      });
      setToggleConfirm({ isOpen: false, host: null });
      // The mutation hook will automatically invalidate queries and refetch
    } catch (err) {
      // Error toast is handled by the mutation hook
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

  if (loading && !hosts.length) {
    return <LoadingSpinner message="Loading hosts..." fullScreen />;
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Host Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Host Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <Input
                  label="Host Name"
                  name="hostName"
                  value={formData.hostName}
                  onChange={handleInputChange}
                  error={!!formErrors.hostName}
                  helperText={formErrors.hostName}
                  placeholder="e.g., Park Luxe India Pvt Ltd"
                  required
                />
              </div>
              <Input
                label="Host Email"
                name="hostEmail"
                type="email"
                value={formData.hostEmail}
                onChange={handleInputChange}
                error={!!formErrors.hostEmail}
                helperText={formErrors.hostEmail}
                placeholder="contact@parkease.in"
                required
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
                placeholder="+917995520025"
                required
              />
              <div>
                <label className="block text-sm text-white/70 mb-2">Host Type</label>
                <select
                  name="hostType"
                  value={formData.hostType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-[5px] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="ORGANIZATION">Organization</option>
                  <option value="INDIVIDUAL">Individual</option>
                </select>
              </div>
              <Input
                label="Host Size"
                name="hostSize"
                type="number"
                value={formData.hostSize}
                onChange={handleInputChange}
                error={!!formErrors.hostSize}
                helperText={formErrors.hostSize}
                placeholder="50"
              />
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Address Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <Input
                  label="Address Line 1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  error={!!formErrors.addressLine1}
                  helperText={formErrors.addressLine1}
                  placeholder="123 Business Park"
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <Input
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="MG Road"
                />
              </div>
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={!!formErrors.city}
                helperText={formErrors.city}
                placeholder="Hyderabad"
                required
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={!!formErrors.state}
                helperText={formErrors.state}
                placeholder="Telangana"
                required
              />
              <Input
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                error={!!formErrors.postalCode}
                helperText={formErrors.postalCode}
                placeholder="500062"
                required
              />
              <Input
                label="Country Code"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                placeholder="IN"
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Business Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                label="Parking Slots"
                name="parkingSlots"
                type="number"
                value={formData.parkingSlots}
                onChange={handleInputChange}
                error={!!formErrors.parkingSlots}
                helperText={formErrors.parkingSlots}
                placeholder="100"
                required
              />
              <Input
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://parkluxe.in"
              />
              <div className="lg:col-span-2">
                <Input
                  label="GST IN Number"
                  name="gstInNumber"
                  value={formData.gstInNumber}
                  onChange={handleInputChange}
                  placeholder="27AABCU9603R1ZM"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Social Media</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                label="Instagram Profile URL"
                name="instagramProfileUrl"
                type="url"
                value={formData.instagramProfileUrl}
                onChange={handleInputChange}
                placeholder="https://instagram.com/parkease"
              />
              <Input
                label="Twitter Profile URL"
                name="twitterProfileUrl"
                type="url"
                value={formData.twitterProfileUrl}
                onChange={handleInputChange}
                placeholder="https://twitter.com/parkease"
              />
              <div className="lg:col-span-2">
                <Input
                  label="LinkedIn Profile URL"
                  name="linkedInProfileUrl"
                  type="url"
                  value={formData.linkedInProfileUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/company/parkease"
                />
              </div>
            </div>
          </div>

          {/* Master Admin Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Master Admin Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <Input
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  placeholder="admin@parkluxe"
                  required
                />
              </div>
              <Input
                label="First Name"
                name="masterFirstName"
                value={formData.masterFirstName}
                onChange={handleInputChange}
                error={!!formErrors.masterFirstName}
                helperText={formErrors.masterFirstName}
                placeholder="Suryansh"
                required
              />
              <Input
                label="Last Name"
                name="masterLastName"
                value={formData.masterLastName}
                onChange={handleInputChange}
                error={!!formErrors.masterLastName}
                helperText={formErrors.masterLastName}
                placeholder="Shukla"
                required
              />
              <Input
                label="Phone Number"
                name="masterPhoneNumber"
                type="tel"
                value={formData.masterPhoneNumber}
                onChange={handleInputChange}
                error={!!formErrors.masterPhoneNumber}
                helperText={formErrors.masterPhoneNumber}
                placeholder="+919995520025"
                required
              />
              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="CEO"
              />
              {!editingHost && (
                <div className="lg:col-span-2">
                  <Input
                    label="Master Password"
                    name="masterPassword"
                    type="password"
                    value={formData.masterPassword}
                    onChange={handleInputChange}
                    error={!!formErrors.masterPassword}
                    helperText={formErrors.masterPassword}
                    placeholder="Admin@123"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
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
