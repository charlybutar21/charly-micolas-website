import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of [
  '/',
  '/about',
  '/technical-skills',
  '/experiences',
  '/writing',
  '/contact',
]) {
  test(`has no automated accessibility violations on ${route} @a11y`, async ({
    page,
  }) => {
    await page.goto(route);

    await page.waitForTimeout(1000); // wait for framer-motion animations to finish
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}
