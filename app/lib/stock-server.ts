import {
  parseStockBackupJson,
  serializeStockBackupJson,
} from './stock-storage';
import type { StockHolding, StockbitFeeConfig } from '../types/stock';

export class StockServer {
  private revision = 0;
  constructor(private readonly key = '') {}
  private async request(options: RequestInit = {}) {
    const response = await fetch('/api/stock', {
      ...options,
      cache: 'no-store',
      headers: {
        ...options.headers,
        ...(this.key ? { Authorization: 'Bearer ' + this.key } : {}),
      },
    });
    if (!response.headers.get('Content-Type')?.includes('application/json'))
      throw new Error('API database belum aktif di situs ini.');
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || 'Database gagal merespons.');
    return result;
  }
  async load() {
    const result = await this.request();
    if (!Number.isSafeInteger(result.revision) || result.revision < 0)
      throw new Error('Respons database tidak valid.');
    this.revision = result.revision;
    return result.portfolio === null
      ? null
      : parseStockBackupJson(JSON.stringify(result.portfolio));
  }
  async save(holdings: StockHolding[], fees: StockbitFeeConfig) {
    const result = await this.request({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'If-Match': String(this.revision),
      },
      body: serializeStockBackupJson(holdings, fees),
    });
    this.revision = result.revision;
  }
}
