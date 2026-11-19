import type {
  FundamentalMetrics,
  StockHolding,
  StockbitFeeConfig,
} from '@/app/types/stock';

// Public bundles must never contain a personal portfolio or invented market data.
export const initialStockHoldings: StockHolding[] = [];
export const initialStockbitFees: StockbitFeeConfig = {
  buyFeePct: 0.15,
  sellFeePct: 0.25,
};
export const emptyFundamentals: FundamentalMetrics = {
  eps: 0,
  bvps: 0,
  dps: 0,
  historicalMeanPer: 0,
  historicalMeanPbv: 0,
  expectedDividendYieldPct: 0,
  method: 'per',
  targetMosPct: 20,
};
