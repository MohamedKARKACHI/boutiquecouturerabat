const express = require('express');
const router = express.Router();
const db = require('../config/db');

const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

module.exports = router;

module.exports = router;
