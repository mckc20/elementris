import { expect, test } from '@playwright/test';

const placements = [
  ['Lithium', 'Alkali metals'], ['Helium', 'Noble gases'], ['Sodium', 'Alkali metals'],
  ['Neon', 'Noble gases'], ['Potassium', 'Alkali metals'], ['Argon', 'Noble gases'],
];

test('guided lesson loads, corrects a mistake, completes and replays', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  await page.goto('/');
  await expect(page).toHaveTitle('Elementris — Learn element families');
  await expect(page.getByRole('heading', { name: 'Meet two element families.' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('introduction.png'), fullPage: true });
  await page.getByRole('button', { name: 'Start guided lesson' }).click();
  await page.getByRole('button', { name: 'Place Lithium in Noble gases', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Lithium belongs to the alkali metals in group 1');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
  for (const [index, [element, family]] of placements.entries()) {
    await expect(page.getByRole('heading', { name: `Find ${element}’s family` })).toBeVisible();
    const target = page.getByRole('button', { name: `Place ${element} in ${family} (highlighted)`, exact: true });
    await expect(target).toHaveClass(/highlighted/);
    const bounds = await target.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (index === 0) await page.screenshot({ path: test.info().outputPath('board.png'), fullPage: true });
    await target.click();
    await expect(page.getByRole('status')).toContainText('Nicely placed!');
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1));
    await page.getByRole('button', { name: index === 5 ? 'Finish lesson' : 'Next element' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Two families. Six discoveries.' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('completion.png'), fullPage: true });
  await page.getByRole('button', { name: 'Replay lesson' }).click();
  await expect(page.getByRole('heading', { name: 'Find Lithium’s family' })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
  expect(errors).toEqual([]);
});

test('complete keyboard flow works with reduced motion and visible focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Start guided lesson' })).toBeFocused();
  await page.keyboard.press('Enter');
  // Wrong destination, then return to the highlighted one and retry.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('Try the highlighted column');
  await page.keyboard.press('Shift+Tab');
  for (const [index, [element, family]] of placements.entries()) {
    if (index > 0) {
      await page.keyboard.press('Tab');
      if (family === 'Noble gases') await page.keyboard.press('Tab');
    }
    const target = page.getByRole('button', { name: `Place ${element} in ${family} (highlighted)` });
    await expect(target).toBeFocused();
    await expect(target).toHaveCSS('outline-width', '3px');
    await page.keyboard.press('Space');
    await expect(page.locator('.placed-tile')).toHaveCSS('animation-name', 'none');
    const next = page.getByRole('button', { name: index === 5 ? 'Finish lesson' : 'Next element' });
    await expect(next).toBeFocused();
    await page.keyboard.press('Enter');
  }
  await expect(page.getByRole('heading', { name: 'Two families. Six discoveries.' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Find Lithium’s family' })).toBeFocused();
});
