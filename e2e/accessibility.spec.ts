import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/about', '/experiences', '/writing', '/contact']) {
  test(`has no automated accessibility violations on ${route} @a11y`, async ({
    page,
  }) => {
    await page.goto(route);

    await page.waitForTimeout(1000); // wait for CSS reveal animations to finish
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}
