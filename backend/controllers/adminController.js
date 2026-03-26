const db = require('../config/db');

// ── PRODUCTS ──

exports.createProduct = async (req, res, next) => {
  try {
    const { title, slug, price, category_id, description, in_stock, is_featured } = req.body;
    const main_image = req.files['image'] ? req.files['image'][0].filename : '';

    const [result] = await db.query(
      `INSERT INTO products (title, slug, price, category_id, description, main_image, in_stock, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, price, category_id, description, main_image, in_stock === 'true', is_featured === 'true']
    );

    const productId = result.insertId;

    if (req.files['gallery']) {
      const galleryQueries = req.files['gallery'].map(file => {
        return db.query('INSERT INTO product_images (product_id, image_path) VALUES (?, ?)', [productId, file.filename]);
      });
      await Promise.all(galleryQueries);
    }

    res.status(201).json({ id: productId, message: 'Product created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { title, slug, price, category_id, description, in_stock, is_featured, remove_images } = req.body;
    
    let query = `UPDATE products SET title=?, slug=?, price=?, category_id=?, description=?, in_stock=?, is_featured=?`;
    const params = [title, slug, price, category_id, description, in_stock === 'true', is_featured === 'true'];

    if (req.files['image']) {
      query += `, main_image=?`;
      params.push(req.files['image'][0].filename);
    }

    query += ` WHERE id=?`;
    params.push(productId);

    await db.query(query, params);

    if (remove_images) {
      const imageIds = JSON.parse(remove_images);
      if (imageIds.length > 0) {
        // Note: For simplicity, we just delete the paths. In real app, delete files too.
        await db.query('DELETE FROM product_images WHERE image_path IN (?)', [imageIds]);
      }
    }

    if (req.files['gallery']) {
      const galleryQueries = req.files['gallery'].map(file => {
        return db.query('INSERT INTO product_images (product_id, image_path) VALUES (?, ?)', [productId, file.filename]);
      });
      await Promise.all(galleryQueries);
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ── CATEGORIES ──

exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const image = req.file ? req.file.filename : '';
    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
      [name, slug, description, image]
    );
    res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
  } catch (error) {
    next(error);
  }
};

// ── GALLERY ──

exports.createGalleryItem = async (req, res, next) => {
  try {
    const { alt_text, order_index } = req.body;
    const image_path = req.file ? req.file.filename : '';
    await db.query(
      'INSERT INTO gallery (image_path, alt_text, order_index) VALUES (?, ?, ?)',
      [image_path, alt_text, order_index || 0]
    );
    res.status(201).json({ message: 'Item added to gallery' });
  } catch (error) {
    next(error);
  }
};
