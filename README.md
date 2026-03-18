Overview:
Test automation framework for Google Cloud Calculator using WebdriverIO with TypeScript and Page Object Model pattern.

Tech Stack:
WebdriverIO - Browser automation
TypeScript - Type-safe test development
Mocha - Test runner
Allure - Test reporting

Setup & Run:
# Install dependencies
npm install
# Run all tests
npm test

Configuration:
Base URL: https://cloud.google.com
Browser: Chrome (headless configurable)
Timeouts: 5000ms default

# Run Playwright tests in UI mode
npm run test:playwright:ui

# Run WebdriverIO tests in headed (visible browser) mode
npm run test:wdio:headed
npm run test:both:parallel //поміняти тут треба адреси

# Run all Playwright smoke tests
npx playwright test src/playwright/tests/smoke

# Fix linting errors automatically
npm run lint:fix

# Update screenshot baselines (run when UI changes are intentional)
npx playwright test screenshot.spec.ts --update-snapshots