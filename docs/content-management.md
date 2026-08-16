# Content management

All public portfolio content is typed and stored in `app/data/`. Update those files rather than hard-coding personal information in components.

## Profile and contact

Edit `app/data/profile.ts` for the hero copy, About copy, competencies, education, email, LinkedIn, and GitHub URLs. The contact model deliberately has no telephone field; do not add or render a phone number unless the owner explicitly changes that privacy decision.

## Technical skills

Edit `app/data/skills.ts` to add, remove, or regroup skills. Each group has a `category` and an `items` array.

`app/lib/skill-icons.ts` controls the visual mark for each named skill:

- Add a Simple Icons or React Icons mapping for a recognised technology brand.
- Leave an unmapped engineering practice as a text-based practice mark.
- Keep the visible text label even when a brand logo exists; logos are supplementary, not the only way to identify a skill.

## Experience timeline

Edit `app/data/experience.ts`. Every entry uses two `highlights`, which remain immediately visible, plus optional `additionalResponsibilities`, which render inside a native “More responsibilities” disclosure. This keeps the timeline scannable while preserving the full CV content.

Keep the entries in reverse chronological order. Do not move presentation logic or ordering into `ExperienceTimeline.tsx`.

## Writing

Add a new object to `app/data/writing.ts`:

```ts
{
  slug: 'a-url-safe-title',
  title: 'Readable title',
  excerpt: 'One-sentence summary for the index and metadata.',
  publishedOn: '16 Aug 2026',
  readingTime: '5 min read',
  status: 'Published',
  body: ['First paragraph.', 'Second paragraph.'],
}
```

The Writing index, static post route, per-post metadata, and sitemap update automatically from this data. Use `Draft` for an unfinished post; the UI displays it as “Draft note.”

## After a content change

Run at least:

```bash
npm run format:check
npm run typecheck
npm run test
npm run build
```

When changing navigation or visual content behavior, also run `npm run test:e2e`.
