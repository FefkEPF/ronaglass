// routes/admin.js
const express = require('express');
const router = express.Router();

// İçerik yönetimi kataloğu: admin panelde gruplu formlar bu tanımdan üretilir.
// `key` settings tablosundaki anahtar; `def` DB'de kayıt yoksa sitede görünen varsayılan.
const CONTENT_CATALOG = [
  {
    id: 'iletisim', title: 'İletişim Bilgileri', icon: '☎',
    desc: 'Telefon, WhatsApp ve adres bilgileri — sitenin tamamında (menü, footer, formlar) kullanılır.',
    fields: [
      { key: 'company_name', label: 'Firma Adı', def: 'Rona Auto Glass' },
      { key: 'phone_number', label: 'Telefon Numarası', def: '0534 694 37 89', help: 'Görünen biçim; tel: bağlantıları boşluklar atılarak üretilir.' },
      { key: 'whatsapp_number', label: 'WhatsApp Numarası', def: '905346943789', help: 'Ülke koduyla, boşluksuz (90XXXXXXXXXX).' },
      { key: 'email_address', label: 'E-posta Adresi', def: 'info@ronaglass.com.tr' },
      { key: 'address', label: 'Adres', def: 'Şaşmaz / Etimesgut / Ankara' },
    ],
  },
  {
    id: 'anasayfa', title: 'Ana Sayfa', icon: '⌂',
    desc: 'Ana sayfadaki sinematik giriş bölümünün metinleri.',
    fields: [
      { key: 'hero_title', label: 'Giriş Başlığı', def: 'CAMDAKİ ŞEFFAF ÇÖZÜM<br><em>RONA AUTO GLASS</em>', long: true, help: 'HTML kullanılabilir: <br> satır atlatır, <em>...</em> vurgular.' },
      { key: 'hero_subtitle', label: 'Giriş Alt Metni', def: "Kasko bozmadan cam değişimi. 15 dk'da tamir.", long: true },
    ],
  },
  {
    id: 'hizmetlerimiz', title: 'Hizmetlerimiz Sayfası', icon: '🛠',
    desc: 'Hizmetlerimiz sayfasının üst (hero) bölümü.',
    fields: [
      { key: 'hizmetlerimiz_hero_tag', label: 'Üst Etiket', def: 'HİZMET KATALOĞUMUZ' },
      { key: 'hizmetlerimiz_hero_title', label: 'Başlık', def: 'Oto Cam Servis Hizmetlerimiz' },
      { key: 'hizmetlerimiz_hero_sub', label: 'Alt Metin', def: 'Binek araçlardan iş makinelerine, kaskolu ücretsiz değişimden 15 dakikada taş tamirine kadar tüm çözümler.', long: true },
    ],
  },
  {
    id: 'hakkimizda', title: 'Hakkımızda Sayfası', icon: '🏢',
    desc: 'Hakkımızda sayfasının üst (hero) bölümü.',
    fields: [
      { key: 'hakkimizda_hero_tag', label: 'Üst Etiket', def: 'KURUMSAL' },
      { key: 'hakkimizda_hero_title', label: 'Başlık', def: 'Rona Auto Glass Hakkında' },
      { key: 'hakkimizda_hero_sub', label: 'Alt Metin', def: "Yılların birikimi, uzman teknisyen kadrosu ve orijinal kalite odaklı hizmet anlayışımız ile Ankara'da lider oto cam servisi.", long: true },
    ],
  },
  {
    id: 'bizeulasin', title: 'Bize Ulaşın Sayfası', icon: '✉',
    desc: 'İletişim sayfasının üst (hero) bölümü.',
    fields: [
      { key: 'bize_ulasin_hero_tag', label: 'Üst Etiket', def: 'İLETİŞİM & RANDEVU' },
      { key: 'bize_ulasin_hero_title', label: 'Başlık', def: 'Bizimle İletişime Geçin' },
      { key: 'bize_ulasin_hero_sub', label: 'Alt Metin', def: 'Ankara Şaşmaz servis noktamıza gelin ya da mobil montaj ekibimizi bulunduğunuz adrese çağırın.', long: true },
    ],
  },
  {
    id: 'blog', title: 'Blog Sayfası', icon: '✎',
    desc: 'Blog sayfasının üst (hero) bölümü.',
    fields: [
      { key: 'blog_hero_tag', label: 'Üst Etiket', def: 'BİLGİ & UZMANLIK' },
      { key: 'blog_hero_title', label: 'Başlık', def: 'Oto Cam Blog & Rehber' },
      { key: 'blog_hero_sub', label: 'Alt Metin', def: 'Cam bakımı, kasko hakları, 15 dakikada taş tamiri tekniği ve güvenli sürüş için uzman tavsiyeleri.', long: true },
    ],
  },
  {
    id: 'sss', title: 'S.S.S Sayfası', icon: '?',
    desc: 'Sıkça sorulan sorular sayfasının üst (hero) bölümü.',
    fields: [
      { key: 'sss_hero_tag', label: 'Üst Etiket', def: 'YARDIM MERKEZİ' },
      { key: 'sss_hero_title', label: 'Başlık', def: 'Sıkça Sorulan Sorular' },
      { key: 'sss_hero_sub', label: 'Alt Metin', def: 'Kasko süreci, cam tamiri, garanti ve mobil montaj hizmetlerimiz hakkında merak ettiğiniz tüm sorular ve detaylı cevapları.', long: true },
    ],
  },
  {
    id: 'footer', title: 'Alt Bilgi (Footer)', icon: '▤',
    desc: 'Tüm sayfaların altındaki tanıtım metni.',
    fields: [
      { key: 'footer_description', label: 'Footer Açıklaması', def: "Ankara Etimesgut Şaşmaz'da kaskolu araçlara ücretsiz cam değişimi, 15 dakikada taş tamiri ve 7/24 mobil montaj hizmeti.", long: true },
    ],
  },
];

// Dashboard
router.get('/', async (req, res) => {
  let leads = [];
  let dbOnline = true;
  try {
    const pool = req.app.locals.pool;
    [leads] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 200');
  } catch (err) {
    dbOnline = false; // DB yoksa boş listeyle devam et
  }
  res.render('admin_dashboard', {
    leads,
    catalog: CONTENT_CATALOG,
    dbOnline,
    saveError: req.query.dberr === '1',
  });
});

// Delete a lead
router.post('/leads/delete', async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      const pool = req.app.locals.pool;
      await pool.query('DELETE FROM leads WHERE id = ?', [id]);
    }
    res.redirect('/admin#talepler');
  } catch (err) {
    console.error('Talep silinemedi:', err.message);
    res.redirect('/admin?dberr=1#talepler');
  }
});

// Update a setting (key/value)
router.post('/settings', async (req, res) => {
  const { key, value, tab } = req.body;
  try {
    if (key) {
      const pool = req.app.locals.pool;
      await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)', [key, value]);
    }
    res.redirect('/admin' + (tab ? '#' + tab : ''));
  } catch (err) {
    console.error('Ayar kaydedilemedi:', err.message);
    res.redirect('/admin?dberr=1' + (tab ? '#' + tab : ''));
  }
});

// Delete a setting
router.post('/settings/delete', async (req, res) => {
  const { key, tab } = req.body;
  try {
    if (key) {
      const pool = req.app.locals.pool;
      await pool.query('DELETE FROM settings WHERE `key` = ?', [key]);
    }
    res.redirect('/admin' + (tab ? '#' + tab : ''));
  } catch (err) {
    console.error('Ayar silinemedi:', err.message);
    res.redirect('/admin?dberr=1' + (tab ? '#' + tab : ''));
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
});

module.exports = router;
