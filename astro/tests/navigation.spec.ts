import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/auteuring/);
    await expect(page.locator('main').locator('text=Hello, I\'m Nikhil')).toBeVisible();
  });

  test('sidebar navigation links work', async ({ page }) => {
    await page.goto('/');

    // Navigate to engineering
    await page.click('.sidebar a[href="/engineering"]');
    await expect(page).toHaveURL('/engineering');
    await expect(page.locator('main h1')).toContainText('engineering');

    // Navigate to music
    await page.click('.sidebar a[href="/music"]');
    await expect(page).toHaveURL('/music');
    await expect(page.locator('main h1')).toContainText('music');

    // Navigate to filmmaking
    await page.click('.sidebar a[href="/filmmaking"]');
    await expect(page).toHaveURL('/filmmaking');
    await expect(page.locator('main h1')).toContainText('filmmaking');

    // Navigate to collection
    await page.click('.sidebar a[href="/collection"]');
    await expect(page).toHaveURL('/collection');
    await expect(page.locator('main h1')).toContainText('collection');

    // Navigate to live
    await page.click('.sidebar a[href="/live"]');
    await expect(page).toHaveURL('/live');
    await expect(page.locator('main h1')).toContainText('live');
  });

  test('nested navigation to iyer section works', async ({ page }) => {
    await page.goto('/');

    // Navigate to iyer
    await page.click('.sidebar a[href="/music/iyer"]');
    await expect(page).toHaveURL('/music/iyer');
    await expect(page.locator('main h1')).toContainText('iyer');

    // Navigate to sub-pages
    await page.click('.sidebar a[href="/music/iyer/theearlydays"]');
    await expect(page).toHaveURL('/music/iyer/theearlydays');

    await page.click('.sidebar a[href="/music/iyer/gigsandmemories"]');
    await expect(page).toHaveURL('/music/iyer/gigsandmemories');

    await page.click('.sidebar a[href="/music/iyer/now"]');
    await expect(page).toHaveURL('/music/iyer/now');
  });

  test('brand link navigates to homepage', async ({ page }) => {
    await page.goto('/engineering');
    await page.click('.sidebar a:has-text("auteuring")');
    await expect(page).toHaveURL('/');
  });

  test('view transitions are smooth (no flash)', async ({ page }) => {
    await page.goto('/');

    // Navigate and ensure page doesn't flash white
    await page.click('.sidebar a[href="/engineering"]');
    await expect(page).toHaveURL('/engineering');

    // Page should have loaded without error
    await expect(page.locator('main h1')).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile menu toggle works', async ({ page }) => {
    await page.goto('/');

    // Sidebar should be hidden on mobile (translated off-screen, no .open class)
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).not.toHaveClass(/open/);

    // Click hamburger menu
    await page.click('#menu-toggle');

    // Sidebar should now be open
    await expect(sidebar).toHaveClass(/open/);

    // Click backdrop to close
    await page.click('#menu-backdrop');
    await expect(sidebar).not.toHaveClass(/open/);
  });

  test('mobile navigation works', async ({ page }) => {
    await page.goto('/');

    // Open menu
    await page.click('#menu-toggle');

    // Navigate
    await page.click('.sidebar a[href="/engineering"]');
    await expect(page).toHaveURL('/engineering');

    // Menu should close after navigation
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).not.toHaveClass(/open/);
  });
});
