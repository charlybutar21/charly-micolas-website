import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { portfolioData } from '../app/data';
import ExperienceTimeline from '../app/components/portfolio/ExperienceTimeline';

it('renders all six CV roles with the current role first', () => {
  const markup = renderToStaticMarkup(<ExperienceTimeline />);

  expect(markup.match(/<article/g) ?? []).toHaveLength(6);
  expect(markup.indexOf('PT Progo Puncak Group (Pinjamin)')).toBeLessThan(
    markup.indexOf('PT LightStream Analytics Indonesia'),
  );
  expect(markup).toContain('Jun 2024 - Present');
  expect(markup).toContain('South Jakarta');
  expect(markup).toContain('Current role');
  expect(markup).not.toContain('<details');
  for (const role of portfolioData.experience) {
    for (const responsibility of [
      ...role.highlights,
      ...role.additionalResponsibilities,
    ]) {
      expect(markup).toContain(
        renderToStaticMarkup(<span>{responsibility}</span>).slice(6, -7),
      );
    }
  }
  expect(markup).not.toContain('More responsibilities');
});
