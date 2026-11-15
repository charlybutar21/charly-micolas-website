import { describe, expect, it } from 'vitest';
import {
  DEFAULT_STOCKBIT_FEES,
  calculateFairValue,
  calculateHoldingMetrics,
  calculatePortfolioSummary,
  getIdxTickSize,
  roundUpToIdxTick,
  simulateAvgDownByLots,
  simulateAvgDownByTargetPrice,
} from '../app/lib/stock-calculator';
import {
  parseStockBackupJson,
  sanitizeHolding,
  serializeStockBackupJson,
} from '../app/lib/stock-storage';
import type { StockHolding } from '../app/types/stock';

describe('IDX tick size and rounding rules', () => {
  it.each([
    { price: 150, expectedTick: 1, unrounded: 150.2, expectedRounded: 151 },
    { price: 350, expectedTick: 2, unrounded: 350.4, expectedRounded: 352 },
    { price: 1250, expectedTick: 5, unrounded: 1251, expectedRounded: 1255 },
    { price: 3800, expectedTick: 10, unrounded: 3801, expectedRounded: 3810 },
    { price: 9200, expectedTick: 25, unrounded: 9203, expectedRounded: 9225 },
  ])(
    'applies correct BEI tick size for price $price',
    ({ price, expectedTick, unrounded, expectedRounded }) => {
      expect(getIdxTickSize(price)).toBe(expectedTick);
      expect(roundUpToIdxTick(unrounded)).toBe(expectedRounded);
    },
  );
});

describe('Stockbit average down simulator', () => {
  it('calculates average down by additional lots with 0.15% buy fee and 0.25% sell fee', () => {
    const result = simulateAvgDownByLots({
      existingLots: 20,
      existingAvgPrice: 5000,
      newBuyPrice: 4000,
      additionalLots: 20,
      feeConfig: DEFAULT_STOCKBIT_FEES,
    });

    expect(result.isFeasible).toBe(true);
    expect(result.grossBuyAmount).toBe(8_000_000);
    expect(result.buyFeeAmount).toBe(12_000);
    expect(result.totalCashNeeded).toBe(8_012_000);
    expect(result.newTotalLots).toBe(40);
    expect(result.newTotalShares).toBe(4000);
    expect(result.newTotalInvested).toBe(18_012_000);
    expect(result.newAvgPrice).toBeCloseTo(4503, 2);
    // 4503 / (1 - 0.0025) = 4514.285... -> rounded up to tick 10 -> 4520
    expect(result.breakEvenSellPrice).toBe(4520);
    expect(result.recoveryNeededAfterPct).toBeLessThan(
      result.recoveryNeededBeforePct,
    );
  });

  it('calculates required lots to reach a target average price', () => {
    const result = simulateAvgDownByTargetPrice({
      existingLots: 10,
      existingAvgPrice: 6000,
      newBuyPrice: 4500,
      targetAvgPrice: 5000,
      feeConfig: DEFAULT_STOCKBIT_FEES,
    });

    expect(result.isFeasible).toBe(true);
    expect(result.additionalLots).toBeGreaterThanOrEqual(21);
    expect(result.newAvgPrice).toBeLessThanOrEqual(5000);
  });

  it('flags infeasible target average when target is at or below effective buy price', () => {
    const result = simulateAvgDownByTargetPrice({
      existingLots: 10,
      existingAvgPrice: 6000,
      newBuyPrice: 4500,
      targetAvgPrice: 4500,
      feeConfig: DEFAULT_STOCKBIT_FEES,
    });

    expect(result.isFeasible).toBe(false);
    expect(result.additionalLots).toBe(0);
    expect(result.validationMessage).toBeTruthy();
  });
});

describe('Fair value (Harga Normal) & Margin of Safety evaluator', () => {
  it('computes PBV, PER, Graham Number, and Dividend Yield fair value models and classifies undervalued stock', () => {
    const valuation = calculateFairValue(4100, {
      eps: 560,
      bvps: 3150,
      dps: 360,
      historicalMeanPer: 11.5,
      historicalMeanPbv: 1.8,
      expectedDividendYieldPct: 6.5,
    });

    expect(valuation.pbvFairValue).toBeCloseTo(5670, 0);
    expect(valuation.perFairValue).toBeCloseTo(6440, 0);
    expect(valuation.grahamNumber).toBeCloseTo(Math.sqrt(22.5 * 560 * 3150), 0);
    expect(valuation.dividendFairValue).toBeCloseTo(360 / 0.065, 0);
    expect(valuation.compositeFairValue).toBeGreaterThan(5500);
    expect(valuation.marginOfSafetyPct).toBeGreaterThanOrEqual(20);
    expect(valuation.status).toBe('undervalued');
  });

  it('classifies overvalued stock when market price significantly exceeds composite fair value', () => {
    const valuation = calculateFairValue(9500, {
      eps: 200,
      bvps: 1200,
      dps: 80,
      historicalMeanPer: 15,
      historicalMeanPbv: 2,
      expectedDividendYieldPct: 5,
    });

    expect(valuation.marginOfSafetyPct).toBeLessThan(-10);
    expect(valuation.status).toBe('overvalued');
  });
});

describe('Portfolio and holding metrics', () => {
  const sampleHoldings: StockHolding[] = [
    {
      id: 'bbca',
      ticker: 'BBCA',
      companyName: 'Bank Central Asia Tbk.',
      sector: 'Banking',
      lots: 30,
      avgBuyPrice: 9200,
      currentPrice: 9800,
      notes: 'Core banking compounder',
      updatedAt: '2026-11-16',
      fundamentals: {
        eps: 450,
        bvps: 2150,
        dps: 290,
        historicalMeanPer: 24,
        historicalMeanPbv: 4.7,
        expectedDividendYieldPct: 3,
      },
    },
    {
      id: 'tlkm',
      ticker: 'TLKM',
      companyName: 'Telkom Indonesia Tbk.',
      sector: 'Telecommunications',
      lots: 50,
      avgBuyPrice: 3400,
      currentPrice: 2850,
      notes: 'Dividend + turnaround play',
      updatedAt: '2026-11-16',
      fundamentals: {
        eps: 250,
        bvps: 1420,
        dps: 178,
        historicalMeanPer: 15,
        historicalMeanPbv: 2.6,
        expectedDividendYieldPct: 5.5,
      },
    },
  ];

  it('calculates net liquidating value, unrealized P&L, and portfolio summary accurately', () => {
    const summary = calculatePortfolioSummary(sampleHoldings);
    expect(summary.holdingsCount).toBe(2);
    expect(summary.totalInvestedCapital).toBe(3000 * 9200 + 5000 * 3400);
    expect(summary.totalGrossMarketValue).toBe(3000 * 9800 + 5000 * 2850);

    const bbcaMetrics = calculateHoldingMetrics(
      sampleHoldings[0],
      summary.totalGrossMarketValue,
    );
    expect(bbcaMetrics.shares).toBe(3000);
    expect(bbcaMetrics.investedCapital).toBe(27_600_000);
    expect(bbcaMetrics.grossMarketValue).toBe(29_400_000);
    expect(bbcaMetrics.estimatedSellFee).toBe(29_400_000 * 0.0025);
    expect(bbcaMetrics.netLiquidatingValue).toBe(29_326_500);
    expect(bbcaMetrics.unrealizedPnL).toBe(1_726_500);
    expect(bbcaMetrics.weightPct).toBeCloseTo(
      (29_400_000 / 43_650_000) * 100,
      2,
    );
  });

  it('sanitizes untrusted input and round-trips JSON backup payloads', () => {
    const cleaned = sanitizeHolding({
      ticker: ' <bbca!> ',
      companyName: '<script>Bank</script>',
      lots: -10,
      avgBuyPrice: 9200,
      currentPrice: 9500,
    });

    expect(cleaned.ticker).toBe('BBCA');
    expect(cleaned.companyName).not.toContain('<');
    expect(cleaned.lots).toBe(1);

    const json = serializeStockBackupJson(
      sampleHoldings,
      DEFAULT_STOCKBIT_FEES,
    );
    const parsed = parseStockBackupJson(json);
    expect(parsed.holdings).toHaveLength(2);
    expect(parsed.holdings[0].ticker).toBe('BBCA');
    expect(parsed.feeConfig.buyFeePct).toBe(0.15);
  });
});
