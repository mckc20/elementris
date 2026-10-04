import { expect, test } from '@playwright/test';

for (const language of ['en', 'de'] as const) {
  test(`${language}: guided lesson to practice, staged hints, correction, results and replay`, async ({ page }) => {
    await page.addInitScript(language => localStorage.setItem('elementris.language', language), language);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const de = language === 'de';
    const start = de ? 'Angeleitete Lektion starten' : 'Start guided lesson';
    const next = de ? 'Nächstes Element' : 'Next element';
    const elements = de ? ['Lithium', 'Helium', 'Natrium', 'Neon', 'Kalium', 'Argon'] : ['Lithium', 'Helium', 'Sodium', 'Neon', 'Potassium', 'Argon'];
    const family = (index: number) => index % 2 === 0 ? de ? 'Alkalimetalle' : 'Alkali metals' : de ? 'Edelgase' : 'Noble gases';
    const placement = (element: string, familyName: string) => de ? `Platziere ${element} in der Familie ${familyName}` : `Place ${element} in ${familyName}`;
    await page.getByRole('button', { name: start }).click();
    for (let index = 0; index < elements.length; index++) {
      await page.getByRole('button', { name: placement(elements[index], family(index)) + (de ? ' (hervorgehoben)' : ' (highlighted)'), exact: true }).click();
      await page.getByRole('button', { name: index === 5 ? de ? 'Lektion abschließen' : 'Finish lesson' : next }).click();
    }
    await page.getByRole('button', { name: de ? 'Übung starten' : 'Start practice', exact: true }).click();
    const order = [2, 1, 0, 5, 4, 3];
    for (const [turn, index] of order.entries()) {
      await expect(page.locator('.highlighted')).toHaveCount(0);
      await expect(page.locator('.family-guide')).toHaveCount(0);
      await expect(page.getByRole('heading', { name: de ? `Finde die Familie von ${elements[index]}` : `Find ${elements[index]}’s family` })).toBeFocused();
      if (turn === 0) {
        const hint = page.getByRole('button', { name: de ? 'Hinweis zur Familie' : 'Get a family clue', exact: true });
        await hint.focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('status')).toContainText(de ? 'Familienhinweis' : 'Family clue');
        await expect(page.locator('.highlighted')).toHaveCount(0);
        await expect(page.getByRole('button', { name: de ? 'Ziel hervorheben' : 'Highlight the destination', exact: true })).toBeFocused();
        await page.keyboard.press('Space');
        await expect(page.locator('.highlighted')).toHaveCount(1);
        await expect(page.getByRole('status')).toContainText(de ? 'hervorgehoben' : 'highlighted');
        await page.screenshot({ path: test.info().outputPath(`${language}-practice-hint.png`), fullPage: true });
      }
      if (turn === 1) {
        await page.getByRole('button', { name: placement(elements[index], family(0)), exact: true }).click();
        await expect(page.getByRole('status')).toContainText(de ? 'gehört zu den Edelgasen' : 'belongs to the noble gases');
        await expect(page.locator('.highlighted')).toHaveCount(0);
        await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1');
      }
      const target = placement(elements[index], family(index)) + (turn === 0 ? de ? ' (hervorgehoben)' : ' (highlighted)' : '');
      await page.getByRole('button', { name: target, exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const advance = page.getByRole('button', { name: turn === 5 ? de ? 'Ergebnisse ansehen' : 'See results' : next, exact: true });
      await expect(advance).toBeFocused();
      await page.keyboard.press('Enter');
    }
    await expect(page.getByRole('heading', { name: de ? 'Deine Ergebnisse.' : 'Your practice results.' })).toBeFocused();
    for (const [label, value] of [[de ? 'Bei der ersten Antwort richtig' : 'Correct on first answer', '5 / 6'], [de ? 'Ohne Hilfe richtig' : 'Correct without help', '4 / 6'], [de ? 'Mit Hilfe oder Korrektur platziert' : 'Placements with help or correction', '2 / 6'], [de ? 'Genutzte Hinweisstufen' : 'Hint stages used', '2'], [de ? 'Weitere Antwortversuche' : 'Retry answers', '1']]) {
      await expect(page.locator('.result-metrics > div').filter({ has: page.getByText(label, { exact: true }) }).locator('dd')).toHaveText(value);
    }
    await expect(page.locator('.review-card li')).toHaveCount(2);
    await expect(page.locator('.review-card')).toContainText(elements[2]);
    await expect(page.locator('.review-card')).toContainText(elements[1]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`${language}-practice-results.png`), fullPage: true });
    await page.getByRole('button', { name: de ? 'English' : 'Deutsch', exact: true }).click();
    await expect(page.locator('.result-metrics dd').first()).toHaveText('5 / 6');
    await page.getByRole('button', { name: de ? 'Replay practice' : 'Übung wiederholen', exact: true }).click();
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
    await expect(page.locator('.highlighted')).toHaveCount(0);
    await expect(page.getByRole('button', { name: de ? 'Get a family clue' : 'Hinweis zur Familie', exact: true })).toBeVisible();
  });
}
