# Recruiter-First Portfolio Refinement — Design Specification

**Date:** 2026-08-16

## Goal

Refine the editorial portfolio of Charly Micolas Butarbutar for two audiences—recruiters and potential collaborators—with recruiters as the primary audience. Preserve the calm, authored visual direction while making the professional value proposition faster to understand and the codebase easier to maintain.

## Confirmed decisions

- Do not add a résumé or external Google Drive CTA.
- Keep the existing placeholder Writing draft publicly visible and clearly labelled as a draft.
- Remove all decorative sequence numbers from navigation, page intros, skills, and page footers.
- Do not invent experience metrics, project outcomes, proficiency levels, or case studies.
- Keep the current static Next.js export and do not introduce a CMS, backend, database, analytics, or contact form.

## Information and visual design

### Navigation and page framing

- Keep the existing grouped navigation labels: Start here, Practice, Notes, and Connect.
- Remove numerical labels from every navigation item.
- Retain active-route indication through colour and italic styling, not position numbers.
- Replace numbered page-intro eyebrows and footer labels with meaningful section descriptors such as `Portfolio`, `Technical practice`, or `Career record`.
- Cap the desktop navigation rail width so it does not consume a disproportionate share of ultrawide screens.
- Mobile navigation remains a native `details` disclosure, with a state-aware menu label and visible keyboard focus.
- Add a visually hidden skip link to `#main-content` that becomes visible on keyboard focus.

### Home

- Preserve the full-viewport editorial name composition and warm-paper visual language.
- Add a concise, CV-supported evidence strip below the introduction:
  - Approximately 9 years in backend engineering.
  - Fintech, PropTech, and SaaS experience.
  - Engineering delivery and technical leadership.
- Add one quiet text CTA to Experiences. Do not add a résumé CTA, generic button card, or fabricated project proof.

### Technical Skills

- Keep the existing technology logo treatment and text labels.
- Remove category sequence numbers.
- Introduce a short context line explaining that the index represents the professional toolkit used across backend delivery, integration, and engineering practice.
- Retain the CV taxonomy and the brand-mark/practice-mark distinction.
- Do not add proficiency bars, percentages, stars, or unsupported seniority claims.

### Experiences

- Preserve all six CV roles in chronological order and retain the current-role marker.
- Show the first two factual responsibilities as immediately visible highlights.
- Put any remaining factual CV responsibilities inside a native `details` disclosure labelled `More responsibilities`.
- Ensure the timeline remains readable at desktop and mobile widths; dates remain a rail on desktop and move above content on mobile.

### Writing and Contact

- Retain the one requested dummy post and its detail route.
- Use explicit Draft status and introductory copy that makes the placeholder nature clear.
- Keep contact to email, LinkedIn, and GitHub only; no phone field, `tel:` URL, or contact form.
- External social links open safely in a new tab with `noopener noreferrer` and descriptive accessible labels.

## Code and data architecture

### Active source root

- `app/` is the sole active Next.js App Router root.
- Move the active favicon into `app/`, then remove the stale `src/app/` root.
- Configure TypeScript `@/*` to resolve from the project root, enabling clear absolute imports from `app/`.

### Organisation

```text
app/
  components/
    layout/       # Site shell and navigation
    portfolio/    # Skills, experiences, writing
    shared/       # Page introductions and contact links
  data/           # Small CV-derived domain modules
  lib/            # Navigation and icon mapping
  types/          # Portfolio data contracts
  [routes]/       # App Router pages
docs/
  architecture.md
  content-management.md
  development.md
```

- Split the current content model into focused modules for profile, skills, experiences, and writing, while preserving one typed portfolio export for page consumers.
- Remove unused data properties. Change Writing status from a draft-only literal to a future-safe `Draft | Published` union.
- Keep content as typed TypeScript. Reconsider MDX only after real Writing content grows beyond a few posts.
- Re-export components from their folders only where that improves route readability; do not add abstractions solely to avoid short relative imports.

## Accessibility, discoverability, and performance

- Darken muted text to meet at least 4.5:1 contrast against the paper background. The current muted colour measures 4.13:1 and is used at small font sizes.
- Preserve visible `:focus-visible` styling and reduced-motion handling.
- Add route-level descriptions, a root `metadataBase`, canonical alternates, Open Graph metadata, and Twitter metadata without claiming unverified achievements.
- Use HTTPS consistently in sitemap and robots output.
- Generate sitemap `lastModified` values from explicit content dates or a documented stable site date, rather than changing every build.
- Maintain the static export and avoid adding runtime data dependencies. The existing icon imports remain tree-shakeable named imports.

## Quality gates and documentation

- Add scripts for `typecheck` and `format:check`; use Prettier for deterministic formatting alongside ESLint.
- Extend GitHub Actions to run format check, typecheck, unit tests, lint, and static build before deployment.
- Add browser-level tests for primary navigation, mobile menu visibility, the absence of phone links, the Writing route, and no horizontal overflow at a narrow viewport.
- Add an automated accessibility smoke test for core routes, including visible focus targets and landmark/heading sanity checks.
- Write the following maintainer documentation:
  - `docs/architecture.md` — route, component, data, and static-export boundaries.
  - `docs/content-management.md` — how to update profile, skills, experience, and Writing data safely.
  - `docs/development.md` — local setup, commands, test layers, CI, and deployment flow.
- Refresh the README into a concise project entry point that links to the detailed documentation.

## Verification

1. Test each behavioural change red then green where practical.
2. Run `npm run format:check`, `npm run typecheck`, `npm run test`, `npm run lint`, and `npm run build`.
3. Verify desktop and 320px routes in a browser for navigation, focus, no horizontal overflow, timeline disclosure, accurate Writing status, and absent phone/tel links.
4. Confirm the working tree is clean and the CI workflow includes every quality gate.

## Non-goals

- No downloadable résumé, contact form, analytics, CMS, case studies, database, or user account features.
- No recreation of the reference site’s branding or layout.
- No performance optimisations unsupported by observed need, such as caching layers or client-state frameworks.
