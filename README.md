# Rona Auto Glass — Kurumsal Web Sitesi

Ankara Etimesgut/Şaşmaz'da hizmet veren Rona Auto Glass oto cam servisinin kurumsal web sitesi.

**Teknolojiler:** Node.js, Express 5, EJS, MySQL (ayarlar için), JWT tabanlı admin paneli.

## Kurulum

```bash
npm install
cp .env.example .env   # değerleri doldurun (aşağıya bakın)
npm start              # http://localhost:3000
```

Geliştirme sırasında otomatik yeniden başlatma için: `npm run dev`

## Ortam Değişkenleri (.env)

| Değişken | Açıklama |
|---|---|
| `PORT` | Sunucu portu (varsayılan 3000) |
| `NODE_ENV` | Production'da `production` yapın (cookie'lere `secure` flag ekler) |
| `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | MySQL bağlantısı. DB erişilemezse site varsayılan ayarlarla çalışmaya devam eder |
| `JWT_SECRET` | **Zorunlu.** Üretmek için: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_USER` | Admin panel kullanıcı adı |
| `ADMIN_PASSWORD_HASH` | bcrypt hash. Üretmek için: `node scripts/hash-password.js <şifre>` |

`.env` dosyasını asla commit etmeyin.

## Veritabanı

```bash
mysql -u root -p < schema.sql   # settings tablosunu oluşturur
node init_db.js                 # varsayılan ayarları yükler
```

Site ayarları (telefon, adres vb.) `/admin` panelinden yönetilir; DB yoksa `server.js` içindeki varsayılanlar kullanılır.

## Proje Yapısı

```
server.js            Express uygulaması, auth middleware, route'lar
routes/admin.js      Admin panel route'ları
views/               EJS sayfaları
views/partials/      Ortak head / navbar / footer parçaları
public/              Statik dosyalar (görseller, video, CSS, JS)
scripts/             Bakım araçları (görsel optimizasyonu, şifre hash'leme)
tests/               Playwright testleri
```

Ortak başlık/menü/alt bilgi `views/partials/` altındadır — telefon, menü veya footer değişikliği tek dosyadan yapılır.

## Yayınlama (Plesk)

Canlı site Plesk (Windows/IIS) üzerinde barındırılıyor. Güncelleme adımları:

1. Plesk panelde **Node.js** eklentisinden uygulamayı seçin (Application Startup File: `server.js`).
2. Depoyu çekin veya dosyaları yükleyin; sunucuda `npm install --production` çalıştırın.
3. Ortam değişkenlerini Plesk'in Node.js ayarlarından ya da uygulama kökündeki `.env` dosyasından tanımlayın (`NODE_ENV=production` dahil).
4. `leads` tablosu için bir kez `schema.sql`'i veritabanına uygulayın.
5. Uygulamayı Plesk'ten yeniden başlatın.

## Testler

```bash
npx playwright install --with-deps   # ilk seferde
npm test
```

## Görsel Optimizasyonu

Yeni görsel eklendiğinde sırayla çalıştırın:

```bash
node scripts/optimize_all_images.js
```

```bash
node scripts/generate-webp.js
```

İlki görselleri yerinde küçültür, ikincisi yanlarına `.webp` sürüm üretir.
Sunucu, tarayıcı destekliyorsa WebP'yi otomatik servis eder — HTML'de
değişiklik gerekmez.

## Tutarlılık Denetimi

Tüm sayfaları ana sayfa referansıyla karşılaştırır (bileşen varlığı + stiller):

```bash
node scripts/audit-consistency.js
```
