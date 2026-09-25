# Changelog

All notable changes to the portfolio. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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