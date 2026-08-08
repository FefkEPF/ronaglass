// server.js
require('dotenv').config();
const express = require('express');
// const session = require('express-session'); // removed in favor of JWT
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session for admin auth (simple in‑memory store, OK for cPanel shared hosting)
// JWT based authentication; using cookies to store token
app.use(cookieParser());

// MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
app.locals.pool = pool;

// Middleware to protect admin routes
function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.redirect('/admin/login');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret');
    req.admin = payload.admin;
    return next();
  } catch (err) {
    return res.redirect('/admin/login');
  }
}

// Global settings middleware
app.use(async (req, res, next) => {
  // Skip static assets and admin login
  if (req.path.match(/\.(js|css|png|jpg|jpeg|mp4|webm|svg)$/) || req.path === '/admin/login') {
    return next();
  }
  try {
    const [rows] = await pool.query('SELECT * FROM settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.locals.settings = settings;
  } catch (err) {
    console.error(err);
    res.locals.settings = {};
  }
  next();
});

// Front-page
app.get(['/', '/index', '/index.html'], (req, res) => {
  res.render('index');
});

// Admin login page
app.get('/admin/login', (req, res) => {
  res.render('admin_login', { error: null });
});
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'jwtsecret');
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
    return res.redirect('/admin');
  }
  res.render('admin_login', { error: 'Invalid credentials' });
});

// Admin dashboard (protected)
// Admin routes are now handled in a separate router
const adminRouter = require('./routes/admin');
app.use('/admin', requireAuth, adminRouter);

// Example endpoint to update a setting (protected)
app.post('/admin/settings', requireAuth, async (req, res) => {
  const { key, value } = req.body;
  if (key) {
    await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)', [key, value]);
  }
  res.redirect('/admin');
});

app.post('/admin/settings/delete', requireAuth, async (req, res) => {
  const { key } = req.body;
  if (key) {
    await pool.query('DELETE FROM settings WHERE `key` = ?', [key]);
  }
  res.redirect('/admin');
});

// Generic route for other pages (e.g. /hizmetlerimiz or /hizmetlerimiz.html -> render hizmetlerimiz.ejs)
app.get(['/:page', '/:page.html'], (req, res, next) => {
  const page = req.params.page.replace(/\.html$/, '');
  const knownPages = ['hizmetlerimiz', 'hakkimizda', 'bize-ulasin', 'blog', 'sss'];
  if (knownPages.includes(page)) {
    return res.render(page, (err, html) => {
      if (err) {
        console.error(`Error rendering page ${page}:`, err);
        return res.status(500).send('Sunucu Hatası');
      }
      res.send(html);
    });
  }
  next();
});

module.exports = app;
