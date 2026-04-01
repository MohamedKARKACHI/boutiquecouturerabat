const express = require('express');
const cors = require('cors');
const path = require('path');
const setupDatabase = require('./config/setup');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://boutiquecouturerabat.vercel.app',
  'https://boutique-couture-rabat.vercel.app',
  'https://www.boutiquecouturerabat.me',
  'https://boutiquecouturerabat.me',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Static files with cache headers (1 day for images)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const galleryRoutes = require('./routes/gallery');
const adminRoutes = require('./routes/admin');
const colorRoutes = require('./routes/colors');
const authRoutes = require('./routes/auth');
const heroRoutes = require('./routes/hero');
const settingsRoutes = require('./routes/settings');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Boussete Couture API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle multer file size errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
  }
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Initialize DB then start server
const PORT = process.env.PORT || 3000;

setupDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database setup failed, starting server without DB:', err.message);
    // Start server anyway — API will return errors on DB queries, but won't crash
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (DB unavailable)`);
    });
  });
