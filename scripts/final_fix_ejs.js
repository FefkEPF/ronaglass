const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs'));

files.forEach(file => {
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove stray "??" markers that were left during previous fixes
  content = content.replace(/\?\?/g, '');

  // Collapse duplicated closing tags like "%> %>" or "%>\s*%>"
  content = content.replace(/%>\s*%>/g, '%>');

  // Fix tel link expression
  const telPattern = /<a\s+href="tel:([^"']*)"/g;
  content = content.replace(telPattern, (match, inner) => {
    // Replace any nested <%=%> patterns inside the href with a clean expression
    const clean = `<a href="tel:<%= settings.phone_number ? settings.phone_number.replace(/\\s+/g, '') : '+' + (settings.whatsapp_number || '905346943789') %>"`;
    return clean;
  });

  // Fix email link expression (ensure single <%=%>)
  const emailPattern = /<a\s+href="mailto:([^"']*)"/g;
  content = content.replace(emailPattern, (match, inner) => {
    return `<a href="mailto:<%= settings.email_address || 'info@ronaglass.com.tr' %>"`;
  });

  // Fix address display (remove stray characters)
  content = content.replace(/<%=\s*settings\.address\s*\|\|\s*'[^']*'\s*%>/g, `<%= settings.address || '2474 Cad 4/1 Şaşmaz, Etimesgut/Ankara' %>`);

  // Ensure phone display fallback is correct
  content = content.replace(/<%=\s*settings\.phone_number\s*\|\|\s*'[^']*'\s*%>/g, `<%= settings.phone_number || '0534 694 37 89' %>`);

  // Write back file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${file}`);
});
