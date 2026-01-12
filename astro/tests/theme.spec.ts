import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('theme toggle button exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.sidebar #theme-toggle')).toBeVisible();
  });

  test('clicking toggle switches theme', async ({ page }) => {
    await page.goto('/');

    // Get initial state
    const initialIsDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('theme-dark') ||
        (!document.documentElement.classList.contains('theme-light') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    // Click toggle
    await page.click('.sidebar #theme-toggle');

    // Check theme changed
    const afterClickIsDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('theme-dark');
    });

    if (initialIsDark) {
      // Was dark, should now be light
      expect(afterClickIsDark).toBe(false);
      await expect(page.locator('html')).toHaveClass(/theme-light/);
    } else {
      // Was light, should now be dark
      expect(afterClickIsDark).toBe(true);
      await expect(page.locator('html')).toHaveClass(/theme-dark/);
    }
  });

  test('theme persists in localStorage', async ({ page }) => {
    await page.goto('/');

    // Toggle to dark
    await page.click('.sidebar #theme-toggle');

    // Check localStorage
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(savedTheme).toBeTruthy();

    // Reload and check theme persists
    await page.reload();

    const themeAfterReload = await page.evaluate(() => localStorage.getItem('theme'));
    expect(themeAfterReload).toBe(savedTheme);
  });

  test('theme persists across navigation', async ({ page }) => {
    await page.goto('/');

    // Set to dark theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
    });

    // Navigate to another page
    await page.click('.sidebar a[href="/engineering"]');
    await expect(page).toHaveURL('/engineering');

    // Check theme is still dark
    await expect(page.locator('html')).toHaveClass(/theme-dark/);
  });

  test('icons swap on toggle', async ({ page }) => {
    await page.goto('/');

    const moonIcon = page.locator('.sidebar #theme-toggle .moon-icon');
    const sunIcon = page.locator('.sidebar #theme-toggle .sun-icon');

    // Get initial visibility
    const moonVisible = await moonIcon.isVisible();
    const sunVisible = await sunIcon.isVisible();

    // One should be visible, one hidden
    expect(moonVisible !== sunVisible).toBe(true);

    // Toggle
    await page.click('.sidebar #theme-toggle');

    // Icons should swap
    const moonVisibleAfter = await moonIcon.isVisible();
    const sunVisibleAfter = await sunIcon.isVisible();

    expect(moonVisibleAfter).toBe(!moonVisible);
    expect(sunVisibleAfter).toBe(!sunVisible);
  });
});

test.describe('Theme - System Preference', () => {
  test('respects system dark mode preference', async ({ page }) => {
    // Emulate dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    // Clear any saved preference
    await page.evaluate(() => localStorage.removeItem('theme'));
    await page.reload();

    // Should use dark theme based on system preference
    const isDark = await page.evaluate(() => {
      const html = document.documentElement;
      return !html.classList.contains('theme-light');
    });

    expect(isDark).toBe(true);
  });

  test('respects system light mode preference', async ({ page }) => {
    // Emulate light mode preference
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    // Clear any saved preference
    await page.evaluate(() => localStorage.removeItem('theme'));
    await page.reload();

    // Should use light theme based on system preference
    const isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('theme-dark');
    });

    expect(isDark).toBe(false);
  });
});
