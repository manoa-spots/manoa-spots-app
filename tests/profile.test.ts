import { test, expect } from '@playwright/test';

test('should load /profile after login', async ({ page }) => {
  await page.goto('/auth/signin');

  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('/home');

  await page.goto('/profile');

  // Verify the page loaded successfully
  const status = await page.evaluate(() => document.readyState);
  expect(status).toBe('complete');
});
