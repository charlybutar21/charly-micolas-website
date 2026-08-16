import { expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Fira_Code: () => ({ variable: '--font-fira-code' }),
  Plus_Jakarta_Sans: () => ({ variable: '--font-jakarta' }),
}));

import { metadata as aboutMetadata } from '../app/about/page';
import { metadata as contactMetadata } from '../app/contact/page';
import { metadata as experiencesMetadata } from '../app/experiences/page';
import { metadata as rootMetadata } from '../app/layout';
import robots from '../app/robots';
import sitemap from '../app/sitemap';
import { metadata as skillsMetadata } from '../app/technical-skills/page';
import { generateMetadata } from '../app/writing/[slug]/page';
import { metadata as writingMetadata } from '../app/writing/page';

it('publishes canonical, share, and crawler metadata for each public route', async () => {
  expect(rootMetadata.metadataBase).toEqual(
    new URL('https://charlymicolas.com'),
  );
  expect(rootMetadata.alternates?.canonical).toBe('/');
  expect(rootMetadata.twitter).toMatchObject({ card: 'summary' });

  for (const [metadata, canonical] of [
    [aboutMetadata, '/about'],
    [skillsMetadata, '/technical-skills'],
    [experiencesMetadata, '/experiences'],
    [writingMetadata, '/writing'],
    [contactMetadata, '/contact'],
  ] as const) {
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe(canonical);
  }

  const postMetadata = await generateMetadata({
    params: Promise.resolve({
      slug: 'the-quiet-work-behind-reliable-software',
    }),
  });
  expect(postMetadata.alternates?.canonical).toBe(
    '/writing/the-quiet-work-behind-reliable-software',
  );
  expect(robots().sitemap).toBe('https://charlymicolas.com/sitemap.xml');
});

it('uses a stable last-modified date instead of the runtime build date', () => {
  const lastModified = sitemap().map((entry) => entry.lastModified);

  expect(lastModified).toEqual(
    expect.arrayContaining([new Date('2026-08-16T00:00:00.000Z')]),
  );
  expect(
    new Set(lastModified.map((value) => new Date(value ?? 0).toISOString())),
  ).toEqual(new Set(['2026-08-16T00:00:00.000Z']));
});
