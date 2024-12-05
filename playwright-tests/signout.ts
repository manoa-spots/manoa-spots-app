// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/signin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill('d');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('c');
  await page.locator('input[name="confirmPassword"]').click();
  await page.locator('input[name="confirmPassword"]').fill('c');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'profile' }).click();
});