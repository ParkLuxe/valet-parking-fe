# Park-Luxe API Documentation

This document outlines the expected API endpoints and data structures for backend integration.

## Base URL
```
https://api.parkluxe.com/api
```

## Authentication

All authenticated endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "host|valet|super_admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+919876543210",
      "role": "host",
      "profilePicture": "url",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /auth/register
Register new host account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+919876543210",
  "businessName": "My Restaurant",
  "password": "SecurePass@123"
}
```

**Response:** Same as login

### POST /auth/refresh
Refresh JWT token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### POST /auth/logout
Logout user (invalidate tokens).

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/profile
Get current user profile.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+919876543210",
    "role": "host",
    "profilePicture": "url",
    "businessName": "My Restaurant",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /auth/profile
Update user profile.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+919876543211"
}
```

**Response:** Updated user object

### POST /auth/change-password
Change user password.

**Headers:** Authorization required

**Request Body:**
```json
{
  "oldPassword": "OldPass@123",
  "newPassword": "NewPass@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### POST /auth/upload-picture
Upload profile picture.

**Headers:** 
- Authorization required
- Content-Type: multipart/form-data

**Request Body:** FormData with 'profilePicture' field

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/profile.jpg"
  }
}
```

---

## 🚗 Vehicle Endpoints

### GET /vehicles/active
Get all active vehicles (not yet delivered).

**Headers:** Authorization required

**Query Parameters:**
- `status` (optional): Filter by status
- `valetId` (optional): Filter by valet

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "vehicleNumber": "MH12AB1234",
      "vehicleType": "car",
      "vehicleColor": "Black",
      "customerPhone": "+919876543210",
      "customerName": "Customer Name",
      "parkingSlot": "A-101",
      "valetId": "uuid",
      "valetName": "Valet Name",
      "status": "parked",
      "entryTime": "2024-01-01T10:00:00Z",
      "parkingTime": "2024-01-01T10:15:00Z",
      "qrCode": "QR123456"
    }
  ]
}
```

### GET /vehicles/history
Get vehicle history (delivered vehicles).

**Headers:** Authorization required

**Query Parameters:**
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** Same structure as active vehicles with pagination info

### POST /vehicles
Add new vehicle entry.

**Headers:** Authorization required

**Request Body:**
```json
{
  "vehicleNumber": "MH12AB1234",
  "vehicleType": "car",
  "vehicleColor": "Black",
  "customerPhone": "+919876543210",
  "customerName": "Customer Name",
  "parkingSlotId": "uuid",
  "valetId": "uuid",
  "qrCode": "QR123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...vehicleData,
    "status": "being_assigned",
    "entryTime": "2024-01-01T10:00:00Z"
  }
}
```

### PATCH /vehicles/:id/status
Update vehicle status.

**Headers:** Authorization required

**Request Body:**
```json
{
  "status": "parking_in_progress|parked|out_for_delivery|delivered",
  "parkingTime": "2024-01-01T10:15:00Z",
  "deliveryTime": "2024-01-01T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "parked",
    ...updatedFields
  }
}
```

### GET /vehicles/:id
Get vehicle details by ID.

**Headers:** Authorization required

**Response:** Single vehicle object

### GET /vehicles/search/qr/:qrCode
Search vehicle by QR code.

**Headers:** Authorization required

**Response:** Single vehicle object or null

### GET /vehicles/search/number/:vehicleNumber
Search vehicle by vehicle number.

**Headers:** Authorization required

**Response:** Single vehicle object or null

---

## 👤 Valet (Host User) Endpoints

### GET /valets
Get all valets/host users.

**Headers:** Authorization required

**Query Parameters:**
- `role` (optional): Filter by role (valet|valet_head)
- `isActive` (optional): Filter by active status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Valet Name",
      "email": "valet@example.com",
      "phone": "+919876543210",
      "role": "valet",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /valets/active
Get only active valets.

**Headers:** Authorization required

**Response:** Same as /valets

### POST /valets
Create new valet/host user.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "Valet Name",
  "email": "valet@example.com",
  "phone": "+919876543210",
  "role": "valet|valet_head",
  "password": "SecurePass@123"
}
```

**Response:** Created valet object

### PUT /valets/:id
Update valet details.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+919876543211",
  "role": "valet_head"
}
```

**Response:** Updated valet object

### DELETE /valets/:id
Delete valet.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Valet deleted successfully"
}
```

### PATCH /valets/:id/status
Update valet active status.

**Headers:** Authorization required

**Request Body:**
```json
{
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isActive": true
  }
}
```

### GET /valets/:id/performance
Get valet performance metrics.

**Headers:** Authorization required

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "valetId": "uuid",
    "valetName": "Valet Name",
    "totalVehicles": 25,
    "avgParkingTime": 8,
    "avgDeliveryTime": 5,
    "rating": 4.5,
    "vehiclesParkedToday": 5
  }
}
```

### GET /valets/performance
Get all valets performance.

**Headers:** Authorization required

**Query Parameters:** Same as individual performance

**Response:** Array of performance objects

---

## 🅿️ Parking Slot Endpoints

### GET /parking-slots
Get all parking slots.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "A-101",
      "isAvailable": true,
      "currentVehicleId": null
    }
  ]
}
```

### POST /parking-slots
Create new parking slot.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "A-201"
}
```

**Response:** Created slot object

### PUT /parking-slots/:id
Update parking slot.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "A-201-Updated",
  "isAvailable": false,
  "currentVehicleId": "uuid"
}
```

**Response:** Updated slot object

### DELETE /parking-slots/:id
Delete parking slot.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Parking slot deleted successfully"
}
```

---

## 📊 Analytics Endpoints

### GET /analytics/metrics
Get dashboard metrics.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "activeValets": 5,
    "carsParked": 12,
    "avgParkingTime": 8,
    "avgDeliveryTime": 5,
    "totalRevenue": 5000,
    "totalScans": 150
  }
}
```

### GET /analytics/valet-performance
Get valet performance rankings.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "valetId": "uuid",
      "valetName": "Top Valet",
      "totalVehicles": 50,
      "avgParkingTime": 6,
      "rating": 4.8
    }
  ]
}
```

### GET /analytics/recent-activity
Get recent activity feed.

**Headers:** Authorization required

**Query Parameters:**
- `limit` (optional): Number of activities (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "vehicle_parked|vehicle_delivered",
      "vehicleNumber": "MH12AB1234",
      "valetName": "Valet Name",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

## 💳 Subscription Endpoints

### GET /subscription
Get current subscription details.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "active|grace_period|expired",
    "usage": {
      "usedScans": 85,
      "totalScans": 100,
      "remainingScans": 15
    },
    "billing": {
      "currentAmount": 1000,
      "basePrice": 1000,
      "additionalCharges": 0,
      "lastPaymentDate": "2024-01-01T00:00:00Z",
      "nextBillingDate": "2024-02-01T00:00:00Z"
    }
  }
}
```

### POST /subscription/payment
Process payment (Razorpay integration).

**Headers:** Authorization required

**Request Body:**
```json
{
  "amount": 1500,
  "paymentId": "razorpay_payment_id",
  "orderId": "razorpay_order_id",
  "signature": "razorpay_signature"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "amount": 1500,
    "status": "success",
    "date": "2024-01-01T00:00:00Z"
  }
}
```

### GET /subscription/payment-history
Get payment history.

**Headers:** Authorization required

**Query Parameters:**
- `page` (optional)
- `limit` (optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 1000,
      "date": "2024-01-01T00:00:00Z",
      "paymentMethod": "razorpay",
      "status": "success"
    }
  ]
}
```

---

## 🔔 WebSocket Events

### Connection
```javascript
const socket = io('wss://ws.parkluxe.com', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Events to Listen (Client)

#### vehicle:status:update
Vehicle status changed.
```json
{
  "vehicleId": "uuid",
  "status": "parked",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

#### vehicle:new:request
New vehicle entry.
```json
{
  "vehicleId": "uuid",
  "vehicleNumber": "MH12AB1234",
  "valetId": "uuid"
}
```

#### valet:assignment
Valet assigned to vehicle.
```json
{
  "vehicleId": "uuid",
  "valetId": "uuid",
  "valetName": "Valet Name"
}
```

#### notification
General notification.
```json
{
  "type": "info|success|warning|error",
  "message": "Notification message",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### Events to Emit (Client)

#### room:join
Join host-specific room.
```json
{
  "roomId": "host_uuid"
}
```

#### room:leave
Leave room.
```json
{
  "roomId": "host_uuid"
}
```

#### vehicle:status:update
Update vehicle status.
```json
{
  "vehicleId": "uuid",
  "status": "parking_in_progress"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": "Field-specific error message"
  }
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

- **Anonymous**: 10 requests/minute
- **Authenticated**: 100 requests/minute
- **Premium**: 1000 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

---

## Testing with Postman

Import the Postman collection:
```
https://api.parkluxe.com/postman-collection.json
```

---

## Support

For API issues or questions, contact: api-support@parkluxe.com
