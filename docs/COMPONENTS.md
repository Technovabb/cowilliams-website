# Building pages: components and rules

Every page is a file in `src/pages/` (sub-folders allowed, e.g. `src/pages/projects/port-st-charles.html`).
`node tools/build.js` wraps it in `src/layout.html` (top bar, header with menus, footer, phone action bar) and writes the finished page to the top of the folder.
**Copy the pattern of `src/pages/civil.html`.** It uses most components.

## The page file

```html
<!--meta {
 "title": "Marine Works",                      // browser tab: "Marine Works | C.O. Williams Construction"
 "description": "One sentence for Google.",
 "nav": "services",                            // which menu item is highlighted: home, services, rental, projects, quarry, about, contact
 "crumbs": [["Services", "services.html"], ["Marine"]]   // breadcrumb after Home; last item has no link
} -->
    <section class="page-hero">...</section>
    ...
```

- Always write links and image paths with `{{root}}` in front: `href="{{root}}marine.html"`, `src="{{root}}assets/img/marine.jpg"`. The build fills in `../` for pages in sub-folders.
- Put `{{crumbs}}` inside the page hero where the breadcrumb goes.
- Shared pieces: `<!--include cta-band-->` (yellow "Got a job in mind?" band) and `<!--include quote-form-->` (the full quote form; use it **once per page**, only on contact.html and the home page).
- Pre-filled quote links: `{{root}}contact.html?service=civil#quote` (service = civil, marine, asphalt, quarry, rental), `?machine=Bulldozer`, `?material=Marl`.
- Icons: `<svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg>`. Available: phone, mail, clock, pin, chat, arrow, check, menu, caret, fax, briefcase, shield, flask, truck, globe, upload.

## Components (all styles already exist in assets/css/site.css)

| Component | Markup |
|---|---|
| Page hero | `<section class="page-hero"><img src=".." alt="" width height><div class="wrap">{{crumbs}}<p class="eyebrow">..</p><h1>..</h1><p class="lead">..</p><div class="hero-ctas">buttons</div></div></section>`. Add `short` class for a shorter banner. |
| Section | `<section class="section">` (white), `section bg-cream`, `section bg-sand`, `section bg-navy on-dark` (navy, white text). Add `tight` for less padding. Inside: `<div class="wrap">`. |
| Section heading | `<div class="section-head"><div><p class="eyebrow">Label</p><h2>Title</h2></div> optional button or <p class="lead"></div>`. Centred: `section-head center`. |
| Text | `<div class="prose">` with `<p class="intro">`, `<p>`, `<h2 class="mt-2">`, `<h3>`. |
| Content + sidebar | `<div class="wrap with-aside"><div class="prose">..</div><aside class="aside">aside-cards</aside></div>` |
| Sidebar card | `<div class="aside-card">` (cream), `aside-card navy`, `aside-card yellow`. Inside: `<h2>`, `<p>`, `.btn`, or `<ul class="aside-links">` (links with arrow icons; `aria-current="page"` on the current one), or `<ul class="facts"><li><b>Label</b><span>Value</span></li></ul>`. |
| Bullet list | `<ul class="check-list">` (yellow squares); two columns: `check-list cols`. |
| Cards | `<ul class="card-grid">` (3 across), `card-grid two`, `card-grid four`. Each `<li class="card"><img ..><div class="card-body"><span class="tag">..</span><h3><a class="card-link" href="..">Title</a></h3><p>..</p><span class="text-link">Read more <svg..arrow></span></div></li>`. The `card-link` makes the whole card clickable. Navy card: `card navy`. |
| Features | `<ul class="features">` (or `features four`): `<li class="feature-item"><span class="ic"><svg class="i"><use href="#i-shield"/></svg></span><h3>..</h3><p>..</p></li>` |
| Steps | `<ol class="steps"><li><h3>..</h3><p>..</p></li></ol>` (numbers 01, 02, 03 are automatic). |
| Gallery | `<ul class="gallery"><li><figure><img ..><figcaption>..</figcaption></figure></li></ul>`; a 2-column item: `<li class="wide">`. |
| Filter bar | `<div class="filter-bar" data-filter-bar><button type="button" data-filter="all" aria-pressed="true">All</button><button type="button" data-filter="marine" aria-pressed="false">Marine</button>…<span class="count" data-filter-count></span></div>`; items to filter get `data-tags="marine barbados"`. |
| Team | `<ul class="team-grid"><li class="person"><img ..><h3>Name</h3><p>Title</p></li></ul>` |
| Logo wall | `<ul class="logo-wall"><li><img ..><span>Company name</span></li></ul>` |
| Rows (jobs, news) | `<ul class="list-rows"><li class="row-item"><div><h3>..</h3><div class="meta">..</div><p>..</p></div><a class="btn btn-navy" ..>..</a></li></ul>` |
| Example content | `<span class="sample-note">Example layout</span>` on anything made up to show a layout (sample jobs or news). `<div class="empty-state"><h3>..</h3><p>..</p></div>` for "nothing posted yet". |
| Table | `<div class="table-wrap"><table class="data-table"><thead>..</thead><tbody>..</tbody></table></div>` |
| Offices | `<div class="office-grid"><div class="office"><h3>Barbados</h3><ul class="contact-list">..</ul></div></div>` (contact-list items as on the home page). |
| Map | `<iframe class="map-embed" title="Map: ..." loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Lears,+St.+Michael,+Barbados&output=embed"></iframe>` |
| FAQ | `<div class="faq"><details><summary>Question</summary><p>Answer</p></details></div>` |
| Machine tiles | `<ul class="machines"><li><a class="machine" href="{{root}}contact.html?machine=Excavator#quote"><small>01</small><span>Excavators</span></a></li></ul>` |
| Chips | `<ul class="chips"><li><a class="chip" href="..">..</a></li></ul>` |
| Placeholder | `<span class="ph">[OPENING HOURS]</span>` for anything the client still has to give us. |
| Buttons | `btn btn-yellow`, `btn btn-navy`, `btn btn-outline-navy` (on light), `btn btn-outline-light` (on navy). Arrow icon after the text. |

## Content rules

- **Use only facts from the client's material**: the current cow.bb text, the concept and the proposal. Never invent dates, numbers, project details, staff titles, prices, awards or claims.
- Anything we don't know yet is a **placeholder** in square brackets: `[YEAR]`, `[TITLE]`, `[ST. LUCIA ADDRESS]`.
- **No prices** anywhere. Rentals and materials are "ask for pricing".
- Made-up example content (a sample vacancy or news post, to show the layout) must carry `<span class="sample-note">Example layout</span>` and use placeholder text, never realistic-looking fake facts.
- Every `<img>` needs `width`, `height` (the file's real size), a plain `alt` (or `alt=""` for decorative banners) and `loading="lazy"` (except the page hero image).
- Plain, confident, short sentences. Barbadian/British spelling (colour, organise). The motto is "Moving the earth to please".
