# TypeScript + TanStack Query + TanStack Table Migration Guide

## Overview

This guide documents the ongoing migration of the Park-Luxe Valet Parking frontend from JavaScript to TypeScript, integrating TanStack Query (React Query) for API state management and TanStack Table for data grids.

## Current Status

### ✅ Completed
- TypeScript configuration and project setup
- Complete type system for all entities (API, components, tables, utils)
- TanStack Query client and query key factory
- Core utilities converted to TypeScript
- API layer converted to TypeScript
- Invoice service and hooks fully migrated (reference implementation)

### 🚧 In Progress
This is a **large-scale migration** affecting 84+ files. The foundation has been established with the invoice service as a reference implementation.

## Migration Pattern

### 1. Service Layer Conversion

**Example: Invoice Service**

```typescript
// src/services/invoiceService.ts
import { apiHelper } from './api';
import type { Invoice, PaginatedResponse, InvoiceFilters } from '../types/api';

const invoiceService = {
  filterInvoices: async (
    filters: InvoiceFilters = {}, 
    page: number = 0, 
    size: number = 10
  ): Promise<PaginatedResponse<Invoice>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    if (filters.status) params.append('status', filters.status);
    if (filters.hostId) params.append('hostId', filters.hostId);
    
    return await apiHelper.get<PaginatedResponse<Invoice>>(
      `/v1/invoices/filter?${params.toString()}`
    );
  },
  // ... other methods
};
```

### 2. Query Hooks Creation

**Example: Invoice Queries**

```typescript
// src/hooks/queries/useInvoices.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import invoiceService from '../../services/invoiceService';

export function useInvoices(
  filters: InvoiceFilters, 
  page: number = 0, 
  size: number = 10
) {
  return useQuery({
    queryKey: queryKeys.invoices.list({ ...filters, page, size }),
    queryFn: () => invoiceService.filterInvoices(filters, page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 3. Mutation Hooks Creation

**Example: Invoice Mutations**

```typescript
// src/hooks/mutations/useInvoiceMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

export function useGenerateInvoice() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (hostId: string) => invoiceService.generateInvoice(hostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      dispatch(addToast({ type: 'success', message: 'Invoice generated!' }));
    },
  });
}
```

### 4. Page Component Migration

**Example: Converting Invoices Page**

```typescript
// src/pages/Invoices.tsx
import React, { useState } from 'react';
import { useInvoices } from '../hooks/queries/useInvoices';
import { useGenerateInvoice, useDownloadInvoicePDF } from '../hooks/mutations/useInvoiceMutations';
import { DataTable } from '../components/tables/DataTable';
import { invoiceColumns } from '../components/tables/columns/invoiceColumns';

const Invoices: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus>('UNPAID');
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, error } = useInvoices(
    { hostId: user?.hostId, status: statusFilter },
    currentPage,
    10
  );

  const downloadPDF = useDownloadInvoicePDF();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <DataTable
        columns={invoiceColumns}
        data={data?.content ?? []}
        onRowClick={(invoice) => downloadPDF.mutate(invoice.id)}
      />
    </div>
  );
};
```

### 5. TanStack Table Integration

**Example: Invoice Table Columns**

```typescript
// src/components/tables/columns/invoiceColumns.tsx
import { createColumnHelper } from '@tanstack/react-table';
import type { Invoice } from '../../../types/api';

const columnHelper = createColumnHelper<Invoice>();

export const invoiceColumns = [
  columnHelper.accessor('invoiceNumber', {
    header: 'Invoice #',
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
  }),
  columnHelper.accessor('totalAmount', {
    header: 'Amount',
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('paymentStatus', {
    header: 'Status',
    cell: (info) => <Badge variant={getStatusVariant(info.getValue())} />,
  }),
];
```

## Next Steps

### Priority 1: Complete Core Services

Convert remaining services to TypeScript:
- [ ] `authService.js` → `.ts`
- [ ] `paymentService.js` → `.ts`
- [ ] `vehicleService.js` → `.ts`
- [ ] `hostService.js` → `.ts`
- [ ] `parkingSlotService.js` → `.ts`
- [ ] `analyticsService.js` → `.ts`
- [ ] ... (17 services total)

### Priority 2: Create Query/Mutation Hooks

For each service, create corresponding hooks:
- [ ] `usePayments.ts` + `usePaymentMutations.ts`
- [ ] `useVehicles.ts` + `useVehicleMutations.ts`
- [ ] `useAuth.ts` + `useAuthMutations.ts`
- [ ] `useAnalytics.ts`
- [ ] ... etc

### Priority 3: TanStack Table Components

- [ ] Create `DataTable.tsx` with TanStack Table
- [ ] Create column definitions for each entity
- [ ] Create custom cell renderers

### Priority 4: Convert Pages

Convert page components to use new hooks:
- [ ] `Invoices.jsx` → `.tsx` (use hooks + table)
- [ ] `Payments.jsx` → `.tsx`
- [ ] `Dashboard.jsx` → `.tsx`
- [ ] `Analytics.jsx` → `.tsx`
- [ ] ... (20+ pages)

### Priority 5: Convert Common Components

- [ ] Button, Card, Modal, etc. → `.tsx`
- [ ] Add proper prop types from `types/components.ts`

### Priority 6: Redux Cleanup

- [ ] Remove server state from Redux (invoices, payments, vehicles)
- [ ] Keep only UI state and auth state
- [ ] Convert remaining slices to TypeScript

## Key Benefits

### TypeScript
- ✅ Type safety across the entire codebase
- ✅ Better IDE autocomplete and IntelliSense
- ✅ Catch errors at compile time

### TanStack Query
- ✅ Automatic caching and background refetching
- ✅ Optimistic updates support
- ✅ Better loading and error states
- ✅ Reduced Redux boilerplate for server state
- ✅ React Query DevTools for debugging

### TanStack Table
- ✅ More powerful and flexible than custom table
- ✅ Built-in sorting, filtering, pagination
- ✅ Better performance with large datasets
- ✅ Type-safe column definitions

## Important Notes

1. **Incremental Migration**: This migration should be done incrementally, one feature at a time.

2. **Keep Existing Functionality**: All current features must continue working during migration.

3. **React Router**: React Router DOM stays unchanged - only convert to TypeScript.

4. **Testing**: Test each converted feature thoroughly before moving to the next.

5. **Server vs Client State**:
   - **Server State** (TanStack Query): Invoices, Payments, Vehicles, Users, Analytics
   - **Client State** (Redux): Auth, UI, Notifications

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [TanStack Table Docs](https://tanstack.com/table/latest/docs/introduction)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Timeline Estimate

This is a **substantial migration project**:
- **Small team (1-2 developers)**: 3-4 weeks
- **Medium team (3-4 developers)**: 2-3 weeks
- **Large team (5+ developers)**: 1-2 weeks

Current progress: ~15% complete (foundation established).
