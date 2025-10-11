import { defineConfig, devices } from '@playwright/test';
import { loadEnvironmentConfig } from './utils/environment-config';
import FailedTestReporter from './utils/FailedTestReporter';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// Load environment configuration
const envConfig = loadEnvironmentConfig();

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel for staging, sequentially for local */
  fullyParallel: envConfig.environment === 'prod',

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Set workers based on environment: multiple for staging, 1 for local */
  workers: envConfig.environment === 'prod' ? undefined : 1,
  
  /* Verlängerte Timeouts für VPN-Verbindungen */
  timeout: 30000, // 30 Sekunden pro Test
  expect: {
    timeout: 10000 // 10 Sekunden für Expectations
  },
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }], 
    ['allure-playwright', { outputFolder: 'allure-results' }], 
    ['line'],
    //['./utils/custom-reporter.ts'] // Use Playwright template reporter 
    //['list'], ['./utils/FailedTestReporter']
    ['./utils/MyReporter']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  globalSetup: require.resolve('./utils/global-setup'),
  globalTeardown: require.resolve('./utils/global-teardown'),
  
  use: {
    /* Base URL will be set per project */
    baseURL: envConfig.baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'on-first-retry' (optional): Captures a trace file on the first retry, which can be useful for debugging.
    trace: 'on', // Enable trace collection for all tests
    headless: envConfig.headless,

    storageState: 'loggedInState.json',
    
    screenshot: 'only-on-failure', // Capture screenshots only on test failure
    video: 'retain-on-failure',   // Retain videos only on test failure
  },


  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        headless: envConfig.headless,
        baseURL: envConfig.baseURL,
      },
    },





/*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
*/
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});