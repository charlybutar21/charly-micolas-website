import { hasSession, matchesOwner } from '../../app/lib/stock-auth';
import { parseStockBackupJson } from '../../app/lib/stock-storage';

const headers = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
};
const reply = (data, status = 200) => Response.json(data, { status, headers });

export async function onRequest({ request, env }) {
  if (!env.STOCK_DB || !env.STOCK_OWNER_KEY || env.STOCK_OWNER_KEY.length < 32)
    return reply(
      { error: 'Database belum dikonfigurasi oleh pemilik situs.' },
      503,
    );
  const token = request.headers.get('Authorization') ?? '';
  const allowed = token
    ? token.startsWith('Bearer ') &&
      (await matchesOwner(token.slice(7), env.STOCK_OWNER_KEY))
    : await hasSession(request, env.STOCK_OWNER_KEY);
  if (!allowed) return reply({ error: 'Kunci akses salah.' }, 401);
  try {
    if (request.method === 'GET') {
      const row = await env.STOCK_DB.prepare(
        'SELECT revision, payload FROM portfolio WHERE id=1',
      ).first();
      return reply(
        row
          ? { revision: row.revision, portfolio: JSON.parse(row.payload) }
          : { revision: 0, portfolio: null },
      );
    }
    if (request.method !== 'PUT')
      return reply({ error: 'Metode tidak didukung.' }, 405);
    if (request.headers.get('Origin') !== new URL(request.url).origin)
      return reply({ error: 'Origin tidak valid.' }, 403);
    if (!request.headers.get('Content-Type')?.startsWith('application/json'))
      return reply({ error: 'Gunakan JSON.' }, 415);
    const revision = Number(request.headers.get('If-Match'));
    if (
      !request.headers.has('If-Match') ||
      !Number.isSafeInteger(revision) ||
      revision < 0
    )
      return reply({ error: 'Revisi tidak valid.' }, 400);
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: 'Data kosong.' }, 400);
    const decoder = new TextDecoder();
    let size = 0,
      body = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2_000_000) {
        await reader.cancel();
        return reply({ error: 'Maksimal 2 MB.' }, 413);
      }
      body += decoder.decode(value, { stream: true });
    }
    let portfolio;
    try {
      portfolio = parseStockBackupJson(body + decoder.decode());
    } catch {
      return reply({ error: 'Data portofolio tidak valid.' }, 400);
    }
    const json = JSON.stringify(portfolio);
    const write =
      revision === 0
        ? env.STOCK_DB.prepare(
            'INSERT INTO portfolio(id, revision, payload) VALUES (1, 1, ?) ON CONFLICT(id) DO NOTHING',
          ).bind(json)
        : env.STOCK_DB.prepare(
            'UPDATE portfolio SET revision=revision+1, payload=? WHERE id=1 AND revision=?',
          ).bind(json, revision);
    const result = await write.run();
    return result.meta.changes === 1
      ? reply({ revision: revision + 1 })
      : reply(
          {
            error:
              'Portofolio berubah di perangkat lain. Unduh backup perubahan Anda lalu muat ulang database.',
          },
          409,
        );
  } catch {
    return reply(
      { error: 'Database tidak tersedia. Periksa binding dan migrasi D1.' },
      503,
    );
  }
}
