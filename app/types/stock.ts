export interface StockbitFeeConfig {
  buyFeePct: number;
  sellFeePct: number;
}

export interface FundamentalMetrics {
  eps: number;
  bvps: number;
  dps: number;
  historicalMeanPer: number;
  historicalMeanPbv: number;
  expectedDividendYieldPct: number;
  method?: 'per' | 'pbv' | 'dividend' | 'manual';
  manualFairValue?: number;
  targetMosPct?: number;
  reportPeriod?: string;
  source?: string;
  reviewedAt?: string;
}

export interface StockHolding {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  lots: number;
  avgBuyPrice: number;
  currentPrice: number;
  targetPrice?: number;
  notes: string;
  updatedAt: string;
  priceUpdatedAt?: string;
  maxWeightPct?: number;
  stopPrice?: number;
  fundamentals: FundamentalMetrics;
}

export interface HoldingPositionMetrics {
  shares: number;
  investedCapital: number;
  grossMarketValue: number;
  estimatedSellFee: number;
  netLiquidatingValue: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  breakEvenSellPrice: number;
  weightPct: number;
  isOverConcentrated: boolean;
}

export interface PortfolioSummaryMetrics {
  totalInvestedCapital: number;
  totalGrossMarketValue: number;
  totalNetLiquidatingValue: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPnLPct: number;
  holdingsCount: number;
  topConcentrationPct: number;
}

export interface AvgDownByLotInput {
  existingLots: number;
  existingAvgPrice: number;
  newBuyPrice: number;
  additionalLots: number;
  feeConfig?: StockbitFeeConfig;
}

export interface AvgDownByTargetInput {
  existingLots: number;
  existingAvgPrice: number;
  newBuyPrice: number;
  targetAvgPrice: number;
  feeConfig?: StockbitFeeConfig;
}

export interface AvgDownSimulationResult {
  existingLots: number;
  existingAvgPrice: number;
  newBuyPrice: number;
  additionalLots: number;
  additionalShares: number;
  grossBuyAmount: number;
  buyFeeAmount: number;
  totalCashNeeded: number;
  newTotalLots: number;
  newTotalShares: number;
  newTotalInvested: number;
  newAvgPrice: number;
  breakEvenSellPrice: number;
  recoveryNeededBeforePct: number;
  recoveryNeededAfterPct: number;
  isFeasible: boolean;
  validationMessage?: string;
}

export type ValuationStatus =
  'undervalued' | 'fair' | 'overvalued' | 'unavailable';

export interface FairValueResult {
  pbvFairValue: number | null;
  perFairValue: number | null;
  grahamNumber: number | null;
  dividendFairValue: number | null;
  compositeFairValue: number | null;
  marginOfSafetyPct: number | null;
  upsidePct: number | null;
  buyBelowPrice: number | null;
  targetMosPct: number;
  status: ValuationStatus;
  recommendation: string;
}
