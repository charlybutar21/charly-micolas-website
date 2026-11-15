import type {
  AvgDownByLotInput,
  AvgDownByTargetInput,
  AvgDownSimulationResult,
  FairValueResult,
  FundamentalMetrics,
  HoldingPositionMetrics,
  PortfolioSummaryMetrics,
  StockHolding,
  StockbitFeeConfig,
  ValuationStatus,
} from '@/app/types/stock';

export const SHARES_PER_LOT = 100;
export const SAFE_CONCENTRATION_LIMIT_PCT = 25;

export const DEFAULT_STOCKBIT_FEES: StockbitFeeConfig = {
  buyFeePct: 0.15,
  sellFeePct: 0.25,
};

export function getIdxTickSize(price: number): number {
  if (price < 200) return 1;
  if (price < 500) return 2;
  if (price < 2000) return 5;
  if (price < 5000) return 10;
  return 25;
}

export function roundUpToIdxTick(price: number): number {
  if (price <= 0) return 0;
  const tick = getIdxTickSize(price);
  return Math.ceil(price / tick) * tick;
}

export function calculateBreakEvenSellPrice(
  avgPrice: number,
  sellFeePct: number = DEFAULT_STOCKBIT_FEES.sellFeePct,
): number {
  if (avgPrice <= 0) return 0;
  const sellFeeRate = Math.max(0, Math.min(0.99, sellFeePct / 100));
  const rawBreakEven = avgPrice / (1 - sellFeeRate);
  return roundUpToIdxTick(rawBreakEven);
}

export function calculateHoldingMetrics(
  holding: StockHolding,
  totalPortfolioGrossValue: number,
  feeConfig: StockbitFeeConfig = DEFAULT_STOCKBIT_FEES,
): HoldingPositionMetrics {
  const shares = Math.max(0, holding.lots) * SHARES_PER_LOT;
  const investedCapital = shares * Math.max(0, holding.avgBuyPrice);
  const grossMarketValue = shares * Math.max(0, holding.currentPrice);
  const estimatedSellFee = grossMarketValue * (feeConfig.sellFeePct / 100);
  const netLiquidatingValue = grossMarketValue - estimatedSellFee;
  const unrealizedPnL = netLiquidatingValue - investedCapital;
  const unrealizedPnLPct =
    investedCapital > 0 ? (unrealizedPnL / investedCapital) * 100 : 0;
  const breakEvenSellPrice = calculateBreakEvenSellPrice(
    holding.avgBuyPrice,
    feeConfig.sellFeePct,
  );
  const weightPct =
    totalPortfolioGrossValue > 0
      ? (grossMarketValue / totalPortfolioGrossValue) * 100
      : 0;

  return {
    shares,
    investedCapital,
    grossMarketValue,
    estimatedSellFee,
    netLiquidatingValue,
    unrealizedPnL,
    unrealizedPnLPct,
    breakEvenSellPrice,
    weightPct,
    isOverConcentrated: weightPct > SAFE_CONCENTRATION_LIMIT_PCT,
  };
}

export function calculatePortfolioSummary(
  holdings: readonly StockHolding[],
  feeConfig: StockbitFeeConfig = DEFAULT_STOCKBIT_FEES,
): PortfolioSummaryMetrics {
  const totalGrossMarketValue = holdings.reduce(
    (sum, item) =>
      sum +
      Math.max(0, item.lots) * SHARES_PER_LOT * Math.max(0, item.currentPrice),
    0,
  );

  let totalInvestedCapital = 0;
  let totalNetLiquidatingValue = 0;
  let topConcentrationPct = 0;

  for (const item of holdings) {
    const metrics = calculateHoldingMetrics(
      item,
      totalGrossMarketValue,
      feeConfig,
    );
    totalInvestedCapital += metrics.investedCapital;
    totalNetLiquidatingValue += metrics.netLiquidatingValue;
    if (metrics.weightPct > topConcentrationPct) {
      topConcentrationPct = metrics.weightPct;
    }
  }

  const totalUnrealizedPnL = totalNetLiquidatingValue - totalInvestedCapital;
  const totalUnrealizedPnLPct =
    totalInvestedCapital > 0
      ? (totalUnrealizedPnL / totalInvestedCapital) * 100
      : 0;

  return {
    totalInvestedCapital,
    totalGrossMarketValue,
    totalNetLiquidatingValue,
    totalUnrealizedPnL,
    totalUnrealizedPnLPct,
    holdingsCount: holdings.length,
    topConcentrationPct,
  };
}

export function simulateAvgDownByLots(
  input: AvgDownByLotInput,
): AvgDownSimulationResult {
  const feeConfig = input.feeConfig ?? DEFAULT_STOCKBIT_FEES;
  const existingLots = Math.max(0, Math.floor(input.existingLots));
  const existingAvgPrice = Math.max(0, input.existingAvgPrice);
  const newBuyPrice = Math.max(0, input.newBuyPrice);
  const additionalLots = Math.max(0, Math.floor(input.additionalLots));

  const existingShares = existingLots * SHARES_PER_LOT;
  const additionalShares = additionalLots * SHARES_PER_LOT;
  const existingInvested = existingShares * existingAvgPrice;

  const grossBuyAmount = additionalShares * newBuyPrice;
  const buyFeeAmount = grossBuyAmount * (feeConfig.buyFeePct / 100);
  const totalCashNeeded = grossBuyAmount + buyFeeAmount;

  const newTotalLots = existingLots + additionalLots;
  const newTotalShares = existingShares + additionalShares;
  const newTotalInvested = existingInvested + totalCashNeeded;

  const newAvgPrice =
    newTotalShares > 0 ? newTotalInvested / newTotalShares : 0;
  const breakEvenSellPrice = calculateBreakEvenSellPrice(
    newAvgPrice,
    feeConfig.sellFeePct,
  );
  const previousBreakEven = calculateBreakEvenSellPrice(
    existingAvgPrice,
    feeConfig.sellFeePct,
  );

  const recoveryNeededBeforePct =
    newBuyPrice > 0
      ? ((previousBreakEven - newBuyPrice) / newBuyPrice) * 100
      : 0;
  const recoveryNeededAfterPct =
    newBuyPrice > 0
      ? ((breakEvenSellPrice - newBuyPrice) / newBuyPrice) * 100
      : 0;

  return {
    existingLots,
    existingAvgPrice,
    newBuyPrice,
    additionalLots,
    additionalShares,
    grossBuyAmount,
    buyFeeAmount,
    totalCashNeeded,
    newTotalLots,
    newTotalShares,
    newTotalInvested,
    newAvgPrice,
    breakEvenSellPrice,
    recoveryNeededBeforePct,
    recoveryNeededAfterPct,
    isFeasible: newTotalLots > 0 && newBuyPrice > 0,
  };
}

export function simulateAvgDownByTargetPrice(
  input: AvgDownByTargetInput,
): AvgDownSimulationResult {
  const feeConfig = input.feeConfig ?? DEFAULT_STOCKBIT_FEES;
  const existingLots = Math.max(0, Math.floor(input.existingLots));
  const existingAvgPrice = Math.max(0, input.existingAvgPrice);
  const newBuyPrice = Math.max(0, input.newBuyPrice);
  const targetAvgPrice = Math.max(0, input.targetAvgPrice);

  const effectiveNewBuyPricePerShare =
    newBuyPrice * (1 + feeConfig.buyFeePct / 100);

  if (existingLots <= 0 || newBuyPrice <= 0) {
    return {
      ...simulateAvgDownByLots({
        existingLots,
        existingAvgPrice,
        newBuyPrice,
        additionalLots: 0,
        feeConfig,
      }),
      isFeasible: false,
      validationMessage:
        'Jumlah lot awal dan harga beli baru harus lebih dari 0.',
    };
  }

  if (targetAvgPrice >= existingAvgPrice) {
    return {
      ...simulateAvgDownByLots({
        existingLots,
        existingAvgPrice,
        newBuyPrice,
        additionalLots: 0,
        feeConfig,
      }),
      isFeasible: false,
      validationMessage:
        'Target harga average harus lebih rendah dari harga average saat ini.',
    };
  }

  if (targetAvgPrice <= effectiveNewBuyPricePerShare) {
    return {
      ...simulateAvgDownByLots({
        existingLots,
        existingAvgPrice,
        newBuyPrice,
        additionalLots: 0,
        feeConfig,
      }),
      isFeasible: false,
      validationMessage: `Target average (Rp ${Math.round(targetAvgPrice).toLocaleString('id-ID')}) harus di atas harga beli efektif + fee beli Stockbit (Rp ${Math.ceil(effectiveNewBuyPricePerShare).toLocaleString('id-ID')}).`,
    };
  }

  const requiredLotsRaw =
    (existingLots * (existingAvgPrice - targetAvgPrice)) /
    (targetAvgPrice - effectiveNewBuyPricePerShare);
  const additionalLots = Math.max(1, Math.ceil(requiredLotsRaw));

  return simulateAvgDownByLots({
    existingLots,
    existingAvgPrice,
    newBuyPrice,
    additionalLots,
    feeConfig,
  });
}

export function calculateFairValue(
  currentPrice: number,
  fundamentals: FundamentalMetrics,
): FairValueResult {
  const pbvFairValue =
    fundamentals.bvps > 0 && fundamentals.historicalMeanPbv > 0
      ? fundamentals.bvps * fundamentals.historicalMeanPbv
      : null;

  const perFairValue =
    fundamentals.eps > 0 && fundamentals.historicalMeanPer > 0
      ? fundamentals.eps * fundamentals.historicalMeanPer
      : null;

  const grahamNumber =
    fundamentals.eps > 0 && fundamentals.bvps > 0
      ? Math.sqrt(22.5 * fundamentals.eps * fundamentals.bvps)
      : null;

  const dividendFairValue =
    fundamentals.dps > 0 && fundamentals.expectedDividendYieldPct > 0
      ? fundamentals.dps / (fundamentals.expectedDividendYieldPct / 100)
      : null;

  const activeModels = [
    pbvFairValue,
    perFairValue,
    grahamNumber,
    dividendFairValue,
  ].filter((value): value is number => value !== null && value > 0);

  const compositeFairValue =
    activeModels.length > 0
      ? activeModels.reduce((sum, val) => sum + val, 0) / activeModels.length
      : 0;

  const marginOfSafetyPct =
    compositeFairValue > 0
      ? ((compositeFairValue - currentPrice) / compositeFairValue) * 100
      : 0;

  const upsidePct =
    currentPrice > 0
      ? ((compositeFairValue - currentPrice) / currentPrice) * 100
      : 0;

  let status: ValuationStatus = 'fair';
  let recommendation =
    'Harga berada di rentang wajar (Fairly Valued). Cicil bertahap hanya jika bobot portofolio masih di bawah batas alokasi.';

  if (marginOfSafetyPct >= 20) {
    status = 'undervalued';
    recommendation =
      'Undervalued dengan Margin of Safety ≥ 20%. Zona ideal untuk akumulasi atau Average Down secara terukur.';
  } else if (marginOfSafetyPct < -10) {
    status = 'overvalued';
    recommendation =
      'Harga pasar berada di atas nilai wajar fundamental (Overvalued). Hindari Average Down agresif dan tunggu koreksi ke area Margin of Safety.';
  }

  return {
    pbvFairValue,
    perFairValue,
    grahamNumber,
    dividendFairValue,
    compositeFairValue,
    marginOfSafetyPct,
    upsidePct,
    status,
    recommendation,
  };
}

export function formatIdr(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}

export function formatPct(pct: number, decimals: number = 2): string {
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(decimals)}%`;
}
