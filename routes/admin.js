// routes/admin.js
const express = require('express');
const router = express.Router();

// Dashboard (renders admin_dashboard view, settings already in res.locals)
router.get('/', async (req, res) => {
  let leads = [];
  try {
    const pool = req.app.locals.pool;
    [leads] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 200');
  } catch (err) {
    // DB yoksa boş listeyle devam et
  }
  res.render('admin_dashboard', { leads });
});

// Delete a lead
router.post('/leads/delete', async (req, res) => {
  const { id } = req.body;
  if (id) {
    const pool = req.app.locals.pool;
    await pool.query('DELETE FROM leads WHERE id = ?', [id]);
  }
  res.redirect('/admin');
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
