# C.O. Williams Construction website: Tech Nova build (PUBLIC repo)

The new multi-page corporate website for **C.O. Williams Construction Ltd.**, built by **Tech Nova Barbados Limited** (Juwan Prescod). It is a design preview on GitHub Pages so the client can review it.

**This repo is public.** Never commit prices, the proposal, call notes, account details or anything private. Those are in the private repo **Technovabb/cowilliams-construction**.

## How the site is built
- Pages are in `src/pages/` (one file per page, with a `<!--meta {...} -->` header). The shared header, menus and footer are in `src/layout.html`, and shared pieces are in `src/partials/`.
- `node tools/build.js` writes the finished pages to the top of the folder and checks every link and image. Never edit the built .html files directly.
- **How to write a page: `docs/COMPONENTS.md`.** `src/pages/civil.html` is the reference page.
- Design follows the approved concept: navy `#0b1f4b`, safety yellow `#ffd100`, Bebas Neue headings, Barlow body text, hazard-stripe accents, and real project photography.
- Photos are C.O. Williams' own, taken from cow.bb. The full list is in the private repo.

## Rules
- **Only use facts from the client's material** (cow.bb, the concept, the proposal). Anything unknown is a placeholder like `[OPENING HOURS]`. No prices.
- Example content (sample jobs or news) must carry the "Example layout" label.
- Keep the preview bar and `noindex` (`PREVIEW = true` in tools/build.js) until launch.
- Forms are preview-only: they send nothing until they are connected at launch.
- Juwan is dyslexic/ADHD, so write plain, short steps, one per line.
- Never create accounts, set passwords or buy anything. Ask before sending any email.
- GitHub Pages publishes every push to `main`. Run the build and check desktop and phone width before pushing.
