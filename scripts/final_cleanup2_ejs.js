const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs'));

files.forEach(file => {
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Simplify tel link
  content = content.replace(/<a\s+href="tel:<%=[^>]*%>"/g, (match) => {
    return '<a href="tel:<%= (settings.phone_number || \'0534 694 37 89\').replace(/\\s+/g, \'\') %>"';
  });

  // Simplify mailto link
  content = content.replace(/<a\s+href="mailto:<%=[^>]*%>"/g, '<a href="mailto:<%= settings.email_address || \'info@ronaglass.com.tr\' %>"');

  // Ensure address display has proper closing %>
  content = content.replace(/<%=\s*settings\.address\s*\|\|\s*'[^']*'\s*%>/g, '<%= settings.address || \'2474 Cad 4/1 Şaşmaz, Etimesgut/Ankara\' %>');

  // Ensure phone fallback display
  content = content.replace(/<%=\s*settings\.phone_number\s*\|\|\s*'[^']*'\s*%>/g, '<%= settings.phone_number || \'0534 694 37 89\' %>');

  // Remove any stray "??" markers
  content = content.replace(/\?\?/g, '');

  // Collapse duplicate closing tags
  content = content.replace(/%>\s*%>/g, '%>');

  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${file}`);
});
