import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/home');
  await page.getByRole('link', { name: 'add spot' }).click();
  await page.getByRole('link', { name: 'add spot' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('j');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('changeme');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'add spot' }).click();
});
