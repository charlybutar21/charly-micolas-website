import { initialStockbitFees } from '../data/stocks';
import { localDate } from './stock-calculator';
import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';

const DB_NAME = 'charly_stock_workspace_db';
const STORE_NAME = 'portfolio_state';
// Keep the original database, store and key so existing portfolios migrate in place.
const STATE_KEY = 'active_portfolio_v1';
export const MAX_IMPORT_BYTES = 2_000_000;
export const MAX_HOLDINGS = 500;

export interface StoredPortfolioState {
  version: 2;
  exportedAt: string;
  feeConfig: StockbitFeeConfig;
  holdings: StockHolding[];
}

const text = (value: unknown, fallback = '', max = 500): string =>
  typeof value === 'string'
    ? value.replace(/[<>]/g, '').trim().slice(0, max) || fallback
    : fallback;
const number = (
  value: unknown,
  fallback = 0,
  min = 0,
  max = 100_000_000,
): number =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= min &&
  value <= max
    ? value
    : fallback;

export function sanitizeHolding(raw: Partial<StockHolding>): StockHolding {
  const ticker = text(raw.ticker, 'IDX', 10)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  const f = raw.fundamentals;
  const method = f?.method;
  return {
    id: text(raw.id, ticker.toLowerCase(), 64),
    ticker,
    companyName: text(raw.companyName, ticker, 120),
    sector: text(raw.sector, 'Belum diisi', 80),
    lots: Math.floor(number(raw.lots, 1, 1, 10_000_000)),
    avgBuyPrice: number(raw.avgBuyPrice),
    currentPrice: number(raw.currentPrice),
    targetPrice: number(raw.targetPrice) || undefined,
    stopPrice: number(raw.stopPrice) || undefined,
    maxWeightPct: number(raw.maxWeightPct, 25, 1, 100),
    notes: text(raw.notes),
    updatedAt: text(raw.updatedAt, localDate(), 32),
    // Legacy updatedAt also changed for edits unrelated to quotes; don't pretend it is a quote timestamp.
    priceUpdatedAt: text(raw.priceUpdatedAt, '', 10) || undefined,
    fundamentals: {
      eps: number(f?.eps, 0, -100_000_000),
      bvps: number(f?.bvps, 0, -100_000_000),
      dps: number(f?.dps),
      historicalMeanPer: number(f?.historicalMeanPer, 0, 0, 500),
      historicalMeanPbv: number(f?.historicalMeanPbv, 0, 0, 200),
      expectedDividendYieldPct: number(f?.expectedDividendYieldPct, 0, 0, 100),
      method:
        method && ['per', 'pbv', 'dividend', 'manual'].includes(method)
          ? method
          : 'per',
      manualFairValue: number(f?.manualFairValue),
      targetMosPct: number(f?.targetMosPct, 20, 0, 90),
      reportPeriod: text(f?.reportPeriod, '', 80),
      source: text(f?.source, '', 300),
      reviewedAt: text(f?.reviewedAt, '', 10),
    },
  };
}

export function sanitizeFeeConfig(
  raw?: Partial<StockbitFeeConfig>,
): StockbitFeeConfig {
  return {
    buyFeePct: number(raw?.buyFeePct, initialStockbitFees.buyFeePct, 0, 10),
    sellFeePct: number(raw?.sellFeePct, initialStockbitFees.sellFeePct, 0, 10),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateHolding(raw: unknown, row: number): StockHolding {
  if (
    !isRecord(raw) ||
    typeof raw.ticker !== 'string' ||
    !/^[A-Z0-9]{2,10}$/i.test(raw.ticker.trim())
  ) {
    throw new Error('Baris ' + row + ': kode saham tidak valid.');
  }
  for (const key of ['lots', 'avgBuyPrice', 'currentPrice'] as const) {
    if (
      typeof raw[key] !== 'number' ||
      !Number.isFinite(raw[key]) ||
      raw[key] <= 0 ||
      raw[key] > (key === 'lots' ? 10_000_000 : 100_000_000) ||
      (key === 'lots' && !Number.isInteger(raw[key]))
    ) {
      throw new Error(
        'Baris ' +
          row +
          ': ' +
          key +
          ' harus angka positif yang valid; lot harus bulat.',
      );
    }
  }
  for (const key of ['targetPrice', 'stopPrice', 'maxWeightPct'] as const) {
    if (
      raw[key] !== undefined &&
      (typeof raw[key] !== 'number' ||
        !Number.isFinite(raw[key]) ||
        raw[key] < (key === 'maxWeightPct' ? 1 : 0) ||
        raw[key] > (key === 'maxWeightPct' ? 100 : 100_000_000))
    ) {
      throw new Error('Baris ' + row + ': ' + key + ' tidak valid.');
    }
  }
  if (raw.fundamentals !== undefined) {
    if (!isRecord(raw.fundamentals))
      throw new Error('Baris ' + row + ': fundamental tidak valid.');
    const f = raw.fundamentals;
    const limits: Record<string, [number, number]> = {
      eps: [-100_000_000, 100_000_000],
      bvps: [-100_000_000, 100_000_000],
      dps: [0, 100_000_000],
      historicalMeanPer: [0, 500],
      historicalMeanPbv: [0, 200],
      expectedDividendYieldPct: [0, 100],
      manualFairValue: [0, 100_000_000],
      targetMosPct: [0, 90],
    };
    for (const [key, [min, max]] of Object.entries(limits)) {
      const value = f[key];
      if (
        value !== undefined &&
        (typeof value !== 'number' ||
          !Number.isFinite(value) ||
          value < min ||
          value > max)
      )
        throw new Error(
          'Baris ' + row + ': fundamental ' + key + ' tidak valid.',
        );
    }
    if (
      f.method !== undefined &&
      !['per', 'pbv', 'dividend', 'manual'].includes(String(f.method))
    )
      throw new Error('Metode valuasi tidak dikenali.');
  }
  for (const key of ['priceUpdatedAt'] as const) {
    if (
      raw[key] !== undefined &&
      (typeof raw[key] !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(raw[key]) ||
        !Number.isFinite(Date.parse(raw[key])) ||
        new Date(raw[key]).toISOString().slice(0, 10) !== raw[key] ||
        raw[key] > localDate())
    )
      throw new Error(
        'Tanggal harga harus tanggal valid, paling lambat hari ini.',
      );
  }
  return sanitizeHolding(raw as Partial<StockHolding>);
}

export function parseStockBackupJson(jsonText: string): StoredPortfolioState {
  if (jsonText.length > MAX_IMPORT_BYTES)
    throw new Error('Ukuran backup maksimal 2 MB.');
  const parsed: unknown = JSON.parse(jsonText);
  if (!isRecord(parsed) && !Array.isArray(parsed))
    throw new Error('Format backup tidak valid.');
  const record = isRecord(parsed) ? parsed : {};
  if (
    record.version !== undefined &&
    record.version !== 1 &&
    record.version !== 2
  )
    throw new Error('Versi backup belum didukung.');
  const rows = Array.isArray(parsed) ? parsed : record.holdings;
  if (!Array.isArray(rows) || rows.length > MAX_HOLDINGS)
    throw new Error('Backup harus berisi daftar holdings, maksimal 500 saham.');
  const holdings = rows.map((row, index) => validateHolding(row, index + 1));
  if (
    new Set(holdings.map((h) => h.ticker)).size !== holdings.length ||
    new Set(holdings.map((h) => h.id)).size !== holdings.length
  )
    throw new Error(
      'Ada kode saham atau ID duplikat. Gabungkan posisinya terlebih dahulu.',
    );
  if (record.feeConfig !== undefined) {
    if (
      !isRecord(record.feeConfig) ||
      !['buyFeePct', 'sellFeePct'].every(
        (k) =>
          typeof (record.feeConfig as Record<string, unknown>)[k] ===
            'number' &&
          Number.isFinite((record.feeConfig as Record<string, unknown>)[k]) &&
          Number((record.feeConfig as Record<string, unknown>)[k]) >= 0 &&
          Number((record.feeConfig as Record<string, unknown>)[k]) <= 10,
      )
    )
      throw new Error('Fee beli/jual harus angka 0–10%.');
  }
  return {
    version: 2,
    exportedAt: text(record.exportedAt, new Date().toISOString()),
    feeConfig: sanitizeFeeConfig(
      record.feeConfig as Partial<StockbitFeeConfig>,
    ),
    holdings,
  };
}

export function serializeStockBackupJson(
  holdings: StockHolding[],
  feeConfig: StockbitFeeConfig,
): string {
  return JSON.stringify(
    { version: 2, exportedAt: new Date().toISOString(), feeConfig, holdings },
    null,
    2,
  );
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('Penyimpanan browser tidak tersedia.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME))
        request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () =>
      reject(new Error('Tutup tab stock lain, lalu coba kembali.'));
  });
}

export async function loadPortfolioStateFromDb(): Promise<StoredPortfolioState> {
  const db = await openDb();
  try {
    const result = await new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(STATE_KEY);
      tx.oncomplete = () => resolve(request.result);
      tx.onabort = () =>
        reject(tx.error ?? new Error('Gagal membaca portofolio.'));
      tx.onerror = () => reject(tx.error);
    });
    return result === undefined
      ? {
          version: 2,
          exportedAt: new Date().toISOString(),
          feeConfig: initialStockbitFees,
          holdings: [],
        }
      : parseStockBackupJson(JSON.stringify(result));
  } finally {
    db.close();
  }
}

export async function savePortfolioStateToDb(
  holdings: StockHolding[],
  feeConfig: StockbitFeeConfig,
): Promise<void> {
  const payload = parseStockBackupJson(
    serializeStockBackupJson(holdings, feeConfig),
  );
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(payload, STATE_KEY);
      // A successful put is not yet a committed transaction.
      tx.oncomplete = () => resolve();
      tx.onabort = () =>
        reject(tx.error ?? new Error('Penyimpanan dibatalkan.'));
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
