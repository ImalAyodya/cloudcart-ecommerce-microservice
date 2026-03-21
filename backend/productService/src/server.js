const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const { PORT } = require("./config/env");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, "../openapi.yaml"));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Swagger UI documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Product Service API Docs"
}));

// Routes
app.use("/api/products/health", healthRoutes);
app.use("/api/products", productRoutes);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
  });
});

module.exports = app;
