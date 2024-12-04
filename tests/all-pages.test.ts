import { test, expect } from '@playwright/test';

const staticPages = [
  '/', // Home page
  '/add', // Add spot page
  '/search?q=library', // Search page with a query
];

// Protected pages requiring login
const protectedPages = ['/profile']; // Add more protected routes as needed

test.describe('Page Availability Tests', () => {
  staticPages.forEach((route) => {
    test(`should load static page: ${route}`, async ({ page }) => {
      // Navigate to the route
      await page.goto(route);

      const status = await page.evaluate(() => document.readyState);
      expect(status).toBe('complete');

      await expect(page).toHaveTitle(/.+/);
    });
  });

  protectedPages.forEach((route) => {
    test(`should load protected page after login: ${route}`, async ({ page }) => {
      // Log in to the app
      await page.goto('/auth/signin'); // Update this path to your login page
      await page.fill('input[name="email"]', 'john@foo.com'); // Use test credentials
      await page.fill('input[name="password"]', 'changeme'); // Use test credentials
      await page.click('button[type="submit"]');
      await page.waitForURL('/home'); // Redirect URL after login

      await page.goto(route);

      const status = await page.evaluate(() => document.readyState);
      expect(status).toBe('complete');

      await expect(page).toHaveTitle(/.+/);
    });
  });
});
