# Charly Micolas Butarbutar — Portfolio

An editorial personal portfolio for a backend-focused Senior Software Engineer. It presents CV-backed experience, a visual technical toolkit, personal writing, and professional contact links without exposing a phone number.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Before the first browser test on a new machine, install Chromium with:

```bash
npx playwright install chromium
```

## Documentation

- [Architecture](docs/architecture.md) — project boundaries, rendering model, and route ownership.
- [Content management](docs/content-management.md) — where and how to update profile, skills, experience, and writing.
- [Development guide](docs/development.md) — quality commands, test layers, and deployment workflow.

## Main routes

- `/` — short introduction and career evidence
- `/about` — profile, competencies, and education
- `/technical-skills` — visual technology and engineering-practice index
- `/experiences` — six-role career timeline
- `/writing` — personal-writing index and static post routes
- `/contact` — email, LinkedIn, and GitHub

## Verification

```bash
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

GitHub Actions runs the same checks before deploying the static `out/` directory to cPanel via FTP on pushes to `main`.
