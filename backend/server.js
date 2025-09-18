const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env configuration

// ==== Route Imports ====
const deviceRoutes = require('./routes/deviceRoutes'); // For device registration and login
const userRoutes = require('./routes/userRoutes');     // For user registration and fetching

const app = express();
const PORT = process.env.PORT || 5000;

// ==== Middleware ====
app.use(cors());               // Enable CORS for frontend access
app.use(express.json());       // Parse JSON request bodies

// ==== API Routes ====
app.use('/api/devices', deviceRoutes); // All device-related routes → /api/devices/*
app.use('/api/user', userRoutes);      // All user-related routes → /api/user/*

// ==== Root Route ====
app.get('/', (req, res) => {
  res.send('✅ Softener API is running...');
});

// ==== MongoDB Connection ====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');

  // Start server only after successful DB connection
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
});
