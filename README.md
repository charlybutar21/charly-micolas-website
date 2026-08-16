# Charly Micolas Butarbutar — Portfolio

An editorial personal portfolio for Charly Micolas Butarbutar, a backend-focused Senior Software Engineer. The site presents an introduction, CV-backed profile and skills, career timeline, a small Writing area, and contact links without exposing a phone number.

## Routes

- `/` — short introduction
- `/about` — profile, core competencies, and education
- `/technical-skills` — visual technology and engineering-practice index
- `/experiences` — six-role career timeline
- `/writing` — personal-writing index with one placeholder draft
- `/contact` — email, LinkedIn, and GitHub

## Development

This project uses Next.js 16, TypeScript, CSS Modules, and a static export configuration.

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```

The CV-derived content is maintained in `app/data/index.ts`. Add a new writing post there to have it appear in the Writing index, generate its static detail route, and enter the sitemap.

## Deployment

The GitHub Actions workflow validates lint and build output for pull requests, then deploys the static `out/` directory to cPanel via FTP after changes land on `main`. Configure `FTP_SERVER`, `FTP_USERNAME`, and `FTP_PASSWORD` as repository secrets before enabling deployment.
