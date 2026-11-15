import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';

export const initialStockbitFees: StockbitFeeConfig = {
  buyFeePct: 0.15,
  sellFeePct: 0.25,
};

export const initialStockHoldings: StockHolding[] = [
  {
    id: 'bbca',
    ticker: 'BBCA',
    companyName: 'PT Bank Central Asia Tbk.',
    sector: 'Banking & Financials',
    lots: 25,
    avgBuyPrice: 9650,
    currentPrice: 9150,
    targetPrice: 10800,
    notes:
      'Core CASA franchise compounder. Akumulasi bertahap saat PBV di bawah rata-rata 5 tahun (4.5x).',
    updatedAt: '2026-11-16',
    fundamentals: {
      eps: 445,
      bvps: 2180,
      dps: 290,
      historicalMeanPer: 23.5,
      historicalMeanPbv: 4.6,
      expectedDividendYieldPct: 3.0,
    },
  },
  {
    id: 'bmri',
    ticker: 'BMRI',
    companyName: 'PT Bank Mandiri (Persero) Tbk.',
    sector: 'Banking & Financials',
    lots: 40,
    avgBuyPrice: 6600,
    currentPrice: 5850,
    targetPrice: 7400,
    notes:
      'Corporate banking leader dengan ROE > 19% dan dividend payout ratio ~60%.',
    updatedAt: '2026-11-16',
    fundamentals: {
      eps: 615,
      bvps: 3080,
      dps: 365,
      historicalMeanPer: 11.8,
      historicalMeanPbv: 2.2,
      expectedDividendYieldPct: 5.5,
    },
  },
  {
    id: 'bbri',
    ticker: 'BBRI',
    companyName: 'PT Bank Rakyat Indonesia (Persero) Tbk.',
    sector: 'Banking & Financials',
    lots: 60,
    avgBuyPrice: 4950,
    currentPrice: 4280,
    targetPrice: 5600,
    notes:
      'High-yield micro banking turnaround. Pantau CoC (Cost of Credit) dan dividen interim.',
    updatedAt: '2026-11-16',
    fundamentals: {
      eps: 398,
      bvps: 2110,
      dps: 335,
      historicalMeanPer: 14.0,
      historicalMeanPbv: 2.5,
      expectedDividendYieldPct: 6.5,
    },
  },
  {
    id: 'tlkm',
    ticker: 'TLKM',
    companyName: 'PT Telkom Indonesia (Persero) Tbk.',
    sector: 'Telecommunications',
    lots: 80,
    avgBuyPrice: 3320,
    currentPrice: 2760,
    targetPrice: 3650,
    notes:
      'Defensive cash-cow & data center play. Valuasi EV/EBITDA dan PER berada di area -2 SD historis.',
    updatedAt: '2026-11-16',
    fundamentals: {
      eps: 248,
      bvps: 1430,
      dps: 179,
      historicalMeanPer: 14.8,
      historicalMeanPbv: 2.5,
      expectedDividendYieldPct: 5.5,
    },
  },
];
