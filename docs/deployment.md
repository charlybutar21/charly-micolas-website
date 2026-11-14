# Cloudflare Pages deployment

This Next.js project exports static HTML, JavaScript, CSS, and assets to `out/`. Production does not need a Node.js server, Docker, a database, or Pages Functions.

## Project settings

Connect `charlybutar21/charly-micolas-website` using the Cloudflare Pages GitHub integration, scoped to this repository.

| Setting                | Value                                 |
| ---------------------- | ------------------------------------- |
| Production branch      | `main`                                |
| Framework preset       | Next.js (Static HTML Export)          |
| Root directory         | Repository root                       |
| Build command          | `npm run build`                       |
| Build output directory | `out`                                 |
| Node.js version        | `22` (also pinned in `.node-version`) |

Enable automatic production deployments and preview deployments. Every push or merge to `main` publishes production after a successful Pages build. Other branches and pull requests produce previews. Local changes must be committed and pushed before deployment occurs.

GitHub Actions runs formatting, type checking, linting, unit tests, browser tests, and a production build independently. Pages does not wait for that workflow; review its checks before merging a pull request. A failed Pages build leaves the previous successful deployment serving traffic.

## Domain setup

1. Validate the initial deployment using the project URL provided by Cloudflare (`<project>.pages.dev`).
2. Add `www.charlymicolas.com` in Pages > Custom domains before changing DNS. Follow the project's displayed CNAME target.
3. To serve the apex `charlymicolas.com` through Pages as well, add the domain as a Cloudflare DNS zone, preserve existing mail/verification records, and set the assigned nameservers at the registrar. Keep domain registration and renewal at the existing registrar.
4. Configure a Cloudflare Redirect Rule for requests whose hostname is exactly `charlymicolas.com`, redirecting to `https://www.charlymicolas.com` with the same path, HTTP 301, and query-string preservation enabled. Keep the apex DNS record proxied. Domain-level redirects belong in Cloudflare Rules, not Pages' `_redirects` file.
5. Wait for custom domains and certificates to become active. Verify HTTPS, redirects, direct route loads, and static assets before retiring the old hosting.

The canonical metadata, sitemap, and robots URL use `https://www.charlymicolas.com`. Do not add a catch-all SPA rewrite: the export includes individual HTML pages and a genuine `404.html`.

If the previous hosting provides email or DNS, migrate those services before cancellation. Preserve MX, SPF, DKIM, DMARC, and verification records as applicable; do not assume old hosting cancellation only affects the website.

## Validation and rollback

- Check `/`, `/about`, `/technical-skills`, `/experiences`, `/writing`, a writing post, and `/contact` by navigating directly and refreshing.
- Check images, styles, navigation, `/sitemap.xml`, `/robots.txt`, and an unknown path returning HTTP 404.
- Verify apex redirects preserve the path and query string and lead to the canonical HTTPS `www` origin without a redirect loop.
- Match the production deployment commit to the latest intended `main` commit in Cloudflare.
- For an application regression, use Cloudflare Pages' rollback action on a previous successful production deployment, then revert the offending commit before the next push.
- During initial DNS migration, retain the previous DNS values and a backup of any available old hosting files. Restore those DNS values only if the old host is still available.

## References

- [Next.js static export on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
