# Visual Testing Workflows

This document explains the automated workflows for managing visual test snapshots across different platforms.

## Problem

Visual test snapshots are platform-specific. When you generate snapshots on Windows (with `-win32.png` suffix) but run tests on Linux (CI/CD using Ubuntu), the tests will fail because:
1. Font rendering differs between platforms
2. Anti-aliasing varies
3. Pixel-perfect matches are impossible across OS boundaries

## Solution

We have two automated workflows to handle cross-platform snapshot management:

### 1. Manual Snapshot Update Workflow

**File:** `update-visual-snapshots.yml`

**Trigger:** Manual dispatch (workflow_dispatch)

**Purpose:** Manually update snapshots on the target CI platform (Ubuntu)

**How to use:**
1. Go to GitHub Actions tab
2. Select "Update Visual Test Snapshots" workflow
3. Click "Run workflow"
4. Select the branch you want to update (defaults to current branch)
5. The workflow will:
   - Run visual tests with `--update-snapshots` flag
   - Commit updated snapshots back to the branch
   - Upload snapshots as artifacts for review

**When to use:**
- After making intentional UI changes
- When migrating from Windows to Linux snapshots
- When you need to regenerate all snapshots on the CI platform

### 2. Automatic Snapshot Update on Failure

**File:** `auto-update-snapshots-on-failure.yml`

**Trigger:** When "Playwright Visual Tests" workflow fails

**Purpose:** Automatically detect visual test failures and update snapshots

**How it works:**
1. Monitors the main visual test workflow
2. When visual tests fail, it automatically:
   - Checks out the failing branch
   - Regenerates snapshots on Ubuntu (matching CI environment)
   - Commits changes with message: `chore: auto-update visual test snapshots`
   - Posts a comment on the PR (if applicable)
   - Uploads snapshots as artifacts

**Benefits:**
- Eliminates manual snapshot regeneration
- Ensures snapshots always match the CI environment
- Provides transparency with PR comments
- Speeds up development workflow

## Best Practices

### 1. Choose Your Primary Platform

**Recommended:** Use Linux (Ubuntu) as your primary snapshot platform since that's what CI uses.

**Why?**
- CI/CD runs on Ubuntu
- Snapshots will be consistent between local runs and CI
- No cross-platform issues

### 2. Local Development on Windows

If you develop on Windows but CI uses Linux:

**Option A: Use WSL2 (Recommended)**
```bash
# Inside WSL2 Ubuntu
npm test -- tests/visual.spec.ts --update-snapshots
```

**Option B: Let CI Generate Snapshots**
1. Make your UI changes
2. Push to GitHub
3. Let the visual test fail
4. The auto-update workflow will regenerate Linux snapshots
5. Pull the updated snapshots

**Option C: Manual Workflow Dispatch**
1. Make your UI changes
2. Push to GitHub
3. Manually run "Update Visual Test Snapshots" workflow
4. Pull the updated snapshots

### 3. Reviewing Snapshot Changes

Always review snapshot changes before merging:

1. Check the artifacts uploaded by workflows
2. Download and compare old vs new snapshots
3. Ensure changes are intentional
4. Look for unexpected visual regressions

### 4. Snapshot Naming Convention

Playwright automatically generates platform-specific names:
- Linux: `test-name-chromium-linux.png`
- Windows: `test-name-chromium-win32.png`
- macOS: `test-name-chromium-darwin.png`

The workflow will generate the correct suffix based on the runner OS.

## Workflow Permissions

Both workflows require:
- `contents: write` - To commit and push snapshot updates
- `actions: write` - To trigger workflows (auto-update only)

These are configured in the workflow files.

## Troubleshooting

### Workflow doesn't commit changes

**Cause:** No snapshot differences detected

**Solution:** Check if the test failure is actually visual-related. Look at the test logs.

### Snapshots still failing after auto-update

**Cause:** Non-visual test failures (e.g., element not found)

**Solution:** Fix the underlying test issue, not just snapshots.

### Multiple platforms needed

**Advanced:** If you need snapshots for multiple platforms, modify `playwright.config.ts`:

```typescript
// Generate snapshots with platform-independent names
use: {
  // ... other config
},
snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
```

This removes platform suffix, but requires more careful management.

## CI/CD Integration

The workflows integrate with your existing CI:

```
Push/PR → Playwright Visual Tests (playwright.yml)
             ↓ (on failure)
          Auto-Update Snapshots (auto-update-snapshots-on-failure.yml)
             ↓
          Commit updated snapshots
             ↓
          Re-trigger tests (automatically via push)
```

## Monitoring

Check workflow status:
- GitHub Actions tab shows all workflow runs
- PR comments notify about auto-updates
- Artifacts preserve snapshot history

## Security Notes

- Workflows use `GITHUB_TOKEN` (automatically provided)
- `[skip ci]` in commit messages prevents infinite loops
- Only updates `.png` files in `tests/` directory
- Runs only on repository events, not external PRs (for security)
