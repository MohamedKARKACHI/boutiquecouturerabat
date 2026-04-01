const db = require('../config/db');

// ── PRODUCTS ──

exports.createProduct = async (req, res, next) => {
  try {
    const { title, title_en, slug, price, category_id, description, description_en, in_stock, is_featured, old_price, promo_active } = req.body;
    const main_image = req.files?.['image']?.[0]?.filename || '';

    const [result] = await db.query(
      `INSERT INTO products (title, title_en, slug, price, category_id, description, description_en, main_image, in_stock, is_featured, old_price, promo_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, title_en || '', slug, price, category_id, description || '', description_en || '', main_image, in_stock === 'true', is_featured === 'true', old_price || null, promo_active === 'true']
    );

    const productId = result.insertId;

    if (req.files?.['gallery']) {
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
    const { title, title_en, slug, price, category_id, description, description_en, in_stock, is_featured, remove_images, old_price, promo_active } = req.body;
    
    let query = `UPDATE products SET title=?, title_en=?, slug=?, price=?, category_id=?, description=?, description_en=?, in_stock=?, is_featured=?, old_price=?, promo_active=?`;
    const params = [title, title_en || '', slug, price, category_id, description || '', description_en || '', in_stock === 'true', is_featured === 'true', old_price || null, promo_active === 'true'];

    if (req.files?.['image']) {
      query += `, main_image=?`;
      params.push(req.files['image'][0].filename);
    }

    query += ` WHERE id=?`;
    params.push(productId);

    await db.query(query, params);

    // Remove selected gallery images by ID (not by path)
    if (remove_images) {
      const imageIds = JSON.parse(remove_images);
      if (imageIds.length > 0) {
        await db.query('DELETE FROM product_images WHERE id IN (?)', [imageIds]);
      }
    }

    // Add new gallery images
    if (req.files?.['gallery']) {
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
    const { name, name_en, slug, description, description_en } = req.body;
    const image = req.file ? req.file.filename : '';
    const [result] = await db.query(
      'INSERT INTO categories (name, name_en, slug, description, description_en, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, name_en || '', slug, description || '', description_en || '', image]
    );
    res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name, name_en, slug, description, description_en } = req.body;

    let query = 'UPDATE categories SET name=?, name_en=?, slug=?, description=?, description_en=?';
    const params = [name, name_en || '', slug, description || '', description_en || ''];

    if (req.file) {
      query += ', image=?';
      params.push(req.file.filename);
    }

    query += ' WHERE id=?';
    params.push(categoryId);

    await db.query(query, params);
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ── GALLERY ──

exports.createGalleryItem = async (req, res, next) => {
  try {
    const { alt_text, alt_text_en, order_index } = req.body;
    const image_path = req.file ? req.file.filename : '';
    await db.query(
      'INSERT INTO gallery (image_path, alt_text, alt_text_en, order_index) VALUES (?, ?, ?, ?)',
      [image_path, alt_text || '', alt_text_en || '', order_index || 0]
    );
    res.status(201).json({ message: 'Item added to gallery' });
  } catch (error) {
    next(error);
  }
};

exports.updateGalleryItem = async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const { alt_text, alt_text_en, order_index } = req.body;

    let query = 'UPDATE gallery SET alt_text=?, alt_text_en=?, order_index=?';
    const params = [alt_text || '', alt_text_en || '', order_index || 0];

    if (req.file) {
      query += ', image_path=?';
      params.push(req.file.filename);
    }

    query += ' WHERE id=?';
    params.push(itemId);

    await db.query(query, params);
    res.json({ message: 'Gallery item updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteGalleryItem = async (req, res, next) => {
  try {
    await db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
