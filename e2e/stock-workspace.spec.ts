import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function importExample(page: Page) {
  await page.goto('/stock');
  await page.getByRole('button', { name: 'Impor / tempel tabel' }).click();
  await page
    .getByLabel('Tabel saham', { exact: true })
    .fill('KODE;LOT;AVERAGE;HARGA\nBBCA;10;9.650;9.150\nTLKM;20;3.200;2.900');
  await page.getByRole('button', { name: 'Periksa tabel' }).click();
  await expect(
    page.getByRole('heading', { name: 'Pratinjau: 2 saham' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Terapkan impor' }).click();
  await expect(
    page.getByText('Tersimpan di browser ini', { exact: true }),
  ).toBeVisible();
}

test('simple entry has four required position inputs, fee convention and survives reload', async ({
  page,
}) => {
  await page.goto('/stock');
  await expect(
    page.getByRole('heading', { name: 'Belum ada saham tersimpan' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Masukkan saham pertama' }).click();
  await page
    .getByRole('textbox', { name: 'Kode saham', exact: true })
    .fill('BBCA');
  await page.getByRole('textbox', { name: /Jumlah lot/ }).fill('10');
  await page
    .getByRole('textbox', { name: 'Average beli (Rp/lembar)', exact: true })
    .fill('9.650,50');
  await page
    .getByRole('textbox', { name: 'Harga terakhir (Rp/lembar)', exact: true })
    .fill('9.150');
  await page.getByRole('button', { name: 'Simpan saham', exact: true }).click();
  await expect(
    page.getByRole('article', { name: 'Posisi BBCA' }),
  ).toContainText('10 lot');
  await expect(
    page.getByText('Tersimpan di browser ini', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('article', { name: 'Posisi BBCA' }),
  ).toContainText('Belum ada valuasi');
  await page.getByRole('button', { name: 'Edit BBCA', exact: true }).click();
  await expect(
    page.getByRole('textbox', {
      name: 'Average beli (Rp/lembar)',
      exact: true,
    }),
  ).toHaveValue('9.650,5');
});

test('valuation and budget simulation are explicit, independent and reversible', async ({
  page,
}, testInfo) => {
  await importExample(page);
  const value = page.getByRole('region', {
    name: 'Harga wajar · BBCA',
    exact: true,
  });
  await value
    .getByRole('combobox', { name: 'Metode valuasi', exact: true })
    .selectOption('pbv');
  await value
    .getByRole('spinbutton', { name: 'BVPS (Rp/lembar)', exact: true })
    .fill('2500');
  await value
    .getByRole('spinbutton', { name: 'PBV acuan (x)', exact: true })
    .fill('5');
  await value
    .getByRole('textbox', { name: 'Periode laporan', exact: true })
    .fill('Contoh fiktif untuk pengujian');
  await value
    .getByRole('textbox', {
      name: 'Sumber data & alasan memilih acuan',
      exact: true,
    })
    .fill('Data contoh — bukan riset atau harga pasar');
  await expect(value).toContainText('+26.80%');
  await expect(value).toContainText('Rp 10.000');
  await value.getByRole('button', { name: 'Simpan asumsi valuasi' }).click();
  const average = page.getByRole('region', {
    name: 'Average down · BBCA',
    exact: true,
  });
  await average
    .getByRole('spinbutton', { name: 'Anggaran maksimum (Rp)', exact: true })
    .fill('5000000');
  await expect(average).toContainText('15 lot total (5 lot tambahan)');
  await expect(
    average.getByRole('button', { name: 'Catat pembelian ke portofolio' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('article', { name: 'Posisi BBCA' }),
  ).toContainText('10 lot');
  await page.screenshot({
    path: testInfo.outputPath('stock-desktop.png'),
    fullPage: true,
  });
  await average.getByRole('checkbox').check();
  await average
    .getByRole('button', { name: 'Catat pembelian ke portofolio' })
    .click();
  await expect(
    page.getByRole('article', { name: 'Posisi BBCA' }),
  ).toContainText('15 lot');
  await page
    .getByRole('button', { name: 'Batalkan perubahan terakhir' })
    .click();
  await expect(
    page.getByRole('article', { name: 'Posisi BBCA' }),
  ).toContainText('10 lot');
  await expect(
    page.getByText('Tersimpan di browser ini', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('article', { name: 'Posisi BBCA' }),
  ).toContainText('MOS +26.8%');
});

test('backup round-trip requires confirmation and invalid imports preserve data', async ({
  page,
}) => {
  await importExample(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Unduh backup' }).click();
  const download = await downloadPromise;
  const backup = await readFile((await download.path())!, 'utf8');
  expect(JSON.parse(backup).version).toBe(2);
  await page.getByRole('button', { name: 'Hapus TLKM' }).click();
  await expect(page.getByRole('article', { name: 'Posisi TLKM' })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Impor / tempel tabel' }).click();
  const fileInput = page.getByLabel('Atau pilih file backup JSON');
  await fileInput.setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":99,"holdings":[]}'),
  });
  await expect(
    page.getByRole('alert').filter({ hasText: 'Versi backup' }),
  ).toContainText('Versi backup belum didukung.');
  await expect(
    page.getByRole('article', { name: 'Posisi BBCA' }),
  ).toBeVisible();
  await fileInput.setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  });
  await expect(
    page.getByRole('button', { name: 'Terapkan impor' }),
  ).toBeDisabled();
  await page.getByRole('checkbox', { name: /Saya memahami/ }).check();
  await page.getByRole('button', { name: 'Terapkan impor' }).click();
  await expect(
    page.getByRole('article', { name: 'Posisi TLKM' }),
  ).toBeVisible();
});

test('mobile inputs, portfolio and calculators stay accessible without horizontal overflow @a11y', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await importExample(page);
  await expect(
    page.getByRole('article', { name: 'Posisi BBCA' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath('stock-mobile.png'),
    fullPage: true,
  });
  await page
    .getByRole('button', { name: '+ Tambah saham', exact: true })
    .click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('aborted database transaction never displays saved success and can retry', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = IDBObjectStore.prototype.put;
    let failed = false;
    IDBObjectStore.prototype.put = function (
      value: unknown,
      key?: IDBValidKey,
    ) {
      const result = original.call(this, value, key);
      if (!failed) {
        failed = true;
        this.transaction.abort();
      }
      return result;
    };
  });
  await page.goto('/stock');
  await page.getByRole('button', { name: 'Impor / tempel tabel' }).click();
  await page
    .getByLabel('Tabel saham', { exact: true })
    .fill('BBCA;10;1000;900');
  await page.getByRole('button', { name: 'Periksa tabel' }).click();
  await page.getByRole('button', { name: 'Terapkan impor' }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Belum tersimpan' }),
  ).toContainText('Belum tersimpan');
  await expect(
    page.getByText('Impor 1 saham diterapkan.', { exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Coba simpan lagi' }).click();
  await expect(
    page.getByText('Tersimpan di browser ini', { exact: true }),
  ).toBeVisible();
});

test('reads legacy data from the original IndexedDB key without reseeding', async ({
  page,
}) => {
  await page.goto('/stock');
  await expect(
    page.getByRole('button', { name: 'Masukkan saham pertama' }),
  ).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('charly_stock_workspace_db', 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('portfolio_state', 'readwrite');
      tx.objectStore('portfolio_state').put(
        {
          version: 1,
          feeConfig: { buyFeePct: 0.15, sellFeePct: 0.25 },
          holdings: [
            {
              id: 'old-tlkm',
              ticker: 'TLKM',
              companyName: 'Telkom',
              sector: 'Telco',
              lots: 7,
              avgBuyPrice: 3500,
              currentPrice: 3000,
              updatedAt: '2026-01-01',
              notes: 'Tesis lama',
              fundamentals: {
                eps: 200,
                bvps: 1000,
                dps: 100,
                historicalMeanPer: 15,
                historicalMeanPbv: 2,
                expectedDividendYieldPct: 5,
              },
            },
          ],
        },
        'active_portfolio_v1',
      );
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await page.reload();
  await expect(
    page.getByRole('article', { name: 'Posisi TLKM' }),
  ).toContainText('7 lot');
  await expect(
    page.getByRole('article', { name: 'Posisi TLKM' }),
  ).toContainText('Tanggal belum diisi');
});
