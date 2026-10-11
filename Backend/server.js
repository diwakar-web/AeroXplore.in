require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./DB/connect');

const subscribeRoutes = require('./Routes/subscribeRoutes');
const contactRoutes = require('./Routes/contactRoutes');
const blogStatRoutes = require('./Routes/blogStatRoutes');
const authRoutes = require('./Routes/authRoutes');
const articleRoutes = require('./Routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      ['https://aeroxplore.in', 'https://www.aeroxplore.in'].includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Explicitly handle all OPTIONS preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AeroXplore Backend is running' });
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection error' });
  }
});

app.use('/api', subscribeRoutes);
app.use('/api', contactRoutes);
app.use('/api', blogStatRoutes);
app.use('/api', authRoutes);
app.use('/api', articleRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Vercel Serverless environments expect the app to be exported
// connectDB() is now handled by middleware above

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`AeroXplore Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
