import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import TechnicalSkillsPage from '../app/technical-skills/page';

it('explains how the technical skill groups are used in practice', () => {
  const markup = renderToStaticMarkup(<TechnicalSkillsPage />);

  expect(markup).toContain(
    'Professional toolkit used across backend delivery, service integration, and engineering practice.',
  );
});
