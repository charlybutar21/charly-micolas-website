# Editorial Portfolio Redesign — Design Specification

**Date:** 2026-08-16

## Goal

Redesign Charly Micolas Butarbutar's portfolio into an editorial, personal experience inspired by the typography, whitespace, and calm navigation of the user-provided Gillian Jack reference. The site must feel distinctive and authored, while remaining credible for a Senior Software Engineer.

This replaces the current dark glass-card single-page visual language. It keeps the CV-backed information already in the repository and does not display a phone number.

## Information architecture

The primary navigation uses real routes, rather than anchor links, to match the reading-oriented reference and make each topic easy to share and revisit.

| Navigation group | Menu item | Route | Purpose |
| --- | --- | --- | --- |
| Start here | Home | `/` | Short introduction and a clear entry point to the portfolio. |
| Start here | About | `/about` | Professional profile, education, and core competencies. |
| Practice | Technical Skills | `/technical-skills` | CV-backed capability index with visual technology logos. |
| Practice | Experiences | `/experiences` | Full career timeline with role, company, place, and outcomes. |
| Notes | Writing | `/writing` | Personal-writing index, initially containing one dummy post. |
| Connect | Contact | `/contact` | Email, LinkedIn, and GitHub only. |

The desktop navigation is a persistent left editorial rail with its group labels. At small viewports it becomes an accessible compact menu toggle, retains all routes, closes after selection, and indicates the current route with `aria-current`.

## Visual direction

- **Tone:** editorial personal journal, calm, intelligent, and deliberate—not a futuristic developer template.
- **Palette:** warm paper background, near-black ink, muted stone text and rules, with a restrained rust-red accent. Color has semantic purpose; there are no neon gradients or glass cards.
- **Typography:** oversized elegant serif display face for names and page titles; practical sans-serif for navigation, metadata, and body copy. Use the version-supported Next font approach or robust local fallbacks after checking installed documentation.
- **Layout:** generous negative space, fine divider lines, slightly asymmetric type composition, lightweight annotations, and long-form reading rhythm.
- **Motion:** only short opacity/translate transitions that respect `prefers-reduced-motion`; no autoplay, parallax, or distracting effects.
- **Accessibility:** visible keyboard focus, sufficient contrast, semantic headings, real links and buttons, descriptive icon labels, and a responsive layout without horizontal overflow.

## Page designs

### Home

- A minimal, mostly full-viewport introduction: name, a short engineering statement derived from the CV, and a small directional note inviting the visitor into the portfolio.
- Uses one strong typographic composition rather than a hero illustration or a generic CTA card.
- Keeps the navigation rail visible on desktop and provides a clear position indicator: `01 / Home`.

### About

- Presents the CV profile as a concise reading experience, then a visual-but-quiet index of core competencies.
- Education appears as a compact academic record near the end rather than an unrelated card grid.
- Uses only verified CV content; no invented achievements or metrics.

### Technical Skills

- A capability index grouped exactly by the existing CV taxonomy:
  - Languages
  - Frameworks & Libraries
  - Data & Messaging
  - Development & DevOps
  - Architecture & Engineering Practices
  - Project Management
- Each named technology with an available official/open icon is rendered as an accessible inline SVG sourced from `simple-icons`; the Java mark uses the Font Awesome Java SVG supplied through `react-icons` because Simple Icons does not provide a Java mark. Every icon is paired with its textual name, so no capability is encoded by color or a logo alone.
- Skills without a real product logo—such as System Design, Clean Code, SOLID Principles, Agile, Scrum, and Kanban—receive a consistent neutral practice mark/monogram instead of a made-up brand logo.
- The presentation is a ruled editorial index with irregular, breathable wrapping, not generic chip pills or a dense card wall.
- A mapping layer provides a safe fallback mark when a CV technology has no suitable Simple Icons entry.

### Experiences

- A chronological vertical timeline for the six CV positions.
- On desktop, dates form a narrow rail; the role, company, location, and selected CV responsibilities sit beside a continuous timeline rule.
- On mobile, the chronological order stays intact and the timeline rule moves to the left of the content.
- Current employment is clearly marked; descriptions remain factual CV-based bullets.

### Writing

- A minimal article index separate from Technical Skills.
- Includes one clearly marked dummy personal post: **“The quiet work behind reliable software”**. It is an illustrative placeholder draft, not claimed as an existing publication.
- The detail route contains a readable title, small metadata, and short placeholder body content that can later be replaced with real writing.

### Contact

- Minimal contact statement plus email, LinkedIn, and GitHub links.
- Omits the phone number and contains no `tel:` link.

## Data and component design

- Retain `app/data/index.ts` as the CV-derived single source of truth and extend it only where a writing record or icon mapping is needed.
- Remove the `phone` field from the rendered portfolio contact model to prevent accidental disclosure.
- Create shared components for the site shell/navigation, page intro, icon index, timeline, and writing previews. Routes should compose these components rather than duplicate layout logic.
- Preserve the original name, professional summary, skills, education, work history, email, LinkedIn, and GitHub supplied by the CV data.

## Verification plan

1. Update/add unit tests for navigation routes, the absence of telephone output, one dummy writing item, timeline entries, and branded/fallback skill-icon behavior.
2. Run `npm run test`, `npm run lint`, and `npm run build`.
3. Manually verify all six routes in a browser at desktop and 320px widths:
   - menu navigation and current-page state;
   - keyboard focus and menu behavior;
   - no horizontal overflow;
   - visible skill names alongside icons;
   - visible timeline order;
   - no rendered phone number or `tel:` link.

## Non-goals

- No CMS, authentication, contact form submission, analytics, or invented case-study metrics.
- No use of third-party logo artwork from unverified sources or remote image hotlinks.
- No cloning of the reference site's layout, content, or branding; only its high-level editorial principles inform this original implementation.
