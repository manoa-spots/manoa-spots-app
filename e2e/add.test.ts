import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://manoa-spots.vercel.app/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('john@foo.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('changeme');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'add spot' }).click();
  await page.getByPlaceholder('e.g., Hamilton Library Study').click();
});
