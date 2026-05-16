# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The Austin Mesh website — `www.austinmesh.org`. Built with Astro + MDX, deployed as a fully static site to Cloudflare Pages. Page content is authored in markdown/MDX under a single `pages` content collection; the layout, head/OG tags, header, nav, and footer are centralized so adding a new page is one MDX file.

Hard constraint to honor: **no client-side framework runtime**. The only client JS the build ships is (a) Pagefind on `/search/`, and (b) the inline `onclick="document.getElementById('event').showModal()"` on the event-dialog trigger. Don't add React/Vue/Svelte hydration; don't add page-wide JS scripts.

## Common commands

- `npm run dev` — Astro dev server on http://localhost:4321
- `npm run build` — production build (includes `pagefind --site dist` postbuild for the search index)
- `npm run preview` — preview the built site locally
- `npx astro sync` — regenerate content-collection types after editing `src/content/config.ts`

## Architecture

- **Pages live in `src/content/pages/`** as `.mdx` files. Frontmatter is validated against the Zod schema in `src/content/config.ts` (`title`, `description` required; `ogImage`, `ogImageAlt`, `canonical`, `eventDialog`, `pagefind`, `publishedAt` optional). The URL is derived from the file path — `src/content/pages/learn/meshcore-2-byte.mdx` → `/learn/meshcore-2-byte/`. Top-level routes like `/devices/` come from `devices.mdx`.
- **Routing is a single catch-all** at `src/pages/[...slug].astro` that renders any entry in the pages collection through `BaseLayout`. Trailing-slash directory-style URLs are pinned via `trailingSlash: 'always'` and `build.format: 'directory'` in `astro.config.mjs`.
- **One exception page**: `src/pages/search.astro` is a stand-alone Astro page (not in the collection) because it ships Pagefind UI client JS. It's excluded from the sitemap.
- **BaseLayout owns the `<head>`**: title, description, canonical, full OG/Twitter set, favicons, manifest, sitemap link. The default `og:image` is `src/assets/hero/austin-mesh-wildflower-center-large.webp`, processed through `getImage()` to produce a hashed, absolute URL. Pages override via `ogImage` in frontmatter.
- **`pagefind` and `eventDialog` are opt-out per page** (defaults true). `pagefind: false` omits the `data-pagefind-body` attribute on `<main>` so the page isn't indexed (`privacy.mdx` uses this). `eventDialog: false` hides the meet button + modal (also `privacy.mdx`). The search page hard-codes `pagefind: false`.

## Working with content

- New page → one `.mdx` file under `src/content/pages/`. Required frontmatter is `title` + `description`. URL follows the path.
- Adding it to the nav requires editing `src/components/Nav.astro` (the menu is hand-listed, not auto-generated).
- Images used in MDX must live under `src/assets/` and be imported as ES modules so Astro can fingerprint, resize, and emit `srcset` via `<Image>` from `astro:assets`. Don't reference `/images/...` from MDX — that path doesn't exist post-migration. Import depth: pages at `src/content/pages/*.mdx` use `../../assets/...`; pages one level deeper (`src/content/pages/learn/*.mdx`, `src/content/pages/join/*.mdx`) use `../../../assets/...`.
- The wildflower-center hero pair lives at `src/assets/hero/` and the logo SVGs at `src/assets/logo/`. Everything else under `src/assets/` mirrors the old `/images/` layout.
- Anything that must keep an exact URL (favicons, manifest, `_redirects`) lives in `public/` and is copied byte-for-byte.

## Redirects

`public/_redirects` is read by Cloudflare Pages. Today it 301s `/faq/`, `/solar/`, and `/coverage-map/` to existing pages. Add more in the same format. Hash fragments after the destination are resolved client-side after the 301.

## Discord event automation

`scripts/update-discord-event.sh` fetches the next upcoming scheduled event from Discord and writes a single `src/data/event.json`. `src/components/EventDialog.astro` imports that JSON at build time and renders the header button + `<dialog>`. The build embeds the dialog markup into every page that doesn't set `eventDialog: false`.

The script requires `DISCORD_GUILD_ID` and `DISCORD_BOT_TOKEN` env vars, plus `jq`, `curl`, and `node` on PATH. It uses Node's `Intl.DateTimeFormat` (timezone `America/Chicago`) for the display strings, so it works identically on macOS and Linux. The JSON's `hasEvent: false` branch produces a "No upcoming events" dialog.

The GitHub Action `.github/workflows/update-discord-event.yml` runs on `workflow_dispatch` only and opens a PR via `peter-evans/create-pull-request` on the `update-discord-event-bot` branch. Diff is now a single JSON file.

## Deploy

Cloudflare Pages builds with `npm run build` and serves `dist/` directly. No adapter is configured — every page is prerendered. `site: 'https://www.austinmesh.org'` in `astro.config.mjs` is what the sitemap and OG absolute URLs are built against.

## Gotchas

- After editing `src/content/config.ts`, run `npx astro sync` so the TypeScript types for `getCollection('pages')` regenerate.
- Raw HTML works inside `.mdx`, including `<iframe>`, `<details>`/`<summary>`, `<aside>`, `<hgroup>`. The Grafana iframe on `/learn/` is a notable example.
- The `<dialog>` opens via an inline `onclick` handler — this is intentional and the only client JS on non-search pages. Don't replace it with a script tag or hydration.
- Pagefind's "Default UI" works but is on a deprecation path; if you upgrade the search experience, prefer Pagefind's Component UI per its `pagefind.app` docs.
