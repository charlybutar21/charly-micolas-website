import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import robots from '../app/robots';
import StockPage, { metadata as stockMetadata } from '../app/stock/page';

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

  it('renders portfolio holdings, Stockbit average down simulator, and fair value calculator', () => {
    const markup = renderToStaticMarkup(<StockPage />);

    expect(markup).toContain('Portfolio &amp;');
    expect(markup).toContain('Valuation');
    expect(markup).toContain('BBCA');
    expect(markup).toContain('BMRI');
    expect(markup).toContain('BBRI');
    expect(markup).toContain('TLKM');
    expect(markup).toContain('Kalkulator Average Down');
    expect(markup).toContain('Valuasi Harga Normal Saham');
    expect(markup).toContain('0.15%');
    expect(markup).toContain('0.25%');
  });
});
