const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const fs = require("fs");
const { PORT } = require("./config/env");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Load OpenAPI spec safely so docs issues do not crash the service.
const openApiCandidates = [
  path.join(__dirname, "../openapi.yaml"),
  path.join(__dirname, "../../openapi.yaml"),
];

let swaggerDocument = null;
for (const candidate of openApiCandidates) {
  if (fs.existsSync(candidate)) {
    swaggerDocument = YAML.load(candidate);
    break;
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Swagger UI documentation
if (swaggerDocument) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Product Service API Docs"
  }));
} else {
  console.warn("OpenAPI spec not found. /api-docs is disabled.");
}

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
