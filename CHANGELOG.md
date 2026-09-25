# Changelog

All notable changes to the portfolio. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## Creative animation suite

Adds the interactive motion layer across all five pages.

### Added
- **Dual marquee** (Home + subpages, `id="dual-marquee"`): two counter-rotating tracks duplicated by `initMarquee` (idempotent), auto-pausing on hover.
- **Sticky stacking cards** (Home case study stack): cards pin and stack into a 3D cascade via ScrollTrigger, then un-pin cleanly (`overflow-x: clip` guard retained).
- **Typing terminal line** (Home hero): types the rotating tagline into a glass terminal mock on an interval; plays after the split-text reveal finishes.
- **`prefers-reduced-motion`** handling: reveals finish visible instantly, marquee/lenis/progress/page-transitions inert.

### Changed
- **`assets/js/motion.js`** — `initReveals()` now always installs an rAF-throttled passive scroll failsafe (plus the IntersectionObserver path), so below-the-fold reveals can never be missed even with `content-visibility` sections; Lenis smooth scroll; scroll progress bar; stat count-ups; wrap-split text (`split-in`), rotating word, dual marquee, stacked sticky cards, ScrollTrigger-backed reveals — all single file.
- **`assets/css/motion.css`** — reveals, count-ups, marquee keyframes, stacking transforms.
- **Font preloads** in every page `<head>` (SPACE Grotesk + Inter + Inter Tight + JetBrains Mono `font/woff2` with `crossorigin`) to eliminate fallback-face swap layout shift.
- **`assets/js/page-transition.js`** — 250ms fade/slide between pages.
- **`js/particles.js`** — connects to the reduce-motion flag.

### QA
- `pw/animverify.js` verifies **20/20** rows PASS (5 pages × 1440/390 during an eased 4s scroll ride): zero layout shift, frame jank ≤ 3 (>50ms) and ≤ 2 long tasks per ride; plus JS-disabled (all mounts filled) and prefers-reduced-motion (no hidden reveals, animations inert) runs. Report: `ANIM-REPORT.md`.
- Green baseline harnesses re-run after the suite: sections-check 48/48, pages-check 45/45, hero-check 61/61, responsive-check 80/80, motioncheck + reducedMotion no errors.

## Dark professional design system

Re-skinned the entire site to a near-black, single-accent theme.

### Added
- `css/theme.css` — single source of truth for the design system (surfaces, one electric-blue accent, text colors, borders, fonts, gradients), loaded last on every page so legacy tokens remap automatically.

### Changed
- **Background:** `#05070F`/blue-tinted surfaces → `#0A0A0B` base with `#111113` / `#16161A` / `#1C1C22` surface layers (no pure black/white).
- **Accent:** multi-color system (indigo + cyan + violet + teal) → one deep electric blue (`#3B82F6` family) used only for links, buttons, chart lines and glow accents.
- **Type:** `#F5F5F7` headings, `#A1A1AA` secondary text; display headings now use **Space Grotesk** (added to the font stack on all pages), body stays Inter, mono stays JetBrains Mono.
- **Cards:** 1px `rgba(255,255,255,0.08)` borders, soft inner glass, faint blue glow on hover — every page (index, about, projects, skills, contact) unified.
- Neutralized all leftover bright/pastel surfaces: per-project rainbow gradients, mini-chart colors, radar/constellation tints, CTA mesh blobs, expertise/badge colors all funnel through the single blue accent (CSS-level, so `assets/js/content.js` data is untouched and stays editable).
- `js/particles.js` + hero canvas colors re-tinted to the blue palette.

### QA
- Re-verified after re-skin: sections-check 48/48, pages-check 45/45, hero-check 61/61, responsive-check 80/80 (all pages @ 1440/1024/768/390 — no h-scroll, no blank sections, no console errors).
- Before/after full-page proof screenshots captured via Playwright at 1440px and 390px in `theme-proof/` (see `theme-proof/index.html`).

## Final pass — performance, accessibility, SEO, responsive QA

### Added
- Per-page SEO: unique `title` + `meta name="description"`, canonical URL, Open Graph card, Twitter card, `theme-color` and `robots` meta on all 5 pages.
- Person JSON-LD schema (with `sameAs` social profiles) in `index.html`.
- Brand assets: `assets/favicon.svg` (SVG favicon + apple touch icon), `assets/og-cover.svg` (1200×630 social cover), root `robots.txt` and `sitemap.xml`.
- Accessibility: skip-to-content link, `<main id="main">` landmark (`scroll-margin-top`), `aria-hidden` on the decorative particle canvas and nav/landmark labelling; global `:focus-visible` outline; dialog semantics + focus return for the project case-study modal; descriptive `aria-label` summaries on the skills radar and tool-constellation SVGs.
- `README.md` editing guide (content, colors, motion, SEO, wiring the contact form).

### Changed
- **Contrast:** `--primary` `#6366F1` → `#7376F3` (and `--primary-dark` `#5658E2` → `#5C5FE8`) so indigo text/accent passes WCAG AA (≈4.5:1) on the dark background.
- **Performance:** Font Awesome now loads asynchronously (`media="print" onload="this.media='all'"`) with a `noscript` fallback and cdnjs `preconnect`, instead of render-blocking. (Fonts were already preloaded/async; below-the-fold sections already lazy-painted via `content-visibility`; the particle canvas already pauses when the tab is hidden — retained as-is.)

## Earlier — portfolio rebuild

- Subpages rebuilt around `assets/js/content.js` config: About (bio, count-up stats, education, certifications, values), Projects (filterable 9-case grid + case-study modal with problem/data/approach/results), Skills (radar chart, grouped proficiency bars, tool constellation), Contact (validated form + success state), shared config-driven footer with real social links across all pages.
- Horizontal-overflow guard on the root `html` (`overflow-x: clip`) that preserves `position: sticky` pinning.
- QA harnesses (Playwright) driving the above: pages-check, sections-check, hero-check, motioncheck, reduced-motion, bento-check.