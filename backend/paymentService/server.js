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
const mongoURI = 'mongodb+srv://pasanamarasinghe2003_db_user:Psn%402003@paymentservice.esjdvkw.mongodb.net/'; // Change as needed
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Health routes (must be before paymentRoutes to avoid /:id catching /health)
app.use('/api/payments', healthRoutes);

// Payment routes
app.use('/api/payments', paymentRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Payment Service API');
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});