import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('link', { name: /open terminal/i })).toBeVisible();
});

test('terminal page loads', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/en/terminal');
  await expect(page.getByRole('textbox', { name: /terminal/i })).toBeVisible();
});
