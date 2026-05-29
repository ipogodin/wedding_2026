# Vivid Mode — Alternative Design Plan
**Ciaran & Polina Wedding SPA · Alternative "Vivid" Theme**

---

## Concept: "Wildfire at Wenatchee"

A dark, cinematic, fully-immersive counterpoint to the Classic ivory/gold theme. Think: nature documentary meets festival poster meets high-end interactive web app. The color story is pulled directly from Lake Wenatchee in summer — electric teal water, deep midnight navy forests, amber sunset sky above the peaks.

Users toggle between **Classic** (existing elegant ivory) and **Vivid** (this) via a persistent switch in the navbar. The preference is stored in localStorage.

---

## Color Palette

| Role | Value | Source |
|------|-------|--------|
| Background deep | `#080E1C` | Night sky above the lake |
| Background surface | `#0D1E35` | Deep water shadow |
| Background card | `#061A14` | Forest floor dark |
| Teal primary | `#00C9B1` | Lake Wenatchee aerial teal |
| Teal glow | `#00C9B122` | Teal at 13% opacity |
| Amber accent | `#FF8C42` | Campfire / sunset peak |
| Gold highlight | `#FFD700` | Golden hour on water |
| White primary | `#FFFFFF` | |
| Muted text | `#7FABB8` | Misted mountain air |
| Dim text | `#3D6478` | Deep water |
| Border subtle | `#1A3550` | Dark pine treeline |

---

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display (names) | Space Grotesk or Syne | 700 | clamp(2.4rem, 6vw, 4rem) |
| Section headings | Space Grotesk | 700 | 1.8–2.4rem |
| Body / UI | Inter | 400/500 | 0.85–1rem |
| Monospace (scanner states) | JetBrains Mono | 400 | 0.8rem |
| Eyebrows / labels | Inter | 500 | 0.65rem, +0.18em spacing |

Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
```

---

## Sections & Animation Inventory

### 1. Navbar (always visible)

- Fixed top bar: `background: #080E1C` + thin `1px solid #1A3550` bottom border
- Left: `C & P` logo in teal
- Right: **Classic ↔ Vivid toggle** (pill switch, animates on change)
- Scroll progress bar: 2px teal line at the very top of the viewport
- On scroll down: navbar compresses from 64px → 48px height with transition

---

### 2. Hero — "Arrival at the Lake"

**Layout:** Full-viewport (`100svh`), dark navy background with layered depth

**Layers (back to front):**
1. SVG mountain silhouette parallax (3 layers, slightly different scroll rates — creates depth)
2. Star field: 60 tiny white dots, opacity 0.3–0.6, subtle twinkle keyframe on randomized delays
3. Horizontal water shimmer band at mid-height (teal, very low opacity, undulates via CSS animation)
4. Teal ambient glow behind the couple photo (radial, 40% opacity, `filter: blur(60px)`)
5. Content

**Content (center-aligned):**
- Eyebrow: `"YOU ARE INVITED TO"` — letter-by-letter fade-in on load (staggered 30ms per char)
- **Couple photo** — 160×200px oval card, `perspective(400px) rotateY(-6deg)`, tracks mouse movement via JS `mousemove` (max ±8deg tilt on each axis). Gold-teal border. On hover: border animates to full teal.
- **Names:** `CIARAN & POLINA` — each word slides in from opposite horizontal edges, meets center. The `&` is teal and does a brief 360° rotate on arrival.
- Date line: fades in 300ms after names settle
- **Countdown:** 4 dark cards (Days / Hours / Min / Sec). Digits use a flip/roll animation (`transform: rotateX`) on each tick change.
- Two CTAs: `[Check my invite]` (filled teal) + `[View details]` (outline)

**Live badge** (top-right corner of hero): `● LIVE · 36 days` in amber, pulses every 2s.

**Scroll indicator:** Bouncing chevron at bottom + `"scroll to check your invitation"` text fades in after 3s.

**Scroll behavior:** On scroll, the mountain layers shift at different rates (parallax), the photo card scales down slightly, text fades out — classic immersive parallax scroll feel.

---

### 3. Guest Check — "The Scanner"

**Background:** Same dark navy. Section is full-width with a subtle grid overlay (1px lines at 40px spacing, 4% opacity).

**Idle state:**
- Section title: `"ACCESS CHECK"` in monospace, teal
- Subtitle: `"Enter your name to verify your invitation"` — dim text
- Input field:
  - Dark surface (`#0D1E35`) with corner bracket decorations (4 teal L-shaped corners, ~10px)
  - On focus: corners animate outward slightly, border brightens teal
  - Scanning beam: a 2px horizontal teal line sweeps left-to-right repeatedly while the field is focused (CSS `@keyframes` translate)
- `[VERIFY]` button: filled teal, uppercase monospace, 0.1em letter-spacing

**Checking state (700ms delay for drama):**
- Button text → `"SCANNING..."` with animated dots (`···`)
- Input locked, scanning beam accelerates
- A circular progress ring appears around the button

**Granted state:**
- Full card reveals with a fast upward slide + fade in
- Card has a shimmer overlay (thin white diagonal stripe animating across once on entry — the "holographic" effect)
- Card border: teal, pulsing glow (`box-shadow: 0 0 20px #00C9B144`)
- Header bar: `● ACCESS GRANTED`
- Body: Welcome name (large, teal), `CONFIRMED GUEST` badge, brief description
- Calendar buttons: `+ Google Calendar` and `+ Apple Calendar` in styled chips
- **Celebration:** fires the canvas petal burst + gold sparkle particle system from the Classic theme (reused, works on both themes)

**Denied state:**
- Card border: red (`#E24B4A`)
- Quick screen glitch effect (brief 100ms red flash overlay, 2 frames of position jitter on the card)
- `// NO MATCH` in red monospace
- `ERR_GUEST_NOT_FOUND` code chip at the bottom

---

### 4. Event Timeline — "The Itinerary"

**Layout:** Full-width dark section, horizontal scrollable timeline strip

**Day cards (July 2–6):**
- Each card: `100px` wide, dark surface, border
- Active day (July 3, wedding): glowing teal border, `background: #061A14`
- Inactive days: dim, muted colors
- Each card shows: day number (large), day name, activity dots, and for July 3 a `WEDDING DAY` badge
- **Drag/scroll** horizontally on mobile; mouse-wheel horizontal scroll on desktop

**Below the strip:** 2×2 activity cards grid
- Each card has a colored icon + title + subtitle
- **3D flip on hover:** `transform: rotateY(180deg)` reveals the card back face with detail text (timing, what to bring, tips)
- Card themes:
  - Swimming → teal accent
  - Evening fire → amber/fire accent
  - Paddleboarding → teal
  - The ceremony → gold accent

**Scroll-triggered entrance:** Cards fly in from below, staggered 80ms apart, when the section enters the viewport (IntersectionObserver).

---

### 5. Details Strip

Three info chips side by side:
- **Location** (teal accent) — Lake Wenatchee, 2hr drive, Sites 101-197. Clicking opens Google Maps.
- **When** (neutral) — July 2–6, Ceremony 9:00 AM July 3rd
- **Dress code** (amber accent) — Wear Yellow, any shade

Each chip animates in from below on scroll with stagger.

**Packing reminder** (below the chips): Tag cloud of what to bring — Swimsuit, Tent (if needed), Cozy clothes, Summer energy — each tag in a dark pill, teal border.

---

### 6. Save the Date CTA

- Deep dark section, centered
- `SAVE THE DATE` in huge display type with teal on the word `DATE`
- A slow-pulsing teal ambient glow behind the text (CSS keyframes, 3s cycle)
- `+ Google Calendar` (filled teal) and `+ Apple Calendar` (outline) buttons
- On click: ripple/spark animation on the button, then confirmation checkmark appears

---

### 7. Footer

Minimal dark strip:
- Left: `C & P` in teal
- Center: `3 · July · 2026 · Lake Wenatchee`
- Right: `Made with love`

---

## Animation Library Plan

| Effect | Implementation | Notes |
|--------|---------------|-------|
| Letter-by-letter text reveal | CSS animation + JS span-splitting | Applied to hero eyebrow on load |
| Name slide-in | CSS `@keyframes` translateX | Words enter from edges |
| Countdown flip | CSS `rotateX` transform | Triggers on digit change |
| Mouse-tilt photo card | JS `mousemove` → inline style | `perspective(400px)` + rotateX/Y |
| Star twinkle | CSS `@keyframes` opacity | Staggered delays on each star |
| Scroll parallax (mountains) | JS `scroll` → `translateY` | 3 layers at 0.1x, 0.2x, 0.3x rate |
| Scroll progress bar | JS scroll → width % | 2px teal bar at viewport top |
| Scanning beam | CSS `@keyframes` translateX | 2px teal line on input |
| Holographic shimmer | CSS `@keyframes` translateX on pseudo | Diagonal white stripe, one-shot on card reveal |
| Card glow pulse | CSS `@keyframes` box-shadow | 3s ease-in-out loop |
| Screen glitch flash | JS timeout + CSS class toggle | 100ms red overlay, 2 position jitter frames |
| 3D card flip | CSS `transform: rotateY(180deg)` | `transform-style: preserve-3d` |
| Scroll reveal stagger | IntersectionObserver + CSS class | `opacity: 0 → 1`, `translateY(20px → 0)` |
| Petal + sparkle burst | Canvas particle system (reused) | Same engine as Classic theme |
| CTA ripple | CSS radial ripple on click | Pseudo-element expand + fade |
| Ambient glow pulse | CSS `@keyframes` opacity | Behind "Save the Date" title |

---

## New Dependencies Needed

```json
"framer-motion": "^11.x"
```

Framer Motion handles scroll-driven animations, staggered reveals, and layout transitions cleanly. Alternative: hand-roll with IntersectionObserver + CSS — keeps bundle smaller but more work.

---

## Theme Switching Architecture

```jsx
// src/context/ThemeContext.jsx
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('wedding-theme') || 'classic'
  )
  const toggle = () => {
    const next = theme === 'classic' ? 'vivid' : 'classic'
    setTheme(next)
    localStorage.setItem('wedding-theme', next)
  }
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}
```

CSS uses `[data-theme="vivid"]` selectors to override all color tokens. Components conditionally render their classic or vivid variant based on `useContext(ThemeContext)`.

---

## File Structure Changes

```
src/
  context/
    ThemeContext.jsx       ← new
  components/
    Navbar.jsx             ← new (theme toggle lives here)
    Hero.jsx               ← extend with vivid variant
    GuestCheck.jsx         ← extend with scanner variant
    EventTimeline.jsx      ← new (vivid-only horizontal timeline)
    ActivityCards.jsx      ← new (3D flip cards)
    SaveTheDate.jsx        ← new (vivid CTA section)
    FloralDecor.jsx        ← classic only
    Celebration.jsx        ← shared (both themes)
    EventDetails.jsx       ← classic only (vivid uses Timeline + ActivityCards)
  styles/
    tokens.css             ← new (CSS custom properties for both themes)
```

---

## Unsplash Image Credits

For the production build, license and download these free images as local assets:

- **Hero background:** Aerial lake + mountains (teal water, pine forests) — search `lake wenatchee` or `washington mountain lake summer` on unsplash.com
- **Parallax mountain layer:** Dark silhouette peaks — any Washington Cascades shot cropped to a wide dark strip

Use `vite-imagetools` to auto-optimize (WebP + responsive srcset).

---

## Implementation Priority

1. `ThemeContext` + toggle switch in Navbar
2. CSS token overrides for vivid (`[data-theme="vivid"]`)
3. Vivid Hero (parallax mountains, star field, animated names, tilt photo)
4. Vivid Guest Check (scanner input, holographic granted card, glitch denied)
5. Event Timeline + Activity flip cards
6. Details strip + Save the Date CTA
7. Polish: cursor trail, scroll progress bar, page transition between themes

---

*Design reference images: `/docs/original_pdf.pdf` (couple photo, invitation palette) · Unsplash "washington lake summer mountains" (aerial teal lake, sunset peaks)*
