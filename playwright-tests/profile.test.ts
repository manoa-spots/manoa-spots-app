import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/profile');
  await page.getByRole('heading', { name: 'Jane Doe' }).click();
  await page.getByRole('img', { name: 'Broome St General Store image' }).click();
  await expect(page.getByRole('img', { name: 'Holoholo Drive-Thru Espresso' })).toBeVisible();
});
