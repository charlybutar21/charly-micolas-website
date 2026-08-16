import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import WritingList from '../app/components/portfolio/WritingList';

it('links the placeholder personal post from the writing index', () => {
  const markup = renderToStaticMarkup(<WritingList />);

  expect(markup).toContain('The quiet work behind reliable software');
  expect(markup).toContain('href="/writing/the-quiet-work-behind-reliable-software"');
  expect(markup).toContain('Draft');
});
