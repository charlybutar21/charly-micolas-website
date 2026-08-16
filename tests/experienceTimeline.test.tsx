import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import ExperienceTimeline from '../app/components/ExperienceTimeline';

it('renders all six CV roles with the current role first', () => {
  const markup = renderToStaticMarkup(<ExperienceTimeline />);

  expect(markup.match(/<article/g) ?? []).toHaveLength(6);
  expect(markup.indexOf('PT Progo Puncak Group (Pinjamin)')).toBeLessThan(
    markup.indexOf('PT LightStream Analytics Indonesia'),
  );
  expect(markup).toContain('Jun 2024 - Present');
  expect(markup).toContain('South Jakarta');
  expect(markup).toContain('Current role');
});
