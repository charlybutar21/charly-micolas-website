'use client';

import { useState } from 'react';
import {
  calculateBreakEvenSellPrice,
  formatIdr,
  formatPct,
  getIdxTickSize,
  simulateAvgDownByBudget,
  simulateAvgDownByLots,
  simulateAvgDownByTargetPrice,
} from '@/app/lib/stock-calculator';
import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

export default function AvgDownCalculatorPanel({
  holding,
  totalMarketValue,
  feeConfig,
  onApplySimulation,
}: {
  holding: StockHolding;
  totalMarketValue: number;
  feeConfig: StockbitFeeConfig;
  onApplySimulation: (id: string, lots: number, average: number) => void;
}) {
  const [mode, setMode] = useState<'budget' | 'lots' | 'target'>('budget');
  const [buyPrice, setBuyPrice] = useState(String(holding.currentPrice));
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const input = {
    existingLots: holding.lots,
    existingAvgPrice: holding.avgBuyPrice,
    newBuyPrice: Number(buyPrice),
    feeConfig,
  };
  const result =
    mode === 'budget'
      ? simulateAvgDownByBudget({ ...input, budget: Number(amount) })
      : mode === 'target'
        ? simulateAvgDownByTargetPrice({
            ...input,
            targetAvgPrice: Number(amount),
          })
        : simulateAvgDownByLots({ ...input, additionalLots: Number(amount) });
  const valid = amount !== '' && Number(amount) > 0 && result.isFeasible;
  const weightBefore =
    totalMarketValue > 0
      ? ((holding.lots * 100 * holding.currentPrice) / totalMarketValue) * 100
      : 0;
  const projectedValue =
    totalMarketValue + result.additionalShares * holding.currentPrice;
  const weightAfter =
    projectedValue > 0
      ? ((result.newTotalShares * holding.currentPrice) / projectedValue) * 100
      : 0;
  const limit = holding.maxWeightPct ?? 25;
  const stressPrice = holding.currentPrice * 0.9;
  const stressBefore =
    holding.lots *
    100 *
    (stressPrice * (1 - feeConfig.sellFeePct / 100) - holding.avgBuyPrice);
  const stressAfter =
    result.newTotalShares * stressPrice * (1 - feeConfig.sellFeePct / 100) -
    result.newTotalInvested;
  const money = (v: number) =>
    valid && Number.isFinite(v) ? formatIdr(v) : '—';
  return (
    <section className={styles.panelCard} aria-labelledby="average-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="average-title" className={styles.panelTitle}>
            Average down · {holding.ticker}
          </h2>
        </div>
        <span className={styles.sectorBadge}>Simulasi</span>
      </div>
      <p className={styles.panelDescription}>
        Posisi sekarang <strong>{holding.lots} lot</strong> pada average{' '}
        <strong>{formatIdr(holding.avgBuyPrice)}</strong> termasuk biaya beli.
        Impas jual sekitar{' '}
        {formatIdr(
          calculateBreakEvenSellPrice(
            holding.avgBuyPrice,
            feeConfig.sellFeePct,
          ),
        )}
        .
      </p>
      <div className={styles.modeSwitch} aria-label="Mode simulasi">
        {(
          [
            ['budget', 'Dari anggaran'],
            ['lots', 'Dari lot'],
            ['target', 'Target average'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            aria-pressed={mode === key}
            className={
              mode === key ? styles.modeButtonActive : styles.modeButton
            }
            onClick={() => {
              setMode(key);
              setAmount('');
              setConfirmed(false);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.formGrid}>
        <label className={styles.fieldGroup}>
          Harga beli rencana (Rp)
          <input
            className={styles.numberInput}
            type="number"
            min="1"
            step="any"
            value={buyPrice}
            onChange={(e) => {
              setBuyPrice(e.target.value);
              setConfirmed(false);
            }}
          />
        </label>
        <label className={styles.fieldGroup}>
          {mode === 'budget'
            ? 'Anggaran maksimum (Rp)'
            : mode === 'lots'
              ? 'Lot tambahan'
              : 'Target average baru (Rp)'}
          <input
            className={styles.numberInput}
            type="number"
            min="1"
            step={mode === 'lots' ? '1' : 'any'}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setConfirmed(false);
            }}
            placeholder={
              mode === 'budget'
                ? 'Contoh: 5000000'
                : mode === 'lots'
                  ? 'Contoh: 10'
                  : 'Di bawah average sekarang'
            }
          />
        </label>
      </div>
      {amount && !valid && (
        <p className={styles.warningBox} role="alert">
          {result.validationMessage ?? 'Masukkan angka positif yang valid.'}
        </p>
      )}
      <div className={styles.simulationResults} aria-live="polite">
        <div className={styles.resultBoxPrimary}>
          <span className={styles.resultLabel}>
            Average baru · termasuk fee
          </span>
          <strong className={styles.resultPrimaryValue}>
            {money(result.newAvgPrice)}
          </strong>
          <small>
            {valid
              ? result.newTotalLots +
                ' lot total (' +
                result.additionalLots +
                ' lot tambahan)'
              : 'Isi rencana pembelian'}
          </small>
        </div>
        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>Total dana dibutuhkan</span>
          <strong className={styles.resultPrimaryValue}>
            {money(result.totalCashNeeded)}
          </strong>
          <small>
            Fee beli {money(result.buyFeeAmount)}
            {mode === 'budget' && valid
              ? ' · Sisa ' + formatIdr(Number(amount) - result.totalCashNeeded)
              : ''}
          </small>
        </div>
        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>Estimasi harga jual impas</span>
          <strong className={styles.resultPrimaryValue}>
            {money(result.breakEvenSellPrice)}
          </strong>
          <small>
            Termasuk fee jual {feeConfig.sellFeePct}%; perkiraan fraksi harga
            reguler.
          </small>
        </div>
        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>Bobot posisi sesudah beli</span>
          <strong className={styles.resultPrimaryValue}>
            {valid ? weightAfter.toFixed(1) + '%' : '—'}
          </strong>
          <small>
            Dari {weightBefore.toFixed(1)}% · batas pilihan Anda {limit}%
          </small>
        </div>
      </div>
      {valid && (
        <>
          {result.newAvgPrice >= holding.avgBuyPrice && (
            <p className={styles.warningBox}>
              Rencana ini menaikkan average setelah fee, bukan average down.
            </p>
          )}
          {weightAfter > limit && (
            <p className={styles.warningBox}>
              Bobot menjadi {weightAfter.toFixed(1)}%, melampaui batas {limit}%.
              Menurunkan average tidak mengurangi konsentrasi risiko.
            </p>
          )}
          {Number(buyPrice) % getIdxTickSize(Number(buyPrice)) !== 0 && (
            <p className={styles.sectionSubnote}>
              Harga rencana mungkin tidak sesuai fraksi reguler. Verifikasi
              fraksi, papan perdagangan, dan harga previous di sekuritas sebelum
              memasang order.
            </p>
          )}
          <div className={styles.recommendationBox}>
            <strong>Jika harga turun lagi 10% dari harga terakhir</strong>
            <p>
              Estimasi P/L bersih sebelum tambah: {formatIdr(stressBefore)}.
              Setelah tambah: {formatIdr(stressAfter)}.
            </p>
            <p>
              Untuk impas dari harga beli rencana:{' '}
              {formatPct(result.recoveryNeededAfterPct)}. Skenario ini bukan
              prediksi; bobot memakai harga terakhir dan dana tambahan dari luar
              portofolio saham.
            </p>
          </div>
          <div className={styles.applySimulationBar}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />{' '}
              Pembelian ini sudah benar-benar saya lakukan di sekuritas.
            </label>
            <button
              className={styles.primaryButton}
              disabled={!confirmed}
              onClick={() => {
                onApplySimulation(
                  holding.id,
                  result.newTotalLots,
                  result.newAvgPrice,
                );
                setConfirmed(false);
                setAmount('');
              }}
            >
              Catat pembelian ke portofolio
            </button>
          </div>
        </>
      )}
      <p className={styles.sectionSubnote}>
        Simulasi tidak mengirim order. Catat hanya jumlah dan harga yang
        benar-benar tereksekusi. Biaya lainnya di luar persentase fee belum
        dihitung.
      </p>
    </section>
  );
}
