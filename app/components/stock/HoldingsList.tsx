import {
  calculateFairValue,
  calculateHoldingMetrics,
  formatIdr,
  formatPct,
} from '@/app/lib/stock-calculator';
import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

interface HoldingsListProps {
  holdings: readonly StockHolding[];
  selectedHoldingId: string;
  totalGrossMarketValue: number;
  feeConfig: StockbitFeeConfig;
  onSelectHolding: (id: string) => void;
  onQuickPriceChange: (id: string, nextPrice: number) => void;
  onEditHolding: (holding: StockHolding) => void;
  onDeleteHolding: (id: string) => void;
}

const STATUS_LABELS = {
  undervalued: 'Undervalued',
  fair: 'Fair Value',
  overvalued: 'Overvalued',
} as const;

export default function HoldingsList({
  holdings,
  selectedHoldingId,
  totalGrossMarketValue,
  feeConfig,
  onSelectHolding,
  onQuickPriceChange,
  onEditHolding,
  onDeleteHolding,
}: HoldingsListProps) {
  if (holdings.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>
          Belum ada data saham di portofolio. Klik tombol{' '}
          <strong>+ Tambah Saham</strong> untuk mulai menginput kepemilikan
          saham Anda.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.holdingsGrid}>
      {holdings.map((holding) => {
        const metrics = calculateHoldingMetrics(
          holding,
          totalGrossMarketValue,
          feeConfig,
        );
        const valuation = calculateFairValue(
          holding.currentPrice,
          holding.fundamentals,
        );
        const isSelected = holding.id === selectedHoldingId;
        const isProfit = metrics.unrealizedPnL >= 0;

        return (
          <article
            key={holding.id}
            className={`${styles.holdingCard} ${
              isSelected ? styles.holdingCardActive : ''
            }`}
          >
            <div className={styles.holdingHeader}>
              <div>
                <div className={styles.tickerRow}>
                  <h3 className={styles.ticker}>{holding.ticker}</h3>
                  <span className={styles.sectorBadge}>{holding.sector}</span>
                  <span
                    className={`${styles.valuationBadge} ${
                      valuation.status === 'undervalued'
                        ? styles.badgeUndervalued
                        : valuation.status === 'overvalued'
                          ? styles.badgeOvervalued
                          : styles.badgeFair
                    }`}
                  >
                    {STATUS_LABELS[valuation.status]} (MoS{' '}
                    {valuation.marginOfSafetyPct.toFixed(1)}%)
                  </span>
                </div>
                <p className={styles.companyName}>{holding.companyName}</p>
              </div>

              <div className={styles.cardActions}>
                <button
                  type="button"
                  onClick={() => onSelectHolding(holding.id)}
                  className={
                    isSelected ? styles.activeActionButton : styles.actionButton
                  }
                  aria-pressed={isSelected}
                >
                  {isSelected
                    ? 'Sedang Dianalisis'
                    : 'Simulasi Avg Down & Valuasi'}
                </button>
                <button
                  type="button"
                  onClick={() => onEditHolding(holding)}
                  className={styles.ghostButton}
                  aria-label={`Edit data saham ${holding.ticker}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteHolding(holding.id)}
                  className={styles.dangerGhostButton}
                  aria-label={`Hapus saham ${holding.ticker}`}
                >
                  Hapus
                </button>
              </div>
            </div>

            <div className={styles.metricsRow}>
              <div className={styles.metricCell}>
                <span className={styles.metricLabel}>Jumlah Lot & Lembar</span>
                <strong className={styles.metricValue}>
                  {holding.lots.toLocaleString('id-ID')} Lot
                </strong>
                <span className={styles.metricSub}>
                  {metrics.shares.toLocaleString('id-ID')} lembar
                </span>
              </div>

              <div className={styles.metricCell}>
                <span className={styles.metricLabel}>Avg Buy / Break-Even</span>
                <strong className={styles.metricValue}>
                  {formatIdr(holding.avgBuyPrice)}
                </strong>
                <span className={styles.metricSub}>
                  Impas jual: {formatIdr(metrics.breakEvenSellPrice)}
                </span>
              </div>

              <div className={styles.metricCell}>
                <label
                  htmlFor={`quick-price-${holding.id}`}
                  className={styles.metricLabel}
                >
                  Harga Pasar Saat Ini (Rp)
                </label>
                <input
                  id={`quick-price-${holding.id}`}
                  type="number"
                  min={1}
                  step={1}
                  value={holding.currentPrice}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isFinite(next) && next >= 0) {
                      onQuickPriceChange(holding.id, next);
                    }
                  }}
                  className={styles.inlinePriceInput}
                />
                <span className={styles.metricSub}>
                  Harga Normal:{' '}
                  {valuation.compositeFairValue > 0
                    ? formatIdr(valuation.compositeFairValue)
                    : '-'}
                </span>
              </div>

              <div className={styles.metricCell}>
                <span className={styles.metricLabel}>
                  Modal vs Nilai Bersih
                </span>
                <strong className={styles.metricValue}>
                  {formatIdr(metrics.netLiquidatingValue)}
                </strong>
                <span className={styles.metricSub}>
                  Modal: {formatIdr(metrics.investedCapital)}
                </span>
              </div>

              <div className={styles.metricCell}>
                <span className={styles.metricLabel}>Unrealized P&amp;L</span>
                <strong
                  className={`${styles.metricValue} ${
                    isProfit ? styles.positiveText : styles.negativeText
                  }`}
                >
                  {isProfit ? '+' : ''}
                  {formatIdr(metrics.unrealizedPnL)}
                </strong>
                <span
                  className={`${styles.metricSub} ${
                    isProfit ? styles.positiveText : styles.negativeText
                  }`}
                >
                  {formatPct(metrics.unrealizedPnLPct)} · Bobot{' '}
                  {metrics.weightPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className={styles.holdingFooter}>
              <p className={styles.thesisNote}>
                <strong>Thesis &amp; Catatan:</strong> {holding.notes}
              </p>
              <span className={styles.updatedDate}>
                Update: {holding.updatedAt}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
