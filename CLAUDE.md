# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The Austin Mesh website — `www.austinmesh.org`. Built with Astro + MDX, deployed as a fully static site to Cloudflare via Workers Static Assets (Workers Builds, not the legacy Pages product). Page content is authored in markdown/MDX across three content collections (`pages`, `projects`, and `faq`); the layout, head/OG tags, header, nav, and footer are centralized so adding a new page, project, or FAQ question is one markdown/MDX file.

Hard constraint to honor: **no client-side framework runtime**. The only client JS the build ships is (a) the ~30-line vanilla handler on `/search/` that calls Pagefind's JS API and renders results into matcha-native markup, and (b) the inline `onclick="document.getElementById('event').showModal()"` on the event-dialog trigger. Don't add React/Vue/Svelte hydration; don't add page-wide JS scripts.

## Common commands

- `npm run dev` — Astro dev server on http://localhost:4321
- `npm run build` — production build (includes `pagefind --site dist` postbuild for the search index)
- `npm run preview` — preview the built site locally
- `npx astro sync` — regenerate content-collection types after editing `src/content/config.ts`

## Architecture

- **Pages live in `src/content/pages/`** as `.mdx` files. Frontmatter is validated against the Zod schema in `src/content/config.ts` (`title`, `description` required; `ogImage`, `ogImageAlt`, `canonical`, `eventDialog`, `pagefind`, `publishedAt`, `lastVerified` optional). The URL is derived from the file path — `src/content/pages/about/meshcore-2-byte.mdx` → `/about/meshcore-2-byte/`. Top-level routes like `/devices/` come from `devices.mdx`.
- **Projects are a second collection** at `src/content/projects/` with its own schema (adds required `thumbnail` + `thumbnailAlt`, optional `author`). They have dedicated routes: `src/pages/projects/index.astro` renders the browse grid, and `src/pages/projects/[...slug].astro` renders each writeup. Per-project pages fall back to the thumbnail as the OG image when `ogImage` isn't set in frontmatter.
- **FAQ is a third collection** at `src/content/faq/<category>/<anchor>.md`, one file per question (frontmatter: required `question`, optional `order`). The folder picks the category and the filename is the deep-link anchor (`/faq/#<anchor>`), so links survive rewording a question or moving it between categories. `src/lib/faq.ts` holds the ordered `faqCategories` list (each `id` = folder name = category anchor) and `getFaqSections()`, which groups and sorts questions and fails the build on an unknown category folder, a duplicate anchor (across questions, categories, and the layout's `#event`), or a markdown heading inside an answer. `src/pages/faq.astro` renders the question index plus every answer expanded. Each question ends with an always-visible link icon (`src/assets/social/link.svg`, kept in a no-wrap span with the question's last word) so phone users can tap or long-press to copy the link; the icon has no `<title>` so it doesn't leak into Pagefind result titles. Pagefind indexes each question heading, so `/search/` links straight to `/faq/#<anchor>`.
- **Routing is a single catch-all** at `src/pages/[...slug].astro` that renders any entry in the pages collection through `BaseLayout`. Trailing-slash directory-style URLs are pinned via `trailingSlash: 'always'` and `build.format: 'directory'` in `astro.config.mjs`.
- **Stand-alone Astro pages** live in `src/pages/`: `faq.astro` (see FAQ above), `search.astro` (ships the ~30-line vanilla Pagefind handler — no `pagefind-ui.*` bundle, excluded from the sitemap), the `projects/` directory (uses BaseLayout but is not in the pages collection), and two calendar endpoints prerendered to static files: `events.ics.ts` (`/events.ics`, subscribable feed of all upcoming events) and `events/[id].ics.ts` (`/events/<discord-id>.ics`, one per event). See Discord event automation.
- **BaseLayout owns the `<head>`**: title, description, canonical, full OG/Twitter set, favicons, manifest, sitemap link. The default `og:image` is `src/assets/hero/austin-mesh-wildflower-center-large.webp`, processed through `getImage()` to produce a hashed, absolute URL. Pages override via `ogImage` in frontmatter. A `<meta name="robots" content="noindex, nofollow">` is conditionally emitted when `process.env.WORKERS_CI_BRANCH` is set to anything other than `main` (so Workers Builds preview deploys aren't indexed; see Deploy).
- **`pagefind` and `eventDialog` are opt-out per page** (defaults true). `pagefind: false` omits the `data-pagefind-body` attribute on `<main>` so the page isn't indexed (`privacy.mdx` uses this). `eventDialog: false` hides the meet button + modal (also `privacy.mdx`). The search page hard-codes `pagefind: false`.

## Working with content

- New page → one `.mdx` file under `src/content/pages/`. Required frontmatter is `title` + `description`. URL follows the path.
- New project writeup → one `.mdx` file under `src/content/projects/`. Required frontmatter is `title` + `description` + `thumbnail` + `thumbnailAlt` (optional `author`). The file appears automatically in the `/projects/` grid; no nav edit needed.
- New FAQ question → one `.md` file under `src/content/faq/<category>/`. The filename is the permanent anchor, so pick it carefully and don't rename it once the question is live (rewording `question:` is fine). Lower `order` sorts first; questions without one follow, alphabetically. Answers should be short with no markdown headings (the build rejects them); link out to a full page for anything long. New category → add `{ id, title }` to `faqCategories` in `src/lib/faq.ts` (array order = page order) and create the matching folder. Empty categories are hidden.
- Adding a page to the nav requires editing `src/components/Nav.astro` (the menu is hand-listed, not auto-generated).
- `lastVerified: YYYY-MM-DD` in frontmatter (pages or projects) renders a muted "Last verified <date>" line at the bottom of the page, just above the footer. It's a manual attestation that the content was checked for accuracy — update it when re-verifying a page, not on every edit. Omit it and no line renders. BaseLayout formats the date in UTC so it displays the literal date written in frontmatter.
- Images used in MDX must live under `src/assets/` and be imported as ES modules so Astro can fingerprint, resize, and emit `srcset` via `<Image>` from `astro:assets`. Don't reference `/images/...` from MDX — that path doesn't exist post-migration. Import depth: pages at `src/content/pages/*.mdx` use `../../assets/...`; pages one level deeper (`src/content/pages/about/*.mdx`, `src/content/pages/join/*.mdx`) use `../../../assets/...`.
- The wildflower-center hero pair lives at `src/assets/hero/` and the logo SVGs at `src/assets/logo/`. Everything else under `src/assets/` mirrors the old `/images/` layout.
- Anything that must keep an exact URL (favicons, manifest, `_redirects`) lives in `public/` and is copied byte-for-byte.

## Redirects

`public/_redirects` is read by Cloudflare Workers Static Assets (same syntax as the legacy Pages `_redirects`). It holds 301s for legacy URLs (old `/solar/`, `/coverage-map/` paths, plus pages that have since moved between collections — see the file for the current list). Add more in the same format. Hash fragments after the destination are resolved client-side after the 301.

## Discord event automation

`scripts/update-discord-event.sh` fetches every upcoming scheduled event (status `SCHEDULED`, minus any whose end time has already passed, since Discord can leave an unstarted event as `SCHEDULED`) from Discord and writes them, soonest first, to `src/data/events.json` as `{ "events": [...] }`. `src/components/EventDialog.astro` imports that JSON at build time and renders the header button + a `<dialog>` that lists each event (name, date, location, description, "RSVP on Discord" link). The build embeds the dialog markup into every page that doesn't set `eventDialog: false`.

The script requires `DISCORD_GUILD_ID` and `DISCORD_BOT_TOKEN` env vars, plus `jq`, `curl`, and `node` on PATH. It uses Node's `Intl.DateTimeFormat` (timezone `America/Chicago`) for the display strings, so it works identically on macOS and Linux. An empty `events` array produces a "No upcoming events" dialog. If Discord returns an error object instead of an array, or the Node step fails, the script exits non-zero without touching the JSON (it renders to a temp file first), so the workflow doesn't open a PR that wipes the list.

**Add to calendar.** `src/lib/events.ts` is the typed entry point to `events.json` (the component and both `.ics` endpoints import `events` from there, not the JSON directly) and holds the calendar helpers: the Google Calendar template URL, the `webcal://` / Google subscribe URLs for the feed, and a hand-rolled RFC 5545 `.ics` builder (UTC times, CRLF, TEXT escaping, 75-octet line folding) behind `icsResponse()`. Event UIDs are `<discord-id>-<start>@austinmesh.org`: recurring Discord events keep one id and move the start forward, so the start keeps each occurrence a separate calendar entry. End times come from Discord's `scheduled_end_time` (`endsAtIso`); when it's null (allowed for voice/stage events) or missing, `eventEnd()` falls back to start + 2h. Cloudflare serves the `.ics` files as `text/calendar; charset=utf-8` because wrangler sets each asset's content type from its file extension at upload, so no `_headers` entry is needed. The feed is only as fresh as the last deploy after the workflow below runs and its PR merges.

The GitHub Action `.github/workflows/update-discord-event.yml` runs daily at 10:17 UTC (`schedule`) and on demand (`workflow_dispatch`), and opens a PR via `peter-evans/create-pull-request` on the `update-discord-event-bot` branch. The script's output is deterministic, so days with no event changes produce no diff and no PR; when there are changes, the same PR is updated in place until someone merges it. Merging is what deploys the update. Diff is a single JSON file. (Note: GitHub auto-disables scheduled workflows in public repos after 60 days without repository activity.)

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
- Raw HTML works inside `.mdx`, including `<iframe>`, `<details>`/`<summary>`, `<aside>`, `<hgroup>`. The Grafana iframe on `/about/` is a notable example.
- The `<dialog>` opens via an inline `onclick` handler — this is intentional and the only client JS on non-search pages. Don't replace it with a script tag or hydration.
- `data-pagefind-ignore="all"` is set on `SiteHeader`, `Nav`, and `SiteFooter` so Pagefind uses each page's actual MDX `<h1>` as the result title (the event dialog's `<h1>` would otherwise win because it appears earlier in the DOM than `<main>`). Don't remove that attribute.
- The hero overlay forces `color: #fff` on `.hero-content` because matcha's light-mode `--default` is dark and would render dark-on-dark over the hero's dark `rgba(31,32,49,.8)` panel. Don't switch hero text to a CSS variable that inherits color-scheme without checking light mode.
- `main img:not(.hero-bg) { height: auto }` and `.partner-logos img { object-fit: contain }` in `src/styles/site.css` exist specifically because Astro `<Image>` emits explicit `width`/`height` attributes; without these rules, matcha's `article { display: flex }` and the `min-height: 70px` partner-logo rule would distort image aspect ratios.
