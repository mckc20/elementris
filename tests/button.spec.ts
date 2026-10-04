import { expect, test } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../src/components/Button';

test('reusable button has keyboard focus and respects reduced motion', async ({ page, browserName }) => {
  await page.goto('/');
  // Mount the actual component's native markup with the application's production CSS.
  const markup = renderToStaticMarkup(createElement(Button, {}, 'Continue'));
  await page.locator('main').evaluate((main, html) => { main.innerHTML = html; }, markup);
  const button = page.getByRole('button', { name: 'Continue' });
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(button).toHaveCSS('outline-width', '3px');
  const bounds = await button.boundingBox();
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  expect(bounds!.width).toBeGreaterThanOrEqual(44);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(button).toHaveCSS('transition-duration', '0s');
  await page.keyboard.down('Space');
  await expect(button).toHaveCSS('transform', 'none');
  await page.keyboard.up('Space');
});
