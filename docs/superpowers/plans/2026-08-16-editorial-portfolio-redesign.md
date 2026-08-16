# Editorial Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax.

**Goal:** Build an editorial multi-route portfolio with CV-backed content, skill logos, a career timeline, a Writing section, and no visible phone number.

**Architecture:** Keep app/data/index.ts as the CV-backed source of truth, adding only one writing record. A root shell owns route navigation. Pages and content sections are Server Components; the route-aware navigation is a small Client Component. CSS Modules hold component layout and app/globals.css owns the shared editorial token system.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, CSS Modules, next/link, next/navigation, Vitest 3, and simple-icons.

## Global Constraints

- Use the root app/ App Router folders and page.tsx route convention.
- Keep existing Plus Jakarta Sans and Fira Code setup. Use system serif fallbacks for display type.
- Retain all approved CV content except remove phone from public contact data.
- Render no phone number and no tel: URL.
- Use exactly Home, About, Technical Skills, Experiences, Writing, Contact, grouped as Start here, Practice, Notes, Connect.
- Bundled Simple Icons SVGs are only for named brands. Concepts use an explicit neutral practice mark.
- Do not use remote asset hotlinks, glass cards, neon gradients, autoplay, or parallax.
- Provide focus styles, semantic structure, reduced-motion support, and no overflow at 320px.

---

## File Structure

| File | Responsibility |
| --- | --- |
| app/data/index.ts and app/types/index.ts | CV content, contact privacy, WritingPost contract. |
| app/lib/navigation.ts | Typed grouped navigation source. |
| app/lib/skill-icons.ts | Brand-icon and practice-mark mapping. |
| app/components/SiteNavigation.tsx | Client desktop rail/mobile menu/current route. |
| app/components/SiteShell.tsx | Shared navigation/content frame. |
| app/components/PageIntro.tsx | Reusable editorial title/note. |
| app/components/SkillIndex.tsx | Visual logo index. |
| app/components/ExperienceTimeline.tsx | Chronological CV timeline. |
| app/components/WritingList.tsx | Writing index. |
| app/components/ContactLinks.tsx | Email, LinkedIn, GitHub links. |
| app/{about,technical-skills,experiences,writing,contact}/page.tsx | Public route pages. |
| app/writing/[slug]/page.tsx | Dummy writing detail route. |
| app/layout.tsx, app/globals.css, app/sitemap.ts | Shell, style tokens, metadata, public route list. |
| tests/*.test.ts(x) | Data, nav, privacy, skills, timeline, writing, sitemap coverage. |

### Task 1: Establish the Content Model

**Files:**
- Modify: app/types/index.ts
- Modify: app/data/index.ts
- Modify: tests/portfolioData.test.ts
- Create: tests/writingData.test.ts

**Interfaces:**
- Produces WritingPost { slug, title, excerpt, publishedOn, readingTime, status, body }.
- Produces portfolioData.writing and a portfolioData.contact contract without phone.

- [ ] **Step 1: Write the failing data test**

~~~ts
import { describe, expect, it } from 'vitest';
import { portfolioData } from '../app/data';

describe('editorial portfolio data', () => {
  it('keeps public contact channels without a phone number', () => {
    expect(portfolioData.contact).toEqual({
      email: 'charlymicolasbutar@gmail.com',
      linkedin: 'https://linkedin.com/in/charly-micolas',
      github: 'https://github.com/charlybutar21',
    });
    expect(portfolioData.contact).not.toHaveProperty('phone');
  });

  it('publishes one clearly marked dummy writing post', () => {
    expect(portfolioData.writing).toEqual([
      expect.objectContaining({
        slug: 'the-quiet-work-behind-reliable-software',
        title: 'The quiet work behind reliable software',
        status: 'Draft',
      }),
    ]);
  });
});
~~~

- [ ] **Step 2: Run the test and verify it fails**

Run: npm run test -- tests/portfolioData.test.ts tests/writingData.test.ts

Expected: FAIL because writing and the private-contact contract do not exist.

- [ ] **Step 3: Implement the minimal model**

~~~ts
export interface WritingPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedOn: string;
  readingTime: string;
  status: 'Draft';
  body: string[];
}

export interface PortfolioData {
  writing: WritingPost[];
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
}
~~~

Add one writing record with the test slug/title, an excerpt stating it is a placeholder draft, and three short body paragraphs. Keep all skills and CV history unchanged.

- [ ] **Step 4: Run the test and verify it passes**

Run: npm run test -- tests/portfolioData.test.ts tests/writingData.test.ts

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add app/types/index.ts app/data/index.ts tests/portfolioData.test.ts tests/writingData.test.ts
git commit -m "feat(content): add writing data and private contact model"
~~~

### Task 2: Create Navigation and Editorial Shell

**Files:**
- Create: app/lib/navigation.ts
- Create: app/components/SiteNavigation.tsx
- Create: app/components/SiteNavigation.module.css
- Create: app/components/SiteShell.tsx
- Create: app/components/SiteShell.module.css
- Modify: app/layout.tsx
- Modify: app/globals.css
- Create: tests/navigation.test.tsx
- Delete: app/components/Navbar.tsx
- Delete: app/components/Navbar.module.css
- Delete: tests/NavigationAndContact.test.tsx

**Interfaces:**
- Produces navigationGroups and SiteShell({ children }).
- Produces client SiteNavigation() using usePathname().
- Consumes next/link and navigationGroups.

- [ ] **Step 1: Write the failing navigation test**

~~~tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/technical-skills' }));
import SiteNavigation from '../app/components/SiteNavigation';

it('renders the six grouped routes and marks the current page', () => {
  const markup = renderToStaticMarkup(<SiteNavigation />);
  for (const href of ['/', '/about', '/technical-skills', '/experiences', '/writing', '/contact']) {
    expect(markup).toContain('href="' + href + '"');
  }
  for (const label of ['Start here', 'Practice', 'Notes', 'Connect']) {
    expect(markup).toContain(label);
  }
  expect(markup).toContain('aria-current="page"');
});
~~~

- [ ] **Step 2: Run the test and verify it fails**

Run: npm run test -- tests/navigation.test.tsx

Expected: FAIL because SiteNavigation does not exist.

- [ ] **Step 3: Implement the route inventory and shell**

~~~ts
export const navigationGroups = [
  { label: 'Start here', items: [{ label: 'Home', href: '/', number: '01' }, { label: 'About', href: '/about', number: '02' }] },
  { label: 'Practice', items: [{ label: 'Technical Skills', href: '/technical-skills', number: '03' }, { label: 'Experiences', href: '/experiences', number: '04' }] },
  { label: 'Notes', items: [{ label: 'Writing', href: '/writing', number: '05' }] },
  { label: 'Connect', items: [{ label: 'Contact', href: '/contact', number: '06' }] },
] as const;
~~~

Use a semantic desktop nav labelled Primary navigation and a native details/summary Menu control at mobile. Set aria-current="page" from usePathname. SiteShell must own a persistent desktop rail and main id="main-content". Delete the old Aurora/background and glass styles; set paper #f4f0e7, ink #191816, muted #78736c, line #c9c2b6, accent #b9492f, focus-visible, and reduced-motion rules.

- [ ] **Step 4: Run the test and verify it passes**

Run: npm run test -- tests/navigation.test.tsx

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add app/layout.tsx app/globals.css app/lib/navigation.ts app/components/SiteNavigation.tsx app/components/SiteNavigation.module.css app/components/SiteShell.tsx app/components/SiteShell.module.css tests/navigation.test.tsx
git rm app/components/Navbar.tsx app/components/Navbar.module.css tests/NavigationAndContact.test.tsx
git commit -m "feat(navigation): add editorial route shell"
~~~

### Task 3: Build Home, About, and Contact

**Files:**
- Create: app/components/PageIntro.tsx
- Create: app/components/PageIntro.module.css
- Create: app/components/ContactLinks.tsx
- Create: app/components/ContactLinks.module.css
- Modify: app/page.tsx
- Create: app/about/page.tsx
- Create: app/contact/page.tsx
- Create: tests/corePages.test.tsx
- Delete: old Hero, About, CoreCompetencies, Education, Contact components and their CSS modules
- Delete: tests/CoreCompetencies.test.tsx

**Interfaces:**
- Produces PageIntro({ number, title, emphasis, note }) and ContactLinks().
- Consumes portfolioData.hero, about, coreCompetencies, education, and contact.

- [ ] **Step 1: Write the failing core-page test**

~~~tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ContactLinks from '../app/components/ContactLinks';
import Home from '../app/page';

describe('editorial core routes', () => {
  it('keeps approved identity and introduction', () => {
    const markup = renderToStaticMarkup(<Home />);
    expect(markup).toContain('Charly Micolas Butarbutar');
    expect(markup).toContain('Senior Software Engineer');
  });

  it('renders contact without telephone output', () => {
    const markup = renderToStaticMarkup(<ContactLinks />);
    expect(markup).toContain('mailto:charlymicolasbutar@gmail.com');
    expect(markup).toContain('linkedin.com/in/charly-micolas');
    expect(markup).toContain('github.com/charlybutar21');
    expect(markup).not.toContain('tel:');
    expect(markup).not.toContain('813-1872');
  });
});
~~~

- [ ] **Step 2: Run the test and verify it fails**

Run: npm run test -- tests/corePages.test.tsx

Expected: FAIL because the new components do not exist.

- [ ] **Step 3: Implement the three pages**

Home uses PageIntro number 01, name, role, and a short CV-backed statement. About renders profile, competencies, then education as a compact academic record. Contact renders ContactLinks only, with target="_blank" and rel="noreferrer" on external anchors. Add Home, About, and Contact page metadata. Use editorial reading columns and divider lines instead of cards.

- [ ] **Step 4: Run the test and verify it passes**

Run: npm run test -- tests/corePages.test.tsx

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add app/page.tsx app/about/page.tsx app/contact/page.tsx app/components/PageIntro.tsx app/components/PageIntro.module.css app/components/ContactLinks.tsx app/components/ContactLinks.module.css tests/corePages.test.tsx
git rm app/components/Hero.tsx app/components/Hero.module.css app/components/About.tsx app/components/About.module.css app/components/CoreCompetencies.tsx app/components/CoreCompetencies.module.css app/components/Education.tsx app/components/Education.module.css app/components/Contact.tsx app/components/Contact.module.css tests/CoreCompetencies.test.tsx
git commit -m "feat(pages): add editorial home about and contact"
~~~

### Task 4: Build Visual Technical Skills

**Files:**
- Modify: package.json
- Modify: package-lock.json
- Create: app/lib/skill-icons.ts
- Create: app/components/SkillIndex.tsx
- Create: app/components/SkillIndex.module.css
- Create: app/technical-skills/page.tsx
- Create: tests/skillIndex.test.tsx
- Delete: app/components/Skills.tsx
- Delete: app/components/Skills.module.css

**Interfaces:**
- Produces getSkillMark(skill: string): SkillMark.
- Brand branch: { kind: 'brand', icon: SimpleIcon }.
- Practice branch: { kind: 'practice', abbreviation: string }.
- Produces SkillIndex().

- [ ] **Step 1: Install the local SVG source**

Run: npm install simple-icons

Expected: simple-icons appears in dependencies and package-lock changes. No CDN URL is added.

- [ ] **Step 2: Write the failing skill-index test**

~~~tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import SkillIndex from '../app/components/SkillIndex';

it('renders sampled CV skills with visual marks and text labels', () => {
  const markup = renderToStaticMarkup(<SkillIndex />);
  for (const skill of ['Java', 'Go', 'Spring Boot', 'Apache Kafka', 'Docker', 'Jira', 'System Design', 'Clean Code', 'Kanban']) {
    expect(markup).toContain(skill);
  }
  expect(markup).toContain('aria-label="Java logo"');
  expect(markup).toContain('aria-label="Docker logo"');
  expect(markup).toContain('aria-label="System Design practice mark"');
});
~~~

- [ ] **Step 3: Run the test and verify it fails**

Run: npm run test -- tests/skillIndex.test.tsx

Expected: FAIL because SkillIndex does not exist.

- [ ] **Step 4: Implement icon mapping and index**

Use direct tree-shakable imports such as siJava, siGo, siSpringboot, siMysql, siPostgresql, siMongodb, siRedis, siRabbitmq, siApachekafka, siDocker, siGithub, siGitlab, and siJira. Map only concrete products. Return practice marks for Spring MVC, System Design, SOLID Principles, Agile, Scrum, Kanban, and any missing product mark.

Render brands as svg role="img" with aria-label "{skill} logo"; render fallbacks as span with aria-label "{skill} practice mark"; retain a visible text label adjacent to both. Render the exact six CV categories as ruled index rows with flexible wrapping, not cards or pills. Use the icon hex color inside the icon only.

- [ ] **Step 5: Run the test and verify it passes**

Run: npm run test -- tests/skillIndex.test.tsx

Expected: PASS.

- [ ] **Step 6: Commit**

~~~bash
git add package.json package-lock.json app/lib/skill-icons.ts app/components/SkillIndex.tsx app/components/SkillIndex.module.css app/technical-skills/page.tsx tests/skillIndex.test.tsx
git rm app/components/Skills.tsx app/components/Skills.module.css
git commit -m "feat(skills): add visual technology index"
~~~

### Task 5: Build Experiences Timeline

**Files:**
- Create: app/components/ExperienceTimeline.tsx
- Create: app/components/ExperienceTimeline.module.css
- Create: app/experiences/page.tsx
- Create: tests/experienceTimeline.test.tsx
- Delete: app/components/Experience.tsx
- Delete: app/components/Experience.module.css

**Interfaces:**
- Produces ExperienceTimeline().
- Consumes portfolioData.experience in existing newest-to-oldest order.

- [ ] **Step 1: Write the failing timeline test**

~~~tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import ExperienceTimeline from '../app/components/ExperienceTimeline';

it('renders all six CV roles with the current role first', () => {
  const markup = renderToStaticMarkup(<ExperienceTimeline />);
  expect((markup.match(/<article/g) ?? [])).toHaveLength(6);
  expect(markup.indexOf('PT Progo Puncak Group (Pinjamin)')).toBeLessThan(
    markup.indexOf('PT LightStream Analytics Indonesia'),
  );
  expect(markup).toContain('Jun 2024 - Present');
  expect(markup).toContain('South Jakarta');
});
~~~

- [ ] **Step 2: Run the test and verify it fails**

Run: npm run test -- tests/experienceTimeline.test.tsx

Expected: FAIL because ExperienceTimeline does not exist.

- [ ] **Step 3: Implement the timeline**

Render semantic ol/li entries containing one article each. Each article includes period, role, company, location, and existing CV bullets. Desktop uses a narrow date rail and a continuous timeline rule. Mobile moves the rule to the content’s left. The first item has visible Current role text.

- [ ] **Step 4: Run the test and verify it passes**

Run: npm run test -- tests/experienceTimeline.test.tsx

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add app/components/ExperienceTimeline.tsx app/components/ExperienceTimeline.module.css app/experiences/page.tsx tests/experienceTimeline.test.tsx
git rm app/components/Experience.tsx app/components/Experience.module.css
git commit -m "feat(experience): add career timeline"
~~~

### Task 6: Add Writing Index and Dummy Detail Page

**Files:**
- Create: app/components/WritingList.tsx
- Create: app/components/WritingList.module.css
- Create: app/writing/page.tsx
- Create: app/writing/[slug]/page.tsx
- Create: tests/writingRoutes.test.tsx

**Interfaces:**
- Produces WritingList() and a static detail route for every portfolioData.writing slug.
- Consumes WritingPost from Task 1.

- [ ] **Step 1: Write the failing Writing test**

~~~tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import WritingList from '../app/components/WritingList';

it('links the dummy post to its detail route', () => {
  const markup = renderToStaticMarkup(<WritingList />);
  expect(markup).toContain('The quiet work behind reliable software');
  expect(markup).toContain('href="/writing/the-quiet-work-behind-reliable-software"');
  expect(markup).toContain('Draft');
});
~~~

- [ ] **Step 2: Run the test and verify it fails**

Run: npm run test -- tests/writingRoutes.test.tsx

Expected: FAIL because WritingList does not exist.

- [ ] **Step 3: Implement Writing**

Create /writing with a visible Draft label. In app/writing/[slug]/page.tsx, return every configured slug from generateStaticParams(), find its data record, and call notFound() when absent. Render title, date, reading time, Draft label, and the three body paragraphs in a narrow reading column.

- [ ] **Step 4: Run the test and verify it passes**

Run: npm run test -- tests/writingRoutes.test.tsx

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add app/components/WritingList.tsx app/components/WritingList.module.css app/writing/page.tsx app/writing/[slug]/page.tsx tests/writingRoutes.test.tsx
git commit -m "feat(writing): add personal writing routes"
~~~

### Task 7: Finish Metadata, Sitemap, and Verification

**Files:**
- Modify: app/layout.tsx
- Modify: app/sitemap.ts
- Modify: README.md
- Create: tests/sitemap.test.ts

**Interfaces:**
- Produces a sitemap containing all six menu routes and the first writing detail route.
- Consumes MetadataRoute.Sitemap, navigation route inventory, and writing slug.

- [ ] **Step 1: Write the failing sitemap test**

~~~ts
import { expect, it } from 'vitest';
import sitemap from '../app/sitemap';

it('lists every public editorial route', () => {
  const urls = sitemap().map(({ url }) => url);
  for (const path of ['/', '/about', '/technical-skills', '/experiences', '/writing', '/writing/the-quiet-work-behind-reliable-software', '/contact']) {
    expect(urls).toContain('http://charlymicolas.com' + path);
  }
});
~~~

- [ ] **Step 2: Run the test and verify it fails**

Run: npm run test -- tests/sitemap.test.ts

Expected: FAIL because the sitemap currently contains only Home.

- [ ] **Step 3: Implement final integration**

Add the seven asserted URLs to sitemap(). Update root metadata to describe an editorial Senior Software Engineer portfolio and remove its incorrect experience-count claim. Update README with local run/test/lint/build commands, the route inventory, and the fact that Writing is a dummy draft.

- [ ] **Step 4: Run the test and verify it passes**

Run: npm run test -- tests/sitemap.test.ts

Expected: PASS.

- [ ] **Step 5: Verify all automation**

~~~bash
npm run test
npm run lint
set NEXT_TELEMETRY_DISABLED=1 && npm run build
~~~

Expected: all tests, ESLint, and production build pass.

- [ ] **Step 6: Verify in the browser**

Run: npm run dev -- --hostname 127.0.0.1 --port 3000

At desktop and 320px, verify every menu route, current-page state, keyboard-reachable mobile menu, no overflow, text next to skill logos, correct timeline order, Writing detail routing, and no phone/tel output.

- [ ] **Step 7: Commit**

~~~bash
git add app/layout.tsx app/sitemap.ts README.md tests/sitemap.test.ts
git commit -m "chore(site): complete editorial portfolio routes"
~~~

## Self-Review

- **Spec coverage:** Tasks 1–3 deliver the content model, contact privacy, shared menu, Home, About, and Contact. Task 4 delivers visual technical skill logos and the non-brand fallback. Task 5 delivers the timeline. Task 6 delivers the separate Writing page/dummy post. Task 7 delivers metadata, sitemap, responsive/accessibility checks, and final verification.
- **Placeholder scan:** The only placeholder is the explicitly labelled Writing draft requested by the user. Every file, type, interface, test, command, expected result, and commit is named.
- **Type consistency:** WritingPost, portfolioData.writing, navigationGroups, getSkillMark, SkillIndex, ExperienceTimeline, WritingList, and ContactLinks are introduced before later tasks use them. The writing slug matches data, route, tests, and sitemap.

## Execution Handoff

Plan complete and saved to docs/superpowers/plans/2026-08-16-editorial-portfolio-redesign.md. Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks.
2. **Inline Execution** — execute tasks in this session using executing-plans, with checkpoints.

Which approach?
