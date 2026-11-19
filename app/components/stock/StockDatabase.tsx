'use client';

import { useState, useSyncExternalStore } from 'react';
import { StockServer } from '@/app/lib/stock-server';
import { initialStockbitFees } from '@/app/data/stocks';
import {
  loadPortfolioStateFromDb,
  type StoredPortfolioState,
} from '@/app/lib/stock-storage';
import StockWorkspace from './StockWorkspace';
import styles from '@/app/stock/page.module.css';

const subscribe = () => () => {};
function preferredLocalMode() {
  try {
    return sessionStorage.getItem('stock-local-mode') === '1';
  } catch {
    return false;
  }
}

export default function StockDatabase() {
  const [session, setSession] = useState<{
    server: StockServer;
    data: StoredPortfolioState;
  } | null>(null);
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selectedLocal, setLocal] = useState(false);
  const rememberedLocal = useSyncExternalStore(
    subscribe,
    preferredLocalMode,
    () => false,
  );
  const local = selectedLocal || rememberedLocal;
  return (
    <>
      {!session && (
        <section className={styles.formPanel} aria-label="Database portofolio">
          <h2 className={styles.panelTitle}>Buka portofolio di database</h2>
          <p className={styles.sectionSubnote}>
            Gunakan kunci pemilik yang sama di HP dan laptop. Jika database
            masih kosong, Anda bisa menyalin posisi dari browser ini saat
            pertama terhubung.
          </p>
          <form
            className={styles.stockForm}
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy) return;
              const migrate = new FormData(e.currentTarget).has('migrate');
              setBusy(true);
              setError('');
              try {
                const server = new StockServer(key.trim());
                let data = await server.load();
                if (!data) {
                  if (migrate) {
                    data = await loadPortfolioStateFromDb();
                    await server.save(data.holdings, data.feeConfig);
                  } else {
                    data = {
                      version: 2,
                      exportedAt: new Date().toISOString(),
                      feeConfig: initialStockbitFees,
                      holdings: [],
                    };
                  }
                }
                setSession({ server, data });
                setKey('');
                try {
                  sessionStorage.removeItem('stock-local-mode');
                } catch {
                  // This preference is optional.
                }
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : 'Tidak dapat terhubung ke database.',
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className={styles.fieldGroup}>
              Kunci pemilik
              <input
                type="password"
                autoComplete="current-password"
                className={styles.textInput}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
            </label>
            <label>
              <input type="checkbox" name="migrate" /> Salin posisi browser
              hanya jika database kosong
            </label>
            {error && <p role="alert">{error}</p>}
            <button className={styles.primaryButton} disabled={busy}>
              {busy ? 'Menghubungkan…' : 'Hubungkan database'}
            </button>
          </form>
          {!local && (
            <button
              className={styles.secondaryButton}
              onClick={() => {
                try {
                  sessionStorage.setItem('stock-local-mode', '1');
                } catch {
                  // The selection still applies to the current page.
                }
                setLocal(true);
              }}
            >
              Buka portofolio lokal
            </button>
          )}
        </section>
      )}
      {session ? (
        <StockWorkspace
          key="database"
          server={session.server}
          initial={session.data}
        />
      ) : (
        local && <StockWorkspace key="local" />
      )}
    </>
  );
}
