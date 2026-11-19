import { emptyFundamentals } from '@/app/data/stocks';
import { localDate } from './stock-calculator';
import {
  MAX_HOLDINGS,
  MAX_IMPORT_BYTES,
  validateHolding,
} from './stock-storage';
import type { StockHolding } from '@/app/types/stock';

// Indonesian convention: 9.650,50 = 9650.5. Plain digits work as well.
export function parseIndonesianNumber(value: string): number {
  const normalized = value.trim().replace(/^Rp\s*/i, '');
  if (!/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(normalized)) return NaN;
  return Number(normalized.replace(/\./g, '').replace(',', '.'));
}

export function parseHoldingsTable(
  input: string,
  date = localDate(),
): StockHolding[] {
  if (input.length > MAX_IMPORT_BYTES)
    throw new Error('Tabel terlalu besar (maksimal 2 MB).');
  const lines = input
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim());
  if (/^(kode|ticker|saham)(\t|;)/i.test(lines[0] ?? '')) lines.shift();
  if (!lines.length || lines.length > MAX_HOLDINGS)
    throw new Error('Masukkan 1–500 baris saham.');
  const result = lines.map((line, i) => {
    const cells = line
      .split(line.includes('\t') ? '\t' : ';')
      .map((v) => v.trim());
    if (cells.length !== 4)
      throw new Error(
        'Baris ' + (i + 1) + ': perlu 4 kolom: kode;lot;average;harga.',
      );
    return validateHolding(
      {
        ticker: cells[0].toUpperCase(),
        id: cells[0].toLowerCase(),
        lots: parseIndonesianNumber(cells[1]),
        avgBuyPrice: parseIndonesianNumber(cells[2]),
        currentPrice: parseIndonesianNumber(cells[3]),
        priceUpdatedAt: date,
        updatedAt: date,
        fundamentals: { ...emptyFundamentals },
      },
      i + 1,
    );
  });
  if (new Set(result.map((h) => h.ticker)).size !== result.length)
    throw new Error('Ada kode saham duplikat dalam tabel.');
  return result;
}
