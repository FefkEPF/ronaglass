import { test, expect } from '@playwright/test';

// Sayfalar arası tutarlılık: her sayfada ortak bileşenler ana sayfayla aynı olmalı.
// Bu testler, "bir stil yanlışlıkla media query içinde kalmış" ya da
// "yeni sayfaya ortak bileşen eklenmemiş" sınıfı hataları CI'da yakalar.

const PAGES = ['/', '/hizmetlerimiz', '/hakkimizda', '/bize-ulasin', '/blog', '/sss', '/kvkk'];

for (const path of PAGES) {
  test.describe(`ortak bileşenler: ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('load');
    });

    test('navbar, mobil CTA, mobil menü ve footer mevcut', async ({ page }) => {
      await expect(page.locator('.navbar')).toBeAttached();
      await expect(page.locator('.logo-brand').first()).toBeAttached();
      await expect(page.locator('.mobile-header-ctas')).toBeAttached();
      await expect(page.locator('.nav-cta-btn.whatsapp')).toBeAttached();
      await expect(page.locator('.nav-cta-btn.phone')).toBeAttached();
      await expect(page.locator('.hamburger')).toBeAttached();
      await expect(page.locator('.mobile-menu')).toBeAttached();
      await expect(page.locator('footer')).toBeAttached();
      await expect(page.locator('.floating-cta')).toBeAttached();
    });

    test('head etiketleri tam (favicon, canonical)', async ({ page }) => {
      await expect(page.locator('link[href*="favicon-32"]')).toBeAttached();
      await expect(page.locator('link[rel="apple-touch-icon"]')).toBeAttached();
      await expect(page.locator('link[rel="canonical"]')).toBeAttached();
    });

    test('mobilde CTA pilleri ana sayfa tasarımıyla stillenmiş', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'yalnızca mobil projeler');
      const wa = page.locator('.nav-cta-btn.whatsapp');
      await expect(wa).toBeVisible();
      // WhatsApp yeşili — stiller uygulanmazsa varsayılan link mavisi olur
      await expect(wa).toHaveCSS('background-color', 'rgb(37, 211, 102)');
      const radius = await wa.evaluate(el => getComputedStyle(el).borderRadius);
      expect(parseFloat(radius)).toBeGreaterThan(10); // pill görünümü
      await expect(page.locator('.hamburger')).toBeVisible();
      // yüzen CTA mobilde görünür
      await expect(page.locator('.floating-cta .cta-btn.whatsapp')).toBeVisible();
    });

    test('masaüstünde telefon butonu görünür, mobil CTA gizli', async ({ page, isMobile }) => {
      test.skip(isMobile, 'yalnızca masaüstü projesi');
      await expect(page.locator('.nav-phone-btn')).toBeVisible();
      await expect(page.locator('.mobile-header-ctas')).toBeHidden();
    });

    test('yatay taşma yok', async ({ page }) => {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(2);
    });
  });
}

test('404 sayfası da ortak bileşenleri taşır', async ({ page }) => {
  await page.goto('/boyle-bir-sayfa-yok');
  await expect(page.locator('.navbar')).toBeAttached();
  await expect(page.locator('footer')).toBeAttached();
  await expect(page.locator('.floating-cta')).toBeAttached();
});
