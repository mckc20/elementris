import { expect, test } from '@playwright/test';

for (const [primary, expected] of [['de-AT', 'de'], ['de-DE', 'de'], ['de-CH', 'de'], ['en-US', 'en'], ['fr-FR', 'en']] as const) {
  test(`browser preference ${primary} selects ${expected}`, async ({ page, browserName }) => {
    await page.addInitScript(primary => {
      Object.defineProperty(navigator, 'languages', { value: [primary, 'de'] });
    }, primary);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', expected);
    await expect(page.getByRole('button', { name: expected === 'de' ? 'Deutsch' : 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
}

test('German lesson completes and replays; switches preserve correction, placed tiles and completion', async ({ page, browserName }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'languages', { value: ['de-AT', 'en'] }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page).toHaveTitle('Elementris — Elementfamilien kennenlernen');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Lerne Elementfamilien/);
  await expect(page.getByRole('heading', { name: 'Lerne zwei Elementfamilien kennen.' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('german-introduction.png'), fullPage: true });
  // The home control and language controls precede the lesson action in keyboard order.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('button', { name: 'Deutsch', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Deutsch', exact: true })).toHaveCSS('outline-width', '3px');
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('button', { name: 'Angeleitete Lektion starten' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Platziere Lithium in der Familie Edelgase', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Lithium gehört zu den Alkalimetallen in Gruppe 1');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Lithium belongs to the alkali metals in group 1');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
  await page.getByRole('button', { name: 'Place Lithium in Alkali metals (highlighted)', exact: true }).click();
  await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Gut platziert!');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1');
  await expect(page.locator('.placed-tile')).toHaveCSS('animation-name', 'none');
  await page.screenshot({ path: test.info().outputPath('german-board.png'), fullPage: true });
  await page.getByRole('button', { name: 'Nächstes Element' }).click();
  const elements = [['Helium', 'Edelgase'], ['Natrium', 'Alkalimetalle'], ['Neon', 'Edelgase'], ['Kalium', 'Alkalimetalle'], ['Argon', 'Edelgase']];
  for (const [index, [element, family]] of elements.entries()) {
    await expect(page.getByRole('heading', { name: `Finde die Familie von ${element}` })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: `Platziere ${element} in der Familie ${family} (hervorgehoben)`, exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Gut platziert!');
    await page.getByRole('button', { name: index === 4 ? 'Lektion abschließen' : 'Nächstes Element' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Zwei Familien. Sechs Entdeckungen.' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('german-completion.png'), fullPage: true });
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Two families. Six discoveries.' })).toBeVisible();
  await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
  await page.getByRole('button', { name: 'Lektion wiederholen' }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
  await expect(page.getByRole('heading', { name: 'Finde die Familie von Lithium' })).toBeVisible();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Meet two element families.' })).toBeVisible();
});

test('invalid saved preference falls back to the browser language', async ({ page, browserName }) => {
  await page.addInitScript(() => {
    localStorage.setItem('elementris.language', 'broken');
    Object.defineProperty(navigator, 'languages', { value: [] });
    Object.defineProperty(navigator, 'language', { value: 'de-CH' });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('failed storage and unavailable preferences do not block a lesson or switching', async ({ page, browserName }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
    Object.defineProperty(navigator, 'languages', { value: [] });
    Object.defineProperty(navigator, 'language', { value: '' });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
  await page.getByRole('button', { name: 'Angeleitete Lektion starten' }).click();
  await page.getByRole('button', { name: 'Platziere Lithium in der Familie Alkalimetalle (hervorgehoben)', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Gut platziert!');
});
