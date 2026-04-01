const db = require('../config/db');

exports.getColors = async (req, res, next) => {
  try {
    const [colors] = await db.query('SELECT * FROM colors ORDER BY name ASC');
    res.json(colors);
  } catch (error) {
    next(error);
  }
};

exports.createColor = async (req, res, next) => {
  try {
    const { name, hex_code } = req.body;
    if (!name || !hex_code) {
      return res.status(400).json({ message: 'Name and Hex code are required' });
    }

    const [result] = await db.query('INSERT INTO colors (name, hex_code) VALUES (?, ?)', [name, hex_code]);
    res.status(201).json({ id: result.insertId, name, hex_code, message: 'Color created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateColor = async (req, res, next) => {
  try {
    const colorId = req.params.id;
    const { name, hex_code } = req.body;

    if (!name || !hex_code) {
      return res.status(400).json({ message: 'Name and Hex code are required' });
    }

    await db.query('UPDATE colors SET name=?, hex_code=? WHERE id=?', [name, hex_code, colorId]);
    res.json({ message: 'Color updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteColor = async (req, res, next) => {
  try {
    await db.query('DELETE FROM colors WHERE id=?', [req.params.id]);
    res.json({ message: 'Color deleted successfully' });
  } catch (error) {
    next(error);
  }
};
