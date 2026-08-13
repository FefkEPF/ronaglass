// Faz 2: public/images altındaki tüm görselleri yerinde optimize eder.
// Orijinaller git geçmişinde durduğu için yerinde üzerine yazmak güvenlidir.
// Kullanım: node scripts/optimize_all_images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'public', 'images');

async function optimize(file) {
  const full = path.join(IMG_DIR, file);
  const before = fs.statSync(full).size;
  const ext = path.extname(file).toLowerCase();
  const isFrame = /^frame_\d+\.jpg$/i.test(file);

  // Not: sharp'a dosya yolu yerine buffer veriyoruz; libvips OneDrive
  // altındaki dosyaları doğrudan açarken hata verebiliyor.
  let pipeline = sharp(fs.readFileSync(full)).rotate(); // EXIF yönünü pikselleri döndürerek koru

  if (isFrame) {
    // Scroll animasyonu kareleri: 129 adet birden yükleniyor, agresif küçült.
    pipeline = pipeline.resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 60, mozjpeg: true });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 75, mozjpeg: true });
  } else if (ext === '.png') {
    // PNG'ler (logo, ekran görüntüleri): palet tabanlı sıkıştırma, şeffaflık korunur.
    pipeline = pipeline.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).png({ compressionLevel: 9, palette: true, quality: 90 });
  } else {
    return null;
  }

  const buf = await pipeline.toBuffer();
  if (buf.length < before * 0.9) {
    fs.writeFileSync(full, buf);
    return { file, before, after: buf.length };
  }
  return { file, before, after: before, skipped: true };
}

(async () => {
  const files = fs.readdirSync(IMG_DIR).filter(f => /\.(jpe?g|png)$/i.test(f));
  let totBefore = 0, totAfter = 0, done = 0;
  for (const f of files) {
    try {
      const r = await optimize(f);
      if (!r) continue;
      totBefore += r.before; totAfter += r.after; done++;
      if (!r.skipped) console.log(`${f}: ${(r.before / 1024).toFixed(0)}KB -> ${(r.after / 1024).toFixed(0)}KB`);
    } catch (e) {
      console.error(`HATA ${f}: ${e.message}`);
    }
  }
  console.log(`\nToplam (${done} dosya): ${(totBefore / 1048576).toFixed(1)}MB -> ${(totAfter / 1048576).toFixed(1)}MB`);
})();
