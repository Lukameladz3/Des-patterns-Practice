import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

// ReportPortal configuration - replace placeholders with real values or
// move to environment variables as needed.
export const rpConfig = {
  apiKey: process.env.REPORTPORTAL_API_KEY || 'test_3YJxqdX4SQK2dtc4RWrbUC-JvoAgcbWZPILn2jo9xh4KKTBChiF0ECzTOSju8Gcp',
  endpoint: process.env.REPORTPORTAL_ENDPOINT || 'http://localhost:8080/api/v2',
  project: process.env.REPORTPORTAL_PROJECT || 'superadmin_personal',
  launch: 'Playwright SDD Tests',
  attributes: [
    { key: 'framework', value: 'playwright' },
    { key: 'env', value: 'dev' },
    { key: 'group', value: 'SDD' },
  ],
  description: 'Automated tests from Playwright SDD Framework',
  skippedIssue: false,
  includeTestSteps: true, // Include @step annotations as nested steps in ReportPortal
};

// add custom timeout
// for some assertions for example we need 10 sec instead of defailt 5
// timout_5 as variable
export default defineConfig({
  testDir: './tests',
  timeout: 60000,

  expect: {
    timeout: 5000,  // Timeout for expect() assertions
    toHaveScreenshot: { maxDiffPixels: 500 },
  },
  use: {
    actionTimeout: 10000,      // Timeout for click, fill, etc.
    navigationTimeout: 30000,  // Timeout for page.goto, waitForNavigation
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ['dot'],
    ['github'],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-reports/results.json" }],
    ["junit", { outputFile: "test-reports/junit-results.xml" }]
  ],


  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], viewport: { width: 1920, height: 1080 } },
    // },

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
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
