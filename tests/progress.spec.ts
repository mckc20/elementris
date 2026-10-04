import { expect, test, type Page } from '@playwright/test';

async function placeCurrent(page: Page, de: boolean, last: boolean) {
  const symbol = await page.locator('.current-element > .element strong').textContent();
  const alkali = ['Li', 'Na', 'K'].includes(symbol!);
  await page.locator('.family-column').nth(alkali ? 0 : 1).click();
  await page.getByRole('button', { name: last ? de ? 'Ergebnisse ansehen' : 'See results' : de ? 'Nächstes Element' : 'Next element', exact: true }).click();
}

for (const de of [false, true]) {
  test(`${de ? 'de' : 'en'}: returning player reviews actual mistakes, resolves them and resets progress`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: de ? 'Deutsch' : 'English', exact: true }).click();
    await page.getByRole('button', { name: de ? 'Angeleitete Lektion starten' : 'Start guided lesson', exact: true }).click();
    for (let index = 0; index < 6; index++) {
      await page.locator('.highlighted').click();
      await page.getByRole('button', { name: index === 5 ? de ? 'Lektion abschließen' : 'Finish lesson' : de ? 'Nächstes Element' : 'Next element', exact: true }).click();
    }
    await page.getByRole('button', { name: de ? 'Übung starten' : 'Start practice', exact: true }).click();
    const reviewSymbols: string[] = [];
    for (let index = 0; index < 6; index++) {
      if (index < 2) reviewSymbols.push((await page.locator('.current-element > .element strong').textContent())!);
      if (index === 0) await page.getByRole('button', { name: de ? 'Hinweis zur Familie' : 'Get a family clue', exact: true }).click();
      if (index === 1) {
        const symbol = await page.locator('.current-element > .element strong').textContent();
        await page.locator('.family-column').nth(['Li', 'Na', 'K'].includes(symbol!) ? 1 : 0).click();
      }
      await placeCurrent(page, de, index === 5);
    }
    await page.reload();
    const card = page.locator('.progress-card');
    await expect(card).toContainText(de ? 'Angeleitet: 6 / 6' : 'Guided: 6 / 6');
    await expect(card).toContainText(de ? 'Vollständige Übung · Abgeschlossen' : 'Full practice · Completed');
    await expect(card).toContainText(de ? 'Elemente zum Wiederholen: 2' : 'Elements to review: 2');
    await expect(card).toContainText('4 / 6');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath('saved-progress.png'), fullPage: true });
    await page.getByRole('button', { name: de ? 'Elemente gezielt üben' : 'Practise elements to review', exact: true }).click();
    await expect(page.getByRole('progressbar')).toHaveAttribute('max', '2');
    const seen: string[] = [];
    for (let index = 0; index < 2; index++) {
      seen.push((await page.locator('.current-element > .element strong').textContent())!);
      await placeCurrent(page, de, index === 1);
    }
    expect(seen.sort()).toEqual(reviewSymbols.sort());
    await expect(page.locator('.result-metrics dd').nth(1)).toHaveText('2 / 2');
    await page.reload();
    await expect(card).toContainText(de ? 'Elemente zum Wiederholen: 0' : 'Elements to review: 0');
    await expect(card).toContainText('6 / 6');
    await page.getByRole('button', { name: de ? 'Lernfortschritt zurücksetzen' : 'Reset learning progress', exact: true }).click();
    await page.getByRole('button', { name: de ? 'Abbrechen' : 'Cancel', exact: true }).click();
    await expect(card).toContainText('6 / 6');
    await page.getByRole('button', { name: de ? 'Lernfortschritt zurücksetzen' : 'Reset learning progress', exact: true }).click();
    await page.getByRole('button', { name: de ? 'Fortschritt löschen' : 'Clear progress', exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('elementris.progress'))).toBeNull();
    await page.reload();
    await expect(card).toContainText('0 / 6');
    await expect(card).toContainText(de ? 'Vollständige Übung · Noch nicht abgeschlossen' : 'Full practice · Not completed');
    await expect(page.locator('html')).toHaveAttribute('lang', de ? 'de' : 'en');
  });
}

test('partial guided progress survives reload; malformed data starts fresh', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start guided lesson', exact: true }).click();
  await page.locator('.highlighted').click();
  await page.reload();
  await expect(page.locator('.progress-card')).toContainText('Guided: 1 / 6');
  await page.evaluate(() => localStorage.setItem('elementris.progress', '{broken'));
  await page.reload();
  await expect(page.locator('.progress-card')).toContainText('Guided: 0 / 6');
});

test('storage failure still permits full practice, review and in-memory reset', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } }));
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Progress could not be saved');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await page.getByRole('button', { name: 'Get a family clue', exact: true }).click();
  for (let index = 0; index < 6; index++) await placeCurrent(page, false, index === 5);
  await expect(page.getByRole('heading', { name: 'Your practice results.' })).toBeVisible();
  await page.getByRole('button', { name: 'Practise elements to review', exact: true }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('max', '1');
  await page.getByRole('button', { name: 'Back to home', exact: true }).click();
  await page.getByRole('button', { name: 'Reset learning progress', exact: true }).click();
  await page.getByRole('button', { name: 'Clear progress', exact: true }).click();
  await expect(page.locator('.progress-card')).toContainText('Elements to review: 0');
});
