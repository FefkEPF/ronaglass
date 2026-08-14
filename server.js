// server.js
require('dotenv').config();
const express = require('express');
// const session = require('express-session'); // removed in favor of JWT
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const compression = require('compression');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.VERCEL) {
    // Serverless'ta process.exit tüm siteyi çökertir (FUNCTION_INVOCATION_FAILED).
    // Site admin'siz çalışmaya devam etsin; admin route'ları 503 döndürür.
    console.error('UYARI: JWT_SECRET tanımlı değil — admin paneli devre dışı. Vercel dashboard > Settings > Environment Variables bölümünden ekleyin.');
  } else {
    console.error('FATAL: JWT_SECRET is not set. Refusing to start with an insecure default.');
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Güvenlik başlıkları. Tüm varlıklar artık kendi sunucumuzdan geldiği için
// CSP açık; sayfalarda gömülü <style>/<script> blokları olduğundan
// 'unsafe-inline' gerekli. Harici izinler: Google Haritalar gömülü çerçevesi.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"], // ref kartlarındaki onerror yedekleri için
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ['https://www.google.com', 'https://maps.google.com'],
      objectSrc: ["'none'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: IS_PROD ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Gzip/deflate sıkıştırma (HTML, CSS, JS yanıtları için)
app.use(compression());

// WebP içerik pazarlığı: tarayıcı destekliyorsa ve yanında .webp varsa
// onu servis et. HTML/CSS'te değişiklik gerektirmez; desteklemeyen
// tarayıcılar orijinal JPEG/PNG'yi almaya devam eder.
const fs = require('fs');
const webpCache = new Map();
function hasWebp(absPath) {
  if (!webpCache.has(absPath)) webpCache.set(absPath, fs.existsSync(absPath));
  return webpCache.get(absPath);
}
app.use((req, res, next) => {
  if (!/\.(jpe?g|png)$/i.test(req.path)) return next();
  if (!(req.headers.accept || '').includes('image/webp')) return next();
  const webpRelative = req.path.replace(/\.(jpe?g|png)$/i, '.webp');
  if (!hasWebp(path.join(__dirname, 'public', webpRelative))) return next();
  req.url = webpRelative;
  res.setHeader('Vary', 'Accept');
  next();
});

// Static assets — tarayıcı önbelleği: görseller/videolar 30 gün,
// CSS/JS 1 gün (style.css?v=N sorgu parametresiyle sürümleniyor)
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, filePath) {
    if (/\.woff2?$/i.test(filePath)) {
      // Fontlar içerik-adresli; bir yıl önbelleklenebilir
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/\.(png|jpe?g|webp|svg|mp4|webm|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    } else if (/\.(css|js)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  },
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  if (!JWT_SECRET) return res.status(503).send('Admin paneli yapılandırılmamış (JWT_SECRET eksik).');
  const token = req.cookies && req.cookies.token;
  if (!token) return res.redirect('/admin/login');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload.admin;
    return next();
  } catch (err) {
    return res.redirect('/admin/login');
  }
}

// Global settings middleware
const defaultSettings = {
  phone_number: '0534 694 37 89',
  whatsapp_number: '905346943789',
  address: 'Şaşmaz / Etimesgut / Ankara',
  company_name: 'Rona Auto Glass'
};

app.use(async (req, res, next) => {
  // Skip static assets and admin login
  if (req.path.match(/\.(js|css|png|jpg|jpeg|mp4|webm|svg)$/) || req.path === '/admin/login') {
    return next();
  }
  try {
    const [rows] = await pool.query('SELECT * FROM settings');
    const settings = { ...defaultSettings };
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.locals.settings = settings;
  } catch (err) {
    // Silently fall back to defaults when DB is offline
    res.locals.settings = defaultSettings;
  }
  next();
});

// Front-page
app.get(['/', '/index', '/index.html'], (req, res) => {
  res.render('index');
});

// Admin login page
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 10, // pencere başına en fazla 10 deneme
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).render('admin_login', { error: 'Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' });
  },
});

app.get('/admin/login', (req, res) => {
  res.render('admin_login', { error: null });
});
app.post('/admin/login', loginLimiter, async (req, res) => {
  if (!JWT_SECRET) return res.status(503).render('admin_login', { error: 'Sunucu yapılandırması eksik (JWT_SECRET).' });
  const { username, password } = req.body;
  let passwordOk = false;
  if (username && password && username === process.env.ADMIN_USER) {
    if (process.env.ADMIN_PASSWORD_HASH) {
      passwordOk = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    } else if (process.env.ADMIN_PASSWORD) {
      // Geçiş dönemi: ADMIN_PASSWORD_HASH tanımlanana kadar düz metin karşılaştırma.
      // `node scripts/hash-password.js <şifre>` ile hash üretip .env'e ekleyin.
      console.warn('WARN: ADMIN_PASSWORD_HASH tanımlı değil; düz metin şifre karşılaştırması kullanılıyor.');
      passwordOk = password === process.env.ADMIN_PASSWORD;
    }
  }
  if (passwordOk) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '2h' });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: IS_PROD,
      maxAge: 2 * 60 * 60 * 1000,
    });
    return res.redirect('/admin');
  }
  res.render('admin_login', { error: 'Invalid credentials' });
});

// Teklif/randevu formu — lead kaydı
const leadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/lead', leadLimiter, async (req, res) => {
  const { name, phone, vehicle, service, kasko, message, page } = req.body || {};
  const clean = v => (typeof v === 'string' ? v.trim().slice(0, 500) : null);
  const cName = clean(name);
  const cPhone = clean(phone);
  if (!cName || !cPhone || !/[0-9+][0-9\s()-]{8,}/.test(cPhone)) {
    return res.status(400).json({ ok: false, error: 'Ad ve geçerli bir telefon numarası zorunludur.' });
  }
  try {
    await pool.query(
      'INSERT INTO leads (name, phone, vehicle, service, kasko, message, page) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cName, cPhone, clean(vehicle), clean(service), clean(kasko), clean(message), clean(page)]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('Lead kaydedilemedi:', err.message);
    // DB yoksa istemci WhatsApp'a yönlendirme yedeğini kullanır
    return res.status(503).json({ ok: false, error: 'db_unavailable' });
  }
});

// Admin dashboard (protected)
// Admin routes are now handled in a separate router
const adminRouter = require('./routes/admin');
app.use('/admin', requireAuth, adminRouter);

// Generic route for other pages (e.g. /hizmetlerimiz or /hizmetlerimiz.html -> render hizmetlerimiz.ejs)
app.get(['/:page', '/:page.html'], (req, res, next) => {
  const page = req.params.page.replace(/\.html$/, '');
  const knownPages = ['hizmetlerimiz', 'hakkimizda', 'bize-ulasin', 'blog', 'sss', 'kvkk'];
  if (knownPages.includes(page)) {
    return res.render(page, (err, html) => {
      if (err) {
        console.error(`Error rendering page ${page}:`, err);
        return res.status(500).render('500');
      }
      res.send(html);
    });
  }
  next();
});

// 404 — eşleşmeyen tüm istekler
app.use((req, res) => {
  res.status(404).render('404');
});

// 500 — yakalanmamış hatalar
app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', err);
  if (res.headersSent) return next(err);
  res.locals.settings = res.locals.settings || defaultSettings;
  res.status(500).render('500');
});

module.exports = app;

process.on('unhandledRejection', (reason) => {
  console.warn('Unhandled Rejection:', reason && reason.message ? reason.message : reason);
});

process.on('uncaughtException', (err) => {
  console.warn('Uncaught Exception:', err && err.message ? err.message : err);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
