import { expect, it } from 'vitest';
import { onRequest } from '../functions/_middleware';

it('gates stock assets and accepts only a signed login session', async () => {
  const origin = 'https://example.com';
  const owner = 'a'.repeat(48);
  const call = (path: string, options: RequestInit = {}, key = owner) =>
    onRequest({
      request: new Request(origin + path, options),
      env: { STOCK_OWNER_KEY: key },
      next: async () => new Response('private content'),
    });
  for (const path of [
    '/stock',
    '/stock/',
    '/stock.html',
    '/stock.txt',
    '/stock/__next._full.txt',
  ]) {
    const response = await call(path);
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain('private content');
  }
  const submit = (password: string, from = origin) => ({
    method: 'POST',
    headers: {
      Origin: from,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': String(password.length + 9),
    },
    body: 'password=' + password,
  });
  expect((await call('/stock', submit('wrong'))).status).toBe(401);
  expect(
    (await call('/stock', submit(owner, 'https://other.invalid'))).status,
  ).toBe(403);
  const login = await call('/stock', submit(owner));
  expect(login.status).toBe(303);
  const cookie = login.headers.get('Set-Cookie')!.split(';')[0];
  expect(cookie).not.toContain(owner);
  expect(
    await (await call('/stock', { headers: { Cookie: cookie } })).text(),
  ).toBe('private content');
  expect(
    (await call('/stock', { headers: { Cookie: cookie + '0' } })).status,
  ).toBe(401);
  expect(
    (await call('/stock', { headers: { Cookie: cookie } }, 'b'.repeat(48)))
      .status,
  ).toBe(401);
  expect(
    (await call('/stock?keluar', submit(''))).headers.get('Set-Cookie'),
  ).toContain('Max-Age=0');
});
