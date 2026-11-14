# Development guide

## Setup

Use Node.js 22 to match the CI workflow. The development server binds to `127.0.0.1` so it is not exposed to the local network by default.

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

| Command                | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `npm run format`       | Apply the project Prettier rules to source and test files. |
| `npm run format:check` | Verify formatting without changing files.                  |
| `npm run typecheck`    | Run TypeScript without emitting output.                    |
| `npm run lint`         | Run ESLint across the application.                         |
| `npm run test`         | Run fast Vitest checks.                                    |
| `npm run test:e2e`     | Run Playwright navigation and responsive browser checks.   |
| `npm run test:a11y`    | Run only Playwright tests marked `@a11y` with Axe.         |
| `npm run build`        | Produce and validate the static `out/` deployment.         |

`playwright.config.ts` starts and stops a local Next.js development server automatically for browser tests. It uses the app’s own Next.js binary rather than a shell wrapper so that the lifecycle is reliable on Windows and CI.

## Test layers

Vitest keeps content and component contracts stable: data remains aligned with CV-backed entries, route markup keeps its core information, and metadata/sitemap output stays public and canonical.

Playwright covers the interaction boundary that unit rendering cannot:

- the narrow-screen navigation opens, announces its state, and reaches grouped content;
- Axe checks the Home, Technical Skills, Experiences, Writing, and Contact pages with no suppressed violations.

Use the smallest appropriate layer when adding behavior. A pure data or component change usually needs Vitest; a keyboard, responsive, or browser-only behavior needs Playwright too.

## CI and deployment

The scoped npm override for `@typescript-eslint/typescript-estree` uses `minimatch` 11.0.1 to address [GHSA-g3hv-75wg-m249](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249). The current upstream parser still requests the affected 10.x range. Remove this override when the parser adopts a patched version; validate linting and rerun `npm run audit` when changing it.

`.github/workflows/deploy.yml` runs on pull requests and pushes to `main`. It installs dependencies with `npm ci`, runs `npm run audit` and all quality gates, installs Chromium on Ubuntu, and builds the static site. The protected `main` branch requires successful checks before a pull request can merge. Cloudflare Pages deploys through its GitHub integration, with `main` as the production branch. No FTP credentials or Cloudflare API tokens are needed in GitHub Actions. See [deployment](deployment.md) for the build settings, domain setup, and rollback procedure.

Do not commit generated directories such as `.next/`, `out/`, `node_modules/`, Playwright reports, or TypeScript build-info files.
