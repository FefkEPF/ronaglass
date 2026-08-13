const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs') && f !== 'admin_dashboard.ejs');

files.forEach(file => {
    const filePath = path.join(viewsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix nested EJS tags
    content = content.replace(/<%= settings\.phone_number \|\| '<%= settings\.phone_number \|\| '0534 694 37 89' %>' %>/g, "<%= settings.phone_number || '0534 694 37 89' %>");
    
    // Fix nested whatsapp
    content = content.replace(/<%= settings\.whatsapp_number \|\| '<%= settings\.whatsapp_number \|\| '905346943789' %>' %>/g, "<%= settings.whatsapp_number || '905346943789' %>");
    
    // Fix nested email
    content = content.replace(/<%= settings\.email_address \|\| '<%= settings\.email_address \|\| 'info@ronaglass\.com\.tr' %>' %>/g, "<%= settings.email_address || 'info@ronaglass.com.tr' %>");
    
    // Fix nested address
    content = content.replace(/<%= settings\.address \|\| '<%= settings\.address \|\| '2474 Cad 4\/1 Şaşmaz, Etimesgut\/Ankara' %>' %>/g, "<%= settings.address || '2474 Cad 4/1 Şaşmaz, Etimesgut/Ankara' %>");
    
    // Fix nested tel links
    content = content.replace(/<%= settings\.phone_number \? settings\.phone_number\.replace\(\/\\s\+\/g, ''\) : '<%= settings\.phone_number \? settings\.phone_number\.replace\(\/\\s\+\/g, ''\) : '\+<%= settings\.whatsapp_number \|\| '905346943789' %>' %>' %>/g, "<%= settings.phone_number ? settings.phone_number.replace(/\\s+/g, '') : '+905346943789' %>");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
});
