import { expect, test } from '@playwright/test';

test('mobile navigation stays directly available without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const navigation = page.getByRole('navigation', {
    name: 'Primary navigation',
  });

  await expect(navigation).toBeVisible();
  await expect(page.getByText('Menu +', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Start here', { exact: true })).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await navigation.getByRole('link', { name: 'Technical Skills' }).click();

  await expect(page).toHaveURL('/technical-skills');
  await expect(
    page.getByText(
      'Professional toolkit used across backend delivery, service integration, and engineering practice.',
    ),
  ).toBeVisible();
});

test('desktop navigation remains pinned while experience content scrolls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/experiences');

  const navigation = page.getByRole('navigation', {
    name: 'Primary navigation',
  });

  await expect(navigation).toHaveCSS('position', 'sticky');
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect
    .poll(async () =>
      navigation.evaluate((element) =>
        Math.round(element.getBoundingClientRect().top),
      ),
    )
    .toBe(0);
});
