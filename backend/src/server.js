const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // Enable CORS for all origins

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// User routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
connectDB();

// Define port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));