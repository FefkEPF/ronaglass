// routes/admin.js
const express = require('express');
const router = express.Router();

// Dashboard (renders admin_dashboard view, settings already in res.locals)
router.get('/', (req, res) => {
  res.render('admin_dashboard');
});

// Update a setting (key/value)
router.post('/settings', async (req, res) => {
  const { key, value } = req.body;
  if (key) {
    const pool = req.app.locals.pool;
    await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)', [key, value]);
  }
  res.redirect('/admin');
});

// Delete a setting
router.post('/settings/delete', async (req, res) => {
  const { key } = req.body;
  if (key) {
    const pool = req.app.locals.pool;
    await pool.query('DELETE FROM settings WHERE `key` = ?', [key]);
  }
  res.redirect('/admin');
});

module.exports = router;
