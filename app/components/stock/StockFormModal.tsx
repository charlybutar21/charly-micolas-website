'use client';

import { useState } from 'react';
import { emptyFundamentals } from '@/app/data/stocks';
import { localDate } from '@/app/lib/stock-calculator';
import { parseIndonesianNumber } from '@/app/lib/stock-import';
import { validateHolding } from '@/app/lib/stock-storage';
import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

export default function StockFormModal({
  initialHolding,
  feeConfig,
  existingTickers,
  onSave,
  onCancel,
}: {
  initialHolding: StockHolding | null;
  feeConfig: StockbitFeeConfig;
  existingTickers: string[];
  onSave: (holding: StockHolding) => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState('');
  const h = initialHolding;
  const numeric = (v: number | undefined) =>
    v === undefined
      ? ''
      : v.toLocaleString('id-ID', { maximumFractionDigits: 8 });
  return (
    <section className={styles.formPanel} aria-labelledby="holding-form-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="holding-form-title" className={styles.panelTitle}>
            {h ? 'Edit ' + h.ticker : 'Tambah saham'}
          </h2>
        </div>
        <button className={styles.ghostButton} onClick={onCancel}>
          Tutup
        </button>
      </div>
      <p className={styles.panelDescription}>
        Salin empat kolom dari portofolio sekuritas Anda. Data fundamental bisa
        diisi nanti. Gunakan format Indonesia: 9.650,50 atau 9650.
      </p>
      <form
        className={styles.stockForm}
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const value = (key: string) => String(form.get(key) ?? '').trim();
          const ticker = value('ticker').toUpperCase();
          if (existingTickers.includes(ticker) && ticker !== h?.ticker) {
            setError(
              'Saham ini sudah ada. Edit posisi yang ada agar tidak terhitung dua kali.',
            );
            return;
          }
          const avg = parseIndonesianNumber(value('avg'));
          try {
            const stock = validateHolding(
              {
                ...h,
                id: h?.id ?? crypto.randomUUID(),
                ticker,
                lots: parseIndonesianNumber(value('lots')),
                avgBuyPrice: form.get('includeFee')
                  ? avg
                  : avg * (1 + feeConfig.buyFeePct / 100),
                currentPrice: parseIndonesianNumber(value('price')),
                priceUpdatedAt: value('priceDate'),
                updatedAt: localDate(),
                companyName: value('company'),
                sector: value('sector'),
                notes: value('notes'),
                targetPrice: value('target')
                  ? parseIndonesianNumber(value('target'))
                  : undefined,
                stopPrice: value('stop')
                  ? parseIndonesianNumber(value('stop'))
                  : undefined,
                maxWeightPct: value('weight')
                  ? parseIndonesianNumber(value('weight'))
                  : 25,
                fundamentals: h?.fundamentals ?? { ...emptyFundamentals },
              },
              1,
            );
            onSave(stock);
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Periksa input saham.');
          }
        }}
      >
        <div className={styles.formGrid}>
          <label className={styles.fieldGroup}>
            Kode saham
            <input
              autoFocus
              className={styles.textInput}
              name="ticker"
              placeholder="Contoh: BBCA"
              defaultValue={h?.ticker}
              required
              pattern="[A-Za-z0-9]{2,10}"
              maxLength={10}
              autoComplete="off"
            />
          </label>
          <label className={styles.fieldGroup}>
            Jumlah lot
            <input
              className={styles.textInput}
              name="lots"
              inputMode="numeric"
              placeholder="Contoh: 10"
              defaultValue={numeric(h?.lots)}
              required
            />
            <small>1 lot = 100 lembar saham.</small>
          </label>
          <label className={styles.fieldGroup}>
            Average beli (Rp/lembar)
            <input
              className={styles.textInput}
              name="avg"
              inputMode="decimal"
              placeholder="Contoh: 9.650"
              defaultValue={numeric(h?.avgBuyPrice)}
              required
            />
          </label>
          <label className={styles.fieldGroup}>
            Harga terakhir (Rp/lembar)
            <input
              className={styles.textInput}
              name="price"
              inputMode="decimal"
              placeholder="Contoh: 9.150"
              defaultValue={numeric(h?.currentPrice)}
              required
            />
          </label>
        </div>
        <label className={styles.checkLabel}>
          <input type="checkbox" name="includeFee" defaultChecked /> Average
          beli sudah termasuk fee beli
        </label>
        <p className={styles.sectionSubnote}>
          Jika belum, kami tambahkan fee beli {feeConfig.buyFeePct}%. Cocokkan
          dengan perhitungan sekuritas Anda.
        </p>
        <label className={styles.fieldGroup}>
          Tanggal harga (WIB)
          <input
            className={styles.textInput}
            type="date"
            name="priceDate"
            max={localDate()}
            defaultValue={h ? (h.priceUpdatedAt ?? '') : localDate()}
            required
          />
        </label>
        <details className={styles.feeDetails}>
          <summary>Opsional: identitas, target & catatan investasi</summary>
          <div className={styles.formGrid}>
            <label className={styles.fieldGroup}>
              Nama perusahaan
              <input
                className={styles.textInput}
                name="company"
                defaultValue={h?.companyName}
                maxLength={120}
              />
            </label>
            <label className={styles.fieldGroup}>
              Sektor
              <input
                className={styles.textInput}
                name="sector"
                defaultValue={h?.sector}
                placeholder="Contoh: Perbankan"
                maxLength={80}
              />
            </label>
            <label className={styles.fieldGroup}>
              Target jual (Rp)
              <input
                className={styles.textInput}
                name="target"
                inputMode="decimal"
                defaultValue={numeric(h?.targetPrice)}
              />
            </label>
            <label className={styles.fieldGroup}>
              Batas evaluasi / stop (Rp)
              <input
                className={styles.textInput}
                name="stop"
                inputMode="decimal"
                defaultValue={numeric(h?.stopPrice)}
              />
            </label>
            <label className={styles.fieldGroup}>
              Batas bobot posisi (%)
              <input
                className={styles.textInput}
                name="weight"
                inputMode="decimal"
                defaultValue={numeric(h?.maxWeightPct ?? 25)}
              />
              <small>Preferensi Anda, bukan batas aman universal.</small>
            </label>
          </div>
          <label className={styles.fieldGroup}>
            Tesis & alasan untuk evaluasi ulang
            <textarea
              className={styles.textareaInput}
              name="notes"
              rows={3}
              maxLength={500}
              defaultValue={h?.notes}
              placeholder="Mengapa membeli? Kondisi apa yang membuat tesis ini tidak berlaku?"
            />
          </label>
        </details>
        {error && (
          <p role="alert" className={styles.warningBox}>
            {error}
          </p>
        )}
        <div className={styles.formFooterActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onCancel}
          >
            Batal
          </button>
          <button className={styles.primaryButton}>Simpan saham</button>
        </div>
      </form>
    </section>
  );
}
