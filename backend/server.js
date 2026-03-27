const express = require('express');
const cors = require('cors');
const setupDatabase = require('./config/setup');
require('dotenv').config();

// Initialize DB
setupDatabase();

const app = express();

// Middleware
const allowedOrigins = [
  'https://boutiquecouturerabat.vercel.app',
  'https://boutique-couture-rabat.vercel.app',
  'https://www.boutiquecouturerabat.me',
  'https://boutiquecouturerabat.me',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// Routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const galleryRoutes = require('./routes/gallery');
const adminRoutes = require('./routes/admin');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Boussete Couture API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
