import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import robots from '../app/robots';
import StockPage, { metadata as stockMetadata } from '../app/stock/page';
import sitemap from '../app/sitemap';
import { navigationItems } from '../app/lib/navigation';

describe('unlisted /stock route', () => {
  it('enforces noindex/nofollow metadata and robots disallow for /stock', () => {
    expect(stockMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });

    const robotConfig = robots();
    const rules = Array.isArray(robotConfig.rules)
      ? robotConfig.rules[0]
      : robotConfig.rules;
    expect(rules.disallow).toContain('/stock');
  });

  it('prerenders no personal positions and keeps stock out of discovery surfaces', () => {
    const markup = renderToStaticMarkup(<StockPage />);

    expect(markup).toContain('Portofolio saham');
    expect(markup).toContain('Hubungkan database');
    expect(markup).not.toContain('BBCA');
    expect(markup).not.toContain('BMRI');
    expect(sitemap().some((entry) => entry.url.includes('/stock'))).toBe(false);
    expect(navigationItems.some((item) => String(item.href) === '/stock')).toBe(
      false,
    );
  });
});
