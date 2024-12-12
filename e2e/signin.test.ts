// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://manoa-spots.vercel.app/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('j');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('c');
  await page.getByRole('button', { name: 'Sign In' }).click();
});
