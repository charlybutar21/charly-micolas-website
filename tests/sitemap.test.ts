import { expect, it } from 'vitest';

import sitemap from '../app/sitemap';

it('includes every public editorial route in the sitemap', () => {
  const urls = sitemap().map((entry) => entry.url);

  expect(urls).toEqual(
    expect.arrayContaining([
      'https://www.charlymicolas.com/',
      'https://www.charlymicolas.com/about',
      'https://www.charlymicolas.com/experiences',
      'https://www.charlymicolas.com/writing',
      'https://www.charlymicolas.com/writing/a-practical-guide-to-system-design',
      'https://www.charlymicolas.com/contact',
    ]),
  );
  expect(urls).not.toContain('https://www.charlymicolas.com/technical-skills');
});
