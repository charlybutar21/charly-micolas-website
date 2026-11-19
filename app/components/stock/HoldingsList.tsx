'use client';

import { useState } from 'react';
import {
  calculateFairValue,
  calculateHoldingMetrics,
  formatIdr,
  formatPct,
  isPriceStale,
} from '@/app/lib/stock-calculator';
import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';

export default function HoldingsList({
  holdings,
  totalMarketValue,
  feeConfig,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: {
  holdings: StockHolding[];
  totalMarketValue: number;
  feeConfig: StockbitFeeConfig;
  selectedId: string;
  onSelect: (id: string) => void;
  onEdit: (holding: StockHolding) => void;
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('ticker');
  const filtered = holdings
    .filter((h) =>
      (h.ticker + ' ' + h.companyName)
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === 'weight'
        ? b.lots * b.currentPrice - a.lots * a.currentPrice
        : sort === 'pnl'
          ? calculateHoldingMetrics(a, totalMarketValue, feeConfig)
              .unrealizedPnLPct -
            calculateHoldingMetrics(b, totalMarketValue, feeConfig)
              .unrealizedPnLPct
          : a.ticker.localeCompare(b.ticker),
    );
  return (
    <section aria-label="Daftar kepemilikan" className={styles.holdingsSection}>
      <div className={styles.listTools}>
        <label className={styles.searchLabel}>
          Cari saham
          <input
            className={styles.textInput}
            type="search"
            placeholder="Kode atau nama perusahaan"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className={styles.fieldGroup}>
          Urutkan
          <select
            className={styles.textInput}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="ticker">Kode A–Z</option>
            <option value="weight">Bobot terbesar</option>
            <option value="pnl">P/L terendah</option>
          </select>
        </label>
      </div>
      <div className={styles.holdingsGrid}>
        {filtered.map((h) => {
          const m = calculateHoldingMetrics(h, totalMarketValue, feeConfig);
          const fv = calculateFairValue(h.currentPrice, h.fundamentals);
          return (
            <article
              key={h.id}
              className={
                styles.holdingCard +
                (selectedId === h.id ? ' ' + styles.holdingCardActive : '')
              }
              aria-label={'Posisi ' + h.ticker}
            >
              <div className={styles.holdingHeader}>
                <div>
                  <div className={styles.tickerRow}>
                    <h3 className={styles.ticker}>{h.ticker}</h3>
                    <span className={styles.sectorBadge}>{h.sector}</span>
                    <span
                      className={
                        styles.valuationBadge +
                        ' ' +
                        (fv.status === 'undervalued'
                          ? styles.badgeUndervalued
                          : fv.status === 'overvalued'
                            ? styles.badgeOvervalued
                            : styles.badgeFair)
                      }
                    >
                      {fv.marginOfSafetyPct === null
                        ? 'Belum ada valuasi'
                        : 'MOS ' + formatPct(fv.marginOfSafetyPct, 1)}
                    </span>
                  </div>
                  <p className={styles.companyName}>{h.companyName}</p>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={
                      selectedId === h.id
                        ? styles.activeActionButton
                        : styles.actionButton
                    }
                    aria-pressed={selectedId === h.id}
                    onClick={() => onSelect(h.id)}
                  >
                    Analisis {h.ticker}
                  </button>
                  <button
                    className={styles.ghostButton}
                    aria-label={'Edit ' + h.ticker}
                    onClick={() => onEdit(h)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.dangerGhostButton}
                    aria-label={'Hapus ' + h.ticker}
                    onClick={() => onDelete(h.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <div className={styles.metricsRow}>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Posisi / average</span>
                  <strong>{h.lots.toLocaleString('id-ID')} lot</strong>
                  <small>{formatIdr(h.avgBuyPrice)} / lembar</small>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Harga terakhir</span>
                  <strong>{formatIdr(h.currentPrice)}</strong>
                  <small>
                    {h.priceUpdatedAt ?? 'Tanggal belum diisi'}
                    {isPriceStale(h.priceUpdatedAt)
                      ? ' · Perlu update'
                      : ' · Manual'}
                  </small>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Nilai bersih</span>
                  <strong>{formatIdr(m.netLiquidatingValue)}</strong>
                  <small>Modal {formatIdr(m.investedCapital)}</small>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>
                    P/L belum terealisasi
                  </span>
                  <strong
                    className={
                      m.unrealizedPnL >= 0
                        ? styles.positiveText
                        : styles.negativeText
                    }
                  >
                    {formatIdr(m.unrealizedPnL)}
                  </strong>
                  <small>
                    {formatPct(m.unrealizedPnLPct)} setelah fee jual
                  </small>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>
                    Bobot / harga wajar
                  </span>
                  <strong>
                    {m.weightPct.toFixed(1)}%
                    {m.isOverConcentrated ? ' · Di atas batas' : ''}
                  </strong>
                  <small>
                    {fv.compositeFairValue === null
                      ? 'Lengkapi valuasi'
                      : formatIdr(fv.compositeFairValue)}
                  </small>
                </div>
              </div>
              {(h.notes ||
                (h.targetPrice && h.currentPrice >= h.targetPrice) ||
                (h.stopPrice && h.currentPrice <= h.stopPrice)) && (
                <div className={styles.holdingFooter}>
                  <p className={styles.thesisNote}>{h.notes}</p>
                  {h.targetPrice && h.currentPrice >= h.targetPrice ? (
                    <span className={styles.positiveText}>
                      Target jual tercapai
                    </span>
                  ) : null}
                  {h.stopPrice && h.currentPrice <= h.stopPrice ? (
                    <span className={styles.negativeText}>
                      Batas evaluasi tersentuh
                    </span>
                  ) : null}
                </div>
              )}
            </article>
          );
        })}
        {!filtered.length && (
          <p className={styles.emptyState}>
            Tidak ada saham yang cocok dengan pencarian.
          </p>
        )}
      </div>
    </section>
  );
}
