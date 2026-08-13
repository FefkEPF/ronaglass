import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'node server.js',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: '8000',
      // Testler DB'siz çalışır (settings varsayılanlara düşer); JWT_SECRET zorunlu.
      JWT_SECRET: process.env.JWT_SECRET || 'playwright-test-secret',
    },
  },
});
