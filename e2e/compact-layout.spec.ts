import { expect, test } from '@playwright/test';

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
]) {
  for (const route of [
    '/',
    '/about',
    '/writing',
    '/contact',
    '/technical-skills',
  ]) {
    test(`compact page fits ${viewport.width}x${viewport.height}: ${route}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollHeight))
        .toBeLessThanOrEqual(viewport.height);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(viewport.width);
    });
  }
}
