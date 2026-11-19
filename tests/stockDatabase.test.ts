import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { onRequest } from '../functions/api/stock';
import { serializeStockBackupJson } from '../app/lib/stock-storage';

it('protects a stored portfolio and rejects stale updates across clients', async () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(readFileSync('migrations/0001_stock.sql', 'utf8'));
    const key = 'a'.repeat(48);
    const env = {
      STOCK_OWNER_KEY: key,
      STOCK_DB: {
        prepare: (sql: string) => ({
          first: () => db.prepare(sql).get(),
          bind: (...args: (number | string)[]) => ({
            run: () => ({ meta: db.prepare(sql).run(...args) }),
          }),
        }),
      },
    };
    const call = (method: string, token = key, rev = 0, body?: string) =>
      onRequest({
        env,
        request: new Request('https://test.invalid/api/stock', {
          method,
          headers: {
            Authorization: 'Bearer ' + token,
            Origin: 'https://test.invalid',
            'If-Match': String(rev),
            'Content-Type': 'application/json',
          },
          body,
        }),
      });
    expect((await call('GET', 'wrong')).status).toBe(401);
    expect(await (await call('GET')).json()).toEqual({
      revision: 0,
      portfolio: null,
    });
    const payload = serializeStockBackupJson([], {
      buyFeePct: 0.1,
      sellFeePct: 0.2,
    });
    expect((await call('PUT', key, 0, payload)).status).toBe(200);
    expect((await call('PUT', key, 0, payload)).status).toBe(409);
    expect((await call('PUT', key, 1, '{}')).status).toBe(400);
    expect((await call('PUT', 'wrong', 1, payload)).status).toBe(401);
    expect((await call('PUT', key, 1, payload)).status).toBe(200);
    expect(await (await call('GET')).json()).toMatchObject({
      revision: 2,
      portfolio: { feeConfig: { buyFeePct: 0.1 } },
    });
  } finally {
    db.close();
  }
});
