import {
  cookie,
  hasSession,
  issueSession,
  matchesOwner,
} from '../app/lib/stock-auth';

const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};
function login(message = '') {
  return new Response(
    `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Masuk · Portofolio saham</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f0e8;color:#211f1b;font:1rem system-ui;min-height:100svh;display:grid;place-items:center}main{width:min(26rem,90vw)}h1{font:2.4rem Georgia,serif}label,input,button{display:block;width:100%}input,button{font:inherit;padding:.85rem;margin-top:.5rem}button{background:#211f1b;color:white;border:0;margin-top:1rem;cursor:pointer}</style><main><h1>Portofolio saham</h1><form method="post" action="/stock"><label>Password pemilik<input name="password" type="password" autocomplete="current-password" required maxlength="300"></label>${message ? '<p role="alert">' + message + '</p>' : ''}<button>Masuk</button></form></main></html>`,
    {
      status: 401,
      headers: {
        ...privateHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy':
          "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
      },
    },
  );
}
export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (url.pathname === '/api/stock') return next();
  const owner = env.STOCK_OWNER_KEY;
  if (!owner || owner.length < 32)
    return new Response('Akses belum dikonfigurasi.', {
      status: 503,
      headers: privateHeaders,
    });
  if (request.method === 'POST') {
    if (
      url.pathname !== '/stock' ||
      request.headers.get('Origin') !== url.origin
    )
      return new Response(null, { status: 403, headers: privateHeaders });
    let sessionCookie;
    if (url.searchParams.has('keluar')) sessionCookie = cookie('', 0);
    else {
      if (
        !request.headers
          .get('Content-Type')
          ?.startsWith('application/x-www-form-urlencoded') ||
        Number(request.headers.get('Content-Length') || Infinity) > 2048
      )
        return new Response(null, { status: 400, headers: privateHeaders });
      const password = new URLSearchParams(await request.text()).get(
        'password',
      );
      if (!(await matchesOwner(password, owner)))
        return login('Password salah. Coba lagi.');
      sessionCookie = await issueSession(owner);
    }
    return new Response(null, {
      status: 303,
      headers: {
        ...privateHeaders,
        Location: '/stock',
        'Set-Cookie': sessionCookie,
      },
    });
  }
  if (!(await hasSession(request, owner))) return login();
  const upstream = await next();
  const response = new Response(upstream.body, upstream);
  const policy = response.headers.get('Content-Security-Policy');
  if (policy)
    response.headers.set(
      'Content-Security-Policy',
      policy.replace("form-action 'none'", "form-action 'self'"),
    );
  for (const [key, value] of Object.entries(privateHeaders))
    response.headers.set(key, value);
  if (response.headers.get('Content-Type')?.includes('text/html'))
    return new HTMLRewriter()
      .on('head', {
        element(el) {
          el.append('<meta name="stock-session" content="active">', {
            html: true,
          });
        },
      })
      .transform(response);
  return response;
}
