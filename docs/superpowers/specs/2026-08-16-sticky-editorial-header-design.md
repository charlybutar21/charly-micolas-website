# Sticky Editorial Header and Compact Page Layout

**Date:** 2026-08-16  
**Status:** Approved for planning  
**Scope:** Portfolio navigation, brand mark, social links, and the About, Technical Skills, and Contact page layouts.

## Intent

Replace the current side-rail navigation with a compact, permanent top-level navigation. The result should make every primary section easy to discover, preserve an editorial portfolio character, and give the content noticeably more room on desktop screens.

The design must feel intentional and calm: strong typography, restrained decoration, clear interactive states, and no visual grouping that makes the navigation feel like an internal tool.

## Information Architecture

The primary navigation is a single, ungrouped sequence in this exact order:

1. Home (`/`)
2. About (`/about`)
3. Technical Skills (`/technical-skills`)
4. Experiences (`/experiences`)
5. Writing (`/writing`)
6. Contact (`/contact`)

Remove all group labels and related conceptual groupings, including “Start here”, “Practice”, “Notes”, and “Connect”.

## Header

### Desktop

- A sticky header is shown at the top of every route.
- It uses a single row with a height of approximately 72 px, a subtle bottom rule, and an opaque paper-coloured background so page content never competes with navigation while scrolling.
- The left area contains a clickable CMB serif monogram rendered as a compact, code-native SVG brand mark. It links to Home and replaces the textual `C.M.B.` treatment.
- The central area contains all six navigation links in a single ungrouped row.
- The current route is conveyed with a high-contrast, non-colour-only active treatment such as an underline and typographic change.
- The right area contains only two icon buttons: LinkedIn and GitHub. Each opens the existing external profile in a new tab and has an accessible name.

### Mobile and small screens

- The header remains sticky.
- The brand mark remains visible at the start of the row.
- Primary links remain directly available as one horizontal, touch-scrollable navigation strip rather than moving into a hamburger menu. This preserves the user requirement that the navigation remains visible.
- Social profile icons remain usable without reducing link hit areas below an accessible touch target. If space is constrained, the navigation strip receives priority and the icon region moves to a compact secondary alignment within the same sticky header.
- The header must not create horizontal document overflow.

## Brand Mark

- Implement an elegant CMB serif monogram as SVG rather than a raster asset. This follows the supplied “Elegant CMB Serif Monogram” reference while keeping it sharp, small, and maintainable.
- Treat the component as an explicit brand/logo slot: it must accept a future image or SVG asset without requiring navigation markup to change.
- The decorative visible mark is hidden from assistive technology; the enclosing Home link supplies the meaningful label.

## Page Density and Layout

### About

- Use a desktop two-column composition with the introductory narrative as the primary left column and concise credentials (competencies and education) as the supporting right column.
- Keep the existing content, but reduce vertical gaps and avoid a long serial stack.
- On narrow screens, collapse to one readable column without shrinking body text beyond the current accessibility baseline.

### Technical Skills

- Keep skills visual and grouped by meaningful capability categories.
- Tighten each skill group into a responsive grid so users scan logos and labels with less vertical travel.
- Preserve clear text labels and current accessible names; logos are supporting visual cues, not the only means of identification.

### Contact

- Fit the contact proposition, prominent email address, and icon-only social links within one desktop viewport in ordinary laptop sizes whenever the viewport height permits.
- Retain the email as the primary call to action; do not display a phone number.
- Icon buttons expose visible focus states, tooltips or equivalent labels on hover where useful, and accessible names for screen readers.

## Typography, Spacing, and Interaction

- Establish a shared top offset so all route content begins beneath the sticky header with consistent breathing room.
- Use a restrained typographic scale: display text stays expressive, navigation stays compact and highly legible, and support labels use the existing mono face sparingly.
- Use fluid spacing with sensible minimums and maximums. Avoid large empty vertical regions created by the former side-rail composition.
- Maintain visible keyboard focus states, sufficient colour contrast, and `aria-current="page"` for the active route.
- Respect reduced-motion preferences; do not introduce mandatory or disorienting animation.

## Acceptance Criteria

- [ ] No side navigation or navigation group labels remain.
- [ ] Every page has a sticky top navigation containing Home, About, Technical Skills, Experiences, Writing, and Contact.
- [ ] The CMB textual wordmark is replaced by a clickable visual brand-mark component.
- [ ] LinkedIn and GitHub are presented as accessible icon-only links.
- [ ] About, Technical Skills, and Contact require materially less desktop scrolling without hiding or reducing content readability.
- [ ] Header and content remain usable at desktop and mobile viewport sizes without horizontal document overflow.
- [ ] Route navigation, keyboard focus, active-route semantics, linting, type checking, unit tests, end-to-end navigation tests, accessibility checks, formatting, and production build pass.
