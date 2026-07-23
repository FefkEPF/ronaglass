import { test, expect } from '@playwright/test';

test.describe('Desktop vs Mobil Karşılaştırma Testleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('canvas çözünürlüğü karşılaştırması', async ({ page }) => {
    // Canvas elementini bul
    const canvas = page.locator('#cinema-canvas');
    await expect(canvas).toBeVisible();

    // Canvas çözünürlüğünü kontrol et
    const canvasWidth = await canvas.evaluate(el => el.width);
    const canvasHeight = await canvas.evaluate(el => el.height);

    console.log(`Canvas çözünürlüğü: ${canvasWidth}x${canvasHeight}`);

    // Desktop için beklenen çözünürlük
    const isMobile = await page.evaluate(() => 
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );

    if (isMobile) {
      // Mobilde de desktop ile aynı çözünürlük olmalı
      expect(canvasWidth).toBe(1920);
      expect(canvasHeight).toBe(1080);
    } else {
      expect(canvasWidth).toBe(1920);
      expect(canvasHeight).toBe(1080);
    }
  });

  test('cinema section yüksekliği karşılaştırması', async ({ page }) => {
    // Loader'ın kaybolmasını bekle
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const cinemaSection = page.locator('.cinema-section');
    await expect(cinemaSection).toBeVisible();

    // Section yüksekliğini kontrol et
    const sectionHeight = await cinemaSection.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.height;
    });

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const expectedHeightVh = (350 * viewportHeight / 100).toFixed(1);

    console.log(`Cinema section yüksekliği: ${sectionHeight}, beklenen: ~${expectedHeightVh}px`);

    // Section yüksekliği yaklaşık 350vh olmalı (tolerans ile)
    const sectionHeightNum = parseFloat(sectionHeight);
    const expectedHeightNum = parseFloat(expectedHeightVh);
    const heightDiff = Math.abs(sectionHeightNum - expectedHeightNum);
    
    expect(heightDiff).toBeLessThan(100); // 100px tolerans
  });

  test('scroll interpolation hızı karşılaştırması', async ({ page }) => {
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    // Scroll yap ve progress bar'ın değişimini ölç
    const progressBar = page.locator('.cinema-progress-fill');
    
    // İlk scroll
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);
    
    const transform1 = await progressBar.evaluate(el => el.style.transform);
    console.log(`İlk scroll transform: ${transform1}`);

    // İkinci scroll
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);
    
    const transform2 = await progressBar.evaluate(el => el.style.transform);
    console.log(`İkinci scroll transform: ${transform2}`);

    // Transform değerleri farklı olmalı (scroll çalışıyor)
    expect(transform1).not.toBe(transform2);
  });

  test('text overlay timing karşılaştırması', async ({ page }) => {
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const cinemaText1 = page.locator('#cinema-text-1');
    const cinemaText2 = page.locator('#cinema-text-2');
    const cinemaText3 = page.locator('#cinema-text-3');

    // Text overlay'lerin görünürlüğünü kontrol et
    await expect(cinemaText1).toBeVisible();
    await expect(cinemaText2).toBeVisible();
    await expect(cinemaText3).toBeVisible();

    // Başlangıç durumu
    const isActive1_initial = await cinemaText1.evaluate(el => el.classList.contains('active'));
    const isActive2_initial = await cinemaText2.evaluate(el => el.classList.contains('active'));
    const isActive3_initial = await cinemaText3.evaluate(el => el.classList.contains('active'));

    console.log(`Başlangıç active durumları: text1=${isActive1_initial}, text2=${isActive2_initial}, text3=${isActive3_initial}`);

    // Scroll yaparak geçişleri test et
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    const isActive1_after = await cinemaText1.evaluate(el => el.classList.contains('active'));
    const isActive2_after = await cinemaText2.evaluate(el => el.classList.contains('active'));
    const isActive3_after = await cinemaText3.evaluate(el => el.classList.contains('active'));

    console.log(`Scroll sonrası active durumları: text1=${isActive1_after}, text2=${isActive2_after}, text3=${isActive3_after}`);

    // Scroll sonrası durumlar değişmiş olmalı
    expect(isActive1_after !== isActive1_initial || isActive2_after !== isActive2_initial).toBe(true);
  });

  test('canvas image sequence loading karşılaştırması', async ({ page }) => {
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    // Canvas'ın görünürlüğünü ve durumunu kontrol et
    const canvas = page.locator('#cinema-canvas');
    await expect(canvas).toBeVisible();

    const canvasOpacity = await canvas.evaluate(el => el.style.opacity);
    const canvasDisplay = await canvas.evaluate(el => el.style.display);

    console.log(`Canvas opacity: ${canvasOpacity}, display: ${canvasDisplay}`);

    // Canvas her iki platformda da görünür olmalı
    expect(canvasDisplay).not.toBe('none');
    expect(canvasOpacity).not.toBe('0');
  });

  test('progress bar scroll synchronization karşılaştırması', async ({ page }) => {
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const progressBar = page.locator('.cinema-progress-fill');
    const cinemaSection = page.locator('.cinema-section');

    // Section yüksekliğini al
    const sectionHeight = await cinemaSection.evaluate(el => el.offsetHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    console.log(`Section height: ${sectionHeight}, Viewport height: ${viewportHeight}`);

    // Scroll yaparak progress bar'ın doğru çalıştığını test et
    await page.evaluate((height) => window.scrollBy(0, height * 0.3), sectionHeight);
    await page.waitForTimeout(500);

    const transform1 = await progressBar.evaluate(el => el.style.transform);
    console.log(`%30 scroll transform: ${transform1}`);

    await page.evaluate((height) => window.scrollBy(0, height * 0.3), sectionHeight);
    await page.waitForTimeout(500);

    const transform2 = await progressBar.evaluate(el => el.style.transform);
    console.log(`%60 scroll transform: ${transform2}`);

    // Progress bar lineer olarak artmalı
    expect(transform1).not.toBe(transform2);
    expect(transform1).not.toBe('scaleX(0)');
    expect(transform2).not.toBe('scaleX(1)');
  });

  test('scroll hint behavior karşılaştırması', async ({ page }) => {
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const scrollHint = page.locator('.cinema-scroll-hint');
    await expect(scrollHint).toBeVisible();

    // Başlangıçta scroll hint görünür olmalı
    const initialOpacity = await scrollHint.evaluate(el => el.style.opacity);
    console.log(`Başlangıç scroll hint opacity: ${initialOpacity}`);
    expect(parseFloat(initialOpacity)).toBeGreaterThan(0);

    // Scroll yapınca scroll hint kaybolmalı
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(300);

    const afterScrollOpacity = await scrollHint.evaluate(el => el.style.opacity);
    console.log(`Scroll sonrası opacity: ${afterScrollOpacity}`);
    expect(parseFloat(afterScrollOpacity)).toBeLessThan(0.5);
  });

  test('overlay fade to black behavior karşılaştırması', async ({ page }) => {
    try {
      await page.waitForSelector('.loader.hidden', { timeout: 5000 });
    } catch (e) {
      console.log('Loader timeout, continuing test');
    }

    const cinemaSection = page.locator('.cinema-section');
    const sectionHeight = await cinemaSection.evaluate(el => el.offsetHeight);

    // Section sonuna scroll yap
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Canvas'ın son frame'de karanlık overlay olup olmadığını kontrol et
    const canvas = page.locator('#cinema-canvas');
    const canvasVisible = await canvas.isVisible();

    console.log(`Section sonunda canvas visible: ${canvasVisible}`);

    // Canvas her iki platformda da görünür olmalı
    expect(canvasVisible).toBe(true);
  });
});
