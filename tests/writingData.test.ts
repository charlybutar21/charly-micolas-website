import { describe, expect, it } from 'vitest';
import { portfolioData } from '../app/data';

describe('writing data', () => {
  it('publishes the System Design guide as the first article', () => {
    expect(portfolioData.writing).toEqual([
      expect.objectContaining({
        slug: 'a-practical-guide-to-system-design',
        title: 'A practical guide to system design',
        status: 'Published',
      }),
    ]);

    const guide = portfolioData.writing[0];
    expect(guide.sections).toHaveLength(6);
    expect(guide.externalResource?.url).toBe(
      'https://github.com/charlybutar21/system-design',
    );
  });
});
