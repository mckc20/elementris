import { expect, test } from '@playwright/test';

for (const language of ['en', 'de'] as const) {
  for (const entry of ['guided', 'direct'] as const) {
    test(`${language}: ${entry} entry to practice, staged hints, correction, results and replay`, async ({ page }) => {
      await page.addInitScript(language => localStorage.setItem('elementris.language', language), language);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      const de = language === 'de';
      const start = de ? 'Angeleitete Lektion starten' : 'Start guided lesson';
      const next = de ? 'Nächstes Element' : 'Next element';
      const elements = de ? ['Lithium', 'Helium', 'Natrium', 'Neon', 'Kalium', 'Argon'] : ['Lithium', 'Helium', 'Sodium', 'Neon', 'Potassium', 'Argon'];
      const family = (index: number) => index % 2 === 0 ? de ? 'Alkalimetalle' : 'Alkali metals' : de ? 'Edelgase' : 'Noble gases';
      const placement = (element: string, familyName: string) => de ? `Platziere ${element} in der Familie ${familyName}` : `Place ${element} in ${familyName}`;
      if (entry === 'guided') {
        await page.getByRole('button', { name: start }).click();
        for (let index = 0; index < elements.length; index++) {
          await page.getByRole('button', { name: placement(elements[index], family(index)) + (de ? ' (hervorgehoben)' : ' (highlighted)'), exact: true }).click();
          await page.getByRole('button', { name: index === 5 ? de ? 'Lektion abschließen' : 'Finish lesson' : next }).click();
        }
        await page.getByRole('button', { name: de ? 'Übung starten' : 'Start practice', exact: true }).click();
      } else {
        for (let tab = 0; tab < 5; tab++) await page.keyboard.press('Tab');
        await expect(page.getByRole('button', { name: de ? 'Übung starten' : 'Start practice', exact: true })).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
      }
      const order: number[] = [];
      for (let turn = 0; turn < elements.length; turn++) {
        const index = elements.indexOf((await page.locator('.current-name').textContent())!);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(order).not.toContain(index);
        order.push(index);
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
          await page.getByRole('button', { name: placement(elements[index], family(index % 2 === 0 ? 1 : 0)), exact: true }).click();
          const correctFamily = index % 2 === 0 ? de ? 'Alkalimetallen' : 'alkali metals' : de ? 'Edelgasen' : 'noble gases';
          await expect(page.getByRole('status')).toContainText(de ? `gehört zu den ${correctFamily}` : `belongs to the ${correctFamily}`);
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
      await expect(page.locator('.review-card')).toContainText(elements[order[0]]);
      await expect(page.locator('.review-card')).toContainText(elements[order[1]]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: test.info().outputPath(`${language}-practice-results.png`), fullPage: true });
      await page.getByRole('button', { name: de ? 'English' : 'Deutsch', exact: true }).click();
      await expect(page.locator('.result-metrics dd').first()).toHaveText('5 / 6');
      await page.getByRole('button', { name: de ? 'Replay practice' : 'Übung wiederholen', exact: true }).click();
      await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
      await expect(page.locator('.highlighted')).toHaveCount(0);
      await expect(page.getByRole('button', { name: de ? 'Get a family clue' : 'Hinweis zur Familie', exact: true })).toBeVisible();
      // Replay also visits every element once, with fresh records in the switched language.
      const replayElements = de ? ['Lithium', 'Helium', 'Sodium', 'Neon', 'Potassium', 'Argon'] : ['Lithium', 'Helium', 'Natrium', 'Neon', 'Kalium', 'Argon'];
      const seen = new Set<number>();
      for (let turn = 0; turn < replayElements.length; turn++) {
        const index = replayElements.indexOf((await page.locator('.current-name').textContent())!);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(seen.has(index)).toBe(false);
        seen.add(index);
        const familyName = index % 2 === 0 ? de ? 'Alkali metals' : 'Alkalimetalle' : de ? 'Noble gases' : 'Edelgase';
        const target = de ? `Place ${replayElements[index]} in ${familyName}` : `Platziere ${replayElements[index]} in der Familie ${familyName}`;
        await page.getByRole('button', { name: target, exact: true }).click();
        await page.getByRole('button', { name: turn === 5 ? de ? 'See results' : 'Ergebnisse ansehen' : de ? 'Next element' : 'Nächstes Element', exact: true }).click();
      }
      await expect(page.locator('.result-metrics dd').nth(1)).toHaveText('6 / 6');
      await expect(page.locator('.review-card li')).toHaveCount(0);
      await page.getByRole('button', { name: de ? 'Back to home' : 'Zur Startseite', exact: true }).click();
      await expect(page.getByRole('heading', { name: de ? 'Meet two element families.' : 'Lerne zwei Elementfamilien kennen.' })).toBeFocused();
      await expect(page.getByRole('button', { name: de ? 'Start practice' : 'Übung starten', exact: true })).toBeVisible();
    });
  }
}
