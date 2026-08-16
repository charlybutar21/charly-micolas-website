# Development guide

## Setup

Use Node.js 22 to match the CI workflow.

```bash
npm install
npm run dev
```

The development server is available at `http://localhost:3000` by default.

For browser tests on a new machine, install the Playwright browser once:

```bash
npx playwright install chromium
```

## Quality commands

| Command | Purpose |
| --- | --- |
| `npm run format` | Apply the project Prettier rules to source and test files. |
| `npm run format:check` | Verify formatting without changing files. |
| `npm run typecheck` | Run TypeScript without emitting output. |
| `npm run lint` | Run ESLint across the application. |
| `npm run test` | Run fast Vitest checks. |
| `npm run test:e2e` | Run Playwright navigation and responsive browser checks. |
| `npm run test:a11y` | Run only Playwright tests marked `@a11y` with Axe. |
| `npm run build` | Produce and validate the static `out/` deployment. |

`playwright.config.ts` starts and stops a local Next.js development server automatically for browser tests. It uses the app’s own Next.js binary rather than a shell wrapper so that the lifecycle is reliable on Windows and CI.

## Test layers

Vitest keeps content and component contracts stable: data remains aligned with CV-backed entries, route markup keeps its core information, and metadata/sitemap output stays public and canonical.

Playwright covers the interaction boundary that unit rendering cannot:

- the narrow-screen navigation opens, announces its state, and reaches grouped content;
- Axe checks the Home, Technical Skills, Experiences, Writing, and Contact pages with no suppressed violations.

Use the smallest appropriate layer when adding behavior. A pure data or component change usually needs Vitest; a keyboard, responsive, or browser-only behavior needs Playwright too.

## CI and deployment

`.github/workflows/deploy.yml` runs on pull requests and pushes to `main`. It installs dependencies with `npm ci`, runs all quality gates, installs Chromium on Ubuntu, and builds the static site. FTP deployment runs only for pushes to `main` and requires `FTP_SERVER`, `FTP_USERNAME`, and `FTP_PASSWORD` repository secrets.

Do not commit generated directories such as `.next/`, `out/`, `node_modules/`, Playwright reports, or TypeScript build-info files.
