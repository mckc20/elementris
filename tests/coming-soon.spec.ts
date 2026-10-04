import { expect, test } from '@playwright/test';

test('Coming Soon loads its assets without errors and fits the viewport', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });

  await page.goto('/');
  await expect(page).toHaveTitle('Elementris — Coming Soon');
  await expect(page.getByRole('heading', { name: 'Coming soon.' })).toBeVisible();
  await expect(page.locator('footer')).toHaveText('Small tiles. Big discoveries.');
  await expect(page.locator('.element')).toHaveCount(3);
  expect(await page.locator('body').evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(245, 247, 242)');
  await expect(page.locator('.tile-lime')).toHaveCSS('background-color', 'rgb(217, 233, 185)');
  expect(errors).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('coming-soon.png'), fullPage: true });
});

test('Coming Soon remains available with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Coming soon.' })).toBeVisible();
  await expect(page.locator('.elements')).toBeVisible();
});
