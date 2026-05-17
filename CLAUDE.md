# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The Austin Mesh website — `www.austinmesh.org`. Built with Astro + MDX, deployed as a fully static site to Cloudflare via Workers Static Assets (Workers Builds, not the legacy Pages product). Page content is authored in markdown/MDX across two content collections (`pages` and `projects`); the layout, head/OG tags, header, nav, and footer are centralized so adding a new page or project is one MDX file.

Hard constraint to honor: **no client-side framework runtime**. The only client JS the build ships is (a) the ~30-line vanilla handler on `/search/` that calls Pagefind's JS API and renders results into matcha-native markup, and (b) the inline `onclick="document.getElementById('event').showModal()"` on the event-dialog trigger. Don't add React/Vue/Svelte hydration; don't add page-wide JS scripts.

## Common commands

- `npm run dev` — Astro dev server on http://localhost:4321
- `npm run build` — production build (includes `pagefind --site dist` postbuild for the search index)
- `npm run preview` — preview the built site locally
- `npx astro sync` — regenerate content-collection types after editing `src/content/config.ts`

## Architecture

- **Pages live in `src/content/pages/`** as `.mdx` files. Frontmatter is validated against the Zod schema in `src/content/config.ts` (`title`, `description` required; `ogImage`, `ogImageAlt`, `canonical`, `eventDialog`, `pagefind`, `publishedAt` optional). The URL is derived from the file path — `src/content/pages/learn/meshcore-2-byte.mdx` → `/learn/meshcore-2-byte/`. Top-level routes like `/devices/` come from `devices.mdx`.
- **Projects are a second collection** at `src/content/projects/` with its own schema (adds required `thumbnail` + `thumbnailAlt`, optional `author`). They have dedicated routes: `src/pages/projects/index.astro` renders the browse grid, and `src/pages/projects/[...slug].astro` renders each writeup. Per-project pages fall back to the thumbnail as the OG image when `ogImage` isn't set in frontmatter.
- **Routing is a single catch-all** at `src/pages/[...slug].astro` that renders any entry in the pages collection through `BaseLayout`. Trailing-slash directory-style URLs are pinned via `trailingSlash: 'always'` and `build.format: 'directory'` in `astro.config.mjs`.
- **Stand-alone Astro pages** live in `src/pages/`: `search.astro` (ships the ~30-line vanilla Pagefind handler — no `pagefind-ui.*` bundle, excluded from the sitemap) and the `projects/` directory (uses BaseLayout but is not in the pages collection).
- **BaseLayout owns the `<head>`**: title, description, canonical, full OG/Twitter set, favicons, manifest, sitemap link. The default `og:image` is `src/assets/hero/austin-mesh-wildflower-center-large.webp`, processed through `getImage()` to produce a hashed, absolute URL. Pages override via `ogImage` in frontmatter. A `<meta name="robots" content="noindex, nofollow">` is conditionally emitted when `process.env.WORKERS_CI_BRANCH` is set to anything other than `main` (so Workers Builds preview deploys aren't indexed; see Deploy).
- **`pagefind` and `eventDialog` are opt-out per page** (defaults true). `pagefind: false` omits the `data-pagefind-body` attribute on `<main>` so the page isn't indexed (`privacy.mdx` uses this). `eventDialog: false` hides the meet button + modal (also `privacy.mdx`). The search page hard-codes `pagefind: false`.

## Working with content

- New page → one `.mdx` file under `src/content/pages/`. Required frontmatter is `title` + `description`. URL follows the path.
- New project writeup → one `.mdx` file under `src/content/projects/`. Required frontmatter is `title` + `description` + `thumbnail` + `thumbnailAlt` (optional `author`). The file appears automatically in the `/projects/` grid; no nav edit needed.
- Adding a page to the nav requires editing `src/components/Nav.astro` (the menu is hand-listed, not auto-generated).
- Images used in MDX must live under `src/assets/` and be imported as ES modules so Astro can fingerprint, resize, and emit `srcset` via `<Image>` from `astro:assets`. Don't reference `/images/...` from MDX — that path doesn't exist post-migration. Import depth: pages at `src/content/pages/*.mdx` use `../../assets/...`; pages one level deeper (`src/content/pages/learn/*.mdx`, `src/content/pages/join/*.mdx`) use `../../../assets/...`.
- The wildflower-center hero pair lives at `src/assets/hero/` and the logo SVGs at `src/assets/logo/`. Everything else under `src/assets/` mirrors the old `/images/` layout.
- Anything that must keep an exact URL (favicons, manifest, `_redirects`) lives in `public/` and is copied byte-for-byte.

## Redirects

`public/_redirects` is read by Cloudflare Workers Static Assets (same syntax as the legacy Pages `_redirects`). It holds 301s for legacy URLs (old `/faq/`, `/solar/`, `/coverage-map/` paths, plus pages that have since moved between collections — see the file for the current list). Add more in the same format. Hash fragments after the destination are resolved client-side after the 301.

## Discord event automation

`scripts/update-discord-event.sh` fetches the next upcoming scheduled event from Discord and writes a single `src/data/event.json`. `src/components/EventDialog.astro` imports that JSON at build time and renders the header button + `<dialog>`. The build embeds the dialog markup into every page that doesn't set `eventDialog: false`.

The script requires `DISCORD_GUILD_ID` and `DISCORD_BOT_TOKEN` env vars, plus `jq`, `curl`, and `node` on PATH. It uses Node's `Intl.DateTimeFormat` (timezone `America/Chicago`) for the display strings, so it works identically on macOS and Linux. The JSON's `hasEvent: false` branch produces a "No upcoming events" dialog.

The GitHub Action `.github/workflows/update-discord-event.yml` runs on `workflow_dispatch` only and opens a PR via `peter-evans/create-pull-request` on the `update-discord-event-bot` branch. Diff is now a single JSON file.

## Deploy

Production lives on Cloudflare Workers Static Assets. `wrangler.jsonc` declares the `assets.directory` as `./dist` and `not_found_handling` as `404-page`; `name` must match the Cloudflare project slug or wrangler will create a duplicate project on the next deploy.

Workers Builds runs on every push to the repo:
- **Build command:** `npm run build` (Astro + Pagefind postbuild)
- **Deploy command (production / main):** `npx wrangler deploy`
- **Non-production branch deploy command:** `npx wrangler versions upload` (creates a Version with a preview URL; doesn't promote to prod)
- **Path:** blank (build runs from repo root)
- **Env var:** `NODE_VERSION=24` (Node 24 is current LTS; also pinned via `.nvmrc` and `engines.node` in `package.json`)

These four fields are stored at the project level in Cloudflare's backend, not in the repo — they have to be changed in the dashboard. No Astro adapter is installed; every page is prerendered. `site: 'https://www.austinmesh.org'` in `astro.config.mjs` is what the sitemap and OG absolute URLs are built against. DNS for `austinmesh.org` is on Cloudflare's nameservers, which is what makes the Workers Custom Domain for `www.austinmesh.org` possible.

Two local convenience scripts mirror what CI runs: `npm run deploy` (build + `wrangler deploy`) and `npm run deploy:preview` (build + `wrangler versions upload`).

**Preview deploys are noindexed.** BaseLayout reads `process.env.WORKERS_CI_BRANCH` at build time; anything other than `main` (or unset, for local builds) emits a `<meta name="robots" content="noindex, nofollow">`. The env var name comes from Cloudflare Workers Builds and has shifted historically (was `CF_PAGES_BRANCH` under Pages) — if a preview deploy shows up in search results, view-source on the preview URL and confirm the meta is present; if not, the env var name has likely changed and `src/layouts/BaseLayout.astro` needs updating.

## Gotchas

- After editing `src/content/config.ts`, run `npx astro sync` so the TypeScript types for `getCollection('pages')` regenerate.
- Raw HTML works inside `.mdx`, including `<iframe>`, `<details>`/`<summary>`, `<aside>`, `<hgroup>`. The Grafana iframe on `/learn/` is a notable example.
- The `<dialog>` opens via an inline `onclick` handler — this is intentional and the only client JS on non-search pages. Don't replace it with a script tag or hydration.
- `data-pagefind-ignore="all"` is set on `SiteHeader`, `Nav`, and `SiteFooter` so Pagefind uses each page's actual MDX `<h1>` as the result title (the event dialog's `<h1>` would otherwise win because it appears earlier in the DOM than `<main>`). Don't remove that attribute.
- The hero overlay forces `color: #fff` on `.hero-content` because matcha's light-mode `--default` is dark and would render dark-on-dark over the hero's dark `rgba(31,32,49,.8)` panel. Don't switch hero text to a CSS variable that inherits color-scheme without checking light mode.
- `main img:not(.hero-bg) { height: auto }` and `.partner-logos img { object-fit: contain }` in `src/styles/site.css` exist specifically because Astro `<Image>` emits explicit `width`/`height` attributes; without these rules, matcha's `article { display: flex }` and the `min-height: 70px` partner-logo rule would distort image aspect ratios.
