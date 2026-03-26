const db = require('../config/db');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let query = `
      SELECT p.*, c.name as category_name, c.name_en as category_name_en, 
      GROUP_CONCAT(col.hex_code) as colors
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_colors pc ON p.id = pc.product_id
      LEFT JOIN colors col ON pc.color_id = col.id
    `;
    
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }
    if (minPrice) {
      conditions.push('p.price >= ?');
      params.push(minPrice);
    }
    if (maxPrice) {
      conditions.push('p.price <= ?');
      params.push(maxPrice);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY p.id';

    const [products] = await db.query(query, params);
    
    const formattedProducts = products.map(p => ({
      ...p,
      colors: p.colors ? p.colors.split(',') : []
    }));

    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (product.length === 0) return res.status(404).json({ message: 'Product not found' });

    const [images] = await db.query('SELECT id, image_path FROM product_images WHERE product_id = ?', [req.params.id]);
    const [colors] = await db.query(`
      SELECT c.name, c.hex_code 
      FROM colors c 
      JOIN product_colors pc ON c.id = pc.color_id 
      WHERE pc.product_id = ?`, [req.params.id]);

    res.json({
      ...product[0],
      images: images.map(img => ({ id: img.id, path: img.image_path })),
      colors: colors
    });
  } catch (error) {
    next(error);
  }
};
