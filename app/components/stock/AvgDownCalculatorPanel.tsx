'use client';

import { useState } from 'react';
import {
  formatIdr,
  formatPct,
  getIdxTickSize,
  simulateAvgDownByLots,
  simulateAvgDownByTargetPrice,
} from '@/app/lib/stock-calculator';
import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

interface AvgDownCalculatorPanelProps {
  holding: StockHolding | null;
  feeConfig: StockbitFeeConfig;
  onFeeConfigChange: (nextFee: StockbitFeeConfig) => void;
  onApplySimulationToHolding: (
    holdingId: string,
    newTotalLots: number,
    newAvgPrice: number,
    latestPrice: number,
  ) => void;
}

export default function AvgDownCalculatorPanel({
  holding,
  feeConfig,
  onFeeConfigChange,
  onApplySimulationToHolding,
}: AvgDownCalculatorPanelProps) {
  const [mode, setMode] = useState<'by-lots' | 'by-target'>('by-lots');
  const [customBuyPrice, setCustomBuyPrice] = useState<number | null>(null);
  const [additionalLots, setAdditionalLots] = useState<number>(20);
  const [targetAvgPrice, setTargetAvgPrice] = useState<number | null>(null);

  const existingLots = holding?.lots ?? 10;
  const existingAvgPrice = holding?.avgBuyPrice ?? 5000;
  const activeBuyPrice = customBuyPrice ?? holding?.currentPrice ?? 4500;
  const defaultTarget = Math.round((existingAvgPrice + activeBuyPrice) / 2);
  const activeTargetAvg = targetAvgPrice ?? defaultTarget;

  const simulation =
    mode === 'by-lots'
      ? simulateAvgDownByLots({
          existingLots,
          existingAvgPrice,
          newBuyPrice: activeBuyPrice,
          additionalLots,
          feeConfig,
        })
      : simulateAvgDownByTargetPrice({
          existingLots,
          existingAvgPrice,
          newBuyPrice: activeBuyPrice,
          targetAvgPrice: activeTargetAvg,
          feeConfig,
        });

  const tickSize = getIdxTickSize(activeBuyPrice);

  return (
    <section
      className={styles.panelCard}
      aria-labelledby="avg-down-calculator-heading"
    >
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelEyebrow}>Stockbit Transaction Simulator</p>
          <h2 id="avg-down-calculator-heading" className={styles.panelTitle}>
            Kalkulator Average Down{' '}
            {holding ? `— ${holding.ticker}` : '(Mode Manual)'}
          </h2>
        </div>

        <div
          className={styles.modeSwitch}
          role="group"
          aria-label="Mode simulasi average down"
        >
          <button
            type="button"
            onClick={() => setMode('by-lots')}
            className={
              mode === 'by-lots' ? styles.modeButtonActive : styles.modeButton
            }
          >
            Simulasi Lot Baru
          </button>
          <button
            type="button"
            onClick={() => setMode('by-target')}
            className={
              mode === 'by-target' ? styles.modeButtonActive : styles.modeButton
            }
          >
            Cari Lot dari Target Avg
          </button>
        </div>
      </div>

      <p className={styles.panelDescription}>
        Menghitung harga rata-rata baru secara presisi dengan memasukkan{' '}
        <strong>Fee Beli Stockbit ({feeConfig.buyFeePct}%)</strong>,{' '}
        <strong>Fee Jual ({feeConfig.sellFeePct}%)</strong>, serta pembulatan{' '}
        <strong>Fraksi Harga BEI (Rp {tickSize})</strong>.
      </p>

      <div className={styles.formGrid}>
        <div className={styles.fieldGroup}>
          <label htmlFor="sim-existing-lots">Posisi Saat Ini (Lot)</label>
          <input
            id="sim-existing-lots"
            type="text"
            readOnly
            value={`${existingLots.toLocaleString('id-ID')} Lot (${(existingLots * 100).toLocaleString('id-ID')} lbr)`}
            className={styles.readOnlyInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="sim-existing-avg">Harga Average Saat Ini</label>
          <input
            id="sim-existing-avg"
            type="text"
            readOnly
            value={formatIdr(existingAvgPrice)}
            className={styles.readOnlyInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="sim-buy-price">Harga Beli Baru (Rp / Lembar)</label>
          <input
            id="sim-buy-price"
            type="number"
            min={1}
            step={tickSize}
            value={activeBuyPrice}
            onChange={(e) => setCustomBuyPrice(Number(e.target.value))}
            className={styles.numberInput}
          />
        </div>

        {mode === 'by-lots' ? (
          <div className={styles.fieldGroup}>
            <label htmlFor="sim-additional-lots">
              Jumlah Lot Beli Tambahan
            </label>
            <input
              id="sim-additional-lots"
              type="number"
              min={1}
              step={1}
              value={additionalLots}
              onChange={(e) =>
                setAdditionalLots(Math.max(0, Number(e.target.value)))
              }
              className={styles.numberInput}
            />
            <div className={styles.quickLotChips}>
              {[10, 25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAdditionalLots(preset)}
                  className={styles.chipButton}
                >
                  +{preset} Lot
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.fieldGroup}>
            <label htmlFor="sim-target-avg">
              Target Harga Average Baru (Rp)
            </label>
            <input
              id="sim-target-avg"
              type="number"
              min={1}
              step={tickSize}
              value={activeTargetAvg}
              onChange={(e) => setTargetAvgPrice(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>
        )}
      </div>

      <details className={styles.feeDetails}>
        <summary>
          Pengaturan Biaya Transaksi Stockbit (Beli {feeConfig.buyFeePct}% ·
          Jual {feeConfig.sellFeePct}%)
        </summary>
        <div className={styles.feeConfigGrid}>
          <div className={styles.fieldGroup}>
            <label htmlFor="fee-buy-pct">Fee Beli Stockbit (%)</label>
            <input
              id="fee-buy-pct"
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={feeConfig.buyFeePct}
              onChange={(e) =>
                onFeeConfigChange({
                  ...feeConfig,
                  buyFeePct: Math.max(0, Number(e.target.value)),
                })
              }
              className={styles.numberInput}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="fee-sell-pct">
              Fee Jual Stockbit + PPh Final (%)
            </label>
            <input
              id="fee-sell-pct"
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={feeConfig.sellFeePct}
              onChange={(e) =>
                onFeeConfigChange({
                  ...feeConfig,
                  sellFeePct: Math.max(0, Number(e.target.value)),
                })
              }
              className={styles.numberInput}
            />
          </div>
        </div>
      </details>

      {!simulation.isFeasible && simulation.validationMessage ? (
        <div className={styles.warningBox} role="status">
          {simulation.validationMessage}
        </div>
      ) : null}

      <div className={styles.simulationResults}>
        <div className={styles.resultBoxPrimary}>
          <span className={styles.resultLabel}>
            Harga Average Baru (Net Fee)
          </span>
          <strong className={styles.resultPrimaryValue}>
            {formatIdr(simulation.newAvgPrice)}
          </strong>
          <span className={styles.resultSub}>
            Turun dari {formatIdr(existingAvgPrice)} (Lot Baru:{' '}
            {simulation.newTotalLots.toLocaleString('id-ID')} Lot)
          </span>
        </div>

        <div className={styles.resultBoxPrimary}>
          <span className={styles.resultLabel}>
            Total Dana Kas yang Harus Disiapkan
          </span>
          <strong className={styles.resultPrimaryValue}>
            {formatIdr(simulation.totalCashNeeded)}
          </strong>
          <span className={styles.resultSub}>
            Beli {simulation.additionalLots.toLocaleString('id-ID')} Lot (Gross{' '}
            {formatIdr(simulation.grossBuyAmount)} + Fee{' '}
            {formatIdr(simulation.buyFeeAmount)})
          </span>
        </div>

        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>
            Harga Jual Impas (Break-Even Sell)
          </span>
          <strong className={styles.resultValue}>
            {formatIdr(simulation.breakEvenSellPrice)}
          </strong>
          <span className={styles.resultSub}>
            Sudah menutup fee jual {feeConfig.sellFeePct}% &amp; fraksi BEI
          </span>
        </div>

        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>
            Kenaikan untuk Impas (Recovery %)
          </span>
          <strong className={styles.resultValue}>
            {formatPct(simulation.recoveryNeededAfterPct)}
          </strong>
          <span className={styles.resultSub}>
            Sebelum avg down: {formatPct(simulation.recoveryNeededBeforePct)}
          </span>
        </div>
      </div>

      {holding && simulation.isFeasible && simulation.additionalLots > 0 ? (
        <div className={styles.applySimulationBar}>
          <p>
            Sudah mengeksekusi pembelian{' '}
            <strong>
              +{simulation.additionalLots} Lot {holding.ticker}
            </strong>{' '}
            di harga <strong>{formatIdr(activeBuyPrice)}</strong> pada aplikasi
            Stockbit?
          </p>
          <button
            type="button"
            onClick={() => {
              onApplySimulationToHolding(
                holding.id,
                simulation.newTotalLots,
                Math.round(simulation.newAvgPrice),
                activeBuyPrice,
              );
              setCustomBuyPrice(null);
            }}
            className={styles.primaryButton}
          >
            Simpan Posisi Baru ke Portofolio
          </button>
        </div>
      ) : null}
    </section>
  );
}
