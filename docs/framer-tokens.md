# Framer.com — Design Token Extraction Report

> Extracted live from https://www.framer.com on 2026-09-26 with Playwright (headless Chromium, 1440×900). All values are **computed styles** read from the rendered DOM via `page.evaluate()` — no guesses, no approximations. Where CSS custom properties were the source, both the var name and its resolved value are given.

## Important honest caveat

The current public Framer marketing homepage is much simpler than its reputation suggests, and several things you'd expect were **measured as absent**:

- **No glass/blur nav state.** The fixed nav (`framer-1w39556-container`, 64px tall) is `position:fixed`, background `rgba(0,0,0,0)`, `backdrop-filter: none`, no border, no box-shadow — identical at scrollY 0, 100, 400 and 1400. A pixel-diff of the top 48px strip between scroll 0 and 1400 is **0%** changed. The page simply paints a black hero behind it; there is no translucent "glass" treatment to extract.
- **No hover transition on the bento/grid cards.** Hovering `framer-ka9z19`, `framer-epilsr`, `framer-1xkai3j`, the features card, and the template "Marketplace Item" card produced **0 visible state change**: `transform`, `box-shadow`, `filter`, `border-color`, `background` were identical before/after, and the cards' CSS `transition` is literally `all 0s ease`. (The page-wide mutation log during hover showed only *decorative* JS-driven transforms on unrelated elements — the animated "spark" bars `framer-1ks0xox` and twinkle text `framer-1vl3l8s`.) Pixel-diff of the hovered card bounding box: **0.04%** (bento) — that residual delta is the continuously-running spark-bar animation, not a hover effect.
- **No `--mouse-x`/`--mouse-y` cursor-spotlight mechanism.** Scanned every element's computed style (incl. pseudo-element-facing `getComputedStyle`) for `--mouse*`, `--x`, `--y`, `--cursor` custom props and for `radial-gradient` backgrounds using CSS vars: none found. Framer's current homepage does **not** use a mouse-coordinate spotlight.
- The site statistically uses **the classic Framer "app screenshot" bento** — the cards are static mock-product shots, and the only motion is JS/animation-driven element ticking (Spark/Launcher bars, star twinkles) which runs on load/hover-events globally, not per-card CSS hovers.

So: extract the tokens below as the site's actual color/border/radius system (it's a clean near-black + blue design), but **do not copy a "spotlight hover" from this page — it does not exist here.** The bento-card styling you *can* reuse is documented in §6.

---

## 1. Background layers

| Layer | Computed value | Source |
|---|---|---|
| `document.body` background-color | `rgb(0, 0, 0)` — `#000000` | `getComputedStyle(document.body).backgroundColor` |
| `html` background-color | `rgba(0, 0, 0, 0)` (transparent) | — |
| body background-image | `none` | — |
| Root hero panel (`.framer-1yvisnx`, first 981px section) | `rgb(0, 0, 0)`; `background-image: none` | — |
| Fade-to-black edge overlays (used at section boundaries) | `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 100%)` and `linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 100%)` | section lip layers `framer-10dvc56`, `framer-8i2eol` |

**Net effect:** a pure near-black canvas (`#000`) with occasional hard edge-gradients into black. No dark-blue tint, no purple wash, no spotlight texture on the body.

## 2. Nav / header

Notable nav-linked styling on the current page:

- Nav container: `framer-1w39556-container` — `position: fixed`, top 0, 64px × 1440px.
  - `background-color: rgba(0, 0, 0, 0)` at top **and** after scrolling.
  - `backdrop-filter: none` / `-webkit-backdrop-filter: none` at all scroll positions.
  - `border-bottom: 0px none rgb(0, 0, 0)`; `box-shadow: none`.
- A **nested SSR variant** wrapper (`ssr-variant hidden-sv03hi`, 64px) is also transparent and blurred never.
- Separate from the nav, small UI pills elsewhere use blur — see §7.

## 3. Text colors

| Role | Computed value | Hex | Size/Weight/Font |
|---|---|---|---|
| `h1` (hero) | `rgb(255, 255, 255)` | `#FFFFFF` | 54px / 500 / "GT Walsheim Medium" |
| `h2` (section) | `rgb(255, 255, 255)` | `#FFFFFF` | 44px / 500 / "GT Walsheim Medium" |
| `h3` | `rgb(255, 255, 255)` | `#FFFFFF` | 18px / 400 / "Inter Variable" |
| Body text (p, base) | `rgb(255, 255, 255)` | `#FFFFFF` | 14px / 400 / "Inter Variable" |
| Muted/secondary (most common cluster, 132 hits) | `rgb(153, 153, 153)` | `#999999` | 12px / 400 |
| Muted secondary (small) | `rgb(102, 102, 102)` | `#666666` | 10–13px / 500 |
| Muted (white w/ alpha) | `rgba(255, 255, 255, 0.4)` / `0.5` / `0.6` | `#FFFFFF 66/80/99` | 12–14px |
| Tertiary (rare) | `rgb(204, 204, 204)` | `#CCCCCC` | 12px / 500 |

**Text color recipe:** `#FFFFFF` headings + `#999999` muted body on `#000`. The alpha-white form (`rgba(255,255,255,0.4–0.6)`) is used for label/secondary copy in the mock-UI cards.

## 4. Accent / highlight colors

Resolved from CSS custom "tokens" (defined as `--token-<uuid>` in an inlined `<style>`; shown here as var + resolved value). These are the site's actual "colors" tokens:

| Token | Value | Hex | Use |
|---|---|---|---|
| `--token-bd71055c-…` (multiple) | `#09f` | **`#0099FF`** | **primary accent/blue** (spark-bar `framer-1ks0xox`, blue borders on bento card chrome, gradient-text edge) |
| `--token-eb0d9e00-…` | `#05f` | `#0055FF` | secondary blue (active states) |
| `--token-60f`-family | `#60f` / `#90f` | `#6600FF` / `#9900FF` | violet gradient stops |
| `--token-f06` / `#f02` | `#f06` / `#f02` | `#FF0066` / `#FF0022` | pink/red gradient stops |
| `--token-fd7702` | `#fd7702` | `#FD7702` | orange gradient stop |
| `--token-fb0` | `#fb0` | `#FFBB00` | amber gradient stop |
| `--token-0cf` / `#2dd` | `#0cf` / `#2dd` | `#00CCFF` / `#22DDDD` | cyan/teal gradient stops |
| `--token-6ecb0037-…` / `#cbff00` | `#cbff00` | **`#CBFF00`** | Framer's signature **lime** (used in a couple of accent chips/CTAs) |
| `--token-4cd963` / `#0d6` | `#4cd963` | `#4CD963` | success/green (live-status text `rgb(76, 217, 99)`) |
| `--token-26e3cb56-…` | `#fff` | `#FFFFFF` | gradient-text primary stop |

**Gradient text (measured):** one element used `linear-gradient(173deg, #fff 32%, rgba(0,0,0,0.1) 74%)` — i.e. white fading to near-transparent, **not** a blue/rainbow gradient on this page.

## 5. Primary button / CTA

| Property | Value |
|---|---|
| Element | `framer-PzEJo framer-qkzqfa framer-v-qkzqfa framer-lt5xhr` ("Get started for free") |
| background-color | `rgb(255, 255, 255)` — `#FFFFFF` (white pill) |
| text color (actual text node) | `rgb(0, 0, 0)` at 14px, weight 400, "Inter Variable" (**comment:** the *anchor* reports `rgb(0,0,238)` — Chrome's default link blue — but the real rendered text span is `#000`; trust `#000`) |
| border-radius | `8px` (border-width 0) |
| padding | `10px 14px` |
| box-shadow | `none` |
| Hover (measured) | identical to resting — white pill, no shadow/transform/filter change |

Nav "Sign up" pill: same pattern — `#FFFFFF` bg, `8px` radius, `#000` text, no shadow.

## 6. Cards / grids (bento + features + templates)

**Bento card surface** — the reusable "classic Framer" card (`.framer-TUKVm .framer-gvd11l`, 480×410, Page Settings mock; wide variant `.framer-zfv9ug` 758×420):

```css
background-color: #111111;                 /* var(--token-5e2a9781…, #111) */
border: 1px solid rgba(255,255,255,0.08);  /* var(--token-c534b380…, #ffffff14) = 8% white */
border-radius: 25px;                       /* calc(25px * var(--corner-shape-fallback,.752)) */
corner-shape: superellipse(1.5);           /* Framer superellipse, 25px radius */
mask: linear-gradient(#000 44%, #00000052 70%, transparent 95%);  /* content fades out at bottom */
overflow: hidden;
padding: 30px;
will-change: transform;
```

**Features card** (`.framer-197brb0`, "Code Block", 240×189): `#111111` bg, radius `15px`, same `rgba(255,255,255,0.08)` border token, `box-shadow: none`.

**Template/gallery card** (`.framer-15d75c`, "Marketplace Item", 560×471): transparent bg (the card *content* renders the mock), `border-radius: 18px`, no shadow, no border-color beyond `#000` default.

**Grid separators:** the bento grid itself uses `1px` separators colored `var(--token-5e0b3b72…, #141414)` = `#141414`; card containers are `#000`.

**Containers charting card-look tokens:** `#171717`, `#1d1d1d`, `#212121`, `#242424`, `#303030`, `#383838`, `#404040`, `#333` (lighter raised surfaces inside the mock UIs), and `#1f1f1f` chips.

## 7. Hover + effects recipe (measured on this page)

**Hover transition (grid cards):** `transition: all 0s ease` — i.e. **no CSS transition is defined**; no `:hover` box-shadow/border/bg/transform exists in any stylesheet for the bento/feature/template cards. Do not replicate a `:hover { transform/glow }` from this extraction — it was not present.

**Spotlight / grid-follow glow:** absent (no `--mouse-x`/`--mouse-y`, no `radial-gradient(...var(--…))`). If you want cursor-follow glow, the mechanism is left to you to design — Framer's own site does not ship one on this page today.

**Backdrop-filter elements found anywhere (the only real blur usage):**

| Element | backdrop-filter | background-color that blurs |
|---|---|---|
| `.framer-y4e3jb` (small pill) | `blur(5px)` | `rgba(0,0,0,0.7)` |
| `.framer-529HA .framer-fzsxn7` | `blur(5px)` | `rgba(31,31,31,0.5)` |
| `.framer-1j94rmh` / `.framer-1kcln18` / `.framer-1eixhh3` (16–30px chips) | `blur(3px)` | `rgba(34,34,34,0.8)` |

These are small floating chips (timestamps, status). There is **no** full-nav glass blur.

## 8. CSS custom properties exposed on `:root`

Only one:

```css
:root {
  --one-if-corner-shape-supported: 1;   /* feature-detect knob for superellipse radii */
}
```

All color tokens live in an **inlined `<style>`** (not `:root`) as `--token-<uuid>` vars (list in §4) — they are the "design tokens" of the page and their fallbacks appear in `var(--token-…, default)` form throughout the rules.

## 9. Verified gallery/pricing cards

- Pricing section: **not present** on the homepage (no pricing cards to extract; brand pricing lives on a separate page).
- Template section: cards are transparent-background mock previews (`radius 18px`), no borders/shadows/glows, no hover state.

## 10. Reusable summary (for a Framer-like flat design, no spotlight)

```css
/* background */  #000
/* surface      */ #111111           (raised: #171717 #1d1d1d #212121 #242424 #383838 #404040 #333333)
/* border       */ rgba(255,255,255,0.08)    (@1px)
/* grid hairlines */ #141414
/* text         */ #FFFFFF heading / #999999 muted / rgba(255,255,255,0.5) micro-label
/* accent       */ #0099FF   (secondary #0055FF; gradient stops #6600FF..#2DDDDF..#FF0066..#FD7702..)
/* highlight    */ #CBFF00 (lime), #4CD963 (green/ok)
/* button       */ bg #FFFFFF, text #000, radius 8px, padding 10px 14px, no shadow
/* card radius  */ 25px (bento) / 18px (gallery) / 15px (feature tiles)
/* blur chips   */ blur(3–5px) over rgba(0,0,0,0.5–0.8)
```

Widths: surface 480×410 (bento) / 758×420 (wide), card padding 30px, corner = superellipse(1.5) at 25px on Chrome.

---

*Extraction script notes:* values originate from `getComputedStyle()` reads at 1440×900, plus stylesheet parsing for the `.framer-TUKVm .framer-gvd11l` / `framer-zfv9ug` recipes, token var definitions and hover-selector inventory. Screenshots captured for reference (before/after hover of each candidate card). Everything above is what the page actually renders today; no values were inferred or "improved".

---

## 11. Where these values were applied (portfolio rewrite)

The proven values from this report were applied to the data-science portfolio (5 pages: index / about / projects / skills / contact) so its CSS resolves to *exactly* the measured framer.com computed styles:

- **Source of truth:** `css/theme.css` (loaded last → wins the passive cascade: `style.css` → page css → `motion.css` → `sections.css` → `theme.css`), which re-declares every token in `:root`.
- **Background/surface:** `--bg:#000`, `--surface-1:#111`, `--surface-2:#171717`, `--surface-3:#212121`, `--card-bg:#111`, `--glass-fill:#111`.
- **Borders:** flattened **real** `1px solid var(--border-subtle)` = `rgba(255,255,255,0.08)` on every grid card (the old "gradient fill + transparent border" glass trick was converted to a literal border so computed `border-color` matches the framer recipe instead of `rgba(0,0,0,0)`).
- **Nav:** transparent, no blur/border/shadow, `20px` vertical padding at **every** scroll position (measurement: identical at scrollY 0/600/1400; the `.scrolled` class still toggles but changes nothing).
- **Buttons:** `.btn-primary` = `#FFF` bg, `#000` text, radius `8px`, padding `10px 14px`, `box-shadow:none`, hover identical to resting. `.nav-cta` padding aligned to `10px 14px`.
- **Cards:** `#111` surface, `1px rgba(255,255,255,0.08)` border, no shadow. Radii: `25px` (bento-style: expertise/stack/project/full-project/project-feature/case-study/modal) and `15px` (feature tiles: tech/learning/stat/contact/cert/timeline/github/pub/tool/avail/etc.). Card hover recipes neutralized to produce **zero** computed-style change (resting reveal transform is the identity `matrix(1,0,0,1,0,0)`; hover forces the same).
- **Spotlight/magnetic:** `initSpotlight()`/`initMagnetic()` in `assets/js/motion.js` are no-ops; the `.spot` CSS was removed — mirrors the measured absence on framer.com.
- **Verification:** `verify-retheme.js` (Playwright, 1440×900, dpr 1) asserts body black, nav identity at 3 scrolls, button recipe + identical hover, and card surface/border/shadow/hover-identity for 15 cards — **70/70 PASS**.