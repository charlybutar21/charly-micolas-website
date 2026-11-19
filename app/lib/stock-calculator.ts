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
    isOverConcentrated:
      weightPct > (holding.maxWeightPct ?? SAFE_CONCENTRATION_LIMIT_PCT),
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
  const valid =
    [
      input.existingLots,
      input.existingAvgPrice,
      input.newBuyPrice,
      input.additionalLots,
      feeConfig.buyFeePct,
      feeConfig.sellFeePct,
    ].every(Number.isFinite) &&
    Number.isInteger(input.existingLots) &&
    input.existingLots > 0 &&
    Number.isInteger(input.additionalLots) &&
    input.additionalLots > 0 &&
    input.additionalLots <= 10_000_000 &&
    input.existingLots + input.additionalLots <= 10_000_000 &&
    input.existingAvgPrice > 0 &&
    input.newBuyPrice > 0 &&
    feeConfig.buyFeePct >= 0 &&
    feeConfig.buyFeePct <= 10 &&
    feeConfig.sellFeePct >= 0 &&
    feeConfig.sellFeePct <= 10;
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
    isFeasible: valid,
    validationMessage: valid
      ? undefined
      : 'Isi posisi, harga, dan lot tambahan yang valid. Lot tambahan harus bilangan bulat minimal 1; biaya 0–10%.',
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

  // A selected method owns the estimate. Averaging unrelated models hides assumptions.
  const candidate = {
    per: perFairValue,
    pbv: pbvFairValue,
    dividend: dividendFairValue,
    manual: fundamentals.manualFairValue ?? null,
  }[fundamentals.method ?? 'per'];
  const compositeFairValue =
    candidate !== null && Number.isFinite(candidate) && candidate > 0
      ? candidate
      : null;
  const targetMosPct = Number.isFinite(fundamentals.targetMosPct)
    ? Math.min(90, Math.max(0, fundamentals.targetMosPct!))
    : 20;
  const priced =
    Number.isFinite(currentPrice) &&
    currentPrice > 0 &&
    compositeFairValue !== null;
  const marginOfSafetyPct = priced
    ? (1 - currentPrice / compositeFairValue) * 100
    : null;
  const upsidePct = priced
    ? (compositeFairValue / currentPrice - 1) * 100
    : null;
  const buyBelowPrice =
    compositeFairValue === null
      ? null
      : compositeFairValue * (1 - targetMosPct / 100);
  let status: ValuationStatus = 'unavailable';
  let recommendation =
    'Lengkapi input metode yang dipilih. Data yang belum tersedia tidak dianggap sebagai harga wajar nol.';
  if (marginOfSafetyPct !== null) {
    status =
      marginOfSafetyPct < 0
        ? 'overvalued'
        : currentPrice <= buyBelowPrice!
          ? 'undervalued'
          : 'fair';
    recommendation =
      status === 'undervalued'
        ? 'Target MOS terpenuhi menurut asumsi Anda. Periksa kembali laporan, tesis investasi, dan batas alokasi sebelum memutuskan.'
        : status === 'overvalued'
          ? 'Harga berada di atas estimasi nilai wajar dari metode yang dipilih.'
          : 'Harga di bawah estimasi nilai wajar, tetapi belum memenuhi target MOS Anda.';
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
    buyBelowPrice,
    targetMosPct,
  };
}

export function simulateAvgDownByBudget(
  input: Omit<AvgDownByLotInput, 'additionalLots'> & { budget: number },
): AvgDownSimulationResult {
  const fees = input.feeConfig ?? DEFAULT_STOCKBIT_FEES;
  const cost = (count: number) => {
    const gross = count * SHARES_PER_LOT * input.newBuyPrice;
    return gross + gross * (fees.buyFeePct / 100);
  };
  const lotCost = cost(1);
  let lots =
    Number.isFinite(input.budget) && input.budget > 0 && lotCost > 0
      ? Math.floor(input.budget / lotCost)
      : 0;
  // Never exceed the entered cash budget because of floating point round-off.
  if (
    lotCost > 0 &&
    Number.isFinite(input.budget) &&
    cost(lots + 1) <= input.budget
  )
    lots += 1;
  if (lots > 0 && cost(lots) > input.budget) lots -= 1;
  const result = simulateAvgDownByLots({ ...input, additionalLots: lots });
  return lots < 1
    ? {
        ...result,
        isFeasible: false,
        validationMessage:
          'Anggaran belum cukup untuk 1 lot termasuk fee beli.',
      }
    : result;
}

export function localDate(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function isPriceStale(
  date: string | undefined,
  today = localDate(),
): boolean {
  return (
    !date ||
    !Number.isFinite(Date.parse(date)) ||
    Date.parse(today) - Date.parse(date) > 3 * 86_400_000
  );
}

export function formatIdr(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}

export function formatPct(pct: number, decimals: number = 2): string {
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(decimals)}%`;
}
