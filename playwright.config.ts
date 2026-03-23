import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/playwright/tests',
  outputDir: 'test-results-playwright',

  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 200,
    },
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['allure-playwright', { 
      outputFolder: 'allure-results-playwright'  // Окрема директорія
    }]
  ],

  use: {
    baseURL: 'https://cloud.google.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});