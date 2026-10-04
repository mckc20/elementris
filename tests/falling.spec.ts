import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { destinations, getElement } from '../src/content/catalogue';
import en from '../src/locales/en/translation.json' with { type: 'json' };
import de from '../src/locales/de/translation.json' with { type: 'json' };

const copy = { en, de };
async function freezeClock(page: Page) {
  const time = new Date('2026-10-04T12:00:00Z');
  await page.clock.install({ time });
  await page.clock.pauseAt(time);
}
async function visibility(page: Page, hidden: boolean) {
  await page.evaluate(hidden => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
}
async function screenCheck(page: Page) {
  // axe uses timers internally; temporarily run the browser clock for its audit.
  await page.clock.resume();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
  expect(result.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const language of ['en', 'de'] as const) {
  const c = copy[language];
  test(`${language}: complete falling round, correction, natural landing, results, replay and home preserve lesson evidence`, async ({ page }) => {
    await freezeClock(page);
    await page.addInitScript(language => {
      localStorage.setItem('elementris.language', language);
      localStorage.setItem('elementris.progress', JSON.stringify({ version: 1, lessons: { 'first-families': { guided: [3], guidedComplete: false, practiceComplete: false, answers: { '3': false } } } }));
    }, language);
    await page.goto('/');
    const before = await page.evaluate(() => localStorage.getItem('elementris.progress'));
    await page.getByRole('button', { name: c.falling.play, exact: true }).click();
    await expect(page.getByRole('button', { name: c.falling.start, exact: true })).toBeDisabled();
    await expect(page.getByRole('checkbox')).toHaveCount(20);
    for (const group of ['group-3', 'group-4'] as const) await page.getByRole('checkbox', { name: new RegExp(`^${c.destinations[group]} `) }).check();
    await expect(page.locator('.round-summary')).toContainText(language === 'en' ? '6 elements' : '6 Elemente');
    await screenCheck(page);
    await page.getByRole('button', { name: c.falling.start, exact: true }).click();
    const board = page.locator('.falling-board');
    await expect(board).toBeFocused();
    await screenCheck(page);
    const seen = new Set<number>();
    for (let index = 0; index < 6; index++) {
      const number = Number(await board.getAttribute('data-atomic-number'));
      expect(seen.has(number)).toBe(false);
      seen.add(number);
      const item = getElement(number);
      const lane = item.destinationId === 'group-3' ? 0 : 1;
      if (index === 0) {
        await page.locator('.lane-control').nth(1 - lane).click();
        await page.getByRole('button', { name: c.falling.drop, exact: true }).click();
        await expect(board).toHaveAttribute('data-status', 'correction');
        await expect(page.getByRole('status')).toContainText(c.destinations[item.destinationId]);
        await expect(page.getByRole('button', { name: c.falling.retry, exact: true })).toBeFocused();
        const otherLanguage = language === 'en' ? 'de' : 'en';
        await page.getByRole('button', { name: otherLanguage === 'de' ? 'Deutsch' : 'English', exact: true }).click();
        await expect(page.getByRole('status')).toContainText(copy[otherLanguage].elements[item.symbol]);
        await expect(board).toHaveAttribute('data-status', 'correction');
        await page.getByRole('button', { name: language === 'de' ? 'Deutsch' : 'English', exact: true }).click();
        await page.clock.fastForward(60_000);
        await expect(board).toHaveAttribute('data-status', 'correction');
        await screenCheck(page);
        await page.getByRole('button', { name: c.falling.retry, exact: true }).click();
        await expect(board).toHaveAttribute('data-atomic-number', String(number));
        await expect(board).toBeFocused();
      }
      await page.locator('.lane-control').nth(lane).click();
      if (index === 1) await page.clock.fastForward(12_000);
      else await page.getByRole('button', { name: c.falling.drop, exact: true }).click();
      await expect(board).toHaveAttribute('data-status', 'collected');
      await page.clock.fastForward(60_000);
      await expect(board).toHaveAttribute('data-status', 'collected');
      await expect(page.locator('.falling-collection li')).toHaveCount(index + 1);
      await page.getByRole('button', { name: index === 5 ? c.falling.finish : c.falling.next, exact: true }).click();
    }
    expect(seen.size).toBe(6);
    await expect(page.getByRole('heading', { name: c.falling.resultsTitle })).toBeFocused();
    await expect(page.getByTestId('falling-score')).toHaveText('5 / 6');
    await expect(page.locator('.review-card li')).toHaveCount(1);
    await page.getByRole('button', { name: language === 'en' ? 'Deutsch' : 'English', exact: true }).click();
    await expect(page.getByTestId('falling-score')).toHaveText('5 / 6');
    await expect(page.getByRole('heading', { name: copy[language === 'en' ? 'de' : 'en'].falling.resultsTitle })).toBeVisible();
    await page.getByRole('button', { name: language === 'de' ? 'Deutsch' : 'English', exact: true }).click();
    await screenCheck(page);
    await page.screenshot({ path: test.info().outputPath(`${language}-falling-results.png`), fullPage: true });
    expect(await page.evaluate(() => localStorage.getItem('elementris.progress'))).toBe(before);
    await page.getByRole('button', { name: c.falling.replay, exact: true }).click();
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
    await expect(page.locator('.falling-collection li')).toHaveCount(0);
    await page.getByRole('button', { name: c.falling.change, exact: true }).click();
    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(2);
    await page.getByRole('button', { name: c.navigation.home, exact: true }).click();
    await expect(page.getByRole('heading', { name: language === 'en' ? 'Meet two element families.' : 'Lerne zwei Elementfamilien kennen.' })).toBeFocused();
    await page.getByRole('button', { name: c.lesson.start, exact: true }).click();
    await expect(page.getByRole('heading', { name: language === 'en' ? 'Find Lithium’s family' : 'Finde die Familie von Lithium' })).toBeVisible();
  });

  test(`${language}: three-lane portrait, reduced motion, selection changes and live language switching`, async ({ page }) => {
    await freezeClock(page);
    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(language => localStorage.setItem('elementris.language', language), language);
    await page.goto('/');
    await page.getByRole('button', { name: c.falling.play, exact: true }).click();
    for (const id of ['group-3', 'lanthanoids', 'actinoids'] as const) await page.getByRole('checkbox', { name: new RegExp(`^${c.destinations[id]} `) }).check();
    await expect(page.getByRole('checkbox', { name: new RegExp(`^${c.destinations['group-4']} `) })).toBeEnabled();
    await expect(page.locator('.round-summary')).toContainText(language === 'en' ? '32 elements' : '32 Elemente');
    await page.getByRole('button', { name: language === 'en' ? 'Deutsch' : 'English', exact: true }).click();
    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(3);
    const other = copy[language === 'en' ? 'de' : 'en'];
    await page.getByRole('button', { name: other.falling.start, exact: true }).click();
    const board = page.locator('.falling-board');
    const number = await board.getAttribute('data-atomic-number');
    await expect(page.locator('.lane-control')).toHaveCount(3);
    for (const lane of await page.locator('.lane-control').all()) {
      const bounds = (await lane.boundingBox())!;
      expect(bounds.width).toBeGreaterThanOrEqual(44);
      expect(bounds.height).toBeGreaterThanOrEqual(44);
    }
    await expect(page.locator('.falling-tile')).toHaveCSS('transform', 'none');
    await page.clock.fastForward(3000);
    await expect(page.locator('.falling-tile')).toHaveCSS('transform', 'none');
    await expect(page.locator('.falling-countdown')).toContainText('9');
    await page.locator('.lane-control').nth(2).click();
    await screenCheck(page);
    await page.screenshot({ path: test.info().outputPath(`${language}-three-lanes.png`), fullPage: true });
    await page.getByRole('button', { name: other.falling.pause, exact: true }).click();
    await page.getByRole('button', { name: language === 'en' ? 'English' : 'Deutsch', exact: true }).click();
    await expect(board).toHaveAttribute('data-atomic-number', number!);
    await expect(board).toHaveAttribute('data-status', 'paused');
    await expect(page.locator('.lane-control').nth(2)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('status')).toContainText(c.falling.paused);
    await page.getByRole('button', { name: c.falling.resume, exact: true }).click();
    await expect(board).toBeFocused();
    await page.getByRole('button', { name: c.falling.change, exact: true }).click();
    await page.getByRole('checkbox', { name: new RegExp(`^${c.destinations.actinoids} `) }).uncheck();
    await page.getByRole('button', { name: c.falling.start, exact: true }).click();
    await expect(page.locator('.lane-control')).toHaveCount(2);
    await expect(page.getByRole('progressbar')).toHaveAttribute('max', '17');
    await screenCheck(page);
    await page.reload();
    await expect(page.getByRole('heading', { name: c.falling.selectionTitle })).toBeFocused();
    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(0);
  });
}

test('keyboard controls, hidden-page pause, manual countdown and shortcut scope', async ({ page, browserName }) => {
  await freezeClock(page);
  await page.goto('/');
  // Reach Play using only the keyboard; language controls retain native behavior.
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  for (let i = 0; i < 4; i++) await page.keyboard.press(tab);
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  const group3 = page.getByRole('checkbox', { name: /^Group 3 / });
  // All selector controls are native checkboxes; Space chooses each destination.
  await group3.focus(); await page.keyboard.press('Space');
  await page.keyboard.press(tab); await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Start round', exact: true }).focus();
  await page.keyboard.press('Enter');
  const board = page.locator('.falling-board');
  await expect(board).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.lane-control').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.lane-control').nth(0)).toHaveAttribute('aria-pressed', 'true');
  await page.clock.fastForward(2500);
  const countdown = await page.locator('.falling-countdown').textContent();
  const transform = await page.locator('.falling-tile').evaluate(node => getComputedStyle(node).transform);
  expect(transform).not.toBe('none');
  await visibility(page, true);
  await expect(board).toHaveAttribute('data-status', 'paused');
  await expect(page.getByRole('status')).toContainText('left the page');
  await page.clock.fastForward(120_000);
  await page.getByRole('button', { name: 'Resume', exact: true }).dispatchEvent('click');
  await expect(board).toHaveAttribute('data-status', 'paused');
  await visibility(page, false);
  await expect(board).toHaveAttribute('data-status', 'paused');
  await expect(page.locator('.falling-countdown')).toHaveText(countdown!);
  await expect(page.locator('.falling-tile')).toHaveCSS('transform', transform);
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.clock.fastForward(500);
  await expect(page.locator('.falling-countdown')).toContainText('9');
  // Shortcuts never act on the language switch or native lane buttons.
  await page.getByRole('button', { name: 'English', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  await expect(board).toHaveAttribute('data-status', 'falling');
  await page.getByRole('checkbox', { name: 'Use a stationary countdown' }).check();
  await expect(page.locator('.falling-tile')).toHaveCSS('transform', 'none');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const pausedCount = await page.locator('.falling-countdown').textContent();
  await page.clock.fastForward(60_000);
  await expect(page.locator('.falling-countdown')).toHaveText(pausedCount!);
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  const number = Number(await board.getAttribute('data-atomic-number'));
  const lane = getElement(number).destinationId === 'group-3' ? 0 : 1;
  if (lane === 1) await page.keyboard.press('ArrowRight');
  await board.dispatchEvent('keydown', { key: ' ', repeat: true });
  await expect(board).toHaveAttribute('data-status', 'falling');
  await page.keyboard.press('Space');
  await expect(board).toHaveAttribute('data-status', 'collected');
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(board).toBeFocused();
});

test('touch selects lanes and commits only through Drop', async ({ page }, info) => {
  test.skip(!info.project.use.hasTouch, 'Requires a touch project');
  await freezeClock(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Play', exact: true }).tap();
  for (const name of [/^Group 3 /, /^Group 4 /]) await page.getByRole('checkbox', { name }).tap();
  await page.getByRole('button', { name: 'Start round', exact: true }).tap();
  const board = page.locator('.falling-board');
  const number = Number(await board.getAttribute('data-atomic-number'));
  await page.locator('.lane-control').nth(getElement(number).destinationId === 'group-3' ? 0 : 1).tap();
  await expect(board).toHaveAttribute('data-status', 'falling');
  await page.getByRole('button', { name: 'Drop', exact: true }).tap();
  await expect(board).toHaveAttribute('data-status', 'collected');
});

for (const language of ['en', 'de'] as const) {
  test(`${language}: completes three-destination coverage with keyboard landings`, async ({ page }) => {
    const c = copy[language];
    await freezeClock(page);
    await page.addInitScript(language => localStorage.setItem('elementris.language', language), language);
    await page.goto('/#play');
    const ids = ['group-3', 'group-4', 'group-5'] as const;
    for (const id of ids) await page.getByRole('checkbox', { name: new RegExp(`^${c.destinations[id]} `) }).check();
    await page.getByRole('button', { name: c.falling.start, exact: true }).click();
    const seen = new Set<number>();
    for (let i = 0; i < 10; i++) {
      const board = page.locator('.falling-board');
      await expect(board).toBeFocused();
      const number = Number(await board.getAttribute('data-atomic-number'));
      expect(seen.has(number)).toBe(false);
      seen.add(number);
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      const destination = getElement(number).destinationId;
      const lane = ids.findIndex(id => id === destination);
      expect(lane).toBeGreaterThanOrEqual(0);
      for (let step = 0; step < lane; step++) await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowDown');
      await expect(board).toHaveAttribute('data-status', 'collected');
      await page.keyboard.press('Enter');
    }
    await expect(page.getByTestId('falling-score')).toHaveText('10 / 10');
    await expect(page.getByRole('heading', { name: c.falling.resultsTitle })).toBeFocused();
    expect(seen.size).toBe(10);
  });
}

for (const language of ['en', 'de'] as const) {
  test(`${language}: all destinations fit portrait and Space drops after lane selection`, async ({ page }) => {
    const c = copy[language];
    await freezeClock(page);
    await page.setViewportSize({ width: 320, height: 568 });
    await page.addInitScript(language => localStorage.setItem('elementris.language', language), language);
    await page.goto('/#play');
    for (const checkbox of await page.getByRole('checkbox').all()) await checkbox.check();
    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(20);
    await page.getByRole('button', { name: c.falling.start, exact: true }).click();
    const board = page.locator('.falling-board');
    await expect(page.getByRole('progressbar')).toHaveAttribute('max', '118');
    await expect(page.locator('.lane-control')).toHaveCount(20);
    for (let step = 0; step < 19; step++) await page.keyboard.press('ArrowRight');
    const last = page.locator('.lane-control').last();
    await expect(last).toHaveAttribute('aria-pressed', 'true');
    const lastBounds = (await last.boundingBox())!;
    expect(lastBounds.width).toBeGreaterThanOrEqual(100);
    expect(lastBounds.x).toBeGreaterThanOrEqual(0);
    expect(lastBounds.x + lastBounds.width).toBeLessThanOrEqual(320);
    await screenCheck(page);
    await page.screenshot({ path: test.info().outputPath(`${language}-twenty-lanes.png`), fullPage: true });
    const number = Number(await board.getAttribute('data-atomic-number'));
    const lane = destinations.findIndex(destination => destination.id === getElement(number).destinationId);
    await page.locator('.lane-control').nth(lane).click();
    await expect(board).toBeFocused();
    await page.keyboard.press('Space');
    await expect(board).toHaveAttribute('data-status', 'collected');
    await expect(page.locator('.falling-collection li')).toHaveCount(1);
    await page.keyboard.press('Enter');
    await expect(board).toHaveAttribute('data-status', 'falling');
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1');
  });
}
