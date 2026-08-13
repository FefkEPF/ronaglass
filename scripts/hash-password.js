// Kullanım: node scripts/hash-password.js <şifre>
// Çıktıdaki hash'i .env dosyasına ADMIN_PASSWORD_HASH olarak ekleyin,
// ardından ADMIN_PASSWORD satırını silin.
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Kullanım: node scripts/hash-password.js <şifre>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log('ADMIN_PASSWORD_HASH=' + hash);
