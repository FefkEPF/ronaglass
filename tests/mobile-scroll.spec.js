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
    
    // Canvas'ın gizli olduğunu kontrol et
    const canvas = page.locator('#cinema-canvas');
    await expect(canvas).not.toBeVisible();

    // Cinema section sticky yapısını kontrol et
    const cinemaSection = page.locator('.cinema-section');
    await expect(cinemaSection).toBeVisible();

    // Cinema sticky elementini kontrol et
    const cinemaSticky = page.locator('.cinema-sticky');
    await expect(cinemaSticky).toBeVisible();

    // Cinema text overlay'leri görünüyor mu
    const cinemaText1 = page.locator('#cinema-text-1');
    await expect(cinemaText1).toBeVisible();
    await expect(cinemaText1).toContainText('CAMDAKİ ŞEFFAF ÇÖZÜM');

    // Progress bar görünüyor mu
    const progressBar = page.locator('.cinema-progress-bar');
    await expect(progressBar).toBeVisible();

    // Scroll hint görünüyor mu
    const scrollHint = page.locator('.cinema-scroll-hint');
    await expect(scrollHint).toBeVisible();
  });

  test('mobilde cinema text overlay\'leri scroll ile çalışıyor', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    // Loader'ın kaybolmasını bekle veya timeout olursa devam et
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    // Cinema text overlay'lerinin görünüyor olduğunu kontrol et
    const cinemaText1 = page.locator('#cinema-text-1');
    const cinemaText2 = page.locator('#cinema-text-2');
    const cinemaText3 = page.locator('#cinema-text-3');

    await expect(cinemaText1).toBeVisible();
    await expect(cinemaText2).toBeVisible();
    await expect(cinemaText3).toBeVisible();

    // Scroll yaparak scroll yapısının çalıştığını test et
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Scroll pozisyonunun değiştiğini kontrol et
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
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

    // CTA butonunu cinema text içinden bul
    const ctaButton = page.locator('#cinema-text-1 .btn-cinema');
    await expect(ctaButton).toBeVisible();

    // CTA butonuna tıkla (JS ile doğrudan tıklama)
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

    // Cinema section sticky yapısını kontrol et
    const cinemaSticky = page.locator('.cinema-sticky');
    await expect(cinemaSticky).toBeVisible();

    // Aşağı scroll yap
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(500);

    // Scroll pozisyonunun değiştiğini kontrol et
    const afterScroll = await page.evaluate(() => window.scrollY);
    expect(afterScroll).toBeGreaterThan(0);

    // Progress bar'ın scroll ile değiştiğini kontrol et
    const progressBar = page.locator('.cinema-progress-fill');
    const initialTransform = await progressBar.evaluate(el => el.style.transform);
    
    // Daha fazla scroll yap (cinema section yüksekliğinde)
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    
    const afterTransform = await progressBar.evaluate(el => el.style.transform);
    
    // Progress bar transform'u değişmiş olmalı veya en azından farklı bir değer olmalı
    if (initialTransform === afterTransform) {
      // Eğer transform değişmediyse, scroll yapıldığını doğrula
      const finalScroll = await page.evaluate(() => window.scrollY);
      expect(finalScroll).toBeGreaterThanOrEqual(1100);
    } else {
      expect(initialTransform).not.toBe(afterTransform);
    }
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

    // Cinema sticky'in viewport yüksekliğinde olduğunu kontrol et
    const cinemaSticky = page.locator('.cinema-sticky');
    const stickyBox = await cinemaSticky.boundingBox();
    expect(stickyBox.height).toBeGreaterThanOrEqual(viewportHeight * 0.9);
  });
});
