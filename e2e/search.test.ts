import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://manoa-spots.vercel.app/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('f');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('c');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByPlaceholder('Search spots...').click();
  await page.getByPlaceholder('Search spots...').fill('c');
  await page.locator('#basicNavbarNav button').click();
  await page.getByLabel('Outlets Available').check();
  await page.getByRole('button', { name: 'Apply Filters' }).click();
});
