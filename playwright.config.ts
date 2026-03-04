import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './src/playwright/tests',
  outputDir: 'test-results-playwright',

  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 200,
    },
  },

  reporter: [
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],
    [
      'junit',
      {
        outputFile: 'test-results-playwright/junit-results.xml',
        suiteName: 'ATM Playwright Tests',
      },
    ],
    ['list'],
    [
      '@reportportal/agent-js-playwright',
      {
        apiKey: process.env['RP_API_KEY'] ?? '',
        endpoint: process.env['RP_ENDPOINT'] ?? '',
        project: process.env['RP_PROJECT'] ?? '',
        launch: process.env['RP_LAUNCH_NAME'] ?? 'Playwright Tests',
        attributes: [
          { key: 'framework', value: 'playwright' },
          { key: 'env', value: 'cloud' },
        ],
        description: 'ATM Playwright smoke tests',
        includeTestSteps: true,
      },
    ],
  ],

  use: {
    baseURL: 'https://cloud.google.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
