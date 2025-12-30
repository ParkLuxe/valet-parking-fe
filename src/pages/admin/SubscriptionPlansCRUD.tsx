/**
 * Subscription Plans CRUD Page (SuperAdmin)
 * Manage subscription plans - Create, Read, Update, Delete
 */

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
} from 'lucide-react';
import { Card } from '../../components';
import { Button } from '../../components';
import { Modal } from '../../components';
import { Input } from '../../components';
import { LoadingSpinner } from '../../components';
import { DataTable } from '../../components';
import { ConfirmDialog } from '../../components';
import {
  useAllSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
} from '../../hooks/queries/useSubscriptionPlans';
import { formatCurrency } from '../../utils';

const SubscriptionPlansCRUD = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, plan: null });
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    baseScans: '',
    additionalScanPrice: '',
    description: '',
    features: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Use TanStack Query hooks
  const { data: plansResponse, isLoading: loading } = useAllSubscriptionPlans(0, 100);
  const plans = plansResponse?.content || plansResponse || [];
  const createPlanMutation = useCreateSubscriptionPlan();
  const updatePlanMutation = useUpdateSubscriptionPlan();

  const validateForm = () => {
    const errors: any = {};

    if (!formData.name.trim()) {
      errors.name = 'Plan name is required';
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      errors.basePrice = 'Base price must be greater than 0';
    }

    if (!formData.baseScans || parseInt(formData.baseScans) <= 0) {
      errors.baseScans = 'Base scans must be greater than 0';
    }

    if (!formData.additionalScanPrice || parseFloat(formData.additionalScanPrice) < 0) {
      errors.additionalScanPrice = 'Additional scan price must be 0 or greater';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      basePrice: '',
      baseScans: '',
      additionalScanPrice: '',
      description: '',
      features: '',
      isActive: true,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEditModal = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.planName || plan.name || '',
      basePrice: plan.monthlyPrice || plan.basePrice || '',
      baseScans: plan.scanLimit || plan.baseScans || '',
      additionalScanPrice: plan.additionalScanPrice || '',
      description: plan.description || '',
      features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      isActive: plan.isActive !== false,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const planData = {
      planName: formData.name.trim(),
      monthlyPrice: parseFloat(formData.basePrice),
      scanLimit: parseInt(formData.baseScans),
      description: formData.description.trim(),
      features: formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f),
      isActive: formData.isActive,
    };

    try {
      if (editingPlan) {
        await updatePlanMutation.mutateAsync({
          planId: editingPlan.id,
          ...planData,
        });
      } else {
        await createPlanMutation.mutateAsync(planData);
      }
      setShowModal(false);
    } catch (err) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleToggleActive = async (plan: any) => {
    try {
      await updatePlanMutation.mutateAsync({
        planId: plan.id,
        isActive: !plan.isActive,
      });
    } catch (err) {
      // Error handling is done in the mutation hook
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.plan) return;

    try {
      // Note: Backend may not have delete endpoint, so we'll deactivate instead
      await updatePlanMutation.mutateAsync({
        planId: deleteConfirm.plan.id,
        isActive: false,
      });
      setDeleteConfirm({ isOpen: false, plan: null });
    } catch (err) {
      // Error handling is done in the mutation hook
    }
  };

  const columns = [
    {
      header: 'Plan Name',
      accessor: 'planName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-semibold text-white">{value}</div>
          {row.description && (
            <div className="text-sm text-white/50 mt-1">{row.description}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Base Price',
      accessor: 'initialPackageAmount',
      sortable: true,
      render: (value) => (
        <span className="text-white">{formatCurrency(value)}</span>
      ),
    },
    {
      header: 'Base Scans',
      accessor: 'initialScansCount',
      sortable: true,
      render: (value) => <span className="text-white">{value}</span>,
    },
    {
      header: 'Additional Scan Price',
      accessor: 'perScanPrice',
      sortable: true,
      render: (value) => (
        <span className="text-white">{formatCurrency(value)}</span>
      ),
    },
    {
      header: 'Description',
      accessor: 'planDescription',
      sortable: false,
      render: (value) => (
        <span className="text-white/70">
          {value ? value : 'No description provided'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
            value
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
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
            onClick={() => handleOpenEditModal(row)}
            startIcon={<Edit className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleToggleActive(row)}
            startIcon={
              row.isActive ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )
            }
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => setDeleteConfirm({ isOpen: true, plan: row })}
            startIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading && !plans.length) {
    return <LoadingSpinner message="Loading subscription plans..." fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Subscription Plans Management
          </h1>
          <p className="text-white/60">
            Create and manage subscription plans for hosts
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenCreateModal}
          startIcon={<Plus className="w-5 h-5" />}
        >
          Create Plan
        </Button>
      </div>

      {/* Plans Table */}
      <Card
        title={`Total Plans: ${plans.length}`}
        subtitle={`Active: ${plans.filter((p) => p.isActive).length} | Inactive: ${
          plans.filter((p) => !p.isActive).length
        }`}
        headerAction={<Package className="w-5 h-5 text-white/50" />}
      >
        <DataTable
          columns={columns}
          data={plans}
          searchable={true}
          searchPlaceholder="Search plans..."
          emptyMessage="No subscription plans found"
          pageSize={10}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Plan Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name} helperText={formErrors.name}
              placeholder="e.g., Basic, Premium, Enterprise"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Base Price (₹)"
              name="basePrice"
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={handleInputChange}
              error={!!formErrors.basePrice} helperText={formErrors.basePrice}
              placeholder="1000"
              required
            />
            <Input
              label="Base Scans"
              name="baseScans"
              type="number"
              value={formData.baseScans}
              onChange={handleInputChange}
              error={!!formErrors.baseScans} helperText={formErrors.baseScans}
              placeholder="100"
              required
            />
          </div>

          <div>
            <Input
              label="Additional Scan Price (₹)"
              name="additionalScanPrice"
              type="number"
              step="0.01"
              value={formData.additionalScanPrice}
              onChange={handleInputChange}
              error={!!formErrors.additionalScanPrice} helperText={formErrors.additionalScanPrice}
              placeholder="10"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Plan description..."
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">
              Features (one per line)
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={5}
              placeholder="Unlimited users&#10;24/7 support&#10;Custom branding"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
            />
            <label className="text-white/70">Active Plan</label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createPlanMutation.isPending || updatePlanMutation.isPending}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, plan: null })}
        onConfirm={handleDeleteConfirm}
        title="Deactivate Subscription Plan"
        message={`Are you sure you want to deactivate the plan "${deleteConfirm.plan?.name}"? This action will make it unavailable for new subscriptions.`}
        confirmText="Deactivate"
        loading={updatePlanMutation.isPending}
      />
    </div>
  );
};

export default SubscriptionPlansCRUD;
