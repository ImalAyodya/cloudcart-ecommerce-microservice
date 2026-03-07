const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const paymentRoutes = require('./routes/paymentRoutes');
const healthRoutes = require('./routes/healthRoutes');
const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://sithmaka:sithmaka1122@cluster.pvqvoqf.mongodb.net/personal_finance_tracker?retryWrites=true&w=majority'; // Change as needed
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Health routes (must be before paymentRoutes to avoid /:id catching /health)
app.use('/payments', healthRoutes);

// Payment routes (now protected with authentication)
app.use('/payments', paymentRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Payment Service API');
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});