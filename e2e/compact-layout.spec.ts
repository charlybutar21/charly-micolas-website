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

test('short desktop pages distribute spare space above and below content', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of ['/', '/about', '/writing', '/contact']) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const spacing = await page.locator('main').evaluate((main) => {
      const container = main.getBoundingClientRect();
      const content = main.firstElementChild!.getBoundingClientRect();
      return {
        top: content.top - container.top,
        bottom: container.bottom - content.bottom,
      };
    });
    expect(spacing.top).toBeGreaterThan(16);
    expect(Math.abs(spacing.top - spacing.bottom)).toBeLessThan(2);
  }
});
