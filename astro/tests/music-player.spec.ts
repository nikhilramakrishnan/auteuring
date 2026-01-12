import { test, expect } from '@playwright/test';

test.describe('Music Player', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collection');
  });

  test('music player renders on collection page', async ({ page }) => {
    await expect(page.locator('.music-player')).toBeVisible();
    await expect(page.locator('.track-list')).toBeVisible();
    await expect(page.locator('#playButton')).toBeVisible();
  });

  test('track list shows all 8 tracks', async ({ page }) => {
    const tracks = page.locator('.track-item');
    await expect(tracks).toHaveCount(8);
  });

  test('clicking track selects it', async ({ page }) => {
    const firstTrack = page.locator('.track-item').first();

    // Initially no track should be active
    await expect(firstTrack).not.toHaveClass(/active/);

    // Click the track
    await firstTrack.click();

    // Track should now be active
    await expect(firstTrack).toHaveClass(/active/);
  });

  test('clicking different track changes selection', async ({ page }) => {
    const tracks = page.locator('.track-item');
    const firstTrack = tracks.first();
    const secondTrack = tracks.nth(1);

    // Click first track
    await firstTrack.click();
    await expect(firstTrack).toHaveClass(/active/);

    // Click second track
    await secondTrack.click();
    await expect(secondTrack).toHaveClass(/active/);
    await expect(firstTrack).not.toHaveClass(/active/);
  });

  test('play button toggles icon', async ({ page }) => {
    const playButton = page.locator('#playButton');
    const playIcon = playButton.locator('.play-icon');
    const pauseIcon = playButton.locator('.pause-icon');

    // Initially play icon should be visible
    await expect(playIcon).toBeVisible();
    await expect(pauseIcon).toBeHidden();

    // Click play
    await playButton.click();

    // Pause icon should now be visible
    await expect(pauseIcon).toBeVisible();
    await expect(playIcon).toBeHidden();

    // Click again to pause
    await playButton.click();

    // Play icon should be visible again
    await expect(playIcon).toBeVisible();
    await expect(pauseIcon).toBeHidden();
  });

  test('prev/next buttons are disabled initially', async ({ page }) => {
    const prevButton = page.locator('#prevButton');
    const nextButton = page.locator('#nextButton');

    await expect(prevButton).toBeDisabled();
    await expect(nextButton).toBeDisabled();
  });

  test('prev button disabled on first track, next enabled', async ({ page }) => {
    const prevButton = page.locator('#prevButton');
    const nextButton = page.locator('#nextButton');
    const firstTrack = page.locator('.track-item').first();

    // Select first track
    await firstTrack.click();

    // Prev should be disabled (first track)
    await expect(prevButton).toBeDisabled();
    // Next should be enabled
    await expect(nextButton).toBeEnabled();
  });

  test('next button disabled on last track, prev enabled', async ({ page }) => {
    const prevButton = page.locator('#prevButton');
    const nextButton = page.locator('#nextButton');
    const lastTrack = page.locator('.track-item').last();

    // Select last track
    await lastTrack.click();

    // Next should be disabled (last track)
    await expect(nextButton).toBeDisabled();
    // Prev should be enabled
    await expect(prevButton).toBeEnabled();
  });

  test('next button advances to next track', async ({ page }) => {
    const tracks = page.locator('.track-item');
    const firstTrack = tracks.first();
    const secondTrack = tracks.nth(1);
    const nextButton = page.locator('#nextButton');

    // Select first track
    await firstTrack.click();
    await expect(firstTrack).toHaveClass(/active/);

    // Click next
    await nextButton.click();

    // Second track should now be active
    await expect(secondTrack).toHaveClass(/active/);
    await expect(firstTrack).not.toHaveClass(/active/);
  });

  test('prev button goes to previous track', async ({ page }) => {
    const tracks = page.locator('.track-item');
    const firstTrack = tracks.first();
    const secondTrack = tracks.nth(1);
    const prevButton = page.locator('#prevButton');

    // Select second track
    await secondTrack.click();
    await expect(secondTrack).toHaveClass(/active/);

    // Click prev
    await prevButton.click();

    // First track should now be active
    await expect(firstTrack).toHaveClass(/active/);
    await expect(secondTrack).not.toHaveClass(/active/);
  });

  test('download button is disabled initially, enabled after track selection', async ({ page }) => {
    const downloadButton = page.locator('#downloadButton');
    const firstTrack = page.locator('.track-item').first();

    // Initially disabled
    await expect(downloadButton).toBeDisabled();

    // Select a track
    await firstTrack.click();

    // Should be enabled
    await expect(downloadButton).toBeEnabled();
  });

  test('progress bar exists', async ({ page }) => {
    await expect(page.locator('#progressBar')).toBeVisible();
    // Progress indicator starts with width 0, so just check it exists in DOM
    await expect(page.locator('#progress')).toBeAttached();
  });

  test('time display shows initial state', async ({ page }) => {
    const timeDisplay = page.locator('#timeDisplay');
    await expect(timeDisplay).toBeVisible();
    await expect(timeDisplay).toContainText('0:00');
  });

  test('tracks have correct data attributes', async ({ page }) => {
    const firstTrack = page.locator('.track-item').first();

    // Check data attributes exist
    const src = await firstTrack.getAttribute('data-src');
    const title = await firstTrack.getAttribute('data-title');
    const info = await firstTrack.getAttribute('data-info');

    expect(src).toContain('tracks.auteur.ing');
    expect(title).toBeTruthy();
    expect(info).toMatch(/FTRAX\d+/);
  });
});
