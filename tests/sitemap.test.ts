import { expect, it } from 'vitest';

import sitemap from '../app/sitemap';

it('includes every public editorial route in the sitemap', () => {
  const urls = sitemap().map((entry) => entry.url);

  expect(urls).toEqual(
    expect.arrayContaining([
      'https://charlymicolas.com/',
      'https://charlymicolas.com/about',
      'https://charlymicolas.com/technical-skills',
      'https://charlymicolas.com/experiences',
      'https://charlymicolas.com/writing',
      'https://charlymicolas.com/writing/the-quiet-work-behind-reliable-software',
      'https://charlymicolas.com/contact',
    ]),
  );
});
