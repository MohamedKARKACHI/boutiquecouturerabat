const db = require('../config/db');

exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
