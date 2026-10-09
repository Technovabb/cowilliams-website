# C.O. Williams Construction website (design preview)

The new website for C.O. Williams Construction Ltd. (Lears, St. Michael, Barbados), built by Tech Nova Barbados from the approved redesign concept.

**This repo is public.** It holds only the website. The proposal, prices and client notes are in Tech Nova's private repo.

- Plain HTML, CSS and JavaScript. No framework and no server.
- Hosted free on GitHub Pages as a preview, so the client can review it.
- Every page shows a "Design preview" bar and tells Google not to list it.

## Pages

| Page | Source file |
|---|---|
| Home | `src/pages/index.html` |
| Services (overview) | `src/pages/services.html` |
| Civil, Marine, Asphalt | `src/pages/civil.html`, `marine.html`, `asphalt.html` |
| Quarry products | `src/pages/quarries.html` |
| Equipment rental (catalogue) | `src/pages/equipment-rental.html` |
| Projects + case studies | `src/pages/projects.html`, `src/pages/projects/*.html` |
| About, Careers, News | `src/pages/about.html`, `careers.html`, `news.html` |
| Contact + request a quote | `src/pages/contact.html` |

## Build

Needs Node.js. From this folder:

```
node tools/build.js
```

It writes every page to the top of this folder, then checks every link and image and lists the placeholders still waiting for the client.

**Never edit the .html files at the top of the folder.** The build overwrites them. Edit `src/pages/`, `src/partials/` or `src/layout.html`, then run the build. How to build a page: `docs/COMPONENTS.md`.

## Look at it on your laptop

```
npx serve .
```

## Launch (later)

1. In `tools/build.js` set `PREVIEW = false`, then run the build.
2. Fill every placeholder the build lists (opening hours, WhatsApp, St. Lucia office, years, staff titles).
3. Connect the quote, careers and contact forms to a real mailbox.
4. Point cow.bb at the new site.
