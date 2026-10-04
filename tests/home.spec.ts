import { expect, test } from '@playwright/test';

for (const language of ['en', 'de'] as const) {
  test(`${language}: brand symbol, brand text and centered footer return home with fresh rounds`, async ({ page }) => {
    await page.addInitScript(language => localStorage.setItem('elementris.language', language), language);
    await page.goto('/');
    const de = language === 'de';
    const start = page.getByRole('button', { name: de ? 'Angeleitete Lektion starten' : 'Start guided lesson', exact: true });
    const practice = page.getByRole('button', { name: de ? 'Übung starten' : 'Start practice', exact: true });
    const home = page.getByRole('button', { name: de ? 'Zur Startseite' : 'Back to home', exact: true });
    const heading = page.getByRole('heading', { name: de ? 'Lerne zwei Elementfamilien kennen.' : 'Meet two element families.' });
    await expect(home).toHaveCount(0);
    await start.click();
    await page.locator('.highlighted').click();
    await page.locator('.brand-mark').click();
    await expect(heading).toBeFocused();
    await expect(practice).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    expect(await page.evaluate(() => scrollY)).toBe(0);

    await practice.click();
    await page.getByRole('button', { name: de ? 'Hinweis zur Familie' : 'Get a family clue', exact: true }).click();
    await home.scrollIntoViewIfNeeded();
    const bounds = (await home.boundingBox())!;
    const width = await page.evaluate(() => innerWidth);
    expect(Math.abs(bounds.x + bounds.width / 2 - width / 2)).toBeLessThan(1);
    await home.focus();
    await page.keyboard.press('Enter');
    await expect(heading).toBeFocused();
    await practice.click();
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
    await expect(page.locator('.highlighted')).toHaveCount(0);
    await expect(page.getByRole('button', { name: de ? 'Hinweis zur Familie' : 'Get a family clue', exact: true })).toBeVisible();
    // Click the wordmark's dot, outside the symbol's bounds.
    await page.locator('.brand-dot').click();
    await expect(heading).toBeFocused();

    await start.click();
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
    for (let index = 0; index < 6; index++) {
      await page.locator('.highlighted').click();
      await page.getByRole('button', { name: index === 5 ? de ? 'Lektion abschließen' : 'Finish lesson' : de ? 'Nächstes Element' : 'Next element', exact: true }).click();
    }
    await home.click();
    await expect(heading).toBeFocused();
    await expect(start).toBeVisible();
    await expect(practice).toBeVisible();
  });
}
