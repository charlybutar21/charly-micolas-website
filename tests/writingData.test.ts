import { describe, expect, it } from 'vitest';
import { portfolioData } from '../app/data';

describe('writing data', () => {
  it('publishes one clearly marked dummy writing post', () => {
    expect(portfolioData.writing).toEqual([
      expect.objectContaining({
        slug: 'the-quiet-work-behind-reliable-software',
        title: 'The quiet work behind reliable software',
        status: 'Draft',
      }),
    ]);
  });
});
