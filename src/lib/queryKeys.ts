/**
 * Query Keys Factory
 * Organized query keys for cache management
 */

import type { InvoiceFilters, VehicleFilters } from '../types/api';

export const queryKeys = {
  // Invoice query keys
  invoices: {
    all: ['invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters: InvoiceFilters) => 
      [...queryKeys.invoices.lists(), filters] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
    unpaid: (hostId: string) => [...queryKeys.invoices.all, 'unpaid', hostId] as const,
    overdue: () => [...queryKeys.invoices.all, 'overdue'] as const,
    revenue: {
      total: () => [...queryKeys.invoices.all, 'revenue', 'total'] as const,
      host: (hostId: string) => [...queryKeys.invoices.all, 'revenue', hostId] as const,
    },
  },

  // Payment query keys
  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (hostId: string, page?: number, size?: number) => 
      [...queryKeys.payments.lists(), { hostId, page, size }] as const,
    details: () => [...queryKeys.payments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.payments.details(), id] as const,
    stats: (hostId: string, startDate: string, endDate: string) =>
      [...queryKeys.payments.all, 'stats', { hostId, startDate, endDate }] as const,
  },

  // Vehicle query keys
  vehicles: {
    all: ['vehicles'] as const,
    lists: () => [...queryKeys.vehicles.all, 'list'] as const,
    list: (filters: VehicleFilters) => 
      [...queryKeys.vehicles.lists(), filters] as const,
    details: () => [...queryKeys.vehicles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.vehicles.details(), id] as const,
    requests: (hostId: string) => 
      [...queryKeys.vehicles.all, 'requests', hostId] as const,
  },

  // User query keys
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (hostId?: string) => 
      [...queryKeys.users.lists(), { hostId }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Host query keys
  hosts: {
    all: ['hosts'] as const,
    lists: () => [...queryKeys.hosts.all, 'list'] as const,
    list: (page?: number, size?: number) => 
      [...queryKeys.hosts.lists(), { page, size }] as const,
    details: () => [...queryKeys.hosts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.hosts.details(), id] as const,
  },

  // Parking Slot query keys
  parkingSlots: {
    all: ['parkingSlots'] as const,
    lists: () => [...queryKeys.parkingSlots.all, 'list'] as const,
    list: (hostId: string) => 
      [...queryKeys.parkingSlots.lists(), hostId] as const,
    details: () => [...queryKeys.parkingSlots.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.parkingSlots.details(), id] as const,
  },

  // Analytics query keys
  analytics: {
    all: ['analytics'] as const,
    dashboard: (hostId?: string) => 
      [...queryKeys.analytics.all, 'dashboard', { hostId }] as const,
    revenue: (hostId: string, startDate: string, endDate: string) =>
      [...queryKeys.analytics.all, 'revenue', { hostId, startDate, endDate }] as const,
    vehicles: (hostId: string, startDate: string, endDate: string) =>
      [...queryKeys.analytics.all, 'vehicles', { hostId, startDate, endDate }] as const,
  },

  // Subscription query keys
  subscriptions: {
    all: ['subscriptions'] as const,
    plans: () => [...queryKeys.subscriptions.all, 'plans'] as const,
    plan: (id: string) => [...queryKeys.subscriptions.plans(), id] as const,
    current: (hostId: string) => 
      [...queryKeys.subscriptions.all, 'current', hostId] as const,
  },

  // QR Code query keys
  qrCodes: {
    all: ['qrCodes'] as const,
    lists: () => [...queryKeys.qrCodes.all, 'list'] as const,
    list: (hostId: string) => [...queryKeys.qrCodes.lists(), hostId] as const,
    detail: (id: string) => [...queryKeys.qrCodes.all, 'detail', id] as const,
  },

  // Valet query keys
  valets: {
    all: ['valets'] as const,
    lists: () => [...queryKeys.valets.all, 'list'] as const,
    list: (hostId: string) => [...queryKeys.valets.lists(), hostId] as const,
    details: () => [...queryKeys.valets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.valets.details(), id] as const,
    performance: (valetId: string) => 
      [...queryKeys.valets.all, 'performance', valetId] as const,
  },

  // Host Schedule query keys
  hostSchedules: {
    all: ['hostSchedules'] as const,
    list: (hostId: string) => [...queryKeys.hostSchedules.all, hostId] as const,
  },

  // Country/State query keys
  locations: {
    all: ['locations'] as const,
    countries: () => [...queryKeys.locations.all, 'countries'] as const,
    states: (countryId: string) => 
      [...queryKeys.locations.all, 'states', countryId] as const,
  },
};
