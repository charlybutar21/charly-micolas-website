import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import SiteShell from '../app/components/layout/SiteShell';
import Home from '../app/page';

it('offers a skip link before the main content', () => {
  const markup = renderToStaticMarkup(
    <SiteShell>
      <p>Portfolio content</p>
    </SiteShell>,
  );

  expect(markup).toContain('href="#main-content"');
  expect(markup).toContain('Skip to main content');
});

it('summarizes experience with a direct route to the career record', () => {
  const markup = renderToStaticMarkup(<Home />);

  for (const statement of [
    'Nearly a decade in backend engineering',
    'Fintech, PropTech, and SaaS',
    'Technical leadership and delivery ownership',
  ]) {
    expect(markup).toContain(statement);
  }

  expect(markup).toContain('href="/experiences"');
  expect(markup).not.toContain('01 / Home');
});
