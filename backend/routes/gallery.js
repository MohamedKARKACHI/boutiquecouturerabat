const express = require('express');
const router = express.Router();
const db = require('../config/db');

const galleryController = require('../controllers/galleryController');

router.get('/', galleryController.getGallery);

module.exports = router;

module.exports = router;
