import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import WritingList from '../app/components/portfolio/WritingList';
import WritingPostPage from '../app/writing/[slug]/page';

it('links the published system design guide from the writing index', () => {
  const markup = renderToStaticMarkup(<WritingList />);

  expect(markup).toContain('A practical guide to system design');
  expect(markup).toContain(
    'href="/writing/a-practical-guide-to-system-design"',
  );
  expect(markup).toContain('Published');
});

it('renders beginner analogies, practical examples, tables, and source repository link on the article page', async () => {
  const markup = renderToStaticMarkup(
    await WritingPostPage({
      params: Promise.resolve({
        slug: 'a-practical-guide-to-system-design',
      }),
    }),
  );

  expect(markup).toContain('Personal notes');
  expect(markup).not.toContain('05 / Writing');
  expect(markup).toContain('In this guide');
  expect(markup).toContain('Analogi Pemula: Dapur Restoran');
  expect(markup).toContain(
    'Pola Praktis Langkah demi Langkah: Cache-Aside (Lazy Loading)',
  );
  expect(markup).toContain('https://github.com/charlybutar21/system-design');
  expect(markup).toContain('Open github.com/charlybutar21/system-design');
});
