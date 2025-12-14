# Development Guide

## Project Overview

Park-Luxe is a complete valet parking management system built with React, Redux, and Material-UI. This guide will help developers understand the architecture and start contributing.

## Architecture

### State Management (Redux)

The application uses Redux Toolkit for state management with the following slices:

1. **authSlice** - User authentication and profile
2. **vehicleSlice** - Active vehicles and history
3. **valetSlice** - Valet management and performance
4. **parkingSlotSlice** - Parking slot availability
5. **analyticsSlice** - Metrics and performance data
6. **subscriptionSlice** - Subscription and billing
7. **notificationSlice** - Real-time notifications and toasts
8. **uiSlice** - UI state (sidebar, modals, loading, errors)

### Routing

- **Public Routes**: Login, Register (redirects to dashboard if authenticated)
- **Protected Routes**: Dashboard, Profile, QR Scan, etc. (requires authentication)
- **Role-Based Routes**: Some routes are restricted to specific user roles

### Components Structure

#### Common Components
- **Button**: Customizable button with loading state
- **Input**: Form input with validation
- **Card**: Content container with header and actions
- **Modal**: Dialog component for forms and confirmations
- **LoadingSpinner**: Loading indicator
- **Sidebar**: Navigation menu with role-based items
- **Header**: Top bar with user menu and notifications
- **Layout**: Main layout wrapper with sidebar and header

#### Page Components
Each page is a standalone component that uses common components and connects to Redux store.

### Services

All API interactions are centralized in service files:

- **authService**: Login, register, profile management
- **vehicleService**: Vehicle CRUD operations
- **valetService**: Valet management
- **websocketService**: Real-time WebSocket communication

#### API Service Setup

The `api.js` file configures axios with:
- Base URL configuration
- JWT token interceptor (adds token to all requests)
- Automatic token refresh on 401 errors
- Error handling

### Utilities

- **constants.js**: All app-wide constants
- **helpers.js**: Utility functions (formatting, calculations)
- **validators.js**: Form validation functions
- **initializeStore.js**: Dummy data initialization

## Development Workflow

### Starting Development

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Start development server:
```bash
npm start
```

3. Access the app at http://localhost:3000

### Code Structure Best Practices

#### 1. Component Organization
```javascript
// Import order
import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Redux hooks
import { useNavigate } from 'react-router-dom'; // Router hooks
import { MUI components } from '@mui/material'; // UI components
import CustomComponents from '../components'; // Custom components
import { actions } from '../redux/slices'; // Redux actions
import { services } from '../services'; // API services
import { utils } from '../utils'; // Utilities
```

#### 2. State Management
```javascript
// Always use Redux for shared state
const dispatch = useDispatch();
const { data } = useSelector((state) => state.sliceName);

// Use local state for component-specific data
const [localData, setLocalData] = useState();
```

#### 3. Error Handling
```javascript
try {
  const result = await apiCall();
  dispatch(addToast({ type: 'success', message: 'Success!' }));
} catch (error) {
  dispatch(addToast({ type: 'error', message: error.message }));
}
```

#### 4. Form Validation
```javascript
import { validateEmail, validatePhone } from '../utils/validators';

const validate = () => {
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    setErrors({ email: emailValidation.error });
    return false;
  }
  return true;
};
```

### Adding New Features

#### 1. Add New Page

```bash
# Create page file
touch src/pages/NewPage.jsx
```

```javascript
// src/pages/NewPage.jsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const NewPage = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold">
        New Page
      </Typography>
    </Container>
  );
};

export default NewPage;
```

```javascript
// Add route in src/App.js
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <Layout>
        <NewPage />
      </Layout>
    </ProtectedRoute>
  }
/>
```

#### 2. Add New Redux Slice

```javascript
// src/redux/slices/newSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const newSlice = createSlice({
  name: 'newFeature',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = newSlice.actions;
export default newSlice.reducer;
```

```javascript
// Add to src/redux/store.js
import newReducer from './slices/newSlice';

const store = configureStore({
  reducer: {
    // ... existing reducers
    newFeature: newReducer,
  },
});
```

#### 3. Add New Service

```javascript
// src/services/newService.js
import { apiHelper } from './api';

const newService = {
  getData: async () => {
    // TODO: Replace with actual endpoint
    // const response = await apiHelper.get('/endpoint');
    return []; // Mock data
  },
};

export default newService;
```

### Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Backend Integration

### Current Setup
The app uses mock data for all API calls. Each service file has commented-out API calls with `TODO` markers.

### Integration Steps

1. **Set up environment variables**
```bash
# .env
REACT_APP_API_URL=https://api.yourbackend.com
REACT_APP_WS_URL=wss://ws.yourbackend.com
REACT_APP_RAZORPAY_KEY=rzp_live_XXXXXXXX
```

2. **Uncomment API calls in service files**
```javascript
// Before
// const response = await apiHelper.get('/endpoint');
return mockData;

// After
const response = await apiHelper.get('/endpoint');
return response.data;
```

3. **Update WebSocket configuration**
```javascript
// src/services/websocketService.js
// Update WS_URL to point to your WebSocket server
```

4. **Test with real API**
- Login functionality
- Data fetching
- Real-time updates
- Error handling

### API Contract

Expected API response format:
```javascript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  message: "Error message",
  errors: { field: "Field error" }
}
```

## Common Issues & Solutions

### Issue: npm install fails
**Solution**: Use `npm install --legacy-peer-deps`

### Issue: Build fails with ESLint errors
**Solution**: Fix ESLint warnings or disable specific rules with comments

### Issue: WebSocket connection fails
**Solution**: Ensure WebSocket server is running and URL is correct in .env

### Issue: JWT token expires
**Solution**: The app automatically tries to refresh the token. Ensure refresh token endpoint is implemented.

## Code Quality

### ESLint Configuration
The project uses Create React App's default ESLint configuration. CI mode treats warnings as errors.

### Code Comments
- Add JSDoc comments for functions
- Explain complex logic
- Mark TODO items for future work

### Git Workflow
1. Create feature branch
2. Make changes with descriptive commits
3. Test thoroughly
4. Create pull request

## Performance Optimization

### Current Optimizations
- Code splitting with React.lazy (can be added)
- Redux state normalized structure
- Memoization with useMemo (can be added)
- Debounced search inputs

### Future Optimizations
- Implement virtual scrolling for large lists
- Add service worker for offline support
- Optimize bundle size with tree shaking
- Add image lazy loading

## Security Considerations

### Current Implementation
- JWT token stored in localStorage
- Auto token refresh on expiry
- Protected routes with role checks
- Input validation on all forms
- XSS protection via React

### Additional Security (Backend Required)
- CSRF protection
- Rate limiting
- Input sanitization
- SQL injection prevention
- HTTPS enforcement

## Deployment

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
EXPOSE 3000
```

## Resources

- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material-UI](https://mui.com/)
- [React Router](https://reactrouter.com/)

## Support

For issues or questions:
1. Check this documentation
2. Search existing issues on GitHub
3. Create a new issue with details
4. Contact the development team

---

Happy Coding! 🚀
