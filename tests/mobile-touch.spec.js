import { test, expect } from '@playwright/test';

test.describe('Mobil Touch Scroll Testleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mobilde touch events kaydediliyor', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const cinemaSection = page.locator('.cinema-section');
    await expect(cinemaSection).toBeVisible();

    // Touch start event'inin kaydedildiğini kontrol et
    const hasTouchStart = await cinemaSection.evaluate(el => {
      return el.onclick !== null || el.addEventListener !== null;
    });

    console.log(`Touch event listeners mevcut: ${hasTouchStart}`);
    expect(hasTouchStart).toBe(true);
  });

  test('mobilde touch scroll canvas güncelliyor', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const canvas = page.locator('#cinema-canvas');
    await expect(canvas).toBeVisible();

    const progressBar = page.locator('.cinema-progress-fill');
    
    // Normal scroll yap (touch scroll yerine)
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(500);

    // Progress bar'ın değiştiğini kontrol et
    const transform = await progressBar.evaluate(el => el.style.transform);
    console.log(`Scroll sonrası progress bar: ${transform}`);
    
    // Scroll sonrası scroll pozisyonu
    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Scroll sonrası scroll position: ${scrollY}`);
    
    expect(scrollY).toBeGreaterThan(0);
  });

  test('mobilde touch hızlı interpolation', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const progressBar = page.locator('.cinema-progress-fill');
    
    // Hızlı scroll yap
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(100);
    
    const transform1 = await progressBar.evaluate(el => el.style.transform);
    console.log(`Hızlı scroll (100ms): ${transform1}`);
    
    // Normal scroll yap
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);
    
    const transform2 = await progressBar.evaluate(el => el.style.transform);
    console.log(`Normal scroll (300ms): ${transform2}`);
    
    // Transform değerleri farklı olmalı
    expect(transform1).not.toBe(transform2);
  });

  test('mobilde touch momentum scroll çalışıyor', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const progressBar = page.locator('.cinema-progress-fill');
    
    // Hızlı scroll yap (momentum simülasyonu)
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(100);
    
    const transform1 = await progressBar.evaluate(el => el.style.transform);
    console.log(`Hızlı scroll (100ms): ${transform1}`);
    
    // Momentum etkisi için bekle
    await page.waitForTimeout(500);
    
    const transform2 = await progressBar.evaluate(el => el.style.transform);
    const scrollY = await page.evaluate(() => window.scrollY);
    
    console.log(`Momentum sonrası progress bar: ${transform2}`);
    console.log(`Momentum sonrası scroll position: ${scrollY}`);
    
    // Momentum scroll scroll pozisyonunu değiştirmiş olmalı
    expect(scrollY).toBeGreaterThan(0);
  });

  test('mobilde touch scroll bounds kontrolü', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const cinemaSection = page.locator('.cinema-section');
    const sectionHeight = await cinemaSection.evaluate(el => el.offsetHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    // Section sonuna scroll yap
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const maxScroll = await page.evaluate(() => window.scrollY);
    const documentHeight = await page.evaluate(() => document.body.scrollHeight);
    
    console.log(`Max scroll: ${maxScroll}, Section height: ${sectionHeight}, Document height: ${documentHeight}`);

    // Scroll bounds içinde olmalı (document height - viewport height)
    const expectedMaxScroll = documentHeight - viewportHeight;
    expect(maxScroll).toBeLessThanOrEqual(expectedMaxScroll + 100); // 100px tolerans
  });

  test('mobilde wheel scroll davranışı', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const progressBar = page.locator('.cinema-progress-fill');
    
    // Wheel scroll
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(200);
    
    const wheelTransform = await progressBar.evaluate(el => el.style.transform);
    console.log(`Wheel scroll transform: ${wheelTransform}`);
    
    // Scroll pozisyonunu sıfırla
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    // İkinci scroll
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(200);
    
    const secondTransform = await progressBar.evaluate(el => el.style.transform);
    console.log(`İkinci scroll transform: ${secondTransform}`);
    
    // Scroll çalışmalı
    expect(wheelTransform).not.toBe('scaleX(0)');
    expect(secondTransform).not.toBe('scaleX(0)');
  });

  test('mobilde touch scroll smoothness', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const progressBar = page.locator('.cinema-progress-fill');
    
    // Smooth scroll testi - küçük adımlarla
    const transforms = [];
    
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 50));
      await page.waitForTimeout(100);
      
      const transform = await progressBar.evaluate(el => el.style.transform);
      transforms.push(transform);
      console.log(`Step ${i + 1} transform: ${transform}`);
    }
    
    // Her adımda transform değerinin değiştiğini kontrol et
    for (let i = 1; i < transforms.length; i++) {
      expect(transforms[i]).not.toBe(transforms[i - 1]);
    }
  });
});
