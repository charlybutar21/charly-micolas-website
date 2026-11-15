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

it('renders structured chapters and source repository link on the article page', async () => {
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
  expect(markup).toContain(
    'How a request travels from a user device to your server',
  );
  expect(markup).toContain('https://github.com/charlybutar21/system-design');
});
