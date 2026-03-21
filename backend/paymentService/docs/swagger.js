const swaggerUi = require("swagger-ui-express");

const PORT = process.env.PORT || 5002;
const BASE_URL = process.env.PAYMENT_SERVICE_BASE_URL || `http://localhost:${PORT}`;

const swaggerSpec = {
	openapi: "3.0.3",
	info: {
		title: "Payment Service API",
		version: "1.0.0",
		description:
			"API contract for Payment Service endpoints used to process and manage order payments.",
	},
	servers: [
		{
			url: BASE_URL,
			description: "Payment service base URL",
		},
	],
	tags: [
		{
			name: "Health",
			description: "Service health endpoints",
		},
		{
			name: "Payments",
			description: "Payment processing and retrieval endpoints",
		},
		{
			name: "Admin",
			description: "Administrative payment operations",
		},
	],
	paths: {
		"/": {
			get: {
				tags: ["Health"],
				summary: "Service root",
				description: "Returns a simple message indicating the Payment service is running.",
				responses: {
					200: {
						description: "Service is reachable",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									example: "Payment Service API",
								},
							},
						},
					},
				},
			},
		},
		"/api/payments/health": {
			get: {
				tags: ["Health"],
				summary: "Health check",
				description: "Returns service health status and current timestamp.",
				responses: {
					200: {
						description: "Service is healthy",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/HealthResponse",
								},
							},
						},
					},
				},
			},
		},
		"/api/payments/process": {
			post: {
				tags: ["Payments"],
				summary: "Process payment",
				description:
					"Creates a new payment transaction for an order. Requires a Bearer token.",
				security: [
					{
						BearerAuth: [],
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ProcessPaymentRequest",
							},
						},
					},
				},
				responses: {
					201: {
						description: "Payment processed",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Payment",
								},
							},
						},
					},
					400: {
						description: "Validation error",
						content: {
							"application/json": {
								schema: {
									oneOf: [
										{ $ref: "#/components/schemas/ErrorResponse" },
										{ $ref: "#/components/schemas/MissingFieldsError" },
									],
								},
								examples: {
									missingFields: {
										summary: "Missing required fields",
										value: {
											error: "Missing required fields",
											missingFields: ["orderId", "paymentMethod"],
											message: "Missing required fields: orderId, paymentMethod",
										},
									},
									invalidEmail: {
										summary: "Invalid email",
										value: {
											error: "Invalid email address",
										},
									},
									invalidAmount: {
										summary: "Invalid amount",
										value: {
											error: "Amount must be greater than 0",
										},
									},
								},
							},
						},
					},
					401: {
						description: "Unauthorized",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								examples: {
									noToken: {
										value: {
											error: "Not authorized, no token provided",
										},
									},
									invalidToken: {
										value: {
											error: "Not authorized, token invalid or expired",
										},
									},
								},
							},
						},
					},
					409: {
						description: "Payment already exists for order",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								example: {
									error: "Payment already processed for this order",
								},
							},
						},
					},
					500: {
						description: "Internal server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								example: {
									error: "Internal server error",
								},
							},
						},
					},
				},
			},
		},
		"/api/payments/transaction/{transactionId}": {
			get: {
				tags: ["Payments"],
				summary: "Get payment by transaction ID",
				parameters: [
					{
						name: "transactionId",
						in: "path",
						required: true,
						description: "Transaction ID (for example: TXNABC12345)",
						schema: {
							type: "string",
						},
					},
				],
				responses: {
					200: {
						description: "Payment found",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Payment",
								},
							},
						},
					},
					400: {
						description: "Invalid request",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								example: {
									error: "transactionId is required",
								},
							},
						},
					},
					404: {
						description: "Payment not found",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								example: {
									error: "Payment not found",
								},
							},
						},
					},
					500: {
						description: "Internal server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
							},
						},
					},
				},
			},
		},
		"/api/payments/{id}": {
			get: {
				tags: ["Payments"],
				summary: "Get payment by MongoDB ID",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						description: "Payment document ID",
						schema: {
							type: "string",
						},
					},
				],
				responses: {
					200: {
						description: "Payment found",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Payment",
								},
							},
						},
					},
					404: {
						description: "Payment not found",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								example: {
									error: "Payment not found",
								},
							},
						},
					},
					500: {
						description: "Internal server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
							},
						},
					},
				},
			},
		},
		"/api/payments/{id}/status": {
			put: {
				tags: ["Admin"],
				summary: "Update payment status",
				description:
					"Updates payment status. Requires a Bearer token for an admin user.",
				security: [
					{
						BearerAuth: [],
					},
				],
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						description: "Payment document ID",
						schema: {
							type: "string",
						},
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UpdatePaymentStatusRequest",
							},
						},
					},
				},
				responses: {
					200: {
						description: "Payment status updated",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Payment",
								},
							},
						},
					},
					400: {
						description: "Invalid status value",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								example: {
									error: "Invalid status value",
								},
							},
						},
					},
					401: {
						description: "Unauthorized",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
							},
						},
					},
					403: {
						description: "Admin access required",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								example: {
									error: "Access denied. Admin privileges required.",
								},
							},
						},
					},
					404: {
						description: "Payment not found",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
								example: {
									error: "Payment not found",
								},
							},
						},
					},
					500: {
						description: "Internal server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
							},
						},
					},
				},
			},
		},
	},
	components: {
		securitySchemes: {
			BearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		schemas: {
			ProcessPaymentRequest: {
				type: "object",
				required: ["orderId", "userId", "email", "amount", "paymentMethod"],
				properties: {
					orderId: {
						type: "string",
						example: "ORD-10001",
					},
					userId: {
						type: "string",
						example: "USR-20001",
					},
					email: {
						type: "string",
						format: "email",
						example: "customer@example.com",
					},
					amount: {
						type: "number",
						format: "double",
						minimum: 0.01,
						example: 125.5,
					},
					paymentMethod: {
						type: "string",
						example: "CARD",
					},
				},
			},
			UpdatePaymentStatusRequest: {
				type: "object",
				required: ["status"],
				properties: {
					status: {
						type: "string",
						enum: ["SUCCESS", "FAILED", "REFUNDED"],
						example: "REFUNDED",
					},
				},
			},
			Payment: {
				type: "object",
				properties: {
					_id: {
						type: "string",
						example: "680a3d8eb7054578f17ddab9",
					},
					orderId: {
						type: "string",
						example: "ORD-10001",
					},
					userId: {
						type: "string",
						example: "USR-20001",
					},
					email: {
						type: "string",
						format: "email",
						example: "customer@example.com",
					},
					amount: {
						type: "number",
						format: "double",
						example: 125.5,
					},
					paymentMethod: {
						type: "string",
						example: "CARD",
					},
					transactionId: {
						type: "string",
						example: "TXN9F2A1B3CD",
					},
					status: {
						type: "string",
						example: "SUCCESS",
					},
					createdAt: {
						type: "string",
						format: "date-time",
						example: "2026-04-26T10:20:30.000Z",
					},
					updatedAt: {
						type: "string",
						format: "date-time",
						example: "2026-04-26T10:20:30.000Z",
					},
				},
			},
			HealthResponse: {
				type: "object",
				properties: {
					status: {
						type: "string",
						example: "healthy",
					},
					service: {
						type: "string",
						example: "payment",
					},
					timestamp: {
						type: "string",
						format: "date-time",
						example: "2026-04-26T10:20:30.000Z",
					},
				},
			},
			ErrorResponse: {
				type: "object",
				properties: {
					error: {
						type: "string",
						example: "Internal server error",
					},
				},
			},
			MissingFieldsError: {
				type: "object",
				properties: {
					error: {
						type: "string",
						example: "Missing required fields",
					},
					missingFields: {
						type: "array",
						items: {
							type: "string",
						},
						example: ["orderId", "paymentMethod"],
					},
					message: {
						type: "string",
						example: "Missing required fields: orderId, paymentMethod",
					},
				},
			},
		},
	},
};

const swaggerUiOptions = {
	explorer: true,
	customSiteTitle: "Payment Service API Docs",
};

function setupSwagger(app) {
	app.use("/api/payments/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
}

module.exports = {
	swaggerSpec,
	setupSwagger,
};
