const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs') && f !== 'admin_dashboard.ejs');

files.forEach(file => {
    const filePath = path.join(viewsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/0534 694 37 89/g, "<%= settings.phone_number || '0534 694 37 89' %>");
    content = content.replace(/\+905346943789/g, "<%= settings.phone_number ? settings.phone_number.replace(/\\s+/g, '') : '+905346943789' %>");
    content = content.replace(/905346943789/g, "<%= settings.whatsapp_number || '905346943789' %>");
    content = content.replace(/info@ronaglass\.com\.tr/g, "<%= settings.email_address || 'info@ronaglass.com.tr' %>");
    content = content.replace(/2474 Cad 4\/1 Şaşmaz, Etimesgut\/Ankara/g, "<%= settings.address || '2474 Cad 4/1 Şaşmaz, Etimesgut/Ankara' %>");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
