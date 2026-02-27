# API Gateway

The API Gateway serves as the single entry point for all client requests to the CloudCart E-commerce microservices.

## Features

- **Request Routing**: Routes requests to appropriate microservices
- **CORS Support**: Handles Cross-Origin Resource Sharing
- **Error Handling**: Centralized error handling and service unavailability responses
- **Health Checks**: Built-in health check endpoint
- **Logging**: Request logging for monitoring

## Architecture

The API Gateway proxies requests to the following services:

- **Product Service**: `/api/products/*`
- **User Service**: `/api/users/*`
- **Order Service**: `/api/orders/*`
- **Payment Service**: `/api/payments/*`

## Setup

### Prerequisites

- Node.js 18+ installed
- Access to microservice endpoints

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
PRODUCT_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
```

### Running Locally

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Docker

Build and run using Docker:

```bash
# Build image
docker build -t api-gateway .

# Run container
docker run -p 3000:3000 --env-file .env api-gateway
```

## API Endpoints

### Health Check

```
GET /health
```

Returns the health status of the API Gateway and configured service URLs.

### Service Routes

All requests are proxied to their respective services:

- `GET/POST/PUT/DELETE /api/products/*` → Product Service
- `GET/POST/PUT/DELETE /api/users/*` → User Service
- `GET/POST/PUT/DELETE /api/orders/*` → Order Service
- `GET/POST/PUT/DELETE /api/payments/*` → Payment Service

## Error Handling

The API Gateway handles service unavailability gracefully:

- Returns `503 Service Unavailable` if a microservice is down
- Returns `404 Not Found` for undefined routes
- Returns `500 Internal Server Error` for unexpected errors

## Testing

Test the API Gateway:

```bash
# Health check
curl http://localhost:3000/health

# Test product service routing
curl http://localhost:3000/api/products
```

## Monitoring

The API Gateway logs all incoming requests with timestamps and HTTP methods for monitoring and debugging purposes.
