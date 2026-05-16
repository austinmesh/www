# Austin Mesh

Source for [www.austinmesh.org](https://www.austinmesh.org).

## What is Austin Mesh?

Austin Mesh is a volunteer-run, non-commercial community building a free, off-grid text-messaging network across Austin, Texas. We deploy long-range LoRa radios (primarily [MeshCore](https://meshcore.co.uk) and [Meshtastic](https://meshtastic.org)) on rooftops, hilltops, and partner sites so anyone with a compatible handheld can send messages without cell service, internet, or grid power.

The site documents what the network is, how to join, which devices work, and what we've learned along the way. We aren't selling anything and we don't track you. [Privacy page](https://www.austinmesh.org/privacy/).

## What is this repo?

The website. It's a static site built with Astro + MDX and deployed to Cloudflare Workers Static Assets. Page content lives as MDX files under `src/content/pages/`. The layout, head/OG tags, header, nav, footer, and event dialog are centralized, so adding a new page is one file.

For the full architecture rundown, see [`CLAUDE.md`](./CLAUDE.md).

### A note on AI usage

This site was not, and is not, "vibe coded". All content was written by humans, sometimes with the assistance of a language model. The design/layout/theme was made by humans. We are open to the use of Agents, but maintain that human-in-the-loop is mandatory, and we do not accept fully agentic contributions. Put another way - the AI didn't write the code you're submitting, YOU wrote the code you're submitting whether you chose to use AI, and IDE, or notepad++.

## Local development

```sh
nvm use            # or install Node 24
npm install
npm run dev        # http://localhost:4321
```

Other scripts:

- `npm run build` — production build (runs Pagefind over `dist/` as a postbuild step)
- `npm run preview` — serve the built site locally
- `npx astro sync` — regenerate content-collection types after editing `src/content/config.ts`

## Contributing

Issues and pull requests are welcome.

### Fixing typos, broken links, or small content changes

Open a PR against `main`. For one-line fixes, the GitHub web editor is fine.

### Adding a new page

1. Create a `.mdx` file under `src/content/pages/`. The file path becomes the URL — `src/content/pages/learn/foo.mdx` → `/learn/foo/`.
2. Required frontmatter: `title` and `description`. Optional: `ogImage`, `ogImageAlt`, `canonical`, `eventDialog` (default `true`), `pagefind` (default `true`), `publishedAt`. The schema is in `src/content/config.ts`.
3. If the page should appear in the top nav, add it to `src/components/Nav.astro` — the menu is hand-listed.
4. Images live under `src/assets/` and must be imported as ES modules so Astro can fingerprint and resize them. Use the `<Image>` component from `astro:assets`.
5. Run `npm run dev` and check the page renders before opening the PR.

### Contributing a project

The `/projects/` section is for community writeups of anything you've built for the network — a radio, a node, an antenna, a packet analyzer, a piece of software, a tower install, etc. The body is open-ended; the index page builds itself from frontmatter.

1. Create a `.mdx` file under `src/content/projects/`. The file name becomes the URL — `src/content/projects/my-yagi.mdx` → `/projects/my-yagi/`.
2. Add a thumbnail image to `src/assets/` (a project-specific subdir is fine, e.g. `src/assets/my-yagi/thumbnail.webp`).
3. Required frontmatter:
   ```yaml
   ---
   title: My Yagi Build
   description: A short one- or two-sentence pitch for the index page.
   thumbnail: ../../assets/my-yagi/thumbnail.webp
   thumbnailAlt: Photo of a four-element 915 MHz Yagi mounted on a chimney.
   author: Your Name           # optional
   publishedAt: 2026-05-16     # optional, used to sort the index newest-first
   ---
   ```
4. Write the body in MDX. Use `<Image>` from `astro:assets` for any inline images. Raw HTML is allowed (e.g. `<details>`, `<iframe>`, `<aside>`).
5. Run `npm run dev`, visit `/projects/` to see your card in the grid, click through, and open a PR.

### Reporting issues

Use [GitHub Issues](https://github.com/austinmesh/austinmesh/issues) for bugs in the site itself. For questions about the network, joining, or hosting a node, we prefer that you join the Discord (link in the site footer).

## License

Our website content is licensed under Creative Commons feel free to use it for your club's website. **Just don't forget to update the various links**. We get a lot of people copying this who forget to update the email or Discord and users get confused.
