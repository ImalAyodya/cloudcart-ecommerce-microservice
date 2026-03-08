# Payment Service Authentication Setup

## Overview
This payment service now requires Bearer token authentication for all payment-related endpoints. The service validates tokens by calling the User Service API.

## How It Works
1. User logs in through User Service and receives a JWT token
2. User includes the token in payment requests
3. Payment Service validates the token by calling User Service's `/api/auth/profile` endpoint
4. If valid, the payment operation proceeds with authenticated user data available

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend/paymentService
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/paymentService` directory:

```env
PORT=5002
MONGO_URI=your_mongodb_connection_string
USER_SERVICE_URL=http://localhost:5001
```

**IMPORTANT:** Set `USER_SERVICE_URL` to point to your running User Service instance.

### 3. How to Use the APIs

#### Get Bearer Token
First, login through your User Service to get a token:

```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response will include a `token` field:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Use Token in Payment API Requests
Include the token in the `Authorization` header with `Bearer` prefix:

```bash
POST http://localhost:5002/payments/process
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "orderId": "ORD123",
  "userId": "user_id_here",
  "email": "user@example.com",
  "amount": 99.99,
  "paymentMethod": "credit_card"
}
```

## Protected Endpoints

### 1. Process Payment (POST /payments/process)
- **Authentication:** Required (Bearer token)
- **Access:** Any authenticated user
- **Description:** Process a new payment

### 2. Get Payment Details (GET /payments/:id)
- **Authentication:** Required (Bearer token)
- **Access:** Any authenticated user
- **Description:** Retrieve payment details by ID

### 3. Update Payment Status (PUT /payments/:id/status)
- **Authentication:** Required (Bearer token)
- **Access:** Admin only
- **Description:** Update payment status (admin function)

## Frontend Integration

When making payment requests from your frontend, include the token from localStorage:

```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5002/payments/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(paymentData)
});
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Not authorized, no token provided"
}
```
or
```json
{
  "error": "Not authorized, token invalid or expired"
}
```

### 403 Forbidden (Admin only routes)
```json
{
  "error": "Access denied. Admin privileges required."
}
```

## Testing with Postman

1. **Login to get token:**
   - Method: POST
   - URL: `http://localhost:5001/api/auth/login`
   - Body: `{ "email": "...", "password": "..." }`
   - Copy the token from response

2. **Use token in payment requests:**
   - Method: POST
   - URL: `http://localhost:5002/payments/process`
   - Headers: `Authorization: Bearer <paste_token_here>`
   - Body: Your payment data

## Notes

- Tokens expire after 7 days by default (configurable in User Service)
- All payment endpoints now require authentication
- Admin routes require both authentication AND admin role
- The middleware validates the token and attaches user info to `req.user`
