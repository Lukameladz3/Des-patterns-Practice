import { test, expect } from '@playwright/test';

// ReportPortal defect type: Automation Bug
test('has title (failing)', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Intentional wrong expectation to produce a failure.
  await expect(page).toHaveTitle('Completely Wrong Title');
});

// ReportPortal defect type: Automation Bug
test('get started link (not found)', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Intentional typo in the link name to cause a lookup failure/timeout.
  await page.getByRole('link', { name: 'Get startedt' }).click();

  // Also use a misspelled heading name to create a second failure in this test.
  await expect(page.getByRole('heading', { name: 'Instalation' })).toBeVisible();
});

// ReportPortal defect type: Automation Bug
test('runtime error test', async () => {
  // Force a runtime exception to register an error in the test run.
  // @ts-ignore
  (global as any).undefinedFunction();
});

// ReportPortal defect type: Automation Bug (flaky)
test('missing await (flaky)', async ({ page }) => {
  // Missing await on navigation can cause race conditions / flakiness.
  page.goto('https://playwright.dev/');
  // Immediately assert - sometimes page hasn't loaded yet.
  await expect(page).toHaveTitle(/Playwright/);
});

test('document returns 500 (network error)', async ({ page }) => {
  // Intercept document requests and reply with 500 to simulate server error.
  await page.route('**/*', async (route) => {
    const req = route.request();
    if (req.resourceType() === 'document') {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
      return;
    }
    await route.continue();
  });

  // Navigation should fail because the main document returns 500.
  await page.goto('https://playwright.dev/');
  // Expect something to assert after the failure (will usually error/out).
  await expect(page).toHaveTitle('This will not load');
});

// ReportPortal defect type: Automation Bug
test('invalid JSON parse (runtime)', async () => {
  // Natural runtime parsing error.
  JSON.parse('{ bad json }');
});

// ReportPortal defect type: Automation Bug
test('selector timeout (natural)', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // Wait for a selector that doesn't exist with a very short timeout.
  await page.waitForSelector('.this-selector-does-not-exist', { timeout: 200 });
});
