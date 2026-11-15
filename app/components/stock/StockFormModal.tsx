'use client';

import { useState } from 'react';
import { sanitizeHolding } from '@/app/lib/stock-storage';
import type { StockHolding } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

interface StockFormModalProps {
  initialHolding: StockHolding | null;
  onSave: (holding: StockHolding) => void;
  onCancel: () => void;
}

export default function StockFormModal({
  initialHolding,
  onSave,
  onCancel,
}: StockFormModalProps) {
  const [ticker, setTicker] = useState(initialHolding?.ticker ?? '');
  const [companyName, setCompanyName] = useState(
    initialHolding?.companyName ?? '',
  );
  const [sector, setSector] = useState(
    initialHolding?.sector ?? 'Banking & Financials',
  );
  const [lots, setLots] = useState(initialHolding?.lots ?? 10);
  const [avgBuyPrice, setAvgBuyPrice] = useState(
    initialHolding?.avgBuyPrice ?? 5000,
  );
  const [currentPrice, setCurrentPrice] = useState(
    initialHolding?.currentPrice ?? 4800,
  );
  const [notes, setNotes] = useState(initialHolding?.notes ?? '');
  const [eps, setEps] = useState(initialHolding?.fundamentals.eps ?? 400);
  const [bvps, setBvps] = useState(initialHolding?.fundamentals.bvps ?? 2000);
  const [dps, setDps] = useState(initialHolding?.fundamentals.dps ?? 200);
  const [historicalMeanPer, setHistoricalMeanPer] = useState(
    initialHolding?.fundamentals.historicalMeanPer ?? 15,
  );
  const [historicalMeanPbv, setHistoricalMeanPbv] = useState(
    initialHolding?.fundamentals.historicalMeanPbv ?? 2.2,
  );
  const [expectedDividendYieldPct, setExpectedDividendYieldPct] = useState(
    initialHolding?.fundamentals.expectedDividendYieldPct ?? 5,
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = sanitizeHolding({
      id:
        initialHolding?.id ??
        `${ticker.toLowerCase()}-${Date.now().toString(36)}`,
      ticker,
      companyName,
      sector,
      lots,
      avgBuyPrice,
      currentPrice,
      notes,
      updatedAt: new Date().toISOString().slice(0, 10),
      fundamentals: {
        eps,
        bvps,
        dps,
        historicalMeanPer,
        historicalMeanPbv,
        expectedDividendYieldPct,
      },
    });
    onSave(cleaned);
  };

  return (
    <section
      className={styles.formPanel}
      aria-labelledby="stock-form-modal-title"
    >
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelEyebrow}>Input Data Kepemilikan Saham</p>
          <h2 id="stock-form-modal-title" className={styles.panelTitle}>
            {initialHolding
              ? `Edit Saham ${initialHolding.ticker}`
              : 'Tambah Saham Baru ke Portofolio'}
          </h2>
        </div>
        <button type="button" onClick={onCancel} className={styles.ghostButton}>
          Tutup Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.stockForm}>
        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label htmlFor="form-ticker">Kode Saham IDX (Ticker)</label>
            <input
              id="form-ticker"
              type="text"
              required
              maxLength={10}
              placeholder="Misal: BBCA, BMRI, ADRO"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-company">Nama Perusahaan</label>
            <input
              id="form-company"
              type="text"
              required
              maxLength={120}
              placeholder="PT Bank Central Asia Tbk."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-sector">Sektor Industri</label>
            <input
              id="form-sector"
              type="text"
              required
              maxLength={80}
              placeholder="Banking & Financials"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-lots">
              Jumlah Lot Dimiliki (1 Lot = 100 lbr)
            </label>
            <input
              id="form-lots"
              type="number"
              required
              min={1}
              step={1}
              value={lots}
              onChange={(e) => setLots(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-avg-price">
              Harga Average Beli (Rp / lbr)
            </label>
            <input
              id="form-avg-price"
              type="number"
              required
              min={1}
              step={1}
              value={avgBuyPrice}
              onChange={(e) => setAvgBuyPrice(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-current-price">
              Harga Pasar Saat Ini (Rp / lbr)
            </label>
            <input
              id="form-current-price"
              type="number"
              required
              min={1}
              step={1}
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-eps">EPS Tahunan / TTM (Rp)</label>
            <input
              id="form-eps"
              type="number"
              min={0}
              step="1"
              value={eps}
              onChange={(e) => setEps(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-bvps">BVPS / Nilai Buku per Lembar (Rp)</label>
            <input
              id="form-bvps"
              type="number"
              min={0}
              step="1"
              value={bvps}
              onChange={(e) => setBvps(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-dps">Dividen per Lembar / DPS (Rp)</label>
            <input
              id="form-dps"
              type="number"
              min={0}
              step="1"
              value={dps}
              onChange={(e) => setDps(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-mean-pbv">5Y Historical Mean PBV (x)</label>
            <input
              id="form-mean-pbv"
              type="number"
              min={0}
              step="0.1"
              value={historicalMeanPbv}
              onChange={(e) => setHistoricalMeanPbv(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-mean-per">5Y Historical Mean PER (x)</label>
            <input
              id="form-mean-per"
              type="number"
              min={0}
              step="0.1"
              value={historicalMeanPer}
              onChange={(e) => setHistoricalMeanPer(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="form-yield">Target Dividend Yield (%)</label>
            <input
              id="form-yield"
              type="number"
              min={0.1}
              step="0.25"
              value={expectedDividendYieldPct}
              onChange={(e) =>
                setExpectedDividendYieldPct(Number(e.target.value))
              }
              className={styles.numberInput}
            />
          </div>
        </div>

        <div className={styles.fieldGroupFull}>
          <label htmlFor="form-notes">
            Investment Thesis &amp; Catatan Strategi
          </label>
          <textarea
            id="form-notes"
            rows={2}
            maxLength={500}
            placeholder="Catat alasan beli, batas akumulasi, dan target profit taking..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.textareaInput}
          />
        </div>

        <div className={styles.formFooterActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.ghostButton}
          >
            Batal
          </button>
          <button type="submit" className={styles.primaryButton}>
            Simpan Data Saham
          </button>
        </div>
      </form>
    </section>
  );
}
