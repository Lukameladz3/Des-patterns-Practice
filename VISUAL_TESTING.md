# Visual Regression Testing Guide

This project uses Playwright's visual comparison engine to ensure the UI remains consistent.

## How It Works

- **Baselines**: "Golden" images stored in `tests/visual.spec.ts-snapshots/`.
- **Comparison**: Each test run captures a new screenshot and compares it pixel-by-pixel with the baseline.
- **Dynamic Data**: We use random users for testing, but for visual consistency, we programmatically force the username to display as **"Welcome VisualUser"** just before taking screenshots.

## Running Visual Tests

To run the visual comparison tests:

```bash
npm run test:visual
```

## Updating Snapshots

If you make a UI change (e.g., changing a button color), the visual test will fail. You need to verify the change is intentional and update the baselines.

### Update All Snapshots

```bash
npm run test:visual:update
```

### Update Specific Test Snapshots

If you only want to update one specific test file (useful if you have many visual tests):

```bash
npx playwright test tests/visual.spec.ts --update-snapshots
```

## Troubleshooting

- **"Pixels are different"**: Check the report (`npx playwright show-report`) to see the "Diff" view.
  - If it's a real bug -> Fix the code.
  - If it's an intentional change -> Update snapshots.
- **Dynamic Content**: If a test creates random data (like IDs or dates) that shows up in the UI, we must mask it or force it to a static value in the test code before calling `toHaveScreenshot`.
  - _Example:_ `page.evaluate(() => document.querySelector('#date').textContent = '2024-01-01');`
