const mysql = require('mysql2/promise');
const fs = require('fs');

async function init() {
  try {
    console.log('Connecting to MySQL server...');
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      multipleStatements: true
    });
    
    console.log('Creating database and user...');
    await conn.query(`
      CREATE DATABASE IF NOT EXISTS \`ronaglass_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      CREATE USER IF NOT EXISTS 'ronaglass_user'@'localhost' IDENTIFIED BY 'your_secure_password';
      GRANT ALL PRIVILEGES ON \`ronaglass_db\`.* TO 'ronaglass_user'@'localhost';
      FLUSH PRIVILEGES;
    `);
    
    await conn.changeUser({ database: 'ronaglass_db' });
    
    console.log('Executing schema.sql...');
    const sql = fs.readFileSync('schema.sql', 'utf8');
    await conn.query(sql);
    
    console.log('DB initialization SUCCESSFUL!');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('DB Init Error:', err);
    process.exit(1);
  }
}
init();
