const encoder = new TextEncoder();
const name = '__Host-stock_session';
export const sessionSeconds = 8 * 60 * 60;

export async function matchesOwner(candidate, owner) {
  if (!owner || owner.length < 32 || !candidate || candidate.length > 300)
    return false;
  const digest = (value) =>
    crypto.subtle.digest('SHA-256', encoder.encode(value));
  const [a, b] = await Promise.all([digest(candidate), digest(owner)]);
  const actual = new Uint8Array(a),
    expected = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < actual.length; i++) difference |= actual[i] ^ expected[i];
  return difference === 0;
}

async function signingKey(owner) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(owner),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export function cookie(value, age) {
  return (
    name +
    '=' +
    value +
    '; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=' +
    age
  );
}

export async function issueSession(owner) {
  const expires = String(Math.floor(Date.now() / 1000) + sessionSeconds);
  const payload = expires + '.' + crypto.randomUUID();
  const signature = await crypto.subtle.sign(
    'HMAC',
    await signingKey(owner),
    encoder.encode(payload),
  );
  return cookie(
    payload +
      '.' +
      Array.from(new Uint8Array(signature), (b) =>
        b.toString(16).padStart(2, '0'),
      ).join(''),
    sessionSeconds,
  );
}

export async function hasSession(request, owner) {
  if (!owner || owner.length < 32) return false;
  const token = (request.headers.get('Cookie') || '')
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(name + '='))
    ?.slice(name.length + 1);
  if (!token || !/^\d{10}\.[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(token))
    return false;
  const [expires, nonce, signature] = token.split('.');
  if (Number(expires) <= Date.now() / 1000) return false;
  return crypto.subtle.verify(
    'HMAC',
    await signingKey(owner),
    Uint8Array.from(signature.match(/../g), (b) => parseInt(b, 16)),
    encoder.encode(expires + '.' + nonce),
  );
}
