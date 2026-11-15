import { formatIdr, formatPct } from '@/app/lib/stock-calculator';
import type {
  PortfolioSummaryMetrics,
  StockbitFeeConfig,
} from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

interface PortfolioSummaryBarProps {
  summary: PortfolioSummaryMetrics;
  feeConfig: StockbitFeeConfig;
  isHydrating: boolean;
}

export default function PortfolioSummaryBar({
  summary,
  feeConfig,
  isHydrating,
}: PortfolioSummaryBarProps) {
  if (isHydrating) {
    return (
      <section
        className={styles.summaryGrid}
        aria-label="Memuat ringkasan portofolio"
        aria-busy="true"
      >
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className={styles.skeletonCard}>
            <span className={styles.skeletonLineShort} />
            <span className={styles.skeletonLineTall} />
            <span className={styles.skeletonLineMedium} />
          </div>
        ))}
      </section>
    );
  }

  const isPositive = summary.totalUnrealizedPnL >= 0;

  return (
    <section
      className={styles.summaryGrid}
      aria-label="Ringkasan nilai portofolio"
    >
      <article className={styles.summaryCard}>
        <p className={styles.summaryLabel}>Total Modal Diinvestasikan</p>
        <p className={styles.summaryValue}>
          {formatIdr(summary.totalInvestedCapital)}
        </p>
        <p className={styles.summaryMeta}>
          {summary.holdingsCount} emiten aktif di portofolio
        </p>
      </article>

      <article className={styles.summaryCard}>
        <p className={styles.summaryLabel}>Nilai Pasar Bersih (Net of Fee)</p>
        <p className={styles.summaryValue}>
          {formatIdr(summary.totalNetLiquidatingValue)}
        </p>
        <p className={styles.summaryMeta}>
          Gross: {formatIdr(summary.totalGrossMarketValue)} (Potong fee jual{' '}
          {feeConfig.sellFeePct}%)
        </p>
      </article>

      <article className={styles.summaryCard}>
        <p className={styles.summaryLabel}>Unrealized Profit / Loss</p>
        <p
          className={`${styles.summaryValue} ${
            isPositive ? styles.positiveText : styles.negativeText
          }`}
        >
          {isPositive ? '+' : ''}
          {formatIdr(summary.totalUnrealizedPnL)}
        </p>
        <p
          className={`${styles.summaryMeta} ${
            isPositive ? styles.positiveText : styles.negativeText
          }`}
        >
          {formatPct(summary.totalUnrealizedPnLPct)} setelah estimasi biaya
          Stockbit
        </p>
      </article>

      <article className={styles.summaryCard}>
        <p className={styles.summaryLabel}>Konsentrasi Posisi Terbesar</p>
        <p className={styles.summaryValue}>
          {summary.topConcentrationPct.toFixed(1)}%
        </p>
        <p className={styles.summaryMeta}>
          {summary.topConcentrationPct > 25
            ? 'Perhatian: Ada posisi > 25% portofolio'
            : 'Distribusi bobot portofolio terdiversifikasi'}
        </p>
      </article>
    </section>
  );
}
