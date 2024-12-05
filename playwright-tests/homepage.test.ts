import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/home');
  await page.getByText('add spotprofileLogin').click();
  await page.getByRole('navigation').click();
  await page.getByText('spotsadd spotprofileLogin').click();
  await page.getByText('spotsadd spotprofileLogin').click();
  await page.getByPlaceholder('Search spots...').click();
  await page.locator('div').filter({ hasText: 'find your perfect spot!' }).nth(2).dblclick();
  await page.getByRole('heading', { name: 'find your perfect spot!' }).dblclick();
});
