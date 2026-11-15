import { expect, test } from '@playwright/test';

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
]) {
  for (const route of ['/', '/about', '/writing', '/contact']) {
    test(`page remains readable at ${viewport.width}x${viewport.height}: ${route}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      // Editorial pages may scroll vertically; content must not be clipped horizontally.
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const main = page.locator('main');
      await expect(main).toHaveCSS('overflow-y', 'visible');
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

test('reduced motion keeps the introduction still and visible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toHaveCSS('animation-name', 'none');
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(
    page.getByRole('link', { name: 'Explore experience' }),
  ).toBeVisible();
});
test('portfolio remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
    'opacity',
    '1',
  );
  await page.getByRole('link', { name: 'Explore experience' }).click();
  await expect(page).toHaveURL(/experiences/);
  await context.close();
});
