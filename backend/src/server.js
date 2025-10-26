require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const chatbotRoutes = require('./routes/chatbotRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/emails', emailRoutes);

const PORT = process.env.PORT || 5000;

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
  }
};

start();
app.use(errorMiddleware);
module.exports = app;
