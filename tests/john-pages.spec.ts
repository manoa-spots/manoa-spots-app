import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});

test('User Pages', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('link', { name: 'Add Spot' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'john@foo.com' })).toBeVisible();
  await page.getByRole('link', { name: 'Add Spot' }).click();
  await expect(page.getByRole('heading', { name: 'Add Spot' })).toBeVisible();
});
