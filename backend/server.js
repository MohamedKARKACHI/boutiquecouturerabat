const express = require('express');
const cors = require('cors');
const setupDatabase = require('./config/setup');
require('dotenv').config();

// Initialize DB
setupDatabase();

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', /\.vercel\.app$/],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
