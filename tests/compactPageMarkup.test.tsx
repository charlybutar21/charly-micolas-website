import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import AboutPage from '../app/about/page';
import ContactPage from '../app/contact/page';

it('keeps the About narrative and supporting credentials in a compact overview', () => {
  const markup = renderToStaticMarkup(<AboutPage />);

  expect(markup).toContain('class="overview"');
  expect(markup).toContain('Core competencies');
  expect(markup).toContain('Education');
});

it('keeps the contact call to action and icon-only social destinations together', () => {
  const markup = renderToStaticMarkup(<ContactPage />);

  expect(markup).toContain('mailto:charlymicolasbutar@gmail.com');
  expect(markup).toContain('Open Charly Micolas LinkedIn profile');
  expect(markup).toContain('Open Charly Micolas GitHub profile');
});
