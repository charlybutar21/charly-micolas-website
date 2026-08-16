import { expect, test } from '@playwright/test';

test('mobile navigation opens, reports its state, and leads to grouped content', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByText('Menu +', { exact: true }).click();
  await expect(page.getByText('Close −', { exact: true })).toBeVisible();

  const navigation = page.getByRole('navigation', {
    name: 'Primary navigation mobile',
  });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: 'Technical Skills' }).click();

  await expect(page).toHaveURL('/technical-skills');
  await expect(
    page.getByText(
      'Professional toolkit used across backend delivery, service integration, and engineering practice.',
    ),
  ).toBeVisible();
});
