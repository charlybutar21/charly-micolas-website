import { describe, expect, it } from 'vitest';
import { portfolioData } from '../app/data';

describe('writing data', () => {
  it('publishes the practical System Design guide with analogies, examples, and GitHub link', () => {
    expect(portfolioData.writing).toEqual([
      expect.objectContaining({
        slug: 'a-practical-guide-to-system-design',
        title: 'A practical guide to system design',
        status: 'Published',
      }),
    ]);

    const guide = portfolioData.writing[0];
    expect(guide.sections).toHaveLength(9);
    expect(guide.sections?.[0].analogy?.title).toContain('Analogi Pemula');
    expect(guide.sections?.[2].example?.code).toContain('getProduct');
    expect(guide.externalResource?.url).toBe(
      'https://github.com/charlybutar21/system-design',
    );
    expect(guide.externalResource?.highlights).toHaveLength(3);
  });
});
