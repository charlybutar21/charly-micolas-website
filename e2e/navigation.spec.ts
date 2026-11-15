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
  for (const label of [
    'Home',
    'About',
    'Experience',
    'Skills',
    'Writing',
    'Contact',
  ]) {
    const link = navigation.getByRole('link', { name: label, exact: true });
    await expect(link).toBeInViewport();
    const bounds = await link.boundingBox();
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByText('Menu +', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Start here', { exact: true })).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await navigation.getByRole('link', { name: 'Experience' }).click();

  await expect(page).toHaveURL('/experiences');
  await expect(
    page.getByText('A chronological record of roles and technical toolkit', {
      exact: false,
    }),
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
