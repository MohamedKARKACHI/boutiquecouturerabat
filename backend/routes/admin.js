const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const colorController = require('../controllers/colorController');

// Apply auth middleware to all admin routes
router.use(adminAuth);

// ── PRODUCTS CRUD ──
router.post('/products', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), adminController.createProduct);
router.put('/products/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// ── CATEGORIES CRUD ──
router.post('/categories', upload.single('image'), adminController.createCategory);
router.put('/categories/:id', upload.single('image'), adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// ── GALLERY CRUD ──
router.post('/gallery', upload.single('image'), adminController.createGalleryItem);
router.put('/gallery/:id', upload.single('image'), adminController.updateGalleryItem);
router.delete('/gallery/:id', adminController.deleteGalleryItem);

// ── COLORS CRUD ──
router.post('/colors', colorController.createColor);
router.put('/colors/:id', colorController.updateColor);
router.delete('/colors/:id', colorController.deleteColor);

// ── HERO SLIDES ──
router.get('/hero', adminController.getHeroSlides);
router.post('/hero', upload.single('image'), adminController.createHeroSlide);
router.put('/hero/:id', upload.single('image'), adminController.updateHeroSlide);
router.delete('/hero/:id', adminController.deleteHeroSlide);

// ── SETTINGS ──
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
