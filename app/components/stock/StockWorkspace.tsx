'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { initialStockHoldings, initialStockbitFees } from '@/app/data/stocks';
import { calculatePortfolioSummary } from '@/app/lib/stock-calculator';
import {
  clearPortfolioStateInDb,
  loadPortfolioStateFromDb,
  parseStockBackupJson,
  savePortfolioStateToDb,
  serializeStockBackupJson,
} from '@/app/lib/stock-storage';
import type {
  FundamentalMetrics,
  StockHolding,
  StockbitFeeConfig,
} from '@/app/types/stock';
import styles from '@/app/stock/page.module.css';
import AvgDownCalculatorPanel from './AvgDownCalculatorPanel';
import FairValuePanel from './FairValuePanel';
import HoldingsList from './HoldingsList';
import PortfolioSummaryBar from './PortfolioSummaryBar';
import StockErrorBoundary from './StockErrorBoundary';
import StockFormModal from './StockFormModal';

export default function StockWorkspace() {
  const [holdings, setHoldings] =
    useState<StockHolding[]>(initialStockHoldings);
  const [feeConfig, setFeeConfig] =
    useState<StockbitFeeConfig>(initialStockbitFees);
  const [selectedHoldingId, setSelectedHoldingId] = useState<string>(
    initialStockHoldings[0]?.id ?? '',
  );
  const [isHydrating, setIsHydrating] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingHolding, setEditingHolding] = useState<StockHolding | null>(
    null,
  );
  const [statusNotice, setStatusNotice] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;
    loadPortfolioStateFromDb()
      .then((stored) => {
        if (!active) return;
        setHoldings(stored.holdings);
        setFeeConfig(stored.feeConfig);
        if (stored.holdings.length > 0) {
          setSelectedHoldingId((prev) =>
            stored.holdings.some((h) => h.id === prev)
              ? prev
              : stored.holdings[0].id,
          );
        }
      })
      .finally(() => {
        if (active) setIsHydrating(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const persistState = (
    nextHoldings: StockHolding[],
    nextFees: StockbitFeeConfig,
    notice?: string,
  ) => {
    setHoldings(nextHoldings);
    setFeeConfig(nextFees);
    void savePortfolioStateToDb(nextHoldings, nextFees);
    if (notice) {
      setStatusNotice(notice);
    }
  };

  const summary = useMemo(
    () => calculatePortfolioSummary(holdings, feeConfig),
    [holdings, feeConfig],
  );

  const selectedHolding = useMemo(
    () =>
      holdings.find((item) => item.id === selectedHoldingId) ??
      holdings[0] ??
      null,
    [holdings, selectedHoldingId],
  );

  const handleSaveHolding = (saved: StockHolding) => {
    const exists = holdings.some((item) => item.id === saved.id);
    const nextHoldings = exists
      ? holdings.map((item) => (item.id === saved.id ? saved : item))
      : [saved, ...holdings];

    persistState(
      nextHoldings,
      feeConfig,
      `Data saham ${saved.ticker} berhasil disimpan ke penyimpanan lokal.`,
    );
    setSelectedHoldingId(saved.id);
    setIsFormOpen(false);
    setEditingHolding(null);
  };

  const handleDeleteHolding = (id: string) => {
    const target = holdings.find((item) => item.id === id);
    const nextHoldings = holdings.filter((item) => item.id !== id);
    persistState(
      nextHoldings,
      feeConfig,
      target ? `Saham ${target.ticker} dihapus dari daftar.` : 'Saham dihapus.',
    );
    if (selectedHoldingId === id) {
      setSelectedHoldingId(nextHoldings[0]?.id ?? '');
    }
  };

  const handleQuickPriceChange = (id: string, nextPrice: number) => {
    const nextHoldings = holdings.map((item) =>
      item.id === id
        ? {
            ...item,
            currentPrice: nextPrice,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : item,
    );
    persistState(nextHoldings, feeConfig);
  };

  const handleApplySimulation = (
    holdingId: string,
    newTotalLots: number,
    newAvgPrice: number,
    latestPrice: number,
  ) => {
    const nextHoldings = holdings.map((item) =>
      item.id === holdingId
        ? {
            ...item,
            lots: newTotalLots,
            avgBuyPrice: newAvgPrice,
            currentPrice: latestPrice,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : item,
    );
    persistState(
      nextHoldings,
      feeConfig,
      'Hasil simulasi Average Down berhasil diterapkan ke posisi portofolio.',
    );
  };

  const handleUpdateFundamentals = (
    holdingId: string,
    nextFundamentals: FundamentalMetrics,
  ) => {
    const nextHoldings = holdings.map((item) =>
      item.id === holdingId
        ? {
            ...item,
            fundamentals: nextFundamentals,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : item,
    );
    persistState(nextHoldings, feeConfig);
  };

  const handleExportJson = () => {
    const json = serializeStockBackupJson(holdings, feeConfig);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `charly-stock-portfolio-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusNotice('Backup JSON portofolio berhasil diunduh.');
  };

  const handleImportJsonFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = parseStockBackupJson(text);
      persistState(
        imported.holdings,
        imported.feeConfig,
        `Berhasil memuat ${imported.holdings.length} saham dari file JSON.`,
      );
      if (imported.holdings[0]) {
        setSelectedHoldingId(imported.holdings[0].id);
      }
    } catch (error) {
      setStatusNotice(
        error instanceof Error
          ? error.message
          : 'Gagal membaca file JSON backup.',
      );
    } finally {
      event.target.value = '';
    }
  };

  const handleResetSeed = async () => {
    await clearPortfolioStateInDb();
    setHoldings(initialStockHoldings);
    setFeeConfig(initialStockbitFees);
    setSelectedHoldingId(initialStockHoldings[0]?.id ?? '');
    setStatusNotice('Data dikembalikan ke baseline seed (app/data/stocks.ts).');
  };

  return (
    <StockErrorBoundary>
      <div className={styles.workspace}>
        <PortfolioSummaryBar
          summary={summary}
          feeConfig={feeConfig}
          isHydrating={isHydrating}
        />

        <section
          className={styles.toolbarSection}
          aria-label="Manajemen data saham dan penyimpanan lokal"
        >
          <div className={styles.toolbarInfo}>
            <h2 className={styles.sectionHeading}>
              Daftar Kepemilikan Saham (Zero-Cost Local DB)
            </h2>
            <p className={styles.sectionSubnote}>
              Data tersimpan otomatis di browser (<code>IndexedDB</code>) tanpa
              biaya sewa database. Gunakan <strong>Export / Import JSON</strong>{' '}
              untuk backup atau sinkronisasi ke <code>app/data/stocks.ts</code>.
            </p>
          </div>

          <div className={styles.toolbarActions}>
            <button
              type="button"
              onClick={() => {
                setEditingHolding(null);
                setIsFormOpen(true);
              }}
              className={styles.primaryButton}
            >
              + Tambah Saham
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className={styles.secondaryButton}
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.secondaryButton}
            >
              Import JSON
            </button>
            <button
              type="button"
              onClick={handleResetSeed}
              className={styles.ghostButton}
            >
              Reset Default
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportJsonFile}
              className={styles.hiddenFileInput}
              aria-label="Import file JSON portofolio saham"
            />
          </div>
        </section>

        {statusNotice ? (
          <p className={styles.statusNotice} role="status">
            {statusNotice}
          </p>
        ) : null}

        {isFormOpen ? (
          <StockFormModal
            initialHolding={editingHolding}
            onSave={handleSaveHolding}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingHolding(null);
            }}
          />
        ) : null}

        <HoldingsList
          holdings={holdings}
          selectedHoldingId={selectedHolding?.id ?? ''}
          totalGrossMarketValue={summary.totalGrossMarketValue}
          feeConfig={feeConfig}
          onSelectHolding={(id) => setSelectedHoldingId(id)}
          onQuickPriceChange={handleQuickPriceChange}
          onEditHolding={(holding) => {
            setEditingHolding(holding);
            setIsFormOpen(true);
          }}
          onDeleteHolding={handleDeleteHolding}
        />

        <div className={styles.calculatorsSplit}>
          <AvgDownCalculatorPanel
            key={selectedHolding?.id ?? 'manual'}
            holding={selectedHolding}
            feeConfig={feeConfig}
            onFeeConfigChange={(nextFee) => persistState(holdings, nextFee)}
            onApplySimulationToHolding={handleApplySimulation}
          />

          <FairValuePanel
            holding={selectedHolding}
            onUpdateFundamentals={handleUpdateFundamentals}
          />
        </div>
      </div>
    </StockErrorBoundary>
  );
}
