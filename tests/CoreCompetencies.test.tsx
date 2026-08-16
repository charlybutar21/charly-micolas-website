import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CoreCompetencies from '../app/components/CoreCompetencies';
import { portfolioData } from '../app/data';

describe('CoreCompetencies', () => {
  it('renders every approved competency in an anchored section', () => {
    const markup = renderToStaticMarkup(<CoreCompetencies />);

    expect(markup).toContain('id="competencies"');
    expect(markup).toContain('02.');
    expect(markup).toContain('Core Competencies');

    for (const competency of portfolioData.coreCompetencies) {
      expect(markup).toContain(competency);
    }
  });
});
