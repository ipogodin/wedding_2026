# Production Readiness Plan
**What separates "it works" from "ships like a real product"**

---

## The 6 Pillars

### 1. Preloader

The preloader is the first thing every guest sees. It sets the emotional tone before a single frame of the scroll journey plays.

**What it does:**
- Runs while fonts, map data, and the lake aerial photo load in the background
- Shows the "C & P" monogram in teal, a progress bar, and individual asset status lines
- Once all assets resolve (or 3s max): monogram scales up → fades to black → USA map reveals underneath
- On repeat visits (cached): plays for under 0.5s — fast enough to feel like an intentional intro, not a loading penalty

**Implementation:**
```jsx 
// src/components/Preloader.jsx
// Uses Promise.all([loadFont(), loadImage(lakePhotoUrl), loadJSON(topoJsonUrl)])
// Reports per-asset progress via individual state flags
// Triggers exit animation when all three resolve
```

**Exit easing:** `cubic-bezier(0.76, 0, 0.24, 1)` — aggressive ease-in then snap — feels decisive, not slow.

---

### 2. Real Imagery

The scroll journey lives or dies on the quality of the lake aerial photo. A generic placeholder breaks the illusion immediately.

**Lake aerial photo strategy:**
- **Primary:** Download from Unsplash (free, commercial license). Best match: search "washington cascade lake aerial summer" — look for teal water + pine-covered peaks, similar to the Diablo Lake aerial shots.
- **Backup:** Page 2 of `docs/original_pdf.pdf` contains an actual Lake Wenatchee photo. Use `pymupdf` to extract it at full resolution.
- **Minimum size:** 2400×1600px source. Serve at 3 responsive breakpoints: 800w, 1400w, 2400w.

**Format pipeline:**
```bash
# vite-imagetools handles this automatically on import
import lakePhoto from './assets/lake.jpg?w=800;1400;2400&format=webp&as=srcset'
```

**CSS color grading (one line, applied to the `<img>` element):**
```css
filter: saturate(1.3) contrast(1.1) brightness(0.85) hue-rotate(-8deg);
```
Effect: deepens the teal water, adds drama to the forest shadows, slightly cools the sky. Matches the dark vivid palette.

---

### 3. Map Atmosphere

A bare D3 outline map looks like a geography textbook. A styled map looks like a night satellite feed.

**SVG fill palette for the dark satellite look:**

| Element | Fill | Stroke |
|---------|------|--------|
| Ocean / background | `#02050F` | — |
| Land (other states) | `#060D1A` | `#0A1520` 0.5px |
| Washington state | `#0A1828` | `#0D2035` 0.8px |
| Mountain sub-region | `#091520` | `#112233` 0.8px |
| Lake Wenatchee body | `#002A38` | `#00C9B133` 0.7px |
| Topographic lines | — | `#06111E` 0.4px dashed |
| Coordinate grid | — | `#0A1520` 0.3px dashed |
| State border glow | — | `#00C9B144` 1.5px (WA only) |

**Film grain overlay:**  
```html
<!-- In the map container -->
<svg style="position:absolute;inset:0;pointer-events:none;opacity:0.04">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)"/>
</svg>
```
This adds a subtle film grain that makes flat SVG surfaces look physical, not digital.

**Pre-rendered frames approach (for 60fps performance):**  
Rather than recomputing D3 projections on every scroll tick, pre-render 4 SVG snapshots:
- `frame-usa.svg` — full USA, WA pin
- `frame-wa.svg` — Washington zoomed, Cascades visible  
- `frame-cascades.svg` — mountain range close-up, lake label
- `frame-lake-bleed.svg` — lake fills the frame, map fades

GSAP cross-fades opacity between frames. Zero computation on scroll = butter smooth.

---

### 4. Social / OG Image

When any guest shares the URL in WhatsApp, iMessage, Slack, or email, they see a rich preview card. This is often the first impression before someone even visits the site.

**Spec:** 1200×630px PNG, static file at `public/og.png`

**Content layout (two-column):**
- Left half: couple's photo in an oval frame with teal border
- Right half: "You're invited" eyebrow → "CIARAN & POLINA" in large bold white → teal rule → "3 · July · 2026" → "Lake Wenatchee, WA" → domain name at the bottom

**Generation method — Satori (zero server cost):**
```bash
npm install satori @resvg/resvg-js
```
Write a `scripts/generate-og.mjs` that renders a React-like JSX tree to SVG via Satori, then converts to PNG via resvg. Run it once: `node scripts/generate-og.mjs` → outputs `public/og.png`.

**Meta tags in `index.html`:**
```html
<meta property="og:title" content="Ciaran & Polina — Wedding · 3 July 2026" />
<meta property="og:description" content="You're invited to celebrate at Lake Wenatchee, WA" />
<meta property="og:image" content="https://ciaran-polina.vercel.app/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
```

---

### 5. Motion Safety & Accessibility

**`prefers-reduced-motion` (critical):**
```css
@media (prefers-reduced-motion: reduce) {
  /* Skip scroll journey entirely — show final state immediately */
  .scroll-journey-container { display: none; }
  .wedding-reveal { opacity: 1 !important; transform: none !important; }
}
```
In JS: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — if true, skip GSAP timeline entirely and render the wedding reveal at full opacity from the start.

**Mobile (< 768px) — no scroll-jacking:**  
Replace the pinned GSAP sequence with a CSS auto-play animation:
```css
@keyframes mobileIntro {
  0%   { opacity: 0; } 
  20%  { opacity: 1; }  /* USA map fades in */
  40%  { filter: blur(4px) scale(1.1); }  /* zoom feel */
  70%  { opacity: 0; }  /* map fades out */
  100% { opacity: 1; }  /* lake photo + wedding reveal */
}
```
Runs once on mount, ~4 seconds, then the normal page is visible.

**Screen reader support:**
```html
<div aria-live="polite" aria-atomic="true" class="sr-only" id="journey-status">
  <!-- Updated by JS as scenes progress -->
  <!-- "Loading wedding invitation for Ciaran and Polina" → "You have arrived at Lake Wenatchee" -->
</div>
```

---

### 6. Performance — Lighthouse 90+ Target

**Image optimization:**
```js
// vite.config.js
import { imagetools } from 'vite-imagetools'
export default defineConfig({
  plugins: [react(), imagetools()]
})
```
WebP format, responsive srcset, blur placeholder while loading.

**Font loading:**
```html
<!-- In index.html <head> — preload the two most critical font files -->
<link rel="preload" href="/fonts/SpaceGrotesk-Bold.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin />
```
Self-host fonts (copy from Google Fonts) — eliminates the Google Fonts DNS lookup on first paint.

**GSAP tree-shaking:**
```js
// Only import what we use — GSAP supports this
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
// Result: ~30kb gzip instead of 100kb+ for the full bundle
```

**Vercel cache headers (`vercel.json`):**
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/og.png",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400" }]
    }
  ]
}
```
Vite hashes all asset filenames, so `max-age=31536000` (1 year) is safe.

**TopoJSON data size:**
The US states file (`us-atlas`) is ~95kb uncompressed. With Vercel gzip it transmits at ~28kb. Load it in the preloader phase so it's ready before the journey starts.

---

## Easing Curves — The Detail That Makes Animations Feel Alive

Linear and `ease-in-out` feel mechanical. These specific curves are used by Apple and Stripe:

| Animation | Curve | Effect |
|-----------|-------|--------|
| Scene transitions (scroll-driven) | `scrub: 0.5` in GSAP | Slight lag behind finger — feels weighty |
| Wedding reveal elements | `cubic-bezier(0.16, 1, 0.3, 1)` | Snappy entrance, gentle settle |
| Preloader exit | `cubic-bezier(0.76, 0, 0.24, 1)` | Decisive, fast — doesn't drag |
| Button hover | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot — feels springy |
| Countdown digit flip | `cubic-bezier(0.4, 0, 0.2, 1)` | Material Design standard — clean |

---

## Custom Cursor (Desktop Only)

A small production detail with outsized perceptual impact:

```js
// Replaces the default cursor with a small teal dot
// + a slightly larger, delayed follower circle
// The follower lags ~80ms behind — creates a "weight" sensation
const cursor = { x: 0, y: 0 }
const follower = { x: 0, y: 0 }

document.addEventListener('mousemove', e => {
  cursor.x = e.clientX
  cursor.y = e.clientY
})

// In rAF loop:
follower.x += (cursor.x - follower.x) * 0.12
follower.y += (cursor.y - follower.y) * 0.12
// Apply to two absolutely-positioned divs
```

Disable on touch devices (`pointer: coarse` media query).

---

## Implementation Priority

Do these in order — each one is independently shippable:

1. **OG image** (`scripts/generate-og.mjs` + meta tags) — 30 min, zero risk, massive sharing impact
2. **Self-hosted fonts + preload hints** — 1 hr, eliminates FOUT (flash of unstyled text)
3. **Lake photo download + WebP pipeline** — 1 hr, the scroll journey needs this to exist
4. **CSS photo grading** — 30 min, one line on the `<img>` tag
5. **Preloader component** — 2 hrs, prevents scroll-journey stutter on first load
6. **Map SVG styling** (dark satellite palette + film grain) — 3 hrs
7. **`prefers-reduced-motion` + mobile fallback** — 1 hr
8. **Vercel cache headers** — 15 min
9. **Custom cursor** — 2 hrs (nice-to-have, desktop only)

---

## Checklist Before "Ship"

- [ ] Lighthouse score ≥ 90 on Performance, Accessibility, Best Practices
- [ ] OG image verified in Twitter Card Validator + Facebook Debugger
- [ ] Scroll journey tested on: Chrome Mac, Safari Mac, Chrome Android, Safari iOS
- [ ] Prefers-reduced-motion tested (System Preferences → Accessibility → Reduce Motion)
- [ ] All 19 guest names verified in the check list
- [ ] Google Calendar URL tested (opens correct event in Google Calendar)
- [ ] Apple `.ics` file tested (opens in Calendar.app)
- [ ] No console errors or warnings in production build
- [ ] Custom domain set up on Vercel (optional: `ciaran-polina.wedding` or similar)

---

*Tech stack and scroll journey architecture: see `scroll-journey-plan.md`*  
*Vivid theme design tokens and components: see `vivid-design-plan.md`*
