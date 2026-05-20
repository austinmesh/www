# Home page: animated mesh hero — design spec

**Date:** 2026-05-20
**Scope:** Rewrite the home page hero (`src/components/Hero.astro`) to replace its static Wildflower Center photograph with a self-contained CSS+SVG animation depicting packet propagation across a small mesh network. The two sections below the hero (`## Dive in`, `## Community partners`) are not touched. No client-side JavaScript is added.

---

## 1. Overview

The current home page hero shows a photograph of someone holding a Meshtastic communicator at the Lady Bird Johnson Wildflower Center. The photograph is replaced with an inline animated SVG: 11 nodes connected by 10 active edges (plus 4 ambient "redundancy" edges), with 10 packet animations that propagate one message outward from a southwest origin node through a central hub, branching to multiple distinct destinations across the canvas. One late "backward" packet (NE corner → north-of-center destination) demonstrates that the mesh is bidirectional and routes are non-obvious.

The animation runs in a single 8-second cycle with `animation-iteration-count: infinite`. It is pure CSS — `offset-path`, `transform: scale()`, `filter: drop-shadow()`, and keyframe `opacity` — and ships no JavaScript, in keeping with `CLAUDE.md`'s "no client-side framework runtime" rule.

The headline structure is reorganized: the H1 `# Austin Mesh` that currently sits above the hero in `index.mdx` moves *inside* the hero. The "We're building a free text messaging network in Austin" tagline becomes the H2 directly below it. The two CTAs (`Join the network`, `About us`) keep their existing destinations and styling.

## 2. File changes

| Path | Change |
|------|--------|
| `src/components/Hero.astro` | Full rewrite. Removes `alt` prop and photo import. Adds inline SVG markup + a scoped `<style>` block containing all animation CSS (~250 lines of keyframes). |
| `src/content/pages/index.mdx` | Remove the top-level markdown `# Austin Mesh` line. Inside the `<Hero>` slot, add `<h1 id="hero-title">Austin Mesh</h1>` as the first child; keep the existing `<h2>` tagline and both CTA links as the remaining children. |
| `src/styles/site.css` | Remove `.hero`, `.hero-bg`, `.hero-content`, `.hero-content a`, `.hero-content a + a`, and the matching `@media (min-width: 720px) .hero-content` block. Their replacements live in the scoped Astro style block. |
| `src/assets/hero/austin-mesh-wildflower-center-large.webp` | **Unchanged on disk.** Still imported by `src/layouts/BaseLayout.astro` as the default `og:image`. The home page no longer references it directly. |

### Architectural choice: scoped styles vs. external CSS

The animation CSS lives in the Astro `<style>` block at the bottom of `Hero.astro` rather than in a new `src/styles/hero.css` or appended to `site.css`. Three reasons:

1. **Cost only where used.** Astro scoped styles are extracted into the rendered page's `<head>` only when the component is present. The animation styles are home-page-only; emitting them on `/learn/`, `/devices/`, etc. would be waste.
2. **Single-file edit cost.** Tuning a timing offset means editing one file, not two.
3. **Precedent fit.** `src/styles/nav.css` is appropriately external because `<Nav>` renders on every page; the same logic argues *against* externalizing this case.

## 3. SVG structure

### Container

```html
<section class="hero" aria-labelledby="hero-title">
  <svg viewBox="0 0 600 220" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    ...
  </svg>
  <div class="hero-content">
    <h1 id="hero-title">Austin Mesh</h1>
    <h2>We're building a free text messaging network in Austin</h2>
    <a class="success" href="/join/">Join the network</a>
    <a class="default" href="/learn/">About us</a>
  </div>
</section>
```

`aria-labelledby` points at the H1 *inside* the hero, so the section is labelled by its own heading (cleaner than the previous `alt`-prop pattern).

The SVG is `aria-hidden="true"` — purely decorative. No `<title>`, no `role`.

### SVG layers (DOM order, back to front)

1. **Active edges** — 10 `<line class="edge">` elements with `stroke-opacity: 0.30`.
2. **Redundancy edges** — 4 `<line class="edge-2">` elements with `stroke-opacity: 0.18`. Not animated; their presence implies the mesh has more routes than this one transmission uses.
3. **Nodes** — 11 `<circle class="node n-{id}">` elements, `r="4"`, `fill: #67EA94`. Each carries a class wiring it to a specific receive-time keyframe.
4. **Packets** — 10 `<circle class="pkt p-{from}-{to}">` elements, `r="3"`, `fill: #fff`, with `filter: drop-shadow(0 0 4px #67EA94)`. Each gets an `offset-path` of the form `path('M x1 y1 L x2 y2')` and is wired to a packet-leg keyframe.

### Node positions and arrival times

All coordinates use the 600×220 viewBox. "Arrival" is the moment that node's keyframe pulses bright, expressed as a percentage of the 8-second cycle.

| ID | Coords | Role | Arrival % | Arrival (s) |
|----|--------|------|-----------|-------------|
| `origin` | (80, 158) | SW origin (sender) | 0% | 0.00s |
| `hub` | (172, 95) | central relay | 12.5% | 1.00s |
| `ns` | (195, 178) | south-near branch | 21% | 1.68s |
| `rn` | (245, 50) | north relay | 22% | 1.76s |
| `re` | (300, 135) | east relay | 23% | 1.84s |
| `nse` | (335, 167) | SE relay (final) | 31% | 2.48s |
| `dne` | (430, 88) | NE destination | 32% | 2.56s |
| `dse` | (368, 195) | SE destination (final) | 32.5% | 2.60s |
| `de` | (488, 165) | east destination (final) | 34% | 2.72s |
| `nne` | (510, 55) | NE corner | 42% | 3.36s |
| `dfn` | (380, 30) | far-north destination | 55% | 4.40s |

The `dfn` node receives the packet via the late `nne → dfn` leg, whose path runs east-to-west (510→380 on the x-axis). This is the "backward" beat that demonstrates mesh routing flexibility.

### Active edges (and packet legs)

| From | To | Path | Leg keyframe |
|------|----|------|--------------|
| origin | hub | `M 80 158 L 172 95` | `pk-0-12` (0% → 12.5%) |
| hub | rn | `M 172 95 L 245 50` | `pk-12-22` (12.5% → 22%) |
| hub | re | `M 172 95 L 300 135` | `pk-12-23` (12.5% → 23%) |
| hub | ns | `M 172 95 L 195 178` | `pk-12-21` (12.5% → 21%) |
| rn | dne | `M 245 50 L 430 88` | `pk-22-32` (22% → 32%) |
| re | de | `M 300 135 L 488 165` | `pk-23-34` (23% → 34%) |
| re | nse | `M 300 135 L 335 167` | `pk-23-31` (23% → 31%) |
| ns | dse | `M 195 178 L 368 195` | `pk-21-325` (21% → 32.5%) |
| dne | nne | `M 430 88 L 510 55` | `pk-32-42` (32% → 42%) |
| nne | dfn | `M 510 55 L 380 30` | `pk-42-55` (42% → 55%) — backward |

### Redundancy edges (static, no animation)

`rn ↔ dfn`, `de ↔ dse`, `nse ↔ de`, `dne ↔ de`. These imply additional mesh paths that aren't used in this specific transmission.

### Why coordinates are hard-coded

The composition is visual content, not data. There is no scenario where the node positions, edges, or timings would be generated dynamically — they are a deliberate piece of designed work. Hard-coding the SVG markup and CSS keeps the file self-documenting and avoids a templating layer that buys nothing.

## 4. Animation timeline

### Cycle: 8 seconds, infinite loop, shared timing

All packet and node animations declare `animation: <keyframe> 8s linear infinite`. There are zero uses of `animation-delay` — start times are baked into keyframe percentages — so the animations stay in lockstep across browsers.

### Packet keyframe pattern

Each packet is invisible before its leg starts, becomes visible at start, traverses `offset-distance: 0% → 100%` over the leg, then snaps invisible. Example for a leg active during 22%–32% of the cycle:

```css
@keyframes pk-22-32 {
  0%, 21.9%   { opacity: 0; offset-distance: 0%; }
  22%         { opacity: 1; offset-distance: 0%; }
  32%         { opacity: 1; offset-distance: 100%; }
  32.5%       { opacity: 0; offset-distance: 100%; }
  100%        { opacity: 0; offset-distance: 100%; }
}
```

The 0.5% trailing fade prevents the packet from visually merging with the next leg's packet at the receiving node.

### Node-receive keyframe pattern

Each node is dim (scale 1, no shadow) before its arrival time, briefly bright (scale 2, 10px shadow) at arrival, then sustains a moderate glow (scale 1.4, 5px shadow) until 95% of the cycle, then snaps back to default for the reset. Example for a node receiving at 22%:

```css
@keyframes n-recv-22 {
  0%, 21%       { transform: scale(1);   filter: none; }
  22%           { transform: scale(2);   filter: drop-shadow(0 0 10px #67EA94); }
  24%, 95%      { transform: scale(1.4); filter: drop-shadow(0 0 5px #67EA94); }
  100%          { transform: scale(1);   filter: none; }
}
```

Effect: from `t≈4.5s` to `t≈7.6s`, all 11 nodes are visibly lit — "the message reached the whole mesh." Then a soft global fade and a new packet launches.

### Transform origin

Every animated `<circle>` carries `transform-box: fill-box; transform-origin: center;` so `scale()` operates around the circle's own center, not the SVG origin.

## 5. Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .hero .pkt { display: none; }
  .hero .node {
    transform: scale(1.4);
    filter: drop-shadow(0 0 5px #67EA94);
    animation: none;
  }
}
```

Packets disappear; nodes freeze in the moderate-glow state — the "everything has received" frame. The mesh is still present and readable; nothing moves.

## 6. Responsive behavior

```css
.hero {
  position: relative;
  width: 100%;
  aspect-ratio: 600 / 220;
  min-height: 280px;
  background: #1f2031;
  overflow: hidden;
}
.hero svg { width: 100%; height: 100%; }
.hero-content {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 0 16px;
  max-width: 90%;
  color: #fff;
}
.hero-content h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  text-shadow: 0 1px 10px rgba(0,0,0,.95), 0 0 28px rgba(0,0,0,.7);
}
.hero-content h2 {
  margin: 0 0 1.25rem;
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-weight: 400;
  text-shadow: 0 1px 10px rgba(0,0,0,.95), 0 0 28px rgba(0,0,0,.7);
}
.hero-content a {
  display: inline-block;
  border: 1px solid #67EA94;
  padding: 10px 15px;
  border-radius: 5px;
  background: rgba(31, 32, 49, 0.85);
  margin: 0 0.25rem;
  color: inherit;
  text-decoration: none;
}
```

The `<h1>` and `<h2>` are block elements (stack vertically, centered via `text-align`); the two `<a>` elements are inline (sit side by side on the same line). This mirrors the layout pattern of the existing `Hero` component minus the dark panel background.

- **Desktop (≥720px wide):** `aspect-ratio` controls. At 1100×~404 the SVG fills exactly; no letterbox.
- **Mobile (<720px wide):** `min-height` overrides the aspect ratio, producing a container taller than the SVG's natural 600:220 (e.g., 375×280). With `preserveAspectRatio="xMidYMid meet"`, the SVG letterboxes top/bottom — the gaps fill with the dark `#1f2031` canvas color, so visually the hero remains a single dark band. All 11 nodes stay in frame.
- **`.hero-content`** is centered against the *container*, not the SVG. On mobile the heading and CTAs sit at the vertical center of the 280px hero band, overlapping the centered SVG. Text-shadow on H1/H2 preserves legibility; the CTAs use a solid `rgba(31,32,49,.85)` background.

## 7. Hero copy

```mdx
<Hero>
  <h1 id="hero-title">Austin Mesh</h1>
  <h2>We're building a free text messaging network in Austin</h2>
  <a class="success" href="/join/">Join the network</a>
  <a class="default" href="/learn/">About us</a>
</Hero>
```

- H1: `clamp(2rem, 6vw, 3.5rem)`, weight 700, white, with text-shadow `0 1px 10px rgba(0,0,0,.95), 0 0 28px rgba(0,0,0,.7)`.
- H2: `clamp(1rem, 2.2vw, 1.25rem)`, weight 400, white with same text-shadow.
- CTAs: keep `.success` / `.default` matcha classes; add a 1px brand-green border, `rgba(31,32,49,.85)` background, no text-shadow on button text.

The H1 above the hero in `index.mdx` is removed; the page's first heading is now this in-hero H1. Pagefind continues to index `<main>`'s headings.

## 8. Accessibility

| Concern | Handling |
|---------|----------|
| Section labeling | `<section aria-labelledby="hero-title">` references the H1 |
| Decorative SVG | `aria-hidden="true"`, no `<title>` |
| Keyboard order | H1 → H2 → "Join the network" → "About us" — same as today |
| Reduced motion | All movement and scaling suppressed; static "all-lit" frame |
| Color contrast | White text + dark text-shadow on `#1f2031` background; CTAs have solid panel backing; verified visually in mockup v6 |
| Focus styles | matcha's default `:focus-visible` outlines apply unchanged |

## 9. Testing

**Manual visual check** (the only check that gates this work):

- `npm run dev`, load `http://localhost:4321/`.
- Watch one full 8-second cycle. Confirm:
  - Packet leaves origin at t=0.
  - Hub pulses at t=1s; three packets emerge.
  - Branches pulse at t≈1.7–1.9s; four packets emerge.
  - Four near-destinations pulse at t≈2.5–2.7s.
  - NE corner (`nne`) pulses at t≈3.4s.
  - The final "backward" packet leaves `nne` at t≈3.4s heading west; far-north node (`dfn`) pulses at t≈4.4s.
  - From t≈4.5s to t≈7.6s, all 11 nodes glow steadily.
  - Soft global fade, then a fresh origin pulse — no flicker, no jank.
- Resize to 320px width: verify SVG letterboxes top/bottom, all 11 nodes remain visible, hero copy is legible.
- Resize to 1440px width: verify SVG fills, no letterbox, animation reads crisp.
- macOS System Settings → Accessibility → Display → enable "Reduce motion"; reload; verify packets vanish and nodes are frozen in moderate-glow state.
- Safari + Firefox + Chrome: `offset-path` is supported in all current versions, but spot-check each.

**Build verification:**

- `npm run build` succeeds; scoped style block extracts cleanly; SVG renders inline.
- Pagefind postbuild produces an unchanged index for the home page (the SVG is `aria-hidden`).

**Lighthouse:**

- Run mobile-emulated Lighthouse on `localhost:4321/` before and after. No regression in Performance or Accessibility scores.

**No automated tests added.** The repo has no test infrastructure today; gating a timing-based animation on snapshot tests would be brittle. Manual visual confirmation is the appropriate bar.

## 10. Rollback

A single `git revert <commit>` restores `Hero.astro`, `index.mdx`, and `site.css`. The Wildflower Center asset never moves on disk, so `BaseLayout`'s `og:image` reference is unaffected by either the change or the revert. No infrastructure, environment variable, or CDN cache invalidation is required.

## 11. Out of scope

- Road / river / map scaffolding (explicitly removed during iteration — user direction).
- `## Dive in` and `## Community partners` sections — unchanged.
- New OG image generation. The existing photo continues as the social share asset.
- A dedicated `nojs` static fallback — Astro renders the SVG markup server-side, and the `prefers-reduced-motion` block already handles the no-animation case.

## 12. Known risks

**GPU cost of continuous drop-shadow.** Around 20 elements carry an animated `filter: drop-shadow(...)`. On mid-tier Android the cost is modest but measurable. If Lighthouse mobile reports a perf regression, the fallback is to drop the packet drop-shadows (keep them on nodes only) — the packets remain visible via their white fill on dark background. This is a one-line change and is non-blocking for the initial ship.
