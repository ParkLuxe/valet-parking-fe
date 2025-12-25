<<<<<<< HEAD
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
=======
# TypeScript Migration Guide - Park-Luxe Valet Parking Frontend

## Executive Summary

This document outlines the TypeScript migration strategy for the Park-Luxe valet parking frontend application. The migration includes converting from JavaScript to TypeScript, migrating from React Router to TanStack Router, and replacing the custom DataTable with TanStack Table.

## Current Status (As of 2025-12-25)

### ✅ Completed Components
- **TypeScript Infrastructure** (100%)
  - tsconfig.json configured with strict mode
  - All TypeScript dependencies installed
  - Type definitions created for entire application
  
- **Utility Files** (100% - 5/5 files)
  - `utils/constants.ts` - Application constants with proper typing
  - `utils/helpers.ts` - Helper functions with full type signatures  
  - `utils/cn.ts` - Class name utility
  - `utils/validators.ts` - Form validation with ValidationResult types
  - `utils/rolePermissions.ts` - Permission system with RolePermissions interface

- **Type Definitions** (100%)
  - `types/api.ts` - 150+ API types (Invoice, Payment, Vehicle, User, Host, etc.)
  - `types/store.ts` - Redux state types for all slices
  - `types/components.ts` - Component prop interfaces
  - `types/router.ts` - TanStack Router types
  - `types/table.ts` - TanStack Table types
  - `types/utils.ts` - Utility types and interfaces

### Build Status
- ✅ TypeScript compilation: **PASSING**
- ✅ Production build: **SUCCESS**
- ✅ ESLint: **PASSING**

## Migration Scope

### Total Files to Migrate: 84 JavaScript/JSX files

#### Breakdown:
- **Utilities**: 5 files → ✅ COMPLETE
- **Services**: 18 files → ⏳ PENDING
- **Redux**: 11 files → ⏳ PENDING
- **Components**: 13 files → ⏳ PENDING
- **Pages**: 30 files → ⏳ PENDING
- **App/Index**: 2 files → ⏳ PENDING
- **Routes**: 2 files (to be replaced) → ⏳ PENDING
- **Tests**: 1 file → ⏳ PENDING

## Detailed Migration Steps

### Phase 1: Services Layer (18 files, ~8-12 hours)

The services layer handles all API communication. Each service file needs:
1. Import type definitions from `types/api.ts`
2. Add return type annotations to all functions
3. Type all function parameters
4. Use generic types for apiHelper calls

#### Example: Converting invoiceService.js to .ts

**Before (JavaScript):**
```javascript
const invoiceService = {
  getInvoiceById: async (invoiceId) => {
    const response = await apiHelper.get(`/v1/invoices/${invoiceId}`);
    return response;
  },
};
```

**After (TypeScript):**
```typescript
import { apiHelper } from './api';
import type { Invoice, ApiResponse } from '../types/api';

const invoiceService = {
  getInvoiceById: async (invoiceId: string): Promise<Invoice> => {
    const response = await apiHelper.get<Invoice>(`/v1/invoices/${invoiceId}`);
    return response;
  },
};
```

#### Files to Convert:
1. `services/api.js` - Core API helper (CRITICAL - do this first)
2. `services/authService.js`
3. `services/invoiceService.js`
4. `services/paymentService.js`
5. `services/vehicleService.js`
6. `services/hostService.js`
7. `services/analyticsService.js`
8. `services/subscriptionService.js`
9. `services/qrCodeService.js`
10. `services/parkingSlotService.js`
11. `services/vehicleRequestService.js`
12. `services/countryStateService.js`
13. `services/hostUserService.js`
14. `services/subscriptionPlanService.js`
15. `services/websocketService.js`
16. `services/valetService.js`
17. `services/hostSchedulesService.js`
18. `services/authService.test.js` (update or remove)

### Phase 2: Redux Store (11 files, ~6-8 hours)

Convert all Redux slices to use TypeScript with proper state typing.

#### Example: Converting authSlice.js to .ts

**Before (JavaScript):**
```javascript
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
  },
});
```

**After (TypeScript):**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/store';

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});
```

#### Files to Convert:
1. `redux/store.js` - Main store configuration
2. `redux/slices/authSlice.js`
3. `redux/slices/invoiceSlice.js`
4. `redux/slices/paymentSlice.js`
5. `redux/slices/vehicleSlice.js`
6. `redux/slices/parkingSlotSlice.js`
7. `redux/slices/subscriptionSlice.js`
8. `redux/slices/analyticsSlice.js`
9. `redux/slices/valetSlice.js`
10. `redux/slices/notificationSlice.js`
11. `redux/slices/uiSlice.js`

### Phase 3: TanStack Table Implementation (~8-12 hours)

Replace the custom DataTable component with TanStack Table.

#### Step 1: Create Generic DataTable Component

Create `components/tables/DataTable.tsx`:

```typescript
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { DataTableProps } from '../../types/table';

export function DataTable<TData>({
  columns,
  data,
  searchable = true,
  onRowClick,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  });

  // Return table JSX with existing styling
  return (
    <div className="space-y-4">
      {/* Search input */}
      {/* Table */}
      {/* Pagination */}
    </div>
  );
}
```

#### Step 2: Create Column Definitions

Create `components/tables/columns/invoiceColumns.tsx`:

```typescript
import { createColumnHelper } from '@tanstack/react-table';
import type { Invoice } from '../../../types/api';
import { formatCurrency, formatDate } from '../../../utils/helpers';
>>>>>>> master

const columnHelper = createColumnHelper<Invoice>();

export const invoiceColumns = [
  columnHelper.accessor('invoiceNumber', {
    header: 'Invoice #',
<<<<<<< HEAD
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
  }),
  columnHelper.accessor('totalAmount', {
    header: 'Amount',
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('paymentStatus', {
    header: 'Status',
    cell: (info) => <Badge variant={getStatusVariant(info.getValue())} />,
=======
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('totalAmount', {
    header: 'Amount',
    cell: info => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('paymentStatus', {
    header: 'Status',
    cell: info => {
      const status = info.getValue();
      const colorClass = status === 'PAID' ? 'text-green-500' : 'text-red-500';
      return <span className={colorClass}>{status}</span>;
    },
  }),
  columnHelper.accessor('invoiceDate', {
    header: 'Date',
    cell: info => formatDate(info.getValue()),
>>>>>>> master
  }),
];
```

<<<<<<< HEAD
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
=======
#### Step 3: Update Pages Using Tables

Find all pages using DataTable and update them:
- Pages/Invoices.jsx
- Pages/Payments.jsx
- Pages/admin/AllPayments.jsx
- Pages/admin/HostManagement.jsx
- Pages/admin/SubscriptionPlansCRUD.jsx
- Pages/host/VehicleManagement.jsx
- Pages/valet/MyVehicles.jsx

### Phase 4: Common Components (13 files, ~10-15 hours)

Convert all common components to TypeScript with proper prop types.

#### Example: Converting Button.jsx to .tsx

**Before (JavaScript):**
```javascript
const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  return (
    <button onClick={onClick} className={getVariantClass(variant)} {...props}>
      {children}
    </button>
  );
};
```

**After (TypeScript):**
```typescript
import type { ButtonProps } from '../../types/components';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  ...props
}) => {
  return (
    <button onClick={onClick} className={getVariantClass(variant)} {...props}>
      {children}
    </button>
  );
};

export default Button;
```

#### Files to Convert:
1. `components/common/Button.jsx`
2. `components/common/Card.jsx`
3. `components/common/Input.jsx`
4. `components/common/Modal.jsx`
5. `components/common/Toast.jsx`
6. `components/common/Layout.jsx`
7. `components/common/Header.jsx`
8. `components/common/Sidebar.jsx`
9. `components/common/LoadingSpinner.jsx`
10. `components/common/ConfirmDialog.jsx`
11. `components/common/DateRangePicker.jsx`
12. `components/common/ExportButton.jsx`
13. `components/common/DataTable.jsx` - DELETE after TanStack Table migration

### Phase 5: TanStack Router Setup (~12-18 hours)

Replace React Router with TanStack Router using file-based routing.

#### Step 1: Create Root Route

Create `routes/__root.tsx`:

```typescript
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ToastProvider } from '../components/common/Toast';

export const Route = createRootRoute({
  component: () => (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  ),
});
```

#### Step 2: Create Authenticated Layout

Create `routes/_authenticated.tsx`:

```typescript
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import Layout from '../components/common/Layout';
import { store } from '../redux/store';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const { auth } = store.getState();
    if (!auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
```

#### Step 3: Create Individual Routes

Create route files for each page:
- `routes/_public/login.tsx`
- `routes/_public/register.tsx`
- `routes/_authenticated/dashboard.tsx`
- `routes/_authenticated/invoices/index.tsx`
- `routes/_authenticated/invoices/$id.tsx`
- etc.

#### Step 4: Update App.tsx

Replace React Router with TanStack Router:

```typescript
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen'; // Generated file

const router = createRouter({ routeTree });

function App() {
  return <RouterProvider router={router} />;
}
```

### Phase 6: Page Components (30 files, ~15-20 hours)

Convert all page components to TypeScript and integrate with new router/tables.

#### Conversion Checklist per Page:
1. Rename `.jsx` to `.tsx`
2. Add prop type interfaces
3. Type all state variables
4. Type all function parameters and returns
5. Add types to hooks (useState, useEffect, etc.)
6. Replace React Router hooks with TanStack Router hooks
7. Replace DataTable with new TanStack Table (if applicable)

#### Files to Convert:
**Public Pages:**
- Login.jsx
- Register.jsx

**Main Pages:**
- Dashboard.jsx
- Profile.jsx
- Analytics.jsx
- Subscription.jsx
- ParkingSlots.jsx
- HostUserManagement.jsx
- QRCodeManagement.jsx
- QRScanPage.jsx
- HostSchedules.jsx
- SubscriptionPlans.jsx
- DebugDashboard.jsx

**Invoice/Payment Pages:**
- Invoices.jsx
- InvoiceDetails.jsx
- Payments.jsx

**Admin Pages:**
- admin/AllPayments.jsx
- admin/HostManagement.jsx
- admin/SubscriptionPlansCRUD.jsx
- admin/SuperAdminAnalytics.jsx
- admin/SystemSettings.jsx

**Host Pages:**
- host/VehicleManagement.jsx
- host/Reports.jsx

**Valet Pages:**
- valet/MyVehicles.jsx
- valet/MyPerformance.jsx

### Phase 7: App Integration (2 files, ~2-4 hours)

1. Convert `index.js` to `index.tsx`
2. Convert `App.js` to `App.tsx`
3. Remove React Router DOM imports
4. Remove old route components (ProtectedRoute.jsx, PublicRoute.jsx)

### Phase 8: Testing & Validation (~8-12 hours)

1. Run `tsc --noEmit` to check for type errors
2. Run `npm run build` to ensure successful compilation
3. Test all routes and navigation
4. Test all tables (sorting, filtering, pagination)
5. Test authentication and role-based access
6. Test all API calls
7. Manual testing of critical user flows

## Migration Best Practices

### 1. Incremental Migration
- Convert files in dependency order (utilities → services → components → pages)
- Keep the app functional after each batch of conversions
- Commit frequently with descriptive messages

### 2. Type Safety
- Use `strict: true` in tsconfig.json
- Avoid `any` type - use `unknown` if type is truly unknown
- Create specific interfaces rather than generic objects
- Use union types for enums and status values

### 3. Testing Strategy
- Test after each major conversion batch
- Don't wait until the end to test
- Keep a running list of issues found

### 4. Code Review
- Review type definitions for correctness
- Ensure interfaces match actual API responses
- Verify component props are properly typed

## Common Pitfalls to Avoid

1. **Don't use `any` unnecessarily** - It defeats the purpose of TypeScript
2. **Don't skip type definitions** - They're the foundation of the migration
3. **Don't convert files out of order** - Respect dependencies
4. **Don't forget to update imports** - Change .js to .ts in import statements
5. **Don't ignore TypeScript errors** - Fix them properly, don't use `@ts-ignore`

## Rollback Strategy

If issues arise:
1. The migration is in a separate branch - main branch is unaffected
2. Each commit is atomic and can be reverted independently
3. Build must pass before merging to main
4. Feature flags can be used to toggle between old and new implementations

## Timeline Estimate

Based on complexity and file count:

- **Services Layer**: 2 days
- **Redux Store**: 1 day
- **TanStack Table**: 2 days
- **Common Components**: 2-3 days
- **TanStack Router**: 3 days
- **Page Components**: 4-5 days
- **Testing & Bug Fixes**: 2-3 days

**Total Estimated Time**: 16-21 business days (3-4 weeks) for a senior developer

## Success Criteria

- ✅ All JavaScript files converted to TypeScript
- ✅ `tsc --noEmit` passes with no errors
- ✅ Production build succeeds
- ✅ All existing features work correctly
- ✅ TanStack Router handles all navigation
- ✅ TanStack Table powers all data grids
- ✅ Type safety enforced throughout codebase
- ✅ No runtime errors from migration
- ✅ Code review approved
- ✅ QA testing passed
>>>>>>> master

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
<<<<<<< HEAD
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [TanStack Table Docs](https://tanstack.com/table/latest/docs/introduction)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Timeline Estimate

This is a **substantial migration project**:
- **Small team (1-2 developers)**: 3-4 weeks
- **Medium team (3-4 developers)**: 2-3 weeks
- **Large team (5+ developers)**: 1-2 weeks

Current progress: ~15% complete (foundation established).
=======
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Current Migration Status: 13% Complete

**Completed:** 11 files (type definitions + utilities)  
**Remaining:** 73+ files  
**Next Priority:** Service layer (api.js → api.ts)
>>>>>>> master
