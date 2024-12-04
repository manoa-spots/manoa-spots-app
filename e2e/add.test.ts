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
  await page.getByPlaceholder('e.g., Hamilton Library Study').click();
  await page.getByPlaceholder('e.g., Hamilton Library Study').fill('C');
  await page.getByPlaceholder('Describe what makes this spot').click();
  await page.getByPlaceholder('Describe what makes this spot').fill('G');
  await page.getByPlaceholder('Full address of the spot').click();
  await page.getByPlaceholder('Full address of the spot').fill('2');
  await page.getByPlaceholder('e.g., 21.2989').click();
  await page.getByPlaceholder('e.g., 21.2989').fill('2');
  await page.getByPlaceholder('e.g., -').click();
  await page.getByPlaceholder('e.g., -').fill('2');
  await page.locator('input[name="hasParking"]').check();
  await page.locator('input[name="hasFoodDrinks"]').check();
  await page.locator('input[name="maxGroupSize"]').click();
  await page.locator('input[name="maxGroupSize"]').fill('10');
  await page.getByRole('combobox').selectOption('other');
  await page.getByPlaceholder('Enter the URL of an image of').click();
});
