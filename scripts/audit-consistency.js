// Sayfalar arası tutarlılık denetimi — index referans alınır
const { chromium, devices } = require('@playwright/test');

const PAGES = ['/', '/hizmetlerimiz', '/hakkimizda', '/bize-ulasin', '/blog', '/sss', '/kvkk', '/olmayan-sayfa-404'];

async function snapshot(page) {
  return page.evaluate(() => {
    const gs = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const c = getComputedStyle(el);
      // gizli elemanların diğer stilleri görsel sonuç doğurmaz — karşılaştırma dışı
      if (c.display === 'none') return { display: 'none' };
      return {
        display: c.display, position: c.position, height: c.height,
        bg: c.backgroundColor, bgImg: c.backgroundImage.slice(0, 50),
        font: c.fontFamily.split(',')[0], fs: c.fontSize, radius: c.borderRadius,
        padding: c.padding, color: c.color,
      };
    };
    const present = sel => !!document.querySelector(sel);
    return {
      navbar: gs('.navbar'),
      logo: present('.logo-brand'),
      hamburger: gs('.hamburger'),
      mobileCtas: gs('.mobile-header-ctas'),
      navWa: gs('.nav-cta-btn.whatsapp'),
      navPh: gs('.nav-cta-btn.phone'),
      navPhoneDesktop: gs('.nav-phone-btn'),
      mobileMenu: present('.mobile-menu'),
      mobileMenuCta: present('.mobile-menu-cta'),
      floatingCta: gs('.floating-cta'),
      floatWa: gs('.floating-cta .cta-btn.whatsapp'),
      floatPh: gs('.floating-cta .cta-btn.phone'),
      floatPhText: (document.querySelector('.floating-cta .cta-btn.phone span') || {}).textContent || null,
      footer: present('footer'),
      footerKvkkLink: !!Array.from(document.querySelectorAll('footer a')).find(a => /kvkk/i.test(a.href)),
      loader: present('.loader'),
      favicon32: present('link[href*="favicon-32"]'),
      appleIcon: present('link[rel="apple-touch-icon"]'),
      canonical: present('link[rel="canonical"]'),
      title: document.title.slice(0, 40),
      bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0],
      hScrollOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

function diff(ref, cur, pagePath, viewport, out) {
  for (const key of Object.keys(ref)) {
    if (key === 'title') continue;
    const a = JSON.stringify(ref[key]); const b = JSON.stringify(cur[key]);
    if (a !== b) out.push(`${viewport} ${pagePath} :: ${key}: ${b} (index: ${a})`);
  }
}

(async () => {
  const browser = await chromium.launch();
  const findings = [];
  for (const [vpName, ctxOpts] of [['MOBIL', { ...devices['iPhone 12'] }], ['DESKTOP', { viewport: { width: 1366, height: 900 } }]]) {
    const ctx = await browser.newContext(ctxOpts);
    let ref = null;
    for (const p of PAGES) {
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 100)); });
      page.on('pageerror', e => errors.push('PAGEERROR: ' + String(e).slice(0, 100)));
      await page.goto('http://localhost:3000' + p, { waitUntil: 'load', timeout: 30000 }).catch(e => errors.push('GOTO: ' + e.message.slice(0, 80)));
      await page.waitForTimeout(2000);
      const snap = await snapshot(page);
      if (p === '/') ref = snap;
      else {
        const isErrorPage = p.includes('404');
        const d = [];
        diff(ref, snap, p, vpName, d);
        findings.push(...d.filter(x => !(isErrorPage && (x.includes(':: loader:') || x.includes('KONSOL')))));
      }
      if (snap.hScrollOverflow > 2) findings.push(`${vpName} ${p} :: YATAY TAŞMA: ${snap.hScrollOverflow}px`);
      errors
        .filter(e => !(p.includes('404') && /status of 404/.test(e)))
        .forEach(e => findings.push(`${vpName} ${p} :: KONSOL: ${e}`));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log(findings.length ? findings.join('\n') : 'TUTARSIZLIK YOK');
})();
