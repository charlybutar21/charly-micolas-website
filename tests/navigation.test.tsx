import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/experiences',
}));

import SiteNavigation from '../app/components/layout/SiteNavigation';

it('renders the primary routes without navigation group labels', () => {
  const markup = renderToStaticMarkup(<SiteNavigation />);

  for (const href of ['/', '/about', '/experiences', '/writing', '/contact']) {
    expect(markup).toContain(`href="${href}"`);
  }

  expect(markup).not.toContain('Start here');
  expect(markup).not.toContain('Practice');
  expect(markup).not.toContain('Notes');
  expect(markup).not.toContain('Connect');

  expect(markup.indexOf('Home')).toBeLessThan(markup.indexOf('About'));
  expect(markup.indexOf('About')).toBeLessThan(markup.indexOf('Experience'));

  expect(markup).toContain('aria-label="Go to Home"');
  expect(markup).toContain('<svg');
  expect(markup).not.toContain('C.M.B.');
  expect(markup).not.toContain('Menu +');
  expect(markup).not.toContain('Primary navigation mobile');
  expect(markup).toContain('aria-current="page"');
  expect(markup).not.toContain('>01<');
});
