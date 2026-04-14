require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./DB/connect');

const subscribeRoutes = require('./Routes/subscribeRoutes');
const contactRoutes = require('./Routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://aeroxplore.in', 'https://www.aeroxplore.in'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AeroXplore Backend is running ✅' });
});

app.use('/api', subscribeRoutes);
app.use('/api', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 AeroXplore Backend running on http://localhost:${PORT}`);
  });
};

start();
