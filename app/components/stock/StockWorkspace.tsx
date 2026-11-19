'use client';

import { useEffect, useRef, useState } from 'react';
import { initialStockbitFees } from '@/app/data/stocks';
import {
  calculateFairValue,
  calculatePortfolioSummary,
  isPriceStale,
  localDate,
} from '@/app/lib/stock-calculator';
import {
  loadPortfolioStateFromDb,
  savePortfolioStateToDb,
  serializeStockBackupJson,
  type StoredPortfolioState,
} from '@/app/lib/stock-storage';
import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';
import AvgDownCalculatorPanel from './AvgDownCalculatorPanel';
import FairValuePanel from './FairValuePanel';
import HoldingsList from './HoldingsList';
import PortfolioSummaryBar from './PortfolioSummaryBar';
import StockFormModal from './StockFormModal';
import StockImportPanel from './StockImportPanel';

import type { StockServer } from '@/app/lib/stock-server';
export default function StockWorkspace({
  server,
  initial,
}: {
  server?: StockServer;
  initial?: StoredPortfolioState;
}) {
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [fees, setFees] = useState<StockbitFeeConfig>(initialStockbitFees);
  const [selectedId, setSelectedId] = useState('');
  const [hydrating, setHydrating] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [storageStatus, setStorageStatus] = useState('Memuat data perangkat…');
  const [saveFailed, setSaveFailed] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState<StockHolding | 'new' | null>(null);
  const [importing, setImporting] = useState(false);
  const [undo, setUndo] = useState<{
    holdings: StockHolding[];
    fees: StockbitFeeConfig;
  } | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const revision = useRef(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    (initial ? Promise.resolve(initial) : loadPortfolioStateFromDb())
      .then((data) => {
        if (!active) return;
        setHoldings(data.holdings);
        setFees(data.feeConfig);
        setSelectedId(data.holdings[0]?.id ?? '');
        setStorageStatus(
          server ? 'Database terhubung' : 'Data tersimpan di browser ini',
        );
      })
      .catch((error) => {
        if (active)
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Data perangkat gagal dibaca.',
          );
      })
      .finally(() => {
        if (active) setHydrating(false);
      });
    return () => {
      active = false;
    };
  }, [server, initial]);

  const persist = (
    next: StockHolding[],
    nextFees = fees,
    message = 'Perubahan disimpan.',
    remember = true,
  ) => {
    if (next.length > 500) {
      setNotice('Maksimal 500 saham.');
      return;
    }
    if (remember) setUndo({ holdings, fees });
    setHoldings(next);
    setFees(nextFees);
    setNotice('Perubahan sedang disimpan…');
    setStorageStatus('Menyimpan…');
    setSaveFailed(false);
    const id = ++revision.current;
    queue.current = queue.current
      .catch(() => {})
      .then(() =>
        server
          ? server.save(next, nextFees)
          : savePortfolioStateToDb(next, nextFees),
      )
      .then(() => {
        if (id === revision.current) {
          setStorageStatus(
            server ? 'Tersimpan di database' : 'Tersimpan di browser ini',
          );
          setSaveFailed(false);
          setNotice(message);
        }
      })
      .catch((err) => {
        if (id === revision.current) {
          setStorageStatus(
            'Belum tersimpan. Unduh backup sebelum menutup halaman.',
          );
          if (server && err instanceof Error) setStorageStatus(err.message);
          setSaveFailed(true);
          setNotice(
            'Perubahan hanya ada pada sesi ini. Unduh backup atau coba simpan lagi.',
          );
        }
      });
  };
  const update = (
    id: string,
    changes: Partial<StockHolding>,
    message: string,
  ) =>
    persist(
      holdings.map((h) =>
        h.id === id ? { ...h, ...changes, updatedAt: localDate() } : h,
      ),
      fees,
      message,
    );
  const summary = calculatePortfolioSummary(holdings, fees);
  const selected = holdings.find((h) => h.id === selectedId) ?? holdings[0];
  const reviewCount = holdings.filter((h) =>
    isPriceStale(h.priceUpdatedAt),
  ).length;
  const mosCount = holdings.filter(
    (h) =>
      calculateFairValue(h.currentPrice, h.fundamentals).status ===
      'undervalued',
  ).length;
  const showForm = (value: StockHolding | 'new') => {
    setForm(value);
    setImporting(false);
    requestAnimationFrame(() =>
      editorRef.current?.scrollIntoView({ block: 'start' }),
    );
  };
  const exportBackup = () => {
    const url = URL.createObjectURL(
      new Blob([serializeStockBackupJson(holdings, fees)], {
        type: 'application/json',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stock-portfolio-' + localDate() + '.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      'Backup diunduh. Simpan file ini untuk pemulihan atau pindah perangkat.',
    );
  };

  if (loadError)
    return (
      <section className={styles.errorBanner} role="alert">
        <h2>Data perangkat belum bisa dibaca</h2>
        <p>{loadError}</p>
        <p>
          Portofolio yang tersimpan belum diubah. Izinkan penyimpanan browser,
          tutup tab stock lain, lalu muat ulang.
        </p>
        <button
          className={styles.primaryButton}
          onClick={() => window.location.reload()}
        >
          Coba muat ulang
        </button>
      </section>
    );
  return (
    <div className={styles.workspace}>
      <div className={styles.workspaceStatus}>
        <span>{server ? 'Database pribadi' : 'Hanya di perangkat ini'}</span>
        <span role="status">{storageStatus}</span>
      </div>
      <PortfolioSummaryBar
        summary={summary}
        feeConfig={fees}
        isHydrating={hydrating}
      />
      {!hydrating && (
        <>
          <section
            className={styles.toolbarSection}
            aria-label="Kelola portofolio"
          >
            <div className={styles.toolbarInfo}>
              <h2 className={styles.sectionHeading}>Saham yang saya miliki</h2>
              <p className={styles.sectionSubnote}>
                Masukkan harga terakhir dari sekuritas Anda.
              </p>
            </div>
            <div className={styles.toolbarActions}>
              <button
                className={styles.primaryButton}
                onClick={() => showForm('new')}
              >
                + Tambah saham
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  setImporting(!importing);
                  setForm(null);
                }}
              >
                Impor / tempel tabel
              </button>
              <button className={styles.ghostButton} onClick={exportBackup}>
                Unduh backup
              </button>
            </div>
          </section>
          {saveFailed && (
            <div role="alert" className={styles.warningBox}>
              {storageStatus}{' '}
              <button
                className={styles.secondaryButton}
                onClick={() =>
                  persist(holdings, fees, 'Mencoba menyimpan kembali.', false)
                }
              >
                Coba simpan lagi
              </button>
            </div>
          )}
          {(notice || undo) && (
            <div className={styles.noticeRow}>
              <p role="status">{notice}</p>
              {undo && (
                <button
                  className={styles.ghostButton}
                  onClick={() => {
                    persist(
                      undo.holdings,
                      undo.fees,
                      'Perubahan terakhir dibatalkan.',
                      false,
                    );
                    setUndo(null);
                  }}
                >
                  Batalkan perubahan terakhir
                </button>
              )}
            </div>
          )}
          <div ref={editorRef} className={styles.scrollAnchor}>
            {form && (
              <StockFormModal
                key={form === 'new' ? 'new' : form.id}
                initialHolding={form === 'new' ? null : form}
                feeConfig={fees}
                existingTickers={holdings.map((h) => h.ticker)}
                onCancel={() => setForm(null)}
                onSave={(h) => {
                  persist(
                    holdings.some((old) => old.id === h.id)
                      ? holdings.map((old) => (old.id === h.id ? h : old))
                      : [...holdings, h],
                    fees,
                    h.ticker + ' disimpan.',
                  );
                  setSelectedId(h.id);
                  setForm(null);
                }}
              />
            )}
          </div>
          {importing && (
            <StockImportPanel
              holdings={holdings}
              onClose={() => setImporting(false)}
              onImport={(next, backup?: StoredPortfolioState) => {
                persist(
                  next,
                  backup?.feeConfig ?? fees,
                  'Impor ' + next.length + ' saham diterapkan.',
                );
                setSelectedId(next[0]?.id ?? '');
                setImporting(false);
              }}
            />
          )}
          {!holdings.length ? (
            <section className={styles.emptyState}>
              <h2>Belum ada saham tersimpan</h2>
              <p>
                Isi kode saham, lot, average beli, dan harga terakhir.
                <br />
                Setelah itu, hitung valuasi dan rencanakan tambahan posisi.
              </p>
              <button
                className={styles.primaryButton}
                onClick={() => showForm('new')}
              >
                Masukkan saham pertama
              </button>
              <p className={styles.sectionSubnote}>
                {server
                  ? 'Posisi disimpan di database pribadi Anda.'
                  : 'Posisi disimpan di browser ini.'}
              </p>
            </section>
          ) : (
            <>
              <div className={styles.monitorStrip}>
                <span>
                  <strong>{reviewCount}</strong> harga perlu diperbarui{' '}
                  <small>(&gt;3 hari kalender / belum bertanggal)</small>
                </span>
                <span>
                  <strong>{mosCount}</strong> memenuhi target MOS{' '}
                  <small>berdasarkan asumsi tersimpan</small>
                </span>
              </div>
              <HoldingsList
                holdings={holdings}
                totalMarketValue={summary.totalGrossMarketValue}
                feeConfig={fees}
                selectedId={selected?.id ?? ''}
                onSelect={(id) => {
                  setSelectedId(id);
                  requestAnimationFrame(() =>
                    analysisRef.current?.scrollIntoView({ block: 'start' }),
                  );
                }}
                onEdit={showForm}
                onDelete={(id) =>
                  persist(
                    holdings.filter((h) => h.id !== id),
                    fees,
                    'Saham dihapus. Anda dapat membatalkan perubahan terakhir.',
                  )
                }
              />
              {selected && (
                <section
                  ref={analysisRef}
                  className={styles.scrollAnchor}
                  aria-label={'Analisis ' + selected.ticker}
                >
                  <div className={styles.analysisHeader}>
                    <div>
                      <p className={styles.panelEyebrow}>Fokus analisis</p>
                      <h2>
                        {selected.ticker} <span>{selected.companyName}</span>
                      </h2>
                    </div>
                    <label className={styles.fieldGroup}>
                      Pilih saham
                      <select
                        className={styles.textInput}
                        value={selected.id}
                        onChange={(e) => setSelectedId(e.target.value)}
                      >
                        {holdings.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.ticker}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <form
                    className={styles.quoteForm}
                    key={
                      selected.id +
                      selected.priceUpdatedAt +
                      selected.currentPrice
                    }
                    onSubmit={(e) => {
                      e.preventDefault();
                      const data = new FormData(e.currentTarget);
                      const price = Number(data.get('price'));
                      const date = String(data.get('date'));
                      if (
                        price > 0 &&
                        Number.isFinite(price) &&
                        price <= 100_000_000 &&
                        date &&
                        date <= localDate()
                      )
                        update(
                          selected.id,
                          { currentPrice: price, priceUpdatedAt: date },
                          'Harga ' + selected.ticker + ' diperbarui.',
                        );
                    }}
                  >
                    <label className={styles.fieldGroup}>
                      Harga terakhir (Rp)
                      <input
                        className={styles.numberInput}
                        name="price"
                        type="number"
                        min="1"
                        max="100000000"
                        step="any"
                        defaultValue={selected.currentPrice}
                        required
                      />
                    </label>
                    <label className={styles.fieldGroup}>
                      Tanggal harga
                      <input
                        className={styles.textInput}
                        name="date"
                        type="date"
                        max={localDate()}
                        defaultValue={selected.priceUpdatedAt ?? localDate()}
                        required
                      />
                    </label>
                    <button className={styles.secondaryButton}>
                      Perbarui harga
                    </button>
                  </form>
                  <div className={styles.calculatorsSplit}>
                    <FairValuePanel
                      key={selected.id + JSON.stringify(selected.fundamentals)}
                      holding={selected}
                      onUpdateFundamentals={(id, fundamentals) =>
                        update(id, { fundamentals }, 'Asumsi valuasi disimpan.')
                      }
                    />
                    <AvgDownCalculatorPanel
                      key={
                        selected.id +
                        ':' +
                        selected.lots +
                        ':' +
                        selected.avgBuyPrice +
                        ':' +
                        selected.currentPrice +
                        ':' +
                        JSON.stringify(fees)
                      }
                      holding={selected}
                      totalMarketValue={summary.totalGrossMarketValue}
                      feeConfig={fees}
                      onApplySimulation={(id, lots, avgBuyPrice) =>
                        update(
                          id,
                          { lots, avgBuyPrice },
                          'Pembelian dicatat. Harga pasar terakhir tetap menggunakan update harga Anda.',
                        )
                      }
                    />
                  </div>
                </section>
              )}
            </>
          )}
          <details className={styles.feeDetails}>
            <summary>Pengaturan biaya & cara data disimpan</summary>
            <form
              key={JSON.stringify(fees)}
              className={styles.quoteForm}
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const buyFeePct = Number(data.get('buy'));
                const sellFeePct = Number(data.get('sell'));
                if (
                  [buyFeePct, sellFeePct].every(
                    (v) => Number.isFinite(v) && v >= 0 && v <= 10,
                  )
                )
                  persist(
                    holdings,
                    { buyFeePct, sellFeePct },
                    'Pengaturan fee diperbarui.',
                  );
              }}
            >
              <label className={styles.fieldGroup}>
                Fee beli (%)
                <input
                  className={styles.numberInput}
                  name="buy"
                  type="number"
                  min="0"
                  max="10"
                  step="any"
                  required
                  defaultValue={fees.buyFeePct}
                />
              </label>
              <label className={styles.fieldGroup}>
                Fee jual (%)
                <input
                  className={styles.numberInput}
                  name="sell"
                  type="number"
                  min="0"
                  max="10"
                  step="any"
                  required
                  defaultValue={fees.sellFeePct}
                />
              </label>
              <button className={styles.secondaryButton}>Simpan fee</button>
            </form>
            <p>
              Sesuaikan fee dengan sekuritas Anda. Average lama diasumsikan
              sudah termasuk fee; perubahan fee hanya memengaruhi estimasi jual
              dan pembelian berikutnya.
            </p>
            <p>
              {server
                ? 'Untuk membuka posisi dari perangkat lain, hubungkan kembali dengan kunci pemilik. Unduh backup sebelum memuat ulang jika penyimpanan gagal.'
                : 'Untuk pindah perangkat, unduh dan impor backup atau salin portofolio ke database.'}
            </p>
            <p>
              Halaman tidak tercantum di menu atau sitemap dan meminta mesin
              pencari tidak mengindeksnya. URL ini tetap dapat dibuka siapa pun
              yang mengetahuinya; ini bukan halaman dengan login.
            </p>
          </details>
        </>
      )}
    </div>
  );
}
