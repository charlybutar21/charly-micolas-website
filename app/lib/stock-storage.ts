import { initialStockHoldings, initialStockbitFees } from '@/app/data/stocks';
import type { StockHolding, StockbitFeeConfig } from '@/app/types/stock';

const DB_NAME = 'charly_stock_workspace_db';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_state';
const STATE_KEY = 'active_portfolio_v1';

export interface StoredPortfolioState {
  version: 1;
  exportedAt: string;
  feeConfig: StockbitFeeConfig;
  holdings: StockHolding[];
}

function sanitizeText(
  value: unknown,
  fallback: string,
  maxLength = 240,
): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.replace(/[<>]/g, '').trim();
  return trimmed.length > 0 ? trimmed.slice(0, maxLength) : fallback;
}

function sanitizeNonNegativeNumber(
  value: unknown,
  fallback: number,
  max = 1_000_000_000,
): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
}

export function sanitizeHolding(raw: Partial<StockHolding>): StockHolding {
  const ticker = sanitizeText(raw.ticker, 'IDX', 10)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  return {
    id: sanitizeText(
      raw.id,
      `${ticker.toLowerCase()}-${Date.now().toString(36)}`,
      64,
    ),
    ticker: ticker || 'IDX',
    companyName: sanitizeText(raw.companyName, 'Emiten BEI', 120),
    sector: sanitizeText(raw.sector, 'General', 80),
    lots: Math.floor(sanitizeNonNegativeNumber(raw.lots, 1, 10_000_000)),
    avgBuyPrice: sanitizeNonNegativeNumber(raw.avgBuyPrice, 1000, 10_000_000),
    currentPrice: sanitizeNonNegativeNumber(raw.currentPrice, 1000, 10_000_000),
    targetPrice:
      raw.targetPrice !== undefined
        ? sanitizeNonNegativeNumber(raw.targetPrice, 0, 10_000_000)
        : undefined,
    notes: sanitizeText(raw.notes, '-', 500),
    updatedAt: sanitizeText(
      raw.updatedAt,
      new Date().toISOString().slice(0, 10),
      20,
    ),
    fundamentals: {
      eps: sanitizeNonNegativeNumber(raw.fundamentals?.eps, 0, 10_000_000),
      bvps: sanitizeNonNegativeNumber(raw.fundamentals?.bvps, 0, 100_000_000),
      dps: sanitizeNonNegativeNumber(raw.fundamentals?.dps, 0, 10_000_000),
      historicalMeanPer: sanitizeNonNegativeNumber(
        raw.fundamentals?.historicalMeanPer,
        0,
        500,
      ),
      historicalMeanPbv: sanitizeNonNegativeNumber(
        raw.fundamentals?.historicalMeanPbv,
        0,
        200,
      ),
      expectedDividendYieldPct: sanitizeNonNegativeNumber(
        raw.fundamentals?.expectedDividendYieldPct,
        0,
        100,
      ),
    },
  };
}

export function sanitizeFeeConfig(
  raw?: Partial<StockbitFeeConfig>,
): StockbitFeeConfig {
  return {
    buyFeePct: sanitizeNonNegativeNumber(
      raw?.buyFeePct,
      initialStockbitFees.buyFeePct,
      10,
    ),
    sellFeePct: sanitizeNonNegativeNumber(
      raw?.sellFeePct,
      initialStockbitFees.sellFeePct,
      10,
    ),
  };
}

export function serializeStockBackupJson(
  holdings: StockHolding[],
  feeConfig: StockbitFeeConfig,
): string {
  const payload: StoredPortfolioState = {
    version: 1,
    exportedAt: new Date().toISOString(),
    feeConfig: sanitizeFeeConfig(feeConfig),
    holdings: holdings.map(sanitizeHolding),
  };
  return JSON.stringify(payload, null, 2);
}

export function parseStockBackupJson(jsonText: string): StoredPortfolioState {
  const parsed: unknown = JSON.parse(jsonText);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Format JSON tidak valid.');
  }

  const record = parsed as Record<string, unknown>;
  const rawHoldings = Array.isArray(parsed)
    ? parsed
    : Array.isArray(record.holdings)
      ? record.holdings
      : null;

  if (!rawHoldings) {
    throw new Error(
      'File JSON harus memiliki properti array "holdings" atau berupa array saham.',
    );
  }

  const holdings = rawHoldings.map((item) =>
    sanitizeHolding((item ?? {}) as Partial<StockHolding>),
  );
  const feeConfig = sanitizeFeeConfig(
    (record.feeConfig ?? undefined) as Partial<StockbitFeeConfig> | undefined,
  );

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    feeConfig,
    holdings,
  };
}

function openPortfolioDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open IndexedDB.'));
  });
}

export async function loadPortfolioStateFromDb(): Promise<StoredPortfolioState> {
  const fallback: StoredPortfolioState = {
    version: 1,
    exportedAt: new Date().toISOString(),
    feeConfig: initialStockbitFees,
    holdings: initialStockHoldings,
  };

  try {
    const db = await openPortfolioDb();
    return await new Promise<StoredPortfolioState>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(STATE_KEY);

      getReq.onsuccess = () => {
        const result = getReq.result as StoredPortfolioState | undefined;
        if (result && Array.isArray(result.holdings)) {
          resolve({
            version: 1,
            exportedAt: result.exportedAt ?? fallback.exportedAt,
            feeConfig: sanitizeFeeConfig(result.feeConfig),
            holdings: result.holdings.map(sanitizeHolding),
          });
        } else {
          resolve(fallback);
        }
      };
      getReq.onerror = () => resolve(fallback);
    });
  } catch {
    return fallback;
  }
}

export async function savePortfolioStateToDb(
  holdings: StockHolding[],
  feeConfig: StockbitFeeConfig,
): Promise<void> {
  try {
    const db = await openPortfolioDb();
    const payload: StoredPortfolioState = {
      version: 1,
      exportedAt: new Date().toISOString(),
      feeConfig: sanitizeFeeConfig(feeConfig),
      holdings: holdings.map(sanitizeHolding),
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const putReq = store.put(payload, STATE_KEY);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () =>
        reject(putReq.error ?? new Error('Failed to write to IndexedDB.'));
    });
  } catch {
    // Fallback gracefully in environments without IndexedDB (e.g., SSR or restricted webviews)
  }
}

export async function clearPortfolioStateInDb(): Promise<void> {
  try {
    const db = await openPortfolioDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delReq = store.delete(STATE_KEY);
      delReq.onsuccess = () => resolve();
      delReq.onerror = () => resolve();
    });
  } catch {
    // Ignore if IndexedDB is unavailable
  }
}
