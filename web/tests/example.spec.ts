import { expect, test } from '@playwright/test';

test('Go to About page', async ({ page }) => {
  await page.goto('/');
});
