'use client';

import { useState } from 'react';
import { localDate } from '@/app/lib/stock-calculator';
import { parseHoldingsTable } from '@/app/lib/stock-import';
import {
  MAX_IMPORT_BYTES,
  parseStockBackupJson,
  type StoredPortfolioState,
} from '@/app/lib/stock-storage';
import type { StockHolding } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

export default function StockImportPanel({
  holdings,
  onImport,
  onClose,
}: {
  holdings: StockHolding[];
  onImport: (holdings: StockHolding[], backup?: StoredPortfolioState) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState('');
  const [date, setDate] = useState(localDate);
  const [preview, setPreview] = useState<StockHolding[] | null>(null);
  const [backup, setBackup] = useState<StoredPortfolioState | undefined>();
  const [error, setError] = useState('');
  const [replace, setReplace] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const duplicates =
    preview?.filter((h) =>
      holdings.some((old) => old.ticker === h.ticker || old.id === h.id),
    ) ?? [];
  return (
    <section className={styles.formPanel} aria-labelledby="import-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="import-title" className={styles.panelTitle}>
            Tempel tabel atau pulihkan backup
          </h2>
        </div>
        <button className={styles.ghostButton} onClick={onClose}>
          Tutup impor
        </button>
      </div>
      <p className={styles.panelDescription}>
        Salin 4 kolom dari Excel / Sheets:{' '}
        <strong>kode saham, lot, average beli, harga terakhir</strong>. Tab atau
        titik koma sebagai pemisah. Average harus sudah termasuk fee; format
        angka Indonesia.
      </p>
      <label className={styles.fieldGroup}>
        Tabel saham
        <textarea
          className={styles.textareaInput}
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setPreview(null);
            setConfirmed(false);
          }}
          placeholder={
            'KODE;LOT;AVERAGE;HARGA\nBBCA;10;9.650;9.150\nTLKM;20;3.200;2.900'
          }
        />
      </label>
      <label className={styles.fieldGroup}>
        Tanggal harga tabel
        <input
          className={styles.textInput}
          type="date"
          value={date}
          max={localDate()}
          onChange={(e) => {
            setDate(e.target.value);
            setPreview(null);
          }}
        />
      </label>
      <div className={styles.toolbarActions}>
        <button
          className={styles.secondaryButton}
          onClick={() => {
            try {
              setPreview(parseHoldingsTable(text, date));
              setBackup(undefined);
              setError('');
              setConfirmed(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Tabel tidak valid.');
              setPreview(null);
            }
          }}
        >
          Periksa tabel
        </button>
        <label className={styles.fieldGroup}>
          Atau pilih file backup JSON
          <input
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPreview(null);
              setConfirmed(false);
              try {
                if (file.size > MAX_IMPORT_BYTES)
                  throw new Error('Ukuran backup maksimal 2 MB.');
                const data = parseStockBackupJson(await file.text());
                setBackup(data);
                setPreview(data.holdings);
                setReplace(true);
                setError('');
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : 'Backup tidak valid.',
                );
              }
              e.target.value = '';
            }}
          />
        </label>
      </div>
      {error && (
        <p role="alert" className={styles.warningBox}>
          {error}
        </p>
      )}
      {preview && (
        <div className={styles.importPreview}>
          <h3>Pratinjau: {preview.length} saham</h3>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Lot</th>
                  <th>Average (Rp)</th>
                  <th>Harga (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((h) => (
                  <tr key={h.id}>
                    <th>{h.ticker}</th>
                    <td>{h.lots}</td>
                    <td>{h.avgBuyPrice.toLocaleString('id-ID')}</td>
                    <td>{h.currentPrice.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={replace}
              onChange={(e) => {
                setReplace(e.target.checked);
                setConfirmed(false);
              }}
            />{' '}
            Ganti seluruh portofolio dengan data ini
          </label>
          {!replace && duplicates.length > 0 && (
            <p role="alert" className={styles.warningBox}>
              Kode atau ID sudah ada:{' '}
              {duplicates.map((h) => h.ticker).join(', ')}. Edit posisi yang ada
              atau pilih ganti seluruh portofolio.
            </p>
          )}
          {replace && (
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />{' '}
              Saya memahami {holdings.length} posisi saat ini akan diganti
              {backup ? ', termasuk pengaturan fee' : ''}.
            </label>
          )}
          <button
            className={styles.primaryButton}
            disabled={
              replace
                ? !confirmed
                : duplicates.length > 0 || preview.length === 0
            }
            onClick={() =>
              onImport(
                replace ? preview : [...holdings, ...preview],
                replace ? backup : undefined,
              )
            }
          >
            Terapkan impor
          </button>
        </div>
      )}
    </section>
  );
}
