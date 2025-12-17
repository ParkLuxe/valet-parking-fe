# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Park-Luxe is a valet parking management system built with React 19, Redux Toolkit, and Material-UI. The application currently uses **mock data for all operations** - all service files contain commented-out API calls marked with `TODO` comments.

## Essential Commands

### Installation
```bash
npm install --legacy-peer-deps
```
**Note:** The `--legacy-peer-deps` flag is required due to peer dependency conflicts.

### Development
```bash
npm start          # Start dev server on http://localhost:3000
npm test           # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage report
npm run build      # Create production build
```

### Development Credentials
- **Super Admin:** admin@parkluxe.com / Admin@123
- **Host:** host@example.com / Host@123
- **Valet:** valet@example.com / Valet@123

## Architecture

### Redux State Management
The app uses Redux Toolkit with 8 main slices:
- **authSlice** - Authentication, JWT tokens stored in localStorage
- **vehicleSlice** - Active vehicles and parking history
- **valetSlice** - Valet users and performance metrics
- **parkingSlotSlice** - Parking slot availability
- **analyticsSlice** - Dashboard metrics and statistics
- **subscriptionSlice** - Billing and usage tracking
- **notificationSlice** - Toast notifications (not persisted)
- **uiSlice** - UI state like sidebar visibility, loading states

All state is managed through Redux actions - avoid direct localStorage manipulation except in authSlice.

### API Service Architecture
All API interactions are centralized in `src/services/`:
- **api.js** - Axios instance with JWT interceptor and automatic token refresh
- **authService.js** - Login, register, profile management
- **vehicleService.js** - Vehicle CRUD operations
- **valetService.js** - Valet user management
- **websocketService.js** - Socket.io client for real-time updates

**Critical:** All service files currently return mock data. API calls are commented out with `// TODO: Replace with actual API endpoint` markers. When integrating with a backend, uncomment these lines and remove mock responses.

### Routing & Access Control
- **PublicRoute** - Redirects to dashboard if authenticated (Login, Register)
- **ProtectedRoute** - Redirects to login if not authenticated
- **Role-based access** - Use `requiredRoles` prop on ProtectedRoute
  ```jsx
  <ProtectedRoute requiredRoles={[USER_ROLES.HOST, USER_ROLES.VALET]}>
  ```

### Directory Structure
```
src/
├── components/common/    # Reusable UI components (Button, Input, Modal, etc.)
├── pages/               # Page-level components
├── redux/
│   ├── slices/         # Redux Toolkit slices
│   └── store.js        # Store configuration
├── routes/             # ProtectedRoute and PublicRoute components
├── services/           # API service layer (currently mocked)
└── utils/
    ├── constants.js    # All constants, API URLs, user roles, statuses
    ├── validators.js   # Form validation functions
    ├── helpers.js      # Utility functions
    └── initializeStore.js  # Dummy data initialization
```

## Key Patterns

### Component Structure
Follow this import order:
1. React and hooks
2. Redux hooks (useSelector, useDispatch)
3. Router hooks
4. MUI components
5. Custom components
6. Redux actions
7. Services
8. Utils

### Error Handling
Always dispatch toast notifications for user feedback:
```javascript
import { addToast } from '../redux/slices/notificationSlice';

try {
  const result = await apiCall();
  dispatch(addToast({ type: 'success', message: 'Success!' }));
} catch (error) {
  dispatch(addToast({ type: 'error', message: error.message }));
}
```

### Mock to Real API Migration
When integrating with backend:
1. Set environment variables in `.env` (copy from `.env.example`)
2. Uncomment API calls in service files (look for `// TODO:` comments)
3. Remove mock response returns
4. Update WebSocket URL in `constants.js`

Expected API response format:
```javascript
// Success
{ success: true, data: { ... } }

// Error
{ success: false, message: "Error message", errors: { field: "error" } }
```

### Vehicle Status Flow
```
BEING_ASSIGNED → PARKING_IN_PROGRESS → PARKED → OUT_FOR_DELIVERY → DELIVERED
```
Status constants defined in `utils/constants.js` under `VEHICLE_STATUS`.

### Adding New Features

#### New Redux Slice
1. Create slice file in `src/redux/slices/`
2. Add reducer to `src/redux/store.js`
3. Use `createSlice` from Redux Toolkit

#### New Page
1. Create component in `src/pages/`
2. Add route in `src/App.js` within appropriate route wrapper
3. Add navigation item in `src/components/common/Sidebar.jsx` if needed

#### New Service
Create in `src/services/` following the pattern:
```javascript
import { apiHelper } from './api';

const newService = {
  getData: async () => {
    // TODO: Replace with actual endpoint
    // const response = await apiHelper.get('/endpoint');
    return []; // Mock data
  },
};
```

## Important Notes

- **ESLint:** Uses Create React App's default configuration. Build treats warnings as errors.
- **Testing:** Uses Jest and React Testing Library (configured in `setupTests.js`)
- **Authentication:** JWT tokens stored in localStorage with automatic refresh on 401
- **Real-time Updates:** WebSocket service configured but requires backend WebSocket server
- **Subscription Model:** ₹1,000 for 100 scans, ₹10 per additional scan, 3-day grace period
- **Never commit:** Changes unless explicitly asked. Users prefer to review before committing.
