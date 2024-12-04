import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Search spots...').click();
  await page.getByPlaceholder('Search spots...').fill('l');
  await page.locator('#basicNavbarNav button').click();
  await page.getByLabel('Outlets').check();
  await page.getByRole('button', { name: 'Apply Filters' }).click();
  await expect(page.getByLabel('Max Group Size:')).toBeVisible();
  await page.getByLabel('Max Group Size:').click();
  await page.getByRole('button', { name: 'Apply Filters' }).click();
});
