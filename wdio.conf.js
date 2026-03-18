const moment = require('moment');

exports.config = {
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: 'tsconfig.json',
    },
  },

  runner: 'local',

  specs: ['./src/tests/**/**.tests.ts'],
  suites: {
    smoke: ['./src/tests/smoke/**.tests.js'],
  },

  maxInstances: 1,

  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--disable-blink-features=AutomationControlled'],
        detach: true,
      },
    },
  ],

  logLevel: 'warn',

  bail: 0,
  baseUrl: 'https://cloud.google.com',

  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  reporters: ['spec'], // Тільки spec, без allure
  services: ['chromedriver'],

  framework: 'mocha',
  mochaOpts: {
    timeout: 30000,
  },

  onPrepare() {
    console.warn(`Start time: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
  },

  async before() {
    await browser.setWindowSize(1280, 720);
  },

  async afterTest(_test, _context, { error }) {
    if (error) {
      await browser.takeScreenshot();
    }
  },

  onComplete() {
    console.warn(`Finish time: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
  },
};
