// public/images altındaki her JPEG/PNG için yanına .webp üretir.
// server.js bu dosyaları, tarayıcı destekliyorsa otomatik servis eder;
// HTML/CSS'te hiçbir değişiklik gerekmez.
// Kullanım: node scripts/generate-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'public', 'images');

(async () => {
  const files = fs.readdirSync(IMG_DIR).filter(f => /\.(jpe?g|png)$/i.test(f));
  let before = 0, after = 0, made = 0, skipped = 0;

  for (const file of files) {
    const src = path.join(IMG_DIR, file);
    const dest = src.replace(/\.(jpe?g|png)$/i, '.webp');
    const srcSize = fs.statSync(src).size;

    // Kaynak dosya webp'den yeniyse yeniden üret
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs) {
      before += srcSize; after += fs.statSync(dest).size; skipped++;
      continue;
    }

    try {
      const buf = await sharp(fs.readFileSync(src)).webp({ quality: 78, effort: 5 }).toBuffer();
      // Yalnızca gerçekten küçükse yaz — aksi halde orijinal servis edilir
      if (buf.length < srcSize * 0.95) {
        fs.writeFileSync(dest, buf);
        made++;
        before += srcSize; after += buf.length;
      } else {
        before += srcSize; after += srcSize;
      }
    } catch (e) {
      console.error(`HATA ${file}: ${e.message}`);
    }
  }

  console.log(`${made} yeni webp, ${skipped} güncel`);
  console.log(`Görsel toplamı: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);
})();
