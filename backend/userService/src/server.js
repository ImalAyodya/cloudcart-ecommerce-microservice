const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users/health", healthRoutes);
app.use("/api/users", userRoutes);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
  });
});

module.exports = app;
