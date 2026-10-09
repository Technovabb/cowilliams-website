#!/usr/bin/env node
/*
 * Builds the C.O. Williams website from src/ into plain HTML pages at the top of this folder.
 *
 *   node tools/build.js            build every page, then check links and images
 *   node tools/build.js --only civil   build just src/pages/civil.html (no checks)
 *
 * Never edit the .html files at the top of the folder: the build overwrites them.
 * Edit src/pages/*.html (page content), src/partials/*.html or src/layout.html instead.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Preview: shows the "Design preview" bar and keeps search engines out. Set to false at launch.
const PREVIEW = true;
const SITE_NAME = 'C.O. Williams Construction';
const FEEDBACK = 'mailto:JuwanPrescod@Technovabb.com?subject=Feedback%3A%20C.O.%20Williams%20website%20preview';

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const PAGES = path.join(SRC, 'pages');
const PARTIALS = path.join(SRC, 'partials');

function listPages(dir, base = '') {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (fs.statSync(full).isDirectory()) out = out.concat(listPages(full, rel));
    else if (name.endsWith('.html')) out.push(rel);
  }
  return out;
}

function includes(html, seen = []) {
  return html.replace(/<!--\s*include\s+([\w-]+)\s*-->/g, (m, name) => {
    if (seen.includes(name)) throw new Error(`include loop: ${seen.concat(name).join(' > ')}`);
    const file = path.join(PARTIALS, `${name}.html`);
    if (!fs.existsSync(file)) throw new Error(`missing partial: src/partials/${name}.html`);
    return includes(fs.readFileSync(file, 'utf8'), seen.concat(name));
  });
}

function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

const layout = fs.readFileSync(path.join(SRC, 'layout.html'), 'utf8');
const version = crypto.createHash('md5')
  .update(fs.readFileSync(path.join(ROOT, 'assets/css/site.css')))
  .update(fs.readFileSync(path.join(ROOT, 'assets/js/site.js')))
  .digest('hex').slice(0, 8);

const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null;

const built = [];
for (const rel of listPages(PAGES)) {
  if (only && rel.replace(/\.html$/, '') !== only) continue;
  const raw = fs.readFileSync(path.join(PAGES, rel), 'utf8');
  const m = raw.match(/^\s*<!--meta\s*([\s\S]*?)-->/);
  if (!m) throw new Error(`${rel}: missing <!--meta {...} --> header`);
  let meta;
  try { meta = JSON.parse(m[1]); } catch (e) { throw new Error(`${rel}: meta is not valid JSON (${e.message})`); }
  const depth = rel.split('/').length - 1;
  const root = '../'.repeat(depth);

  let body = includes(raw.slice(m[0].length));
  const crumbs = (meta.crumbs || []).map(([label, href], i, arr) =>
    i === arr.length - 1 || !href
      ? `<li><span aria-current="page">${label}</span></li>`
      : `<li><a href="{{root}}${href}">${label}</a></li>`).join('');
  body = body.replace(/\{\{crumbs\}\}/g, crumbs ? `<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="{{root}}index.html">Home</a></li>${crumbs}</ol></nav>` : '');

  let html = includes(layout).replace('{{content}}', () => body);
  html = html
    .replace(/\{\{active:(\w+)\}\}/g, (x, key) => (meta.nav === key ? ' is-active' : ''))
    .replace(/\{\{title\}\}/g, escapeAttr(meta.title ? `${meta.title} | ${SITE_NAME}` : `${SITE_NAME} | Civil, Asphalt, Quarries, Marine & Rentals`))
    .replace(/\{\{description\}\}/g, escapeAttr(meta.description || ''))
    .replace(/\{\{bodyClass\}\}/g, meta.bodyClass || '')
    .replace(/\{\{robots\}\}/g, PREVIEW ? '<meta name="robots" content="noindex, nofollow">' : '')
    .replace(/\{\{previewBar\}\}/g, PREVIEW
      ? `<p class="preview-bar">Design preview for C.O. Williams Construction. This is not the live website. Highlighted items like <span class="ph">[OPENING HOURS]</span> are details we still need from you. <a href="${FEEDBACK}">Send feedback</a></p>`
      : '')
    .replace(/\{\{version\}\}/g, version)
    .replace(/\{\{root\}\}/g, root);

  const left = html.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error(`${rel}: unresolved ${[...new Set(left)].join(', ')}`);
  const outFile = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  built.push(rel);
}
console.log(`built ${built.length} page(s): ${built.join(', ')}`);

// Checks: internal links and images must exist; count placeholders still waiting for the client.
if (!only) {
  const problems = [];
  const placeholders = new Map();
  for (const rel of built) {
    const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const dir = path.dirname(path.join(ROOT, rel));
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]));
    for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) {
        if (url.startsWith('#') && url.length > 1 && !ids.has(url.slice(1)) && url !== '#whatsapp') problems.push(`${rel}: ${attr} ${url} (no such id on the page)`);
        continue;
      }
      const [file, hash] = url.split('#');
      const target = path.join(dir, file.split('?')[0]);
      if (!fs.existsSync(target)) { problems.push(`${rel}: ${attr} ${url} (file missing)`); continue; }
      if (hash && file.endsWith('.html')) {
        const other = fs.readFileSync(target, 'utf8');
        if (!new RegExp(`\\sid="${hash}"`).test(other)) problems.push(`${rel}: ${url} (no #${hash} in ${file})`);
      }
    }
    for (const [ph] of html.matchAll(/\[[A-Z][A-Z0-9 .,'&/-]+\]/g)) placeholders.set(ph, (placeholders.get(ph) || 0) + 1);
  }
  if (problems.length) { console.log(`\n${problems.length} problem(s):\n  ` + problems.join('\n  ')); process.exitCode = 1; }
  else console.log('links and images: all OK');
  console.log('\nplaceholders still to fill: ' + [...placeholders.keys()].sort().join(', '));
}
