import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://manoa-spots.vercel.app/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
});
