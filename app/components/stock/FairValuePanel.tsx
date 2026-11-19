'use client';

import { useState } from 'react';
import {
  calculateFairValue,
  formatIdr,
  formatPct,
  localDate,
} from '@/app/lib/stock-calculator';
import type { FundamentalMetrics, StockHolding } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

export default function FairValuePanel({
  holding,
  onUpdateFundamentals,
}: {
  holding: StockHolding;
  onUpdateFundamentals: (id: string, fundamentals: FundamentalMetrics) => void;
}) {
  const [draft, setDraft] = useState<FundamentalMetrics>(holding.fundamentals);
  const result = calculateFairValue(holding.currentPrice, draft);
  const method = draft.method ?? 'per';
  const money = (v: number | null) =>
    v === null ? 'Belum tersedia' : formatIdr(v);
  const field = (
    key: keyof FundamentalMetrics,
    label: string,
    max: number,
    min = 0,
  ) => (
    <label className={styles.fieldGroup}>
      {label}
      <input
        className={styles.numberInput}
        type="number"
        step="any"
        min={min}
        max={max}
        value={
          typeof draft[key] === 'number' && draft[key] !== 0
            ? String(draft[key])
            : ''
        }
        onChange={(e) =>
          setDraft({
            ...draft,
            [key]: e.target.value === '' ? 0 : e.target.valueAsNumber,
          })
        }
        required
      />
    </label>
  );
  return (
    <section className={styles.panelCard} aria-labelledby="fair-value-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="fair-value-title" className={styles.panelTitle}>
            Harga wajar · {holding.ticker}
          </h2>
        </div>
        <span className={styles.sectorBadge}>Estimasi Anda</span>
      </div>
      <p className={styles.panelDescription}>
        Pilih metode sesuai bisnisnya. Nilai wajar adalah estimasi berbasis
        asumsi; harga pasar dan jumlah lot saja tidak cukup untuk menghitungnya.
      </p>
      <form
        className={styles.stockForm}
        onSubmit={(e) => {
          e.preventDefault();
          onUpdateFundamentals(holding.id, {
            ...draft,
            reviewedAt: localDate(),
          });
        }}
      >
        <label className={styles.fieldGroup}>
          Metode valuasi
          <select
            className={styles.textInput}
            value={method}
            onChange={(e) =>
              setDraft({
                ...draft,
                method: e.target.value as FundamentalMetrics['method'],
              })
            }
          >
            <option value="per">PER — laba perusahaan</option>
            <option value="pbv">PBV — nilai buku ekuitas</option>
            <option value="dividend">Dividend yield — dividen berulang</option>
            <option value="manual">Manual — hasil riset sendiri</option>
          </select>
        </label>
        <p className={styles.sectionSubnote}>
          {method === 'per'
            ? 'EPS TTM × PER acuan. Gunakan laba normal positif; hindari laba one-off dan membandingkan sektor berbeda.'
            : method === 'pbv'
              ? 'BVPS × PBV acuan. Berguna untuk bisnis berbasis aset / bank; tetap periksa ROE dan kualitas aset.'
              : method === 'dividend'
                ? 'DPS tahunan ÷ target yield. Gunakan dividen berulang, bukan dividen khusus yang belum tentu terulang.'
                : 'Masukkan nilai per saham dari riset Anda, misalnya DCF. Cantumkan sumber dan asumsi di bawah.'}
        </p>
        <div className={styles.formGrid}>
          {method === 'per' && (
            <>
              {field('eps', 'EPS TTM (Rp/lembar)', 100_000_000, -100_000_000)}
              {field('historicalMeanPer', 'PER acuan (x)', 500)}
            </>
          )}
          {method === 'pbv' && (
            <>
              {field('bvps', 'BVPS (Rp/lembar)', 100_000_000, -100_000_000)}
              {field('historicalMeanPbv', 'PBV acuan (x)', 200)}
            </>
          )}
          {method === 'dividend' && (
            <>
              {field('dps', 'DPS tahunan (Rp/lembar)', 100_000_000)}
              {field(
                'expectedDividendYieldPct',
                'Target dividend yield (%)',
                100,
              )}
            </>
          )}
          {method === 'manual' &&
            field(
              'manualFairValue',
              'Estimasi harga wajar (Rp/lembar)',
              100_000_000,
            )}
          <label className={styles.fieldGroup}>
            Target Margin of Safety (%)
            <input
              className={styles.numberInput}
              type="number"
              step="any"
              min="0"
              max="90"
              required
              value={draft.targetMosPct ?? 20}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  targetMosPct:
                    e.target.value === '' ? 0 : e.target.valueAsNumber,
                })
              }
            />
          </label>
          <label className={styles.fieldGroup}>
            Periode laporan
            <input
              className={styles.textInput}
              value={draft.reportPeriod ?? ''}
              maxLength={80}
              onChange={(e) =>
                setDraft({ ...draft, reportPeriod: e.target.value })
              }
              placeholder="Contoh: TTM s.d. Q3 2026"
            />
          </label>
        </div>
        <label className={styles.fieldGroup}>
          Sumber data & alasan memilih acuan
          <input
            className={styles.textInput}
            value={draft.source ?? ''}
            maxLength={300}
            onChange={(e) => setDraft({ ...draft, source: e.target.value })}
            placeholder="Laporan emiten / tanggal riset / pembanding PER atau PBV"
          />
        </label>
        <div className={styles.simulationResults}>
          <div className={styles.resultBoxPrimary}>
            <span className={styles.resultLabel}>Estimasi harga wajar</span>
            <strong className={styles.resultPrimaryValue}>
              {money(result.compositeFairValue)}
            </strong>
            <small>Metode {method.toUpperCase()} · Rp per lembar</small>
          </div>
          <div className={styles.resultBox}>
            <span className={styles.resultLabel}>Margin of Safety</span>
            <strong className={styles.resultPrimaryValue}>
              {result.marginOfSafetyPct === null
                ? '—'
                : formatPct(result.marginOfSafetyPct)}
            </strong>
            <small>
              Upside:{' '}
              {result.upsidePct === null ? '—' : formatPct(result.upsidePct)}
            </small>
          </div>
          <div className={styles.resultBox}>
            <span className={styles.resultLabel}>
              Harga batas beli · MOS {result.targetMosPct}%
            </span>
            <strong className={styles.resultPrimaryValue}>
              {money(result.buyBelowPrice)}
            </strong>
            <small>Ambang matematis, belum dibulatkan ke fraksi order.</small>
          </div>
          <div className={styles.resultBox}>
            <span className={styles.resultLabel}>Harga terakhir · manual</span>
            <strong className={styles.resultPrimaryValue}>
              {formatIdr(holding.currentPrice)}
            </strong>
            <small>{holding.priceUpdatedAt ?? 'Tanggal belum diketahui'}</small>
          </div>
        </div>
        <p className={styles.recommendationBox}>{result.recommendation}</p>
        {(!draft.source || !draft.reportPeriod) && (
          <p className={styles.sectionSubnote}>
            Sumber/periode belum lengkap. Hasil belum dapat ditelusuri ke
            laporan keuangan.
          </p>
        )}
        <button className={styles.primaryButton}>Simpan asumsi valuasi</button>
      </form>
      <details className={styles.feeDetails}>
        <summary>Rumus, keterbatasan & pembanding</summary>
        <p>
          MOS = (nilai wajar − harga) ÷ nilai wajar × 100%. Upside = (nilai
          wajar − harga) ÷ harga × 100%. Harga batas beli = nilai wajar × (1 −
          target MOS).
        </p>
        <p>
          PER: {money(result.perFairValue)} · PBV: {money(result.pbvFairValue)}{' '}
          · Dividen: {money(result.dividendFairValue)}. Pembanding tidak
          dirata-ratakan. EPS/BVPS negatif tidak menghasilkan valuasi melalui
          metode tersebut.
        </p>
        <p>
          Graham number: {money(result.grahamNumber)} — pembanding klasik dengan
          asumsi tetap; bukan metode utama untuk semua bisnis. Estimasi tidak
          mencakup perubahan bisnis, dilusi, atau dividen mendatang secara
          otomatis.
        </p>
        <a
          href="https://pages.stern.nyu.edu/adamodar/New_Home_Page/lectures/approach.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Referensi pendekatan valuasi · Aswath Damodaran ↗
        </a>
      </details>
    </section>
  );
}
