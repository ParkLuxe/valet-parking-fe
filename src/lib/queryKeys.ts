/**
 * Query Keys Factory
 * Centralized query key management for TanStack Query
 */

import type { InvoiceFilterParams, PaymentFilterParams, VehicleFilterParams } from '../types/api';

export const queryKeys = {
  // Invoice queries
  invoices: {
    all: ['invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters: InvoiceFilterParams, page: number, size: number) =>
      [...queryKeys.invoices.lists(), { filters, page, size }] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
    infinite: (filters: InvoiceFilterParams) =>
      [...queryKeys.invoices.all, 'infinite', filters] as const,
    unpaid: (hostId: string) => [...queryKeys.invoices.all, 'unpaid', hostId] as const,
    overdue: () => [...queryKeys.invoices.all, 'overdue'] as const,
  },

  // Payment queries
  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (filters: PaymentFilterParams, page: number, size: number) =>
      [...queryKeys.payments.lists(), { filters, page, size }] as const,
    details: () => [...queryKeys.payments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.payments.details(), id] as const,
    byInvoice: (invoiceId: string) =>
      [...queryKeys.payments.all, 'invoice', invoiceId] as const,
  },

  // Vehicle queries
  vehicles: {
    all: ['vehicles'] as const,
    lists: () => [...queryKeys.vehicles.all, 'list'] as const,
    list: (filters: VehicleFilterParams, page?: number, size?: number) =>
      [...queryKeys.vehicles.lists(), { filters, page, size }] as const,
    details: () => [...queryKeys.vehicles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.vehicles.details(), id] as const,
    active: (hostId?: string) =>
      [...queryKeys.vehicles.all, 'active', hostId] as const,
    history: (hostId?: string) =>
      [...queryKeys.vehicles.all, 'history', hostId] as const,
  },

  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (hostId?: string) => [...queryKeys.users.lists(), hostId] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
  },

  // Host queries
  hosts: {
    all: ['hosts'] as const,
    lists: () => [...queryKeys.hosts.all, 'list'] as const,
    list: () => [...queryKeys.hosts.lists()] as const,
    details: () => [...queryKeys.hosts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.hosts.details(), id] as const,
  },

  // Subscription queries
  subscriptions: {
    all: ['subscriptions'] as const,
    plans: () => [...queryKeys.subscriptions.all, 'plans'] as const,
    plan: (id: string) => [...queryKeys.subscriptions.plans(), id] as const,
    current: (hostId: string) =>
      [...queryKeys.subscriptions.all, 'current', hostId] as const,
  },

  // Parking slot queries
  parkingSlots: {
    all: ['parkingSlots'] as const,
    lists: () => [...queryKeys.parkingSlots.all, 'list'] as const,
    list: (hostId: string) => [...queryKeys.parkingSlots.lists(), hostId] as const,
    details: () => [...queryKeys.parkingSlots.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.parkingSlots.details(), id] as const,
    available: (hostId: string) =>
      [...queryKeys.parkingSlots.all, 'available', hostId] as const,
  },

  // Analytics queries
  analytics: {
    all: ['analytics'] as const,
    dashboard: (hostId?: string) =>
      [...queryKeys.analytics.all, 'dashboard', hostId] as const,
    performance: (hostId?: string, valetId?: string) =>
      [...queryKeys.analytics.all, 'performance', hostId, valetId] as const,
    revenue: (hostId?: string, period?: string) =>
      [...queryKeys.analytics.all, 'revenue', hostId, period] as const,
  },

  // QR Code queries
  qrCodes: {
    all: ['qrCodes'] as const,
    lists: () => [...queryKeys.qrCodes.all, 'list'] as const,
    list: (hostId: string) => [...queryKeys.qrCodes.lists(), hostId] as const,
    details: () => [...queryKeys.qrCodes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.qrCodes.details(), id] as const,
  },

  // Schedule queries
  schedules: {
    all: ['schedules'] as const,
    lists: () => [...queryKeys.schedules.all, 'list'] as const,
    list: (hostId: string) => [...queryKeys.schedules.lists(), hostId] as const,
    details: () => [...queryKeys.schedules.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.schedules.details(), id] as const,
  },
};
