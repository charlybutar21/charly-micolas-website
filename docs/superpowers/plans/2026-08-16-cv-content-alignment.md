# CV Content Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every CV-derived portfolio claim match the approved 2026 Google Doc while retaining the current one-page glassmorphic design.

**Architecture:** `app/data/index.ts` remains the single source of content. Its `PortfolioData` type gains a core-competency list and a phone number; one new presentational component renders competency badges between the summary and technical-skills sections. No backend or CMS is introduced.

**Tech Stack:** Next.js 16.2.11, React 19.2.4, TypeScript 5, CSS Modules, Vitest 3.

## Global Constraints

- Create an isolated worktree from commit `0034aa7`; never modify, stage, or discard the Vite/WebStorm files in the primary worktree.
- Before source edits, run `npm ci` in that worktree and read the installed Next.js App Router guide under `node_modules/next/dist/docs/`, as required by `AGENTS.md`.
- The approved Google Doc is the sole source for all CV facts.
- Preserve the static export, single-page layout, aurora/glass theme, responsive CSS Modules, and no-backend architecture.
- Display `+62 813-1872-8890` and use `tel:+6281318728890` for its link.
- Do not add a CMS, API, form submission, analytics, visual redesign, or project case studies.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `package.json`, `package-lock.json` | Provide `npm run test` with Vitest. |
| `vitest.config.ts` | Run TS/TSX tests and process CSS Module imports. |
| `tests/portfolioData.test.ts` | Assert the approved CV data contract. |
| `tests/CoreCompetencies.test.tsx` | Assert new section markup and all competency labels. |
| `tests/NavigationAndContact.test.tsx` | Assert section anchors and CV contact actions. |
| `app/types/index.ts` | Add `coreCompetencies` and `phone` to the typed data model. |
| `app/data/index.ts` | Store the complete approved CV content. |
| `app/components/CoreCompetencies.tsx` | Render the new section from the data model. |
| `app/components/CoreCompetencies.module.css` | Style the section using existing responsive glass-card patterns. |
| `app/page.tsx` | Place competencies after the summary. |
| `app/components/{About,Skills,Experience,Education,Contact,Navbar}.tsx` | Align headings, section numbers, anchors, and contact presentation. |
| `app/components/Contact.module.css` | Style the phone contact action. |

### Task 1: Prepare the isolated Next.js worktree and test harness

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`

**Produces:** `npm run test` runs `tests/**/*.test.ts` and `tests/**/*.test.tsx`.

- [ ] **Step 1: Create an isolated worktree and install its committed dependencies**

```powershell
git worktree add ..\charly-micolas-cv-content 0034aa7
Set-Location ..\charly-micolas-cv-content
npm ci
Get-ChildItem node_modules\next\dist\docs -Recurse -File | Select-Object -First 20 -ExpandProperty FullName
```

Expected: the worktree uses the committed Next.js application and the installed documentation directory exists.

- [ ] **Step 2: Read the installed App Router guidance before editing source**

```powershell
rg -l "App Router|app directory" node_modules\next\dist\docs | Select-Object -First 5
```

Read the App Router guide returned by this command and obey any deprecation notes it contains.

- [ ] **Step 3: Add a test command and Vitest**

Add this script and development dependency to `package.json`, then regenerate the lockfile with `npm install --save-dev vitest@^3.2.4`:

```json
{
  "scripts": { "test": "vitest run" },
  "devDependencies": { "vitest": "^3.2.4" }
}
```

- [ ] **Step 4: Add the Vitest configuration**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
  css: {
    modules: { classNameStrategy: 'non-scoped' },
  },
});
```

- [ ] **Step 5: Commit the harness**

```powershell
git add package.json package-lock.json vitest.config.ts
git commit -m "test: add CV content test harness"
```

### Task 2: Replace the typed portfolio data with the approved CV

**Files:**

- Create: `tests/portfolioData.test.ts`
- Modify: `app/types/index.ts`
- Modify: `app/data/index.ts`

**Consumes:** `PortfolioData` in `app/types/index.ts`.

**Produces:** `portfolioData.coreCompetencies: string[]` and `portfolioData.contact.phone: string`.

- [ ] **Step 1: Write the failing CV-data test**

Create `tests/portfolioData.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { portfolioData } from '../app/data';

describe('approved 2026 CV content', () => {
  it('exposes the approved profile and contact channels', () => {
    expect(portfolioData.hero).toMatchObject({
      name: 'Charly Micolas Butarbutar',
      role: 'Senior Software Engineer | Backend Engineering | Technical Leadership',
    });
    expect(portfolioData.hero.tagline).toContain('approximately 9 years');
    expect(portfolioData.contact).toMatchObject({
      email: 'charlymicolasbutar@gmail.com',
      phone: '+62 813-1872-8890',
      linkedin: 'https://linkedin.com/in/charly-micolas',
      github: 'https://github.com/charlybutar21',
    });
  });

  it('preserves the approved competencies, skills, and employment order', () => {
    expect(portfolioData.coreCompetencies).toEqual([
      'Backend Architecture', 'API Design and Integration', 'Microservices',
      'Distributed Systems', 'Database Design', 'System Reliability',
      'Technical Leadership', 'Delivery Management', 'Requirement Analysis',
      'Stakeholder Alignment', 'Code and Design Review', 'Agile Delivery',
    ]);
    expect(portfolioData.skills.map(({ category }) => category)).toEqual([
      'Languages', 'Frameworks & Libraries', 'Data & Messaging',
      'Development & DevOps', 'Architecture & Engineering Practices',
      'Project Management',
    ]);
    expect(portfolioData.experience).toHaveLength(6);
    expect(portfolioData.experience[0]).toMatchObject({
      company: 'PT Progo Puncak Group (Pinjamin)',
      period: 'Jun 2024 - Present',
      location: 'South Jakarta',
    });
  });
});
```

- [ ] **Step 2: Verify the test fails for the intended missing fields**

Run `npm run test -- tests/portfolioData.test.ts`.

Expected: failure because `coreCompetencies` and `contact.phone` do not exist yet.

- [ ] **Step 3: Extend the strict TypeScript model**

In `PortfolioData`, add:

```ts
coreCompetencies: string[];

contact: {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
};
```

- [ ] **Step 4: Populate `portfolioData` with the exact approved CV content**

Use these values verbatim in `app/data/index.ts`:

```ts
hero: {
  name: 'Charly Micolas Butarbutar',
  role: 'Senior Software Engineer | Backend Engineering | Technical Leadership',
  tagline: 'Backend-focused Senior Software Engineer combining approximately 9 years of technical experience with delivery ownership and cross-functional coordination. Experienced in Java, Golang, REST APIs, microservices, databases, and service integration across Fintech P2P, Property Technology, and SaaS supply chain. Brings hands-on backend depth to architecture discussions, requirement clarification, engineering review, blocker resolution, and reliable delivery.',
},
about: {
  paragraphs: ['Backend-focused Senior Software Engineer combining approximately 9 years of technical experience with delivery ownership and cross-functional coordination. Experienced in Java, Golang, REST APIs, microservices, databases, and service integration across Fintech P2P, Property Technology, and SaaS supply chain. Brings hands-on backend depth to architecture discussions, requirement clarification, engineering review, blocker resolution, and reliable delivery.'],
},
coreCompetencies: [
  'Backend Architecture', 'API Design and Integration', 'Microservices',
  'Distributed Systems', 'Database Design', 'System Reliability',
  'Technical Leadership', 'Delivery Management', 'Requirement Analysis',
  'Stakeholder Alignment', 'Code and Design Review', 'Agile Delivery',
],
contact: {
  email: 'charlymicolasbutar@gmail.com',
  phone: '+62 813-1872-8890',
  linkedin: 'https://linkedin.com/in/charly-micolas',
  github: 'https://github.com/charlybutar21',
},
```

Replace the remaining values with the document's exact lists and text:

```text
Languages: Java, Go
Frameworks & Libraries: Spring Boot, Spring MVC, Spring Data JPA, Hibernate, MyBatis, Spring Cloud, Eureka, JSP, Lombok, JUnit, Mockito
Data & Messaging: MySQL, PostgreSQL, MongoDB, Redis, RabbitMQ, Apache Kafka
Development & DevOps: Git, GitLab, GitHub, Docker, Docker Compose, Maven, Gradle, CI/CD
Architecture & Engineering Practices: System Design, Microservices, REST API Design, Event-Driven Architecture, Database Design, OOP, SOLID Principles, Clean Code, Code Review, Refactoring, Root Cause Analysis, SDLC
Project Management: Jira, Confluence, Agile, Scrum, Kanban
Employment periods: Jun 2024 - Present; Feb - May 2024; Jun 2023 - Jan 2024; Sep 2021 - May 2023; Sep 2017 - Aug 2021; Nov 2015 - Jul 2017
Education: Bachelor of Science in Computer Science — University of Indonesia, Depok — Feb 2019; Associate Degree in Information Technology — Del Institute of Technology, North Sumatra — Sep 2015
```

Use these six experience records in newest-first order, including these exact description arrays:

```text
PT Progo Puncak Group (Pinjamin) | Senior Software Engineer | South Jakarta | Jun 2024 - Present
- Supported ISO 27001, OJK, and FDC audit activities by addressing technical findings, preparing evidence, and delivering improvements that strengthened security and regulatory compliance.
- Lead cross-functional delivery involving 6 engineers, 2 QA engineers, 1 product manager, and 1 UI designer, translating business requirements into technical solutions and actionable engineering tasks.
- Design, develop, and maintain backend systems supporting lending, collection, AML, and internal operations, including the Internal Management Dashboard, Collection System, and Pinjamin website.
- Lead technical discussions, solution and design reviews, production issue resolution, and delivery planning while coordinating dependencies, risks, blockers, owners, and cross-functional decisions.

PT Ringan Teknologi Indonesia (Ringan) | Software Engineer | South Jakarta | Feb - May 2024
- Collaborated with the Technical Lead to assess system requirements, translate them into actionable technical tasks, and align backend solutions with business objectives.
- Contributed to the full development lifecycle of Java and Spring Boot APIs supporting loan application submissions, including implementation, testing, debugging, and defect resolution.

PT Advotics Technology Global (Advotics) | Freelance Software Engineer | Remote | Jun 2023 - Jan 2024
- Delivered Java and Spring Boot API enhancements for a Workforce Management System, translating agreed requirements into maintainable backend solutions.
- Independently managed assigned development work, including estimation, implementation, testing, documentation, and handover within contracted timelines.

PT Properti Solusi Manajemen (Pinhome) | Senior Software Engineer | Remote | Sep 2021 - May 2023
- Partnered with the Technical Lead to assess requirements, break down technical tasks, and prepare upcoming sprints in alignment with business priorities.
- Owned the end-to-end delivery of features across agent and lead-management backend services, covering technical design, development, testing, documentation, and deployment.
- Resolved defects and reduced technical debt through systematic troubleshooting and refactoring, improving system maintainability and reliability.
- Mentored 3 junior engineers and improved team code quality through structured code reviews and engineering best-practice sharing.

PT Advotics Technology Global (Advotics) | Software Engineer / Engineering Lead | South Jakarta | Sep 2017 - Aug 2021
- Designed and maintained Java and Spring Boot microservices supporting item and order management, identity and access, content, and analytics capabilities across SaaS supply-chain products.
- Led a team of 6 engineers in delivering product features for clients across multiple industries.
- Partnered with Product Managers to estimate scope and engineering effort, prioritize technical work, and support reliable sprint delivery.
- Translated business requirements into technical designs and actionable engineering tasks, providing implementation guidance throughout delivery.
- Led end-to-end modernization initiatives for several internal products and features, covering technical planning, implementation, testing, rollout, and issue resolution.
- Acted as a technical advisor by investigating complex system issues and providing guidance to product, engineering, and support teams.

PT LightStream Analytics Indonesia | IT Support Consultant | Central Jakarta | Nov 2015 - Jul 2017
- Investigated and resolved technical issues using Java, AWS, Hadoop Cloudera, and Linux where applicable.
- Managed support requests from intake through resolution, documenting troubleshooting steps, recurring issues, and escalation details for technical teams.
```

- [ ] **Step 5: Verify the test passes**

Run `npm run test -- tests/portfolioData.test.ts`.

Expected: PASS with two tests.

- [ ] **Step 6: Commit the verified data model and content**

```powershell
git add app/types/index.ts app/data/index.ts tests/portfolioData.test.ts
git commit -m "feat(content): align portfolio CV data"
```

### Task 3: Add the tested Core Competencies section

**Files:**

- Create: `tests/CoreCompetencies.test.tsx`
- Create: `app/components/CoreCompetencies.tsx`
- Create: `app/components/CoreCompetencies.module.css`
- Modify: `app/page.tsx`

**Consumes:** `portfolioData.coreCompetencies: string[]`.

**Produces:** `#competencies`, `02. Core Competencies`, and one badge for each competency.

- [ ] **Step 1: Write the failing server-render test**

Create `tests/CoreCompetencies.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CoreCompetencies from '../app/components/CoreCompetencies';
import { portfolioData } from '../app/data';

describe('CoreCompetencies', () => {
  it('renders every approved competency in an anchored section', () => {
    const markup = renderToStaticMarkup(<CoreCompetencies />);

    expect(markup).toContain('id="competencies"');
    expect(markup).toContain('02.');
    expect(markup).toContain('Core Competencies');
    for (const competency of portfolioData.coreCompetencies) {
      expect(markup).toContain(competency);
    }
  });
});
```

- [ ] **Step 2: Verify the test fails because the component is absent**

Run `npm run test -- tests/CoreCompetencies.test.tsx`.

Expected: FAIL with a module-not-found error for `CoreCompetencies`.

- [ ] **Step 3: Implement the component and insert it in page order**

Create `app/components/CoreCompetencies.tsx`:

```tsx
import { portfolioData } from '../data';
import styles from './CoreCompetencies.module.css';

export default function CoreCompetencies() {
  return (
    <section id="competencies" className={styles.competencies}>
      <h3 className={styles.sectionTitle}>
        <span className="mono">02.</span> Core Competencies
      </h3>
      <div className={`glass-card ${styles.content}`}>
        <ul className={styles.list}>
          {portfolioData.coreCompetencies.map((competency) => (
            <li key={competency} className={`mono ${styles.item}`}>
              {competency}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

Create `app/components/CoreCompetencies.module.css`:

```css
.competencies { margin: 0 auto; max-width: 800px; padding: 50px 0; }
.sectionTitle { align-items: center; display: flex; font-size: clamp(26px, 5vw, 32px); margin: 10px 0 40px; white-space: nowrap; }
.sectionTitle span { color: var(--accent); font-size: clamp(16px, 3vw, 20px); margin-right: 10px; }
.content { padding: 25px; }
.list { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; margin: 0; padding: 0; }
.item { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); border-radius: 8px; color: var(--foreground); font-size: 0.85rem; padding: 6px 14px; }
```

Add `<CoreCompetencies />` immediately after `<About />` in `app/page.tsx`.

- [ ] **Step 4: Verify the rendered section passes its test**

Run `npm run test -- tests/CoreCompetencies.test.tsx`.

Expected: PASS with one test.

- [ ] **Step 5: Commit the new section**

```powershell
git add app/components/CoreCompetencies.tsx app/components/CoreCompetencies.module.css app/page.tsx tests/CoreCompetencies.test.tsx
git commit -m "feat(portfolio): add core competencies section"
```

### Task 4: Align section labels, navigation, and contact actions

**Files:**

- Create: `tests/NavigationAndContact.test.tsx`
- Modify: `app/components/About.tsx`
- Modify: `app/components/Skills.tsx`
- Modify: `app/components/Experience.tsx`
- Modify: `app/components/Education.tsx`
- Modify: `app/components/Contact.tsx`
- Modify: `app/components/Contact.module.css`
- Modify: `app/components/Navbar.tsx`

**Consumes:** `portfolioData.contact.phone`, anchors `summary`, `competencies`, `skills`, `experience`, and `contact`.

**Produces:** working section navigation and email/phone links based on the CV.

- [ ] **Step 1: Write the failing navigation and contact test**

Create `tests/NavigationAndContact.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Contact from '../app/components/Contact';
import Navbar from '../app/components/Navbar';

describe('portfolio navigation and contact', () => {
  it('links navigation to the rendered sections', () => {
    const markup = renderToStaticMarkup(<Navbar />);
    for (const href of ['#summary', '#competencies', '#skills', '#experience', '#contact']) {
      expect(markup).toContain(`href="${href}"`);
    }
  });

  it('renders approved email and phone actions', () => {
    const markup = renderToStaticMarkup(<Contact />);
    expect(markup).toContain('mailto:charlymicolasbutar@gmail.com');
    expect(markup).toContain('tel:+6281318728890');
    expect(markup).toContain('+62 813-1872-8890');
  });
});
```

- [ ] **Step 2: Verify the test fails for the old anchors and missing phone action**

Run `npm run test -- tests/NavigationAndContact.test.tsx`.

Expected: FAIL because `Navbar` lacks `#summary` and `#competencies`, and `Contact` lacks the telephone link.

- [ ] **Step 3: Update all headings, IDs, navigation, and contact presentation**

Apply this exact section sequence:

```text
About.tsx: id="summary";       01. Professional Summary
CoreCompetencies.tsx:           02. Core Competencies
Skills.tsx:                     03. Technical Skills
Experience.tsx:                 04. Professional Experience
Education.tsx:                  05. Education
Contact.tsx:                    06. Get In Touch
```

Replace the navbar items with:

```tsx
<li><Link href="#summary">Summary</Link></li>
<li><Link href="#competencies">Core Competencies</Link></li>
<li><Link href="#skills">Technical Skills</Link></li>
<li><Link href="#experience">Experience</Link></li>
<li><Link href="#contact">Contact</Link></li>
```

Replace the old availability copy in `Contact.tsx` with `Connect with me through email, phone, LinkedIn, or GitHub.`. Destructure `phone` with the other contact fields and render:

```tsx
<a
  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
  className={styles.secondaryButton}
>
  {phone}
</a>
```

Add this `secondaryButton` CSS, alongside the existing contact action styles:

```css
.secondaryButton {
  color: var(--secondary);
  font-size: 1.1rem;
  font-weight: 500;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.secondaryButton:hover {
  color: var(--accent);
  text-shadow: 0 0 10px var(--accent-glow);
}
```

- [ ] **Step 4: Verify all content-presentation tests pass**

Run `npm run test`.

Expected: PASS with five tests across the three test files.

- [ ] **Step 5: Commit the user-facing alignment**

```powershell
git add app/components/About.tsx app/components/Skills.tsx app/components/Experience.tsx app/components/Education.tsx app/components/Contact.tsx app/components/Contact.module.css app/components/Navbar.tsx tests/NavigationAndContact.test.tsx
git commit -m "feat(portfolio): align CV navigation and contact"
```

### Task 5: Verify the finished static portfolio

**Files:**

- Verify only: `app/**`, `tests/**`, `package.json`, `next.config.ts`

**Consumes:** all completed tasks.

**Produces:** verified tests, lint, static export, and responsive browser confirmation.

- [ ] **Step 1: Run every automated check**

```powershell
npm run test
npm run lint
npm run build
```

Expected: all tests pass, ESLint has zero errors, and Next.js creates `out/`.

- [ ] **Step 2: Validate the rendered portfolio in a browser**

Run `npm run dev -- --hostname 127.0.0.1 --port 3000` and verify that the hero, six numbered sections, six jobs, two education records, four contact channels, five navbar anchors, and twelve competency badges match the approved CV. Check both 320px and 900px widths for overflow.

- [ ] **Step 3: Review the final diff**

Run `git diff --check HEAD~4..HEAD` and `git status --short`.

Expected: no whitespace errors and no uncommitted implementation files. If a correction is needed, first add a failing regression test, then repeat its red-green cycle before committing the correction.
