import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://manoa-spots.vercel.app/');
  await page.getByRole('heading', { name: 'trending spots' }).click();
  await page.locator('div').filter({ hasText: 'find your perfect spot!' }).nth(2).click();
  await page.getByRole('link', { name: 'spotsspots' }).click();
});
