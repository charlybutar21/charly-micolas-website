'use client';

import {
  calculateFairValue,
  formatIdr,
  formatPct,
} from '@/app/lib/stock-calculator';
import type { FundamentalMetrics, StockHolding } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

interface FairValuePanelProps {
  holding: StockHolding | null;
  onUpdateFundamentals: (
    holdingId: string,
    nextFundamentals: FundamentalMetrics,
  ) => void;
}

const DEFAULT_FUNDAMENTALS: FundamentalMetrics = {
  eps: 450,
  bvps: 2200,
  dps: 250,
  historicalMeanPer: 15,
  historicalMeanPbv: 2.5,
  expectedDividendYieldPct: 5,
};

export default function FairValuePanel({
  holding,
  onUpdateFundamentals,
}: FairValuePanelProps) {
  const fundamentals = holding?.fundamentals ?? DEFAULT_FUNDAMENTALS;
  const currentPrice = holding?.currentPrice ?? 4500;
  const valuation = calculateFairValue(currentPrice, fundamentals);

  const handleFieldChange = (
    field: keyof FundamentalMetrics,
    rawValue: string,
  ) => {
    if (!holding) return;
    const numeric = Number(rawValue);
    if (!Number.isFinite(numeric) || numeric < 0) return;
    onUpdateFundamentals(holding.id, {
      ...fundamentals,
      [field]: numeric,
    });
  };

  return (
    <section
      className={styles.panelCard}
      aria-labelledby="fair-value-panel-heading"
    >
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelEyebrow}>
            Intrinsic Value &amp; Margin of Safety
          </p>
          <h2 id="fair-value-panel-heading" className={styles.panelTitle}>
            Valuasi Harga Normal Saham{' '}
            {holding ? `— ${holding.ticker}` : '(Mode Contoh)'}
          </h2>
        </div>

        <span
          className={`${styles.valuationBadge} ${
            valuation.status === 'undervalued'
              ? styles.badgeUndervalued
              : valuation.status === 'overvalued'
                ? styles.badgeOvervalued
                : styles.badgeFair
          }`}
        >
          {valuation.status === 'undervalued'
            ? 'Undervalued (Zona Akumulasi)'
            : valuation.status === 'overvalued'
              ? 'Overvalued (Rawan Koreksi)'
              : 'Fairly Valued (Harga Wajar)'}
        </span>
      </div>

      <p className={styles.panelDescription}>
        <strong>Bagaimana cara tahu harga normal saham?</strong> Ambil angka{' '}
        <code>EPS (TTM)</code>, <code>BVPS</code>, <code>DPS</code>, serta
        rata-rata 5 tahun <code>Mean PE</code> &amp; <code>Mean PBV</code> dari
        menu <strong>Key Stats di Stockbit</strong>. Sistem akan menghitung
        rentang harga wajar dari 4 pendekatan fundamental sekaligus.
      </p>

      <div className={styles.formGrid}>
        <div className={styles.fieldGroup}>
          <label htmlFor="fund-eps">EPS Tahunan / TTM (Rp)</label>
          <input
            id="fund-eps"
            type="number"
            min="0"
            step="1"
            value={fundamentals.eps}
            disabled={!holding}
            onChange={(e) => handleFieldChange('eps', e.target.value)}
            className={styles.numberInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="fund-bvps">Book Value per Share / BVPS (Rp)</label>
          <input
            id="fund-bvps"
            type="number"
            min="0"
            step="1"
            value={fundamentals.bvps}
            disabled={!holding}
            onChange={(e) => handleFieldChange('bvps', e.target.value)}
            className={styles.numberInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="fund-dps">Dividen per Lembar / DPS (Rp)</label>
          <input
            id="fund-dps"
            type="number"
            min="0"
            step="1"
            value={fundamentals.dps}
            disabled={!holding}
            onChange={(e) => handleFieldChange('dps', e.target.value)}
            className={styles.numberInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="fund-mean-pbv">5Y Historical Mean PBV (x)</label>
          <input
            id="fund-mean-pbv"
            type="number"
            min="0"
            step="0.1"
            value={fundamentals.historicalMeanPbv}
            disabled={!holding}
            onChange={(e) =>
              handleFieldChange('historicalMeanPbv', e.target.value)
            }
            className={styles.numberInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="fund-mean-per">5Y Historical Mean PER (x)</label>
          <input
            id="fund-mean-per"
            type="number"
            min="0"
            step="0.1"
            value={fundamentals.historicalMeanPer}
            disabled={!holding}
            onChange={(e) =>
              handleFieldChange('historicalMeanPer', e.target.value)
            }
            className={styles.numberInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="fund-div-yield">
            Target Dividend Yield Wajar (%)
          </label>
          <input
            id="fund-div-yield"
            type="number"
            min="0.1"
            step="0.25"
            value={fundamentals.expectedDividendYieldPct}
            disabled={!holding}
            onChange={(e) =>
              handleFieldChange('expectedDividendYieldPct', e.target.value)
            }
            className={styles.numberInput}
          />
        </div>
      </div>

      <div className={styles.simulationResults}>
        <div className={styles.resultBoxPrimary}>
          <span className={styles.resultLabel}>
            Harga Normal Konsensus (Composite Fair Value)
          </span>
          <strong className={styles.resultPrimaryValue}>
            {valuation.compositeFairValue > 0
              ? formatIdr(valuation.compositeFairValue)
              : '-'}
          </strong>
          <span className={styles.resultSub}>
            Harga Pasar Saat Ini: {formatIdr(currentPrice)} (Upside{' '}
            {formatPct(valuation.upsidePct)})
          </span>
        </div>

        <div className={styles.resultBoxPrimary}>
          <span className={styles.resultLabel}>Margin of Safety (MoS)</span>
          <strong
            className={`${styles.resultPrimaryValue} ${
              valuation.marginOfSafetyPct >= 0
                ? styles.positiveText
                : styles.negativeText
            }`}
          >
            {valuation.marginOfSafetyPct.toFixed(1)}%
          </strong>
          <span className={styles.resultSub}>
            Diskon harga pasar terhadap nilai wajarnya
          </span>
        </div>

        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>
            1. Historical PBV Band (BVPS × Mean PBV)
          </span>
          <strong className={styles.resultValue}>
            {valuation.pbvFairValue ? formatIdr(valuation.pbvFairValue) : '-'}
          </strong>
          <span className={styles.resultSub}>
            Cocok untuk Perbankan (BBCA, BMRI, BBRI) &amp; Properti
          </span>
        </div>

        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>
            2. Historical PER Band (EPS × Mean PER)
          </span>
          <strong className={styles.resultValue}>
            {valuation.perFairValue ? formatIdr(valuation.perFairValue) : '-'}
          </strong>
          <span className={styles.resultSub}>
            Cocok untuk Consumer, Telco (TLKM), &amp; Healthcare
          </span>
        </div>

        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>
            3. Benjamin Graham Number (√(22.5 × EPS × BVPS))
          </span>
          <strong className={styles.resultValue}>
            {valuation.grahamNumber ? formatIdr(valuation.grahamNumber) : '-'}
          </strong>
          <span className={styles.resultSub}>
            Batas konservatif value investing klasik
          </span>
        </div>

        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>
            4. Dividend Yield Model (DPS ÷ Target Yield)
          </span>
          <strong className={styles.resultValue}>
            {valuation.dividendFairValue
              ? formatIdr(valuation.dividendFairValue)
              : '-'}
          </strong>
          <span className={styles.resultSub}>
            Cocok untuk saham rutin bagi dividen tinggi
          </span>
        </div>
      </div>

      <div className={styles.recommendationBox}>
        <strong>Kesimpulan Senior Investment Manager:</strong>{' '}
        {valuation.recommendation}
      </div>
    </section>
  );
}
