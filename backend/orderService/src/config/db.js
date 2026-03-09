const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(MONGO_URI);
    console.log("Order DB connected");
  } catch (error) {
    console.error("[OrderService.DB] Connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;