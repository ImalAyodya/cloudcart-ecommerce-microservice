# Notification Service

A centralized microservice for handling all notification operations (emails, SMS, push notifications, etc.) across the CloudCart e-commerce platform.

## Features

- 📧 **Email Notifications**: Send various types of emails using Gmail SMTP
- 🔐 **Secure Configuration**: Email credentials stored in environment variables
- 🎨 **Beautiful Templates**: Professional HTML email templates
- 🚀 **RESTful API**: Easy integration with other microservices
- ✅ **Health Monitoring**: Built-in health check endpoints

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `notificationService` folder with the following:

```env
PORT=5004
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

### 3. Generate Gmail App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password and paste it in `EMAIL_PASSWORD`

## Running the Service

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The service will run on `http://localhost:5004`

## API Endpoints

### Health Check
```http
GET /api/health
```

### Send Generic Email
```http
POST /api/notifications/send-email
Content-Type: application/json

{
  "to": "customer@example.com",
  "subject": "Test Email",
  "html": "<h1>Hello!</h1><p>This is a test email.</p>",
  "text": "Hello! This is a test email."
}
```

### Send Payment Receipt
```http
POST /api/notifications/send-payment-receipt
Content-Type: application/json

{
  "recipientEmail": "customer@example.com",
  "paymentDetails": {
    "orderId": "ORD-12345",
    "transactionId": "TXN-67890",
    "amount": 99.99,
    "paymentMethod": "Credit Card",
    "status": "SUCCESS",
    "createdAt": "2026-03-01T10:30:00Z"
  }
}
```

### Send Order Confirmation
```http
POST /api/notifications/send-order-confirmation
Content-Type: application/json

{
  "recipientEmail": "customer@example.com",
  "orderDetails": {
    "orderId": "ORD-12345",
    "items": [
      { "name": "Product 1", "quantity": 2, "price": 29.99 },
      { "name": "Product 2", "quantity": 1, "price": 49.99 }
    ],
    "totalAmount": 109.97,
    "shippingAddress": "123 Main St, City, State 12345",
    "createdAt": "2026-03-01T10:30:00Z"
  }
}
```

### Send Welcome Email
```http
POST /api/notifications/send-welcome-email
Content-Type: application/json

{
  "recipientEmail": "newuser@example.com",
  "userName": "John Doe"
}
```

### Send Password Reset
```http
POST /api/notifications/send-password-reset
Content-Type: application/json

{
  "recipientEmail": "user@example.com",
  "resetLink": "http://localhost:5173/reset-password?token=abc123"
}
```

## Integration with Other Services

### Example: Calling from Payment Service

```javascript
const axios = require('axios');

// Send payment receipt after successful payment
async function notifyPaymentSuccess(email, paymentData) {
  try {
    const response = await axios.post(
      'http://localhost:5004/api/notifications/send-payment-receipt',
      {
        recipientEmail: email,
        paymentDetails: paymentData
      }
    );
    console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Failed to send notification:', error.message);
  }
}
```

### Example: Calling from User Service

```javascript
const axios = require('axios');

// Send welcome email to new user
async function sendWelcomeToNewUser(email, name) {
  try {
    await axios.post(
      'http://localhost:5004/api/notifications/send-welcome-email',
      {
        recipientEmail: email,
        userName: name
      }
    );
  } catch (error) {
    console.error('Welcome email failed:', error.message);
  }
}
```

## Project Structure

```
notificationService/
├── .env                          # Environment configuration
├── package.json                  # Dependencies
├── server.js                     # Main server file
├── README.md                     # Documentation
├── controllers/
│   ├── healthController.js       # Health check logic
│   └── notificationController.js # Notification handlers
├── routes/
│   ├── healthRoutes.js          # Health endpoints
│   └── notificationRoutes.js    # Notification endpoints
└── utils/
    └── emailService.js          # Email sending logic
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## Security Best Practices

1. ✅ Never commit `.env` file to version control
2. ✅ Use Gmail App Passwords, not regular passwords
3. ✅ Enable 2-Factor Authentication on your Google account
4. ✅ Rotate credentials regularly
5. ✅ Use environment-specific configurations

## Troubleshooting

### Email not sending?
- Check that `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly in `.env`
- Verify you're using an App Password, not your regular Gmail password
- Ensure 2-Step Verification is enabled on your Google account
- Check the console logs for detailed error messages

### Connection refused?
- Make sure the service is running on the correct port
- Check that no other service is using port 5004
- Verify firewall settings

## License

ISC
