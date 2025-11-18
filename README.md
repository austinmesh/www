# Austin Mesh Website

The Austin Mesh static site built with [Eleventy](https://www.11ty.dev/) and [Matcha CSS](https://matcha.mizu.sh/).

## Development

Install dependencies by running:

```bash
npm install
```

Then start the development server:

```bash
npm start
```

Now you can visit http://localhost:8080 and the page will auto-reload when making changes to HTML or markdown files.

## Build

GitHub Actions normally builds and publishes the site. But to generate the full static site locally you can run:

```bash
npm run build
```

The output is in the `_site/` directory.

## Adding Content

### New Partner

Create a markdown file in `src/partners/`:

```markdown
---
title: Partner Name
tags: partners
date: 2024-01-04
image: /assets/images/partners/name/photo.webp
permalink: false
---

Partner description here.
```

Partners are sorted by `date` field.

### New Page

Create a markdown file in `src/`:

```markdown
---
layout: layouts/page.html
title: Page Title
description: Page description
---

Content here.
```

## Project Structure

```
src/
├── _data/           # Site configuration and data files
├── _includes/       # Layouts and partials
├── assets/          # Images, CSS, JS
├── partners/        # Partner pages
└── *.md             # Content pages
```
