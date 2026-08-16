import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import WritingList from '../app/components/portfolio/WritingList';
import WritingPostPage from '../app/writing/[slug]/page';

it('links the placeholder personal post from the writing index', () => {
  const markup = renderToStaticMarkup(<WritingList />);

  expect(markup).toContain('The quiet work behind reliable software');
  expect(markup).toContain(
    'href="/writing/the-quiet-work-behind-reliable-software"',
  );
  expect(markup).toContain('Draft note');
});

it('uses a descriptive eyebrow on the article page instead of a sequence number', async () => {
  const markup = renderToStaticMarkup(
    await WritingPostPage({
      params: Promise.resolve({
        slug: 'the-quiet-work-behind-reliable-software',
      }),
    }),
  );

  expect(markup).toContain('Personal notes');
  expect(markup).not.toContain('05 / Writing');
});
