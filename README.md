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

npm run test:playwright:ui
npm run test:wdio:headed
npm run test:both:parallel

npx playwright test src/tests/playwright/smoke

npm run lint:fix