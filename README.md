# Data Scientist Portfolio

Static, dependency-light portfolio site for Dr. Alex Morgan. No build step — open `index.html` or serve the folder statically.

## Where to edit things

### Content (text, projects, skills, contact info)
All content lives in **`assets/js/content.js`** as a single `SITE` object:

| Scene | Object key | What it holds |
| --- | --- | --- |
| About | `SITE.about` | bio, stats (numbers that count up), education, certifications, values |
| Projects | `SITE.portfolio` | 9 case studies (title, category, metrics, tech chips, `case.problem/data/approach/results` used in the modal) |
| Skills | `SITE.radar`, `SITE.skillGroups`, `SITE.constellation` | radar axes + values, proficiency bars, tool constellation groups |
| Contact | `SITE.contact` | info cards, `SITE.socials` links, form labels/placeholders |
| Misc | `SITE.resumeUrl` | path to the downloadable resume (`resume.pdf`) |

Footer social links are also driven from `SITE.socials` on every page.

### Colors, theme and fonts
The whole design system lives in **`css/theme.css`** (loaded last on every page) — surfaces, the single accent, text colors, borders, fonts and gradients are all CSS variables there. Tweak once, it applies everywhere:

- `--bg` `#0A0A0B`, `--surface-1/2/3` `#111113/#16161A/#1C1C22` — page and card layers (never pure black/white).
- `--accent` `#3B82F6`, `--accent-600` `#2563EB`, `--accent-400` `#60A5FA` — the one electric-blue accent for links, buttons, chart lines and glow accents.
- `--text` `#F5F5F7` (headings), `--text-secondary` `#A1A1AA` (body/labels).
- `--border-subtle` `rgba(255,255,255,0.08)` — 1px card borders + soft inner glass.
- `--font-display` (`Space Grotesk`), `--font-main` (`Inter`), `--font-mono` (`JetBrains Mono` for stats/code/data labels).

Legacy token names (`--primary`, `--dark`, `--border`, `--gradient`, …) are aliased to the same values, so nothing else needs editing. Keep any custom accent at AA contrast (4.5:1) against the surfaces.

### Animations and motion
Animation/layout settings live in three places:

- **`assets/js/motion.js`** — scroll-driven FX: pinning/stacking, scroll progress bar, reveals, count-ups, marquee duplication. Toggle points: reveal duration, ScrollTrigger trigger margins, `Lenis` smoothness.
- **`assets/css/motion.css`** — motion stylesheet loaded last on every page. Includes `content-visibility: auto` on below-the-fold sections (lazy paint) and all `@keyframes`.
- **`js/particles.js`** — background particle canvas (`COUNT`, speed, color palette, tie length). Respects `prefers-reduced-motion` automatically.

Every animated visual respects `prefers-reduced-motion: reduce` (static frame, no looping, no pinning). Keep that invariant when adding animations.

### Page SEO / shared head
Each page has its own `<title>`, `<meta name="description">`, canonical URL, Open Graph and Twitter card tags in the `<head>`, plus the shared favicon (`assets/favicon.svg`) and Open Graph cover (`assets/og-cover.svg`).

Per-site metadata used across pages:

- Domain placeholder: `https://alexmorgan.ai` — used in canonical/OG/sitemap. Replace with the real deployed domain (also flagged as `TODO` in `sitemap.xml`).
- `robots.txt` allows all crawlers and points at `sitemap.xml`.

## Contact form

The contact form validates locally and shows a success state. To wire it to real email, set `SITE.contact.formspreeEndpoint` (or add `FORMSPREE_ID`) in `assets/js/content.js` — see the comment above that field.

## Accessibility / performance checklist (enforced in QA)

- Skip-to-content link (`#main`), semantic `<main>`/`<nav aria-label="Primary">`/`<footer>` landmarks.
- Visible keyboard focus (`:focus-visible`), AA color contrast, `aria-hidden` on all decorative canvases/SVGs, labelled dialog + SVG charts.
- Fonts are preloaded/asynchronously loaded; Font Awesome loads non-blocking; below-the-fold sections lazy-paint via `content-visibility`; particle canvas pauses when the tab is hidden.
- QA harnesses (Playwright) re-verify all 5 pages at 1440/1024/768/390px with no horizontal scroll, blank sections, stuck reveals, or console errors.
- Animation QA is tracked in `ANIM-REPORT.md` (20/20 PASS: no layout shift / frame jank / long tasks during a slow scroll on every page, plus JS-off and reduced-motion rows).