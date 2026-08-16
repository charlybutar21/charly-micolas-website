import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of [
  '/',
  '/technical-skills',
  '/experiences',
  '/writing',
  '/contact',
]) {
  test(`has no automated accessibility violations on ${route} @a11y`, async ({
    page,
  }) => {
    await page.goto(route);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}
