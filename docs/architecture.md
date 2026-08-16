# Architecture

## Purpose and runtime model

This repository is a static Next.js App Router portfolio. `next.config.ts` sets `output: 'export'`, so `npm run build` produces deployable HTML, JavaScript, and assets in `out/`; there is no application server or database in production.

The site is intentionally content-led. Route pages compose presentational components with typed data rather than fetching runtime content. This keeps deployment simple, makes all public routes indexable, and ensures the sitemap can be generated from the same source of truth.

## Directory map

| Path | Responsibility |
| --- | --- |
| `app/` | App Router routes, metadata, global styles, and sitemap/robots handlers. |
| `app/components/layout/` | Persistent shell and responsive primary navigation. |
| `app/components/portfolio/` | Domain-specific views: skills, experience timeline, and writing index. |
| `app/components/shared/` | Reusable route-level building blocks, such as page intros and contact links. |
| `app/data/` | Typed, CV-backed portfolio content grouped by domain. |
| `app/types/` | The single portfolio content model. |
| `app/lib/` | Small pure helpers, including navigation structure and skill-icon lookup. |
| `tests/` | Fast Vitest tests for data, routes, metadata, and rendered markup. |
| `e2e/` | Playwright checks for responsive navigation and Axe accessibility scans. |
| `docs/` | Maintainer documentation and approved design/implementation records. |

## Content flow

```text
app/data/{profile,skills,experience,writing}.ts
                    ↓
            app/data/index.ts
                    ↓
        route pages and portfolio components
                    ↓
         static pages, post routes, sitemap
```

`app/data/index.ts` combines the domain files as `portfolioData` for consumers that need the complete profile. Keep domain-specific edits in their own files; this avoids one oversized content module and makes review easier.

## Rendering and interactivity

Most components are Server Components. `SiteNavigation` is the only persistent Client Component because it needs the current pathname and menu-open state. Keep client boundaries narrow: put interactive behavior in a dedicated client component and leave route pages and data rendering on the server by default.

The responsive menu uses native `<details>` and `<summary>`, which preserves keyboard behavior without a custom disclosure implementation. `SiteShell` also supplies the `#main-content` skip link target for keyboard users.

## Metadata and deployment

The root layout defines `metadataBase`, site-level description, social metadata, and the home canonical URL. Each public route owns its description and canonical URL. The Writing post route derives metadata from its typed post data.

`app/sitemap.ts` includes all route paths and every writing slug. `app/robots.ts` points crawlers to the HTTPS sitemap. The CI workflow runs formatting, type checking, linting, unit tests, Playwright, and the static build before FTP deployment.
