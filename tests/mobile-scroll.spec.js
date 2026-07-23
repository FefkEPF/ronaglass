import { test, expect } from '@playwright/test';

test.describe('Mobil Scroll Page Testleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mobilde sayfa yükleniyor ve fallback görünüyor', async ({ page, isMobile }) => {
    // Sadece mobil cihazlarda test et
    if (!isMobile) {
      test.skip();
    }

    // Loader'ın kaybolmasını bekle veya timeout olursa devam et
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      // Loader timeout olursa devam et
      console.log('Loader timeout, continuing test');
    }
    
    // Fallback elementinin görünürlüğünü kontrol et
    const fallback = page.locator('.cinema-fallback');
    await expect(fallback).toBeVisible({ timeout: 3000 });

    // Canvas'ın gizli olduğunu kontrol et
    const canvas = page.locator('#cinema-canvas');
    await expect(canvas).not.toBeVisible();

    // Fallback içeriğini kontrol et
    const fallbackContent = page.locator('.cinema-fallback-content');
    await expect(fallbackContent).toBeVisible();

    // Logo görünüyor mu
    const logo = page.locator('.cinema-fallback-inner img');
    await expect(logo).toBeVisible();

    // Başlık görünüyor mu
    const heading = page.locator('.cinema-fallback-content h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('CAMDAKİ ŞEFFAF ÇÖZÜM');

    // Tag line görünüyor mu
    const tag = page.locator('.cinema-fallback-content .cinema-tag');
    await expect(tag).toBeVisible();
    await expect(tag).toContainText('ANKARA ETİMESGUT ŞAŞMAZ');

    // Alt metin görünüyor mu
    const subText = page.locator('.cinema-fallback-content .cinema-sub');
    await expect(subText).toBeVisible();
    await expect(subText).toContainText('Kasko bozmadan cam değişimi');

    // CTA butonu görünüyor mu
    const ctaButton = page.locator('.cinema-fallback-content .btn-cinema');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('İnceleyin');
  });

  test('mobilde cinema text overlay\'leri gizli', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    // Loader'ın kaybolmasını bekle veya timeout olursa devam et
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    // Cinema text overlay'lerinin gizli olduğunu kontrol et
    const cinemaText1 = page.locator('#cinema-text-1');
    const cinemaText2 = page.locator('#cinema-text-2');
    const cinemaText3 = page.locator('#cinema-text-3');

    await expect(cinemaText1).not.toBeVisible();
    await expect(cinemaText2).not.toBeVisible();
    await expect(cinemaText3).not.toBeVisible();

    // Progress bar gizli mi
    const progressBar = page.locator('.cinema-progress-bar');
    await expect(progressBar).not.toBeVisible();

    // Scroll hint gizli mi
    const scrollHint = page.locator('.cinema-scroll-hint');
    await expect(scrollHint).not.toBeVisible();
  });

  test('mobilde CTA butonu çalışıyor', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    // Loader'ın kaybolmasını bekle veya timeout olursa devam et
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    // CTA butonuna tıkla (JS ile doğrudan tıklama)
    const ctaButton = page.locator('.cinema-fallback-content .btn-cinema');
    await ctaButton.evaluate((el) => el.click());

    // Video presentation section'a scroll yapması lazım
    const videoSection = page.locator('#video-presentation');
    await expect(videoSection).toBeInViewport({ timeout: 3000 });
  });

  test('mobilde scroll yapısı düzgün çalışıyor', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    // Loader'ın kaybolmasını bekle veya timeout olursa devam et
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    // Başlangıç scroll pozisyonu
    const initialScroll = await page.evaluate(() => window.scrollY);
    expect(initialScroll).toBe(0);

    // Aşağı scroll yap
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Scroll pozisyonunun değiştiğini kontrol et
    const afterScroll = await page.evaluate(() => window.scrollY);
    expect(afterScroll).toBeGreaterThan(0);

    // Hero section görünür olmalı
    const heroSection = page.locator('.hero-video-section');
    await expect(heroSection).toBeVisible();
  });

  test('mobilde navbar görünüyor ve çalışıyor', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    // Loader'ın kaybolmasını bekle veya timeout olursa devam et
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    // Navbar görünüyor mu
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();

    // Hamburger menü butonu görünüyor mu
    const hamburger = page.locator('#hamburger');
    await expect(hamburger).toBeVisible();

    // Hamburger'a tıkla
    await hamburger.click();

    // Mobile menu açılmalı
    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).toHaveClass(/open/);

    // Menüyü kapat
    await hamburger.click();
    await expect(mobileMenu).not.toHaveClass(/open/);
  });

  test('mobilde viewport yüksekliği düzgün ayarlanmış', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    // Loader'ın kaybolmasını bekle veya timeout olursa devam et
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    // Viewport yüksekliğini kontrol et
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    expect(viewportHeight).toBeGreaterThan(0);

    // Fallback'in viewport içinde olduğunu kontrol et
    const fallback = page.locator('.cinema-fallback');
    const fallbackBox = await fallback.boundingBox();
    expect(fallbackBox.height).toBeGreaterThanOrEqual(viewportHeight * 0.8);
  });
});
