import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Contact from '../app/components/Contact';
import Navbar from '../app/components/Navbar';

describe('portfolio navigation and contact', () => {
  it('links navigation to the rendered sections', () => {
    const markup = renderToStaticMarkup(<Navbar />);

    for (const href of [
      '#summary',
      '#competencies',
      '#skills',
      '#experience',
      '#contact',
    ]) {
      expect(markup).toContain(`href="${href}"`);
    }
  });

  it('renders approved email and phone actions', () => {
    const markup = renderToStaticMarkup(<Contact />);

    expect(markup).toContain('mailto:charlymicolasbutar@gmail.com');
    expect(markup).toContain('tel:+6281318728890');
    expect(markup).toContain('+62 813-1872-8890');
  });
});
