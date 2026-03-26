const express = require('express');
const router = express.Router();
const db = require('../config/db');

const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);

module.exports = router;

module.exports = router;
