import { expect, it } from 'vitest';

import { portfolioData } from '../app/data';

it('separates the current role into visible highlights and additional responsibilities', () => {
  const currentRole = portfolioData.experience[0] as unknown as {
    highlights?: string[];
    additionalResponsibilities?: string[];
  };

  expect(currentRole.highlights).toEqual([
    'Supported ISO 27001, OJK, and FDC audit activities by addressing technical findings, preparing evidence, and delivering improvements that strengthened security and regulatory compliance.',
    'Lead cross-functional delivery involving 6 engineers, 2 QA engineers, 1 product manager, and 1 UI designer, translating business requirements into technical solutions and actionable engineering tasks.',
  ]);
  expect(currentRole.additionalResponsibilities).toHaveLength(2);
});
