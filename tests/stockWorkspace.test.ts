import { describe, expect, it } from 'vitest';
import { emptyFundamentals } from '../app/data/stocks';
import {
  calculateFairValue,
  isPriceStale,
  simulateAvgDownByBudget,
  simulateAvgDownByLots,
  simulateAvgDownByTargetPrice,
} from '../app/lib/stock-calculator';
import {
  parseHoldingsTable,
  parseIndonesianNumber,
} from '../app/lib/stock-import';
import {
  parseStockBackupJson,
  serializeStockBackupJson,
} from '../app/lib/stock-storage';

describe('valuation uses the chosen method and exposes uncertainty', () => {
  it('includes the exact MOS threshold despite floating point division', () => {
    expect(
      calculateFairValue(800, {
        ...emptyFundamentals,
        method: 'manual',
        manualFairValue: 1000,
        targetMosPct: 20,
      }).status,
    ).toBe('undervalued');
  });
  it('keeps unavailable data distinct from zero/fair and rejects loss-based PER', () => {
    expect(calculateFairValue(1000, emptyFundamentals)).toMatchObject({
      compositeFairValue: null,
      marginOfSafetyPct: null,
      status: 'unavailable',
    });
    expect(
      calculateFairValue(1000, {
        ...emptyFundamentals,
        eps: -50,
        historicalMeanPer: 20,
      }).compositeFairValue,
    ).toBeNull();
    expect(
      calculateFairValue(0, {
        ...emptyFundamentals,
        method: 'manual',
        manualFairValue: 2000,
      }).marginOfSafetyPct,
    ).toBeNull();
  });
  it('does not average unrelated models; MOS and upside use different denominators', () => {
    const result = calculateFairValue(800, {
      ...emptyFundamentals,
      method: 'pbv',
      bvps: 500,
      historicalMeanPbv: 2,
      eps: 500,
      historicalMeanPer: 30,
      targetMosPct: 25,
    });
    expect(result.compositeFairValue).toBe(1000);
    expect(result.marginOfSafetyPct).toBeCloseTo(20);
    expect(result.upsidePct).toBeCloseTo(25);
    expect(result.buyBelowPrice).toBe(750);
    expect(result.status).toBe('fair');
  });
  it('accepts dividend/manual methods and flags price above the estimate', () => {
    expect(
      calculateFairValue(900, {
        ...emptyFundamentals,
        method: 'dividend',
        dps: 50,
        expectedDividendYieldPct: 5,
      }).compositeFairValue,
    ).toBe(1000);
    expect(
      calculateFairValue(1100, {
        ...emptyFundamentals,
        method: 'manual',
        manualFairValue: 1000,
      }).status,
    ).toBe('overvalued');
  });
});

describe('budget and target average boundaries', () => {
  const position = {
    existingLots: 10,
    existingAvgPrice: 5000,
    newBuyPrice: 4000,
  };
  it('counts whole lots including fees and never exceeds the cash budget', () => {
    const result = simulateAvgDownByBudget({ ...position, budget: 1_000_000 });
    expect(result.additionalLots).toBe(2);
    expect(result.totalCashNeeded).toBeCloseTo(801_200);
    for (const budget of [400_599, 400_600, 801_200, 1_200_000, 5_000_000]) {
      const simulation = simulateAvgDownByBudget({ ...position, budget });
      expect(simulation.totalCashNeeded).toBeLessThanOrEqual(budget);
      if (simulation.isFeasible)
        expect(simulation.totalCashNeeded + 400_600).toBeGreaterThan(budget);
    }
  });
  it('rejects insufficient budget, fractional or zero lots and non-finite input', () => {
    expect(
      simulateAvgDownByBudget({ ...position, budget: 400_000 }).isFeasible,
    ).toBe(false);
    for (const additionalLots of [0, 1.5, NaN, Infinity, -10])
      expect(
        simulateAvgDownByLots({ ...position, additionalLots }).isFeasible,
      ).toBe(false);
  });
  it('rounds target sizing upward and handles unreachable fee-inclusive targets', () => {
    const r = simulateAvgDownByTargetPrice({
      ...position,
      targetAvgPrice: 4500,
    });
    expect(r.isFeasible).toBe(true);
    expect(r.newAvgPrice).toBeLessThanOrEqual(4500);
    const fewer = simulateAvgDownByLots({
      ...position,
      additionalLots: r.additionalLots - 1,
    });
    expect(fewer.newAvgPrice).toBeGreaterThan(4500);
    expect(
      simulateAvgDownByTargetPrice({ ...position, targetAvgPrice: 4006 })
        .isFeasible,
    ).toBe(false);
  });
});

describe('input and backup safety', () => {
  const table =
    'KODE;LOT;AVERAGE;HARGA\nBBCA;10;9.650,50;9.150\nTLKM;20;3.200;2.900';
  it('parses Indonesian numbers, semicolon tables and pasted spreadsheet tabs', () => {
    expect(parseIndonesianNumber('Rp 9.650,50')).toBe(9650.5);
    expect(parseIndonesianNumber('1e3')).toBeNaN();
    const rows = parseHoldingsTable(table, '2026-01-01');
    expect(rows[0]).toMatchObject({
      ticker: 'BBCA',
      lots: 10,
      avgBuyPrice: 9650.5,
      currentPrice: 9150,
    });
    expect(
      parseHoldingsTable('BBCA\t10\t9650\t9150', '2026-01-01'),
    ).toHaveLength(1);
  });
  it.each([
    'BBCA;0;100;100',
    'BBCA;1,5;100;100',
    'BBCA;-1;100;100',
    'BBCA;2;x;100',
    'BBCA;2;100;100\nBBCA;3;100;100',
  ])('rejects ambiguous or invalid input: %s', (input) =>
    expect(() => parseHoldingsTable(input)).toThrow(),
  );
  it('migrates version 1 without inventing quote freshness and preserves negatives', () => {
    const h = parseHoldingsTable(table)[0];
    delete h.priceUpdatedAt;
    h.fundamentals.eps = -25;
    const result = parseStockBackupJson(
      JSON.stringify({
        version: 1,
        holdings: [h],
        feeConfig: { buyFeePct: 0.15, sellFeePct: 0.25 },
      }),
    );
    expect(result.version).toBe(2);
    expect(result.holdings[0].priceUpdatedAt).toBeUndefined();
    expect(result.holdings[0].fundamentals.eps).toBe(-25);
    expect(
      parseStockBackupJson(
        serializeStockBackupJson(result.holdings, result.feeConfig),
      ).holdings,
    ).toEqual(result.holdings);
  });
  it('rejects invalid backups before changing anything', () => {
    const h = parseHoldingsTable(table)[0];
    for (const input of [
      null,
      { version: 99, holdings: [] },
      { holdings: [null] },
      { holdings: [{ ...h, lots: '10' }] },
      { holdings: [h, h] },
      { holdings: [{ ...h, priceUpdatedAt: '2026-02-31' }] },
      { holdings: [h], feeConfig: { buyFeePct: -1, sellFeePct: 0 } },
    ])
      expect(() => parseStockBackupJson(JSON.stringify(input))).toThrow();
  });
  it('does not pretend an unknown quote date is fresh', () => {
    expect(isPriceStale(undefined, '2026-11-18')).toBe(true);
    expect(isPriceStale('2026-11-14', '2026-11-18')).toBe(true);
    expect(isPriceStale('2026-11-18', '2026-11-18')).toBe(false);
  });
});
