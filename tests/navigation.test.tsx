import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/technical-skills',
}));

import SiteNavigation from '../app/components/layout/SiteNavigation';

it('renders the six grouped routes and marks the current page', () => {
  const markup = renderToStaticMarkup(<SiteNavigation />);

  for (const href of [
    '/',
    '/about',
    '/technical-skills',
    '/experiences',
    '/writing',
    '/contact',
  ]) {
    expect(markup).toContain(`href="${href}"`);
  }

  for (const label of ['Start here', 'Practice', 'Notes', 'Connect']) {
    expect(markup).toContain(label);
  }

  expect(markup).toContain('aria-current="page"');
  expect(markup).not.toContain('>01<');
});
