# Sticky Editorial Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the side navigation with an accessible sticky editorial header and make About, Technical Skills, and Contact denser without sacrificing readability.

**Architecture:** Keep page routes and portfolio data unchanged. Introduce focused shared visual primitives for the CMB brand mark and external social profiles, then compose them in the persistent navigation and contact area. Convert the layout shell from a two-column rail into a document flow with a sticky header, and use page-local layout classes for compact route compositions.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, `react-icons`, Vitest, Playwright, Axe.

## Global Constraints

- Primary navigation order is exactly Home, About, Technical Skills, Experiences, Writing, Contact.
- Remove all navigation grouping labels: Start here, Practice, Notes, and Connect.
- Keep navigation sticky and directly usable on mobile; do not reintroduce a hamburger menu.
- Render the CMB mark as code-native SVG, wrapped by the Home link, and make future asset replacement local to the brand component.
- Render LinkedIn and GitHub as icon-only, new-tab links with accessible names and visible keyboard focus.
- Do not show a phone number.
- Keep visual skill logos supplementary to their text labels.
- Preserve reduced-motion support, `aria-current="page"`, mobile usability, and no horizontal document overflow.
- Do not add dependencies: `react-icons` is already installed.
- Read `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md` and `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-pathname.md` before modifying the client navigation component. Account for the sticky-header `scroll-padding-top` guidance in the Link documentation.

---

### Task 1: Flatten the navigation model

**Files:**
- Modify: `app/lib/navigation.ts`
- Modify: `tests/navigation.test.tsx`

**Interfaces:**
- Consumes: `NavigationItem` with `label: string` and `href: string`.
- Produces: `navigationItems`, a readonly array of exactly six `NavigationItem` values, for `SiteNavigation`.

- [ ] **Step 1: Write the failing navigation-data assertions**

  Replace the group-label assertions in `tests/navigation.test.tsx` with the required flat order and absence checks:

  ```tsx
  expect(markup).not.toContain('Start here');
  expect(markup).not.toContain('Practice');
  expect(markup).not.toContain('Notes');
  expect(markup).not.toContain('Connect');

  expect(markup.indexOf('Home')).toBeLessThan(markup.indexOf('About'));
  expect(markup.indexOf('About')).toBeLessThan(
    markup.indexOf('Technical Skills'),
  );
  ```

- [ ] **Step 2: Run the targeted test to verify it fails**

  Run: `npm.cmd run test -- tests/navigation.test.tsx`

  Expected: FAIL because `SiteNavigation` still renders group labels.

- [ ] **Step 3: Replace grouped data with a flat readonly navigation list**

  In `app/lib/navigation.ts`, remove `NavigationGroup` and export the route sequence below:

  ```ts
  export interface NavigationItem {
    label: string;
    href: string;
  }

  export const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Technical Skills', href: '/technical-skills' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Writing', href: '/writing' },
    { label: 'Contact', href: '/contact' },
  ] as const satisfies readonly NavigationItem[];
  ```

- [ ] **Step 4: Update the navigation component's import and mapping**

  In `app/components/layout/SiteNavigation.tsx`, replace the nested group mapping with one `<ul>` over `navigationItems`. Retain `isCurrentPath` and its `aria-current="page"` result.

- [ ] **Step 5: Run the targeted test to verify it passes**

  Run: `npm.cmd run test -- tests/navigation.test.tsx`

  Expected: PASS once group labels are gone and all six route links remain.

- [ ] **Step 6: Commit the flat navigation model**

  ```bash
  git add app/lib/navigation.ts app/components/layout/SiteNavigation.tsx tests/navigation.test.tsx
  git commit -m "refactor(nav): flatten primary routes"
  ```

### Task 2: Add reusable brand and social-profile primitives

**Files:**
- Create: `app/components/shared/BrandMark.tsx`
- Create: `app/components/shared/BrandMark.module.css`
- Create: `app/components/shared/SocialProfileLinks.tsx`
- Create: `app/components/shared/SocialProfileLinks.module.css`
- Modify: `app/components/shared/ContactLinks.tsx`
- Modify: `app/components/shared/ContactLinks.module.css`
- Modify: `tests/corePages.test.tsx`
- Create: `tests/brandMark.test.tsx`

**Interfaces:**
- Consumes: `portfolioData.contact.github` and `portfolioData.contact.linkedin`.
- Produces: `BrandMark({ className?: string })` and `SocialProfileLinks({ placement: 'header' | 'contact' })`.
- Produces: `ContactLinks`, which preserves the email CTA and uses `SocialProfileLinks` for icon-only external destinations.

- [ ] **Step 1: Write failing rendering tests**

  Add `tests/brandMark.test.tsx` and extend `tests/corePages.test.tsx` with these assertions:

  ```tsx
  const brandMarkup = renderToStaticMarkup(<BrandMark />);
  expect(brandMarkup).toContain('<svg');
  expect(brandMarkup).toContain('aria-hidden="true"');
  expect(brandMarkup).not.toContain('C.M.B.');

  const contactMarkup = renderToStaticMarkup(<ContactLinks />);
  expect(contactMarkup).toContain('aria-label="Open Charly Micolas LinkedIn profile"');
  expect(contactMarkup).toContain('aria-label="Open Charly Micolas GitHub profile"');
  expect(contactMarkup).not.toContain('LinkedIn â†—');
  expect(contactMarkup).not.toContain('GitHub â†—');
  ```

- [ ] **Step 2: Run the targeted component tests to verify they fail**

  Run: `npm.cmd run test -- tests/brandMark.test.tsx tests/corePages.test.tsx`

  Expected: FAIL because no brand component exists and contact still has text links.

- [ ] **Step 3: Implement the brand mark as an asset-replaceable SVG component**

  Create `BrandMark.tsx` as a self-contained component with a geometric C/M/B-inspired path or layered serif letter shapes. Its public interface is:

  ```tsx
  interface BrandMarkProps {
    className?: string;
  }

  export default function BrandMark({ className }: BrandMarkProps) {
    return (
      <svg
        aria-hidden="true"
        className={className}
        focusable="false"
        viewBox="0 0 48 48"
      >
        <circle cx="24" cy="24" r="22" />
        <text x="8" y="31">C</text>
        <text x="18" y="28">M</text>
        <text x="31" y="31">B</text>
      </svg>
    );
  }
  ```

  Keep all mark-specific dimensions and colours in `BrandMark.module.css`, making a later raster or bespoke SVG substitution independent of header markup.

- [ ] **Step 4: Implement semantic icon-only social links**

  Create `SocialProfileLinks.tsx` using `FaLinkedinIn` and `FaGithub` from `react-icons/fa6`. Render two `<a>` elements with the existing URLs, `target="_blank"`, `rel="noopener noreferrer"`, descriptive `aria-label` values, `title` values for mouse users, and icons marked `aria-hidden="true"`.

  Use this prop contract:

  ```tsx
  type SocialProfilePlacement = 'header' | 'contact';

  const profiles = [
    {
      href: linkedin,
      label: 'Open Charly Micolas LinkedIn profile',
      icon: FaLinkedinIn,
    },
    {
      href: github,
      label: 'Open Charly Micolas GitHub profile',
      icon: FaGithub,
    },
  ] as const;

  export default function SocialProfileLinks({
    placement,
  }: {
    placement: SocialProfilePlacement;
  }) {
    return (
      <ul aria-label="Professional profiles">
        {profiles.map(({ href, icon: Icon, label }) => (
          <li key={href}>
            <a aria-label={label} href={href} rel="noopener noreferrer" target="_blank" title={label}>
              <Icon aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    );
  }
  ```

  The CSS module provides 40 px minimum square hit areas, a visible focus-compatible outline, and size variants for `header` and `contact`.

- [ ] **Step 5: Simplify the contact links component**

  Retain the email link and separator in `ContactLinks.tsx`; replace the text social links with:

  ```tsx
  <SocialProfileLinks placement="contact" />
  ```

  Remove only the obsolete text-link styles from `ContactLinks.module.css`; do not duplicate icon styling there.

- [ ] **Step 6: Run the targeted component tests to verify they pass**

  Run: `npm.cmd run test -- tests/brandMark.test.tsx tests/corePages.test.tsx`

  Expected: PASS with an SVG mark, icon-only profile links, and no telephone output.

- [ ] **Step 7: Commit shared visual primitives**

  ```bash
  git add app/components/shared/BrandMark.tsx app/components/shared/BrandMark.module.css app/components/shared/SocialProfileLinks.tsx app/components/shared/SocialProfileLinks.module.css app/components/shared/ContactLinks.tsx app/components/shared/ContactLinks.module.css tests/brandMark.test.tsx tests/corePages.test.tsx
  git commit -m "feat(brand): add monogram and social icons"
  ```

### Task 3: Build the sticky top header and update the shell

**Files:**
- Modify: `app/components/layout/SiteNavigation.tsx`
- Modify: `app/components/layout/SiteNavigation.module.css`
- Modify: `app/components/layout/SiteShell.module.css`
- Modify: `app/globals.css`
- Modify: `tests/navigation.test.tsx`

**Interfaces:**
- Consumes: `navigationItems`, `BrandMark`, `SocialProfileLinks`, `usePathname()`, and `Link`.
- Produces: one `nav[aria-label="Primary navigation"]` whose desktop and mobile form is the same sticky top header.
- Produces: `--header-height` and `scroll-padding-top` for routes and skip-link target positioning.

- [ ] **Step 1: Extend the failing navigation test for the new header contract**

  Add assertions that express the expected static markup:

  ```tsx
  expect(markup).toContain('aria-label="Go to Home"');
  expect(markup).toContain('aria-label="Primary navigation"');
  expect(markup).toContain('Open Charly Micolas LinkedIn profile');
  expect(markup).toContain('Open Charly Micolas GitHub profile');
  expect(markup).not.toContain('Menu +');
  expect(markup).not.toContain('Primary navigation mobile');
  ```

- [ ] **Step 2: Run the targeted navigation test to verify it fails**

  Run: `npm.cmd run test -- tests/navigation.test.tsx`

  Expected: FAIL because the current component still renders the desktop rail and mobile `<details>` menu.

- [ ] **Step 3: Replace the rail and mobile menu with one sticky header**

  Update `SiteNavigation.tsx` to render a single nav with three regions:

  ```tsx
  <nav aria-label="Primary navigation" className={styles.navigation}>
    <Link aria-label="Go to Home" className={styles.brandLink} href="/">
      <BrandMark className={styles.brandMark} />
    </Link>
    <ul className={styles.links}>
      {navigationItems.map((item) => (
        <li key={item.href}>
          <Link aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined} href={item.href}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
    <SocialProfileLinks placement="header" />
  </nav>
  ```

  Remove `useState`, `<details>`, the location footer, and every rail/mobile-only class.

- [ ] **Step 4: Implement responsive header layout and document flow**

  In `SiteNavigation.module.css`, make `.navigation` `position: sticky; top: 0; z-index: 10`, give it `min-height: var(--header-height)`, a paper background, bottom rule, and compact horizontal padding. Center or balance the navigation links with CSS grid and prevent link wrapping.

  For widths at or below 760 px, keep the brand mark and social icons fixed in the row, and put `.links` in an `overflow-x: auto` region with `scrollbar-width: none`, `white-space: nowrap`, `min-width: 0`, and touch-friendly link padding. Do not make the document itself horizontally scrollable.

  Replace the two-column grid in `SiteShell.module.css` with a normal minimum-height document wrapper. In `app/globals.css`, declare `--header-height: 4.5rem` and add `scroll-padding-top: calc(var(--header-height) + 1rem)` on `html` so sticky headers do not obscure scroll targets.

- [ ] **Step 5: Run the targeted navigation test to verify it passes**

  Run: `npm.cmd run test -- tests/navigation.test.tsx`

  Expected: PASS with one flat navigation landmark, brand SVG, direct route links, and no menu disclosure markup.

- [ ] **Step 6: Commit the header transition**

  ```bash
  git add app/components/layout/SiteNavigation.tsx app/components/layout/SiteNavigation.module.css app/components/layout/SiteShell.module.css app/globals.css tests/navigation.test.tsx
  git commit -m "feat(nav): add sticky editorial header"
  ```

### Task 4: Compact page compositions without reducing readability

**Files:**
- Modify: `app/components/shared/PageIntro.module.css`
- Modify: `app/about/page.tsx`
- Modify: `app/about/page.module.css`
- Modify: `app/technical-skills/page.module.css`
- Modify: `app/components/portfolio/SkillIndex.module.css`
- Modify: `app/contact/page.module.css`
- Modify: `app/page.module.css`
- Modify: `tests/technicalSkillsPage.test.tsx`
- Create: `tests/compactPageMarkup.test.tsx`

**Interfaces:**
- Consumes: existing `portfolioData`, `PageIntro`, `SkillIndex`, and `ContactLinks` content.
- Produces: semantic pages whose desktop composition uses the post-header viewport efficiently and whose mobile composition stacks safely.

- [ ] **Step 1: Write failing compact-layout markup tests**

  Create `tests/compactPageMarkup.test.tsx` with page-level assertions for the intended structures:

  ```tsx
  const aboutMarkup = renderToStaticMarkup(<AboutPage />);
  expect(aboutMarkup).toContain('class="overview"');
  expect(aboutMarkup).toContain('Core competencies');
  expect(aboutMarkup).toContain('Education');

  const contactMarkup = renderToStaticMarkup(<ContactPage />);
  expect(contactMarkup).toContain('mailto:charlymicolasbutar@gmail.com');
  expect(contactMarkup).toContain('Open Charly Micolas LinkedIn profile');
  ```

- [ ] **Step 2: Run the targeted layout tests to verify they fail**

  Run: `npm.cmd run test -- tests/compactPageMarkup.test.tsx tests/technicalSkillsPage.test.tsx`

  Expected: FAIL because the About overview wrapper does not exist yet.

- [ ] **Step 3: Recompose About into a concise desktop overview**

  In `app/about/page.tsx`, wrap the profile and supporting information like this:

  ```tsx
  <div className={styles.overview}>
    <section className={styles.profile}>...</section>
    <div className={styles.supportingInfo}>
      <section className={styles.index}>...</section>
      <section className={styles.education}>...</section>
    </div>
  </div>
  ```

  In the CSS module, make `.overview` a two-column grid above 760 px with an expansive narrative column and a constrained supporting column. Preserve the existing competency text, education data, borders, and mobile one-column fallback. Reduce serial top and bottom padding instead of reducing readable type sizes.

- [ ] **Step 4: Convert skills into responsive capability cards**

  Keep `SkillIndex.tsx` data mapping and text labels unchanged. In `SkillIndex.module.css`, make `.index` a two-column grid at desktop widths, make each `.group` a bordered card-like grid item, and make its `<ul>` a compact auto-fit grid. Below 760 px, restore one column with the same logo and label pairing. Tighten `app/technical-skills/page.module.css` context spacing so the first capability card appears near the intro.

- [ ] **Step 5: Make Contact and shared intros fit the post-header viewport**

  Reduce `PageIntro.module.css` top/bottom padding and display scale so the page heading remains editorial but no longer consumes most of a laptop viewport. In `app/contact/page.module.css`, use `min-height: calc(100dvh - var(--header-height))`, vertically balanced internal spacing, and a constrained content width that places its text, email CTA, and icon links in the normal first desktop view. Maintain an automatic-height single-column mobile layout.

  Update `app/page.module.css` hero min-height calculations to subtract `var(--header-height)` so Home does not become taller than intended after the header moves into normal document flow.

- [ ] **Step 6: Run the targeted page tests to verify they pass**

  Run: `npm.cmd run test -- tests/compactPageMarkup.test.tsx tests/technicalSkillsPage.test.tsx`

  Expected: PASS with preserved portfolio content and the new compact About wrapper.

- [ ] **Step 7: Commit compact page layouts**

  ```bash
  git add app/components/shared/PageIntro.module.css app/about/page.tsx app/about/page.module.css app/technical-skills/page.module.css app/components/portfolio/SkillIndex.module.css app/contact/page.module.css app/page.module.css tests/compactPageMarkup.test.tsx tests/technicalSkillsPage.test.tsx
  git commit -m "feat(layout): compact portfolio pages"
  ```

### Task 5: Verify navigation, responsive layout, accessibility, and documentation

**Files:**
- Modify: `e2e/navigation.spec.ts`
- Modify: `e2e/accessibility.spec.ts`
- Modify: `docs/architecture.md`

**Interfaces:**
- Consumes: the completed header, shared primitives, and routes.
- Produces: browser-level regression coverage for sticky direct navigation, responsive no-overflow behaviour, and all-page Axe coverage.

- [ ] **Step 1: Write failing browser regression checks**

  Replace the old mobile-menu flow in `e2e/navigation.spec.ts` with tests that assert direct mobile navigation and sticky desktop behaviour:

  ```ts
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', {
    name: 'Primary navigation',
  });
  await expect(navigation).toBeVisible();
  await expect(page.getByText('Menu +', { exact: true })).toHaveCount(0);
  await navigation.getByRole('link', { name: 'Technical Skills' }).click();
  await expect(page).toHaveURL('/technical-skills');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/experiences');
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(navigation).toHaveCSS('position', 'sticky');
  expect(await navigation.evaluate((element) => element.getBoundingClientRect().top)).toBe(0);
  ```

  Add a mobile width assertion that `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 2: Run the targeted browser test to verify it fails**

  Run: `npm.cmd run test:e2e -- e2e/navigation.spec.ts`

  Expected: FAIL before the header implementation because the old mobile disclosure control is still required.

- [ ] **Step 3: Extend automated accessibility coverage**

  Add `/about` to the Axe route list in `e2e/accessibility.spec.ts`, leaving the existing routes intact.

- [ ] **Step 4: Document the composition boundaries**

  Update `docs/architecture.md` to describe:

  ```md
  - `layout/SiteNavigation` owns the persistent route header and active-route state.
  - `shared/BrandMark` is the replaceable visual brand slot used by navigation.
  - `shared/SocialProfileLinks` owns accessible LinkedIn and GitHub icon links for header and contact placements.
  ```

- [ ] **Step 5: Run the full automated verification suite**

  Run these commands in order:

  ```bash
  npm.cmd run format:check
  npm.cmd run lint
  npm.cmd run typecheck
  npm.cmd run test
  npm.cmd run test:e2e
  npm.cmd run build
  ```

  Expected: every command exits with status 0.

- [ ] **Step 6: Perform a visual desktop and mobile review**

  Start the local server with `npm.cmd run dev -- --hostname 127.0.0.1 --port 3000`. Inspect `/`, `/about`, `/technical-skills`, and `/contact` at 1440 x 900 and 390 x 844. Confirm the header remains visible, links remain reachable, social icons are legible and focusable, Contact fits naturally in a desktop first view, and the mobile document has no horizontal overflow.

- [ ] **Step 7: Commit verification coverage and documentation**

  ```bash
  git add e2e/navigation.spec.ts e2e/accessibility.spec.ts docs/architecture.md
  git commit -m "test(ui): cover sticky portfolio navigation"
  ```
