# Park-Luxe - Valet Parking Management System

A complete React frontend application for managing valet parking operations with real-time updates and comprehensive analytics.

## 🚀 Features

### Authentication & User Management
- **Multi-Role Login System**: Separate login flows for Hosts, Host Users (Valets), and Super Admin
- **Host Registration**: New hosts can register with business details
- **Profile Management**: Edit profile, change password, upload profile picture
- **Role-Based Access Control**: Different features based on user roles

### QR Code & Vehicle Management
- **Dynamic QR Code Generation**: Auto-refreshing QR codes for each customer
- **Vehicle Entry Form**: Complete vehicle and customer details capture
- **Real-time Status Tracking**: Being Assigned → Parking In Progress → Parked → Out for Delivery → Delivered
- **Valet Assignment**: Assign available valets to parking tasks
- **Parking Slot Management**: Track and assign available parking slots

### Analytics Dashboard
- **Key Metrics Cards**: Active valets, cars parked, average parking/delivery times
- **Valet Performance Tracking**: Individual valet statistics and rankings
- **Recent Activity Feed**: Live updates of parking/delivery events

### Subscription Management
- **Usage Tracking**: Visual display of scan usage
- **Pay-as-you-go Billing**: ₹1,000 for 100 scans, ₹10 per additional scan
- **Grace Period**: 3-day buffer after limit exceeded
- **Payment History**: Track all payments
- **Razorpay Integration**: Ready for payment gateway

## 🛠️ Tech Stack

- **React 19** with hooks
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Material-UI (MUI)** for UI components
- **Axios** with JWT interceptors
- **Socket.io Client** for real-time updates
- **QRCode.react** for QR generation

## 🚦 Getting Started

### Installation

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm start
```

### Build

```bash
npm run build
```

## 🔐 Development Credentials

**Super Admin:** admin@parkluxe.com / Admin@123
**Host:** host@example.com / Host@123
**Valet:** valet@example.com / Valet@123

⚠️ Change these in production!

## 📝 API Integration

Currently using mock data. To integrate with backend:
1. Update API_BASE_URL in .env
2. Uncomment API calls in service files
3. Replace mock responses with actual API calls

## 📄 License

MIT License - see LICENSE file for details.
