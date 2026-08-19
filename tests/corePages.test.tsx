import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ContactLinks from '../app/components/shared/ContactLinks';
import Home from '../app/page';

describe('editorial core routes', () => {
  it('keeps the approved identity and introduction', () => {
    const markup = renderToStaticMarkup(<Home />);

    expect(markup).toContain('Charly Micolas');
    expect(markup).toContain('Butarbutar');
    expect(markup).toContain('Senior Software Engineer');
  });

  it('renders email and professional links without telephone output', () => {
    const markup = renderToStaticMarkup(<ContactLinks />);

    expect(markup).toContain('mailto:charlymicolasbutar@gmail.com');
    expect(markup).toContain('linkedin.com/in/charly-micolas');
    expect(markup).toContain('github.com/charlybutar21');
    expect(markup).toContain(
      'aria-label="Open Charly Micolas LinkedIn profile"',
    );
    expect(markup).toContain('aria-label="Open Charly Micolas GitHub profile"');
    expect(markup).not.toContain('>LinkedIn');
    expect(markup).not.toContain('>GitHub');
    expect(markup).toContain('<svg');
    expect(markup).not.toContain('tel:');
    expect(markup).not.toContain('813-1872');
  });
});
