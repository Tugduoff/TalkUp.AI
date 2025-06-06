import { test, expect } from '@playwright/test';

test('Go to About page', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await expect(page.locator('h3')).toContainText('Home');
  await page.getByText('Page vitrine').click();
  await page.getByText('Change Logo color by clicking').click();
  await page.getByRole('link', { name: 'About' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL('http://localhost:8080/about');
  await expect(page.getByRole('heading', { name: 'About' })).toContainText('About');
});
