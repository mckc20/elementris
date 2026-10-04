import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function checkScreen(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const button of await page.getByRole('button').all()) {
    const bounds = await button.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
  }
}

for (const language of ['en', 'de']) {
  test(`${language}: accessibility through selection, guidance, hints, results and reset`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: language === 'de' ? 'Deutsch' : 'English', exact: true }).click();
    await checkScreen(page);
    await page.locator('.progress-card .start-button').first().click();
    await checkScreen(page);
    for (let turn = 0; turn < 6; turn++) {
      await page.locator('.highlighted').click();
      await page.locator('.next-button').click();
    }
    await checkScreen(page);
    await page.locator('.lesson .start-button').click();
    await checkScreen(page);
    await page.locator('.hint-button').click();
    await checkScreen(page);
    await page.locator('.hint-button').click();
    await checkScreen(page);
    for (let turn = 0; turn < 6; turn++) {
      const symbol = await page.locator('.current-element strong').textContent();
      const correct = ['Li', 'Na', 'K'].includes(symbol!) ? 0 : 1;
      if (turn === 1) {
        await page.locator('.family-column').nth(1 - correct).click();
        await checkScreen(page);
      }
      await page.locator('.family-column').nth(correct).click();
      await page.locator('.next-button').click();
    }
    await checkScreen(page);
    await page.locator('.home-button').click();
    await page.locator('.reset-progress button').click();
    await expect(page.locator('.reset-progress button').first()).toBeFocused();
    await checkScreen(page);
  });

  test(`${language}: narrow portrait and enlarged text keep controls and collected names readable`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.getByRole('button', { name: language === 'de' ? 'Deutsch' : 'English', exact: true }).click();
    // Text-only scaling exercises wrapping without changing the viewport.
    async function enlargeText() {
      await page.evaluate(() => {
        for (const node of document.querySelectorAll<HTMLElement>('[data-text-enlarged]')) node.style.removeProperty('font-size');
        const sizes = Array.from(document.querySelectorAll<HTMLElement>('body *')).map(node => [node, parseFloat(getComputedStyle(node).fontSize) * 2] as const);
        for (const [node, size] of sizes) { node.style.fontSize = `${size}px`; node.dataset.textEnlarged = 'true'; }
      });
    }
    await enlargeText();
    const overflow = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>('body *')).filter(node => node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 1).map(node => ({ tag: node.tagName, className: node.className, text: node.textContent?.slice(0, 50), width: node.clientWidth, scroll: node.scrollWidth })));
    expect(overflow).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.progress-card .start-button').first().click();
    await enlargeText();
    await page.locator('.highlighted').click();
    await enlargeText();
    const name = page.locator('.tile-slots .name').first();
    expect(await name.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`${language}-narrow-text.png`), fullPage: true });
  });
}

test('portrait placement works by touch with stable targets and reduced motion', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.use.hasTouch, 'Requires a touch project');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.progress-card .start-button').first().tap();
  const target = page.locator('.highlighted');
  const before = await target.boundingBox();
  await target.tap();
  await expect(page.locator('.placed-tile')).toHaveCSS('animation-name', 'none');
  const after = await page.locator('.family-column').first().boundingBox();
  expect(after?.width).toBe(before?.width);
  await expect(page.locator('.next-button')).toBeFocused();
  await page.locator('.next-button').tap();
  await expect(page.locator('.current-name')).toHaveText('Helium');
});
