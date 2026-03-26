const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/upload');

// ── PRODUCTS CRUD ──

// Create
router.post('/products', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
  try {
    const { title, title_en, slug, price, category_id, description, description_en, in_stock, is_featured } = req.body;
    const main_image = req.files['image'] ? req.files['image'][0].filename : '';

    const [result] = await db.query(
      `INSERT INTO products (title, title_en, slug, price, category_id, description, description_en, main_image, in_stock, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, title_en, slug, price, category_id, description, description_en, main_image, in_stock === 'true', is_featured === 'true']
    );

    const productId = result.insertId;

    // Handle Gallery Images
    if (req.files['gallery']) {
      const galleryQueries = req.files['gallery'].map(file => {
        return db.query('INSERT INTO product_images (product_id, image_path) VALUES (?, ?)', [productId, file.filename]);
      });
      await Promise.all(galleryQueries);
    }

    res.status(201).json({ id: productId, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put('/products/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, title_en, slug, price, category_id, description, description_en, in_stock, is_featured, remove_images } = req.body;
    
    let query = `UPDATE products SET title=?, title_en=?, slug=?, price=?, category_id=?, description=?, description_en=?, in_stock=?, is_featured=?`;
    const params = [title, title_en, slug, price, category_id, description, description_en, in_stock === 'true', is_featured === 'true'];

    if (req.files['image']) {
      query += `, main_image=?`;
      params.push(req.files['image'][0].filename);
    }

    query += ` WHERE id=?`;
    params.push(productId);

    await db.query(query, params);

    // Remove selected images if any
    if (remove_images) {
      const imageIds = JSON.parse(remove_images);
      if (imageIds.length > 0) {
        await db.query('DELETE FROM product_images WHERE id IN (?)', [imageIds]);
      }
    }

    // Add new gallery images
    if (req.files['gallery']) {
      const galleryQueries = req.files['gallery'].map(file => {
        return db.query('INSERT INTO product_images (product_id, image_path) VALUES (?, ?)', [productId, file.filename]);
      });
      await Promise.all(galleryQueries);
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete('/products/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── CATEGORIES CRUD ──

router.post('/categories', upload.single('image'), async (req, res) => {
  try {
    const { name, name_en, slug, description, description_en } = req.body;
    const image = req.file ? req.file.filename : '';
    const [result] = await db.query(
      'INSERT INTO categories (name, name_en, slug, description, description_en, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, name_en, slug, description, description_en, image]
    );
    res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GALLERY CRUD ──

router.post('/gallery', upload.single('image'), async (req, res) => {
  try {
    const { alt_text, alt_text_en, order_index } = req.body;
    const image_path = req.file ? req.file.filename : '';
    await db.query(
      'INSERT INTO gallery (image_path, alt_text, alt_text_en, order_index) VALUES (?, ?, ?, ?)',
      [image_path, alt_text, alt_text_en, order_index || 0]
    );
    res.status(201).json({ message: 'Item added to gallery' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
