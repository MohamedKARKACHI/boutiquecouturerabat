const db = require('../config/db');

exports.getGallery = async (req, res, next) => {
  try {
    const [items] = await db.query('SELECT * FROM gallery ORDER BY order_index ASC');
    res.json(items);
  } catch (error) {
    next(error);
  }
};
