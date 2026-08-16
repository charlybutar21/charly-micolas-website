# CV Content Alignment Design

## Goal

Make the public portfolio accurately reflect the approved 2026 CV while retaining the current one-page, glassmorphic visual design and static Next.js architecture.

## Scope

- Replace all existing profile, skills, experience, education, and contact values with the approved Google Doc content.
- Preserve the existing single-page layout, section navigation, styling system, and outbound contact links.
- Add a dedicated **Core Competencies** section between the professional summary and technical skills.
- Add the CV phone number as a contact method.
- Remove content that conflicts with, or is absent from, the approved CV.

## Content Mapping

| CV source | Portfolio destination |
| --- | --- |
| Name and senior backend-engineering title | Hero |
| Professional Summary | Summary section (replaces About Me) |
| Core Competencies | New dedicated section |
| Technical Skills categories | Technical Skills section |
| Professional Experience | Experience cards, newest first |
| Education | Education cards |
| Email, phone, LinkedIn, GitHub | Contact section |

## Implementation Shape

`app/data/index.ts` remains the single source of content. Its typed portfolio model will gain `coreCompetencies` and `phone` fields. Existing components will continue to render arrays from that model; a small `CoreCompetencies` component will render competency badges using the established CSS-module and glass-card conventions. The navigation labels and numbered section headings will be updated to reflect the new sequence.

No CMS, API, server logic, or visual redesign is required.

## Behaviour and Validation

- Every user-facing CV claim comes from the approved document.
- The navigation anchors resolve to their matching sections.
- The phone link uses `tel:` and email uses `mailto:`.
- Existing responsive layouts remain intact for mobile and desktop.
- The production build succeeds with the portfolio's intended Next.js toolchain after the separate Vite/Next working-tree conflict is resolved.

## Explicitly Out of Scope

- Rebuilding the site as a new resume layout.
- Adding project case studies, a CMS, analytics, forms, or backend services.
- Changing the visual theme beyond the new section and content-length adjustments needed for readability.
