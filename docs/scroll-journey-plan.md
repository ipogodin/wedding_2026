# Scroll Journey — Cinematic Intro Plan
**"From the USA to the Lake" — Scroll-Driven Geographic Reveal**

---

## The Concept

A scroll-jacked cinematic sequence that replaces the standard hero section. The user arrives at a dark satellite-style map of the United States. As they scroll down, the map zooms in — from the whole country, to Washington state, to the Cascades, to Lake Wenatchee — then dissolves into a real aerial photograph of the lake itself. The wedding names and invitation emerge from the water surface. Only after this 6-scene journey does the page unlock and normal scrolling resume.

**Inspiration:** Apple iPhone product pages, The Pudding data journalism, Stripe's homepage.  
**WOW factor:** The user doesn't read about where the wedding is — they *travel there*.

---

## Scene Sequence

| Scene | Scroll % | What the user sees |
|-------|----------|-------------------|
| 01 | 0% | Dark night satellite map of the USA. Pulsing amber pin on the Pacific Northwest. "Lake Wenatchee, WA · scroll to begin" |
| 02 | 0–15% | Map zooms into Washington state. State outline glows teal. Pin tightens over the Cascades. |
| 03 | 15–35% | Zoom into Cascade mountain range. Mountain silhouettes visible. "Lake Wenatchee" label fades in. |
| 04 | 35–55% | Map begins dissolving. Aerial lake photo cross-fades in underneath. |
| 05 | 55–75% | Lake photo fills the screen. Camera continues descending (scale 1.3→1). Names ghosted on the water surface at low opacity. |
| 06 | 75–100% | Full wedding reveal: names burst in, couple photo drops in, date and CTA animate up. Scroll unlocks. |

**Total pinned scroll distance:** ~500vh  
**Total page height after unlock:** Normal (guest check + details sections below)

---

## How Scroll-Jacking Works (Technical)

The "pinned section" model:
- A tall container div (`height: 600vh`) sits at the top of the page
- GSAP `ScrollTrigger.pin()` keeps the viewport content fixed in place while the user's scroll position advances through the container's height
- The raw scroll position is divided by the total container height to produce a `0 → 1` progress value
- Every animation property (opacity, scale, translateY, D3 projection parameters) is mapped to a point on this 0→1 curve
- When progress hits 1.0, the pin releases and normal scrolling resumes

The user's **scroll wheel moves normally** — the browser scrolls the document. GSAP just pins the visual frame while using that scroll distance as an animation scrubber.

---

## Tech Stack (VERIFIED — cross-checked with Gemini, Perplexity, ChatGPT)

> **Decision:** No live interactive map at runtime. Pre-render the geographic zoom as video, scrub with GSAP. Real aerial photo for the emotional final act. DOM text for the invitation reveal.

### GSAP + ScrollTrigger — scroll engine
The industry standard for this pattern (used by Apple, Stripe, Linear). Key features used:
- `ScrollTrigger.pin()` — pins the container
- `scrub: true` — ties animation progress directly to scroll position
- Video scrub: `gsap.to(video, { currentTime: video.duration, scrollTrigger: { scrub: true } })`

```bash
npm install gsap
```

### Pre-rendered map zoom video — geographic sequence
**NOT live Mapbox. NOT Google Earth Studio.** Instead:
1. Open [Mapbox Studio](https://studio.mapbox.com) — design the dark satellite style (free account)
2. Use [Mapbox GL JS in a local browser page](https://docs.mapbox.com/mapbox-gl-js/) to set up 4 camera keyframes and screen-record the flyover at 60fps
3. Export as `public/map-zoom.webm` (primary) + `public/map-zoom.mp4` (Safari/iOS fallback)
4. First frame as `public/map-zoom-poster.jpg` for instant first-paint

**Why not Google Earth Studio:** Requires visible attribution, commercial use restrictions.  
**Why not live Mapbox at runtime:** flyTo() + scroll sync = tile-loading jank, device-dependent, hard to art-direct.

Camera keyframes for the screen-record:
```js
// Frame 1: Full USA, zoom ~3
// Frame 2: Pacific Northwest, zoom ~5.5
// Frame 3: Washington + Cascades, zoom ~8
// Frame 4: Lake Wenatchee close, zoom ~11.5, pitch 40°
// [-120.8571, 47.8196] is the lake center
```

**Video spec:** 8–10 seconds, 1920×1080, webm/vp9 + mp4/h264, target <8MB total

### Canvas crossfade — video-to-photo transition
Two absolutely-positioned layers (`<video>` map zoom + `<img>` lake aerial) with GSAP driving opacity independently. The lake photo preloads during the pinned section's early scroll.

### Framer Motion — Scene 06 wedding reveal
Used only for the staggered burst of elements when the wedding content appears. Each element (eyebrow, names, photo card, date, CTA) has a `variants` entry with a staggered `delay`. GSAP triggers the Framer Motion sequence by setting a React state flag.

**Invitation text stays as DOM — never baked into video.** This keeps it accessible, editable, and crisp at all resolutions.

---

## Video Scrub Implementation

The map zoom runs as a pre-rendered video scrubbed by GSAP:

```jsx
// src/components/ScrollJourney/index.jsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function ScrollJourney() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    // Wait for video metadata so duration is known
    const init = () => {
      gsap.to(video, {
        currentTime: video.duration,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=4000',   // 4000px of scroll = full intro
          scrub: 0.5,
          pin: true,
          onUpdate: (self) => {
            // Trigger lake photo + invite reveal at 65% and 80%
            if (self.progress > 0.65) setShowLake(true)
            if (self.progress > 0.80) setShowReveal(true)
          }
        }
      })
    }
    video.readyState >= 1 ? init() : video.addEventListener('loadedmetadata', init)
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div ref={containerRef} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster="/map-zoom-poster.jpg"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src="/map-zoom.webm" type="video/webm" />
        <source src="/map-zoom.mp4" type="video/mp4" />
      </video>
      {/* Lake photo and invite reveal layers overlay here */}
    </div>
  )
}
```

**Important iOS/Safari notes:**
- `muted` + `playsInline` are mandatory for autoplay
- `preload="auto"` needed so `currentTime` scrubbing works
- Test on real iOS device — video scrub can be inconsistent in iOS low-power mode
- Keep video under 10MB total for fast preload

---

## Layer Stack (absolutely positioned, full-viewport)

```
Layer 4 (top):    Wedding UI elements     — opacity: 0, animates in at 75% scroll
Layer 3:          Lake aerial photo        — opacity: 0, fades in 55–70% scroll
Layer 2:          D3 SVG map (or frames)   — opacity: 1, fades out 55–70% scroll
Layer 1 (base):   Dark navy background    — always visible, never changes
```

All layers: `position: absolute; top: 0; left: 0; width: 100%; height: 100%`  
Container: `position: sticky; top: 0; height: 100vh; overflow: hidden`

---

## Aerial Photo Strategy

**Option A — Unsplash free image (fastest)**  
License a photo from Unsplash search "lake wenatchee" or "washington mountain lake summer".  
Best match found: aerial teal-water lake surrounded by pine forests and peaks (similar to Diablo Lake in North Cascades — visually identical to Lake Wenatchee's aesthetic).  
Download, optimize with `vite-imagetools` to WebP, multiple sizes.

**Option B — Extract from the invitation PDF**  
Page 2 of `docs/original_pdf.pdf` contains an existing Lake Wenatchee photo. Already available in the project.

**Recommended:** Use Option B for authenticity (it's the *actual* lake from the invitation), supplement with Option A for a wider/aerial crop if needed.

---

## Animation Detail Per Transition

### Scene 1 → 2 (0–15% scroll)
```
D3 map: scale 1000 → 4000, translate shifts northwest
USA outline: opacity 1 → 0.3
WA state outline: opacity 0 → 1, stroke brightens to teal
Pin dot: scale 1 → 2, pulse ring expands
```

### Scene 2 → 3 (15–35% scroll)
```
D3 map: scale 4000 → 28000, translate zooms into Cascades
Other states: opacity → 0 (only WA visible)
Mountain SVG silhouette: opacity 0 → 1
"Lake Wenatchee" label: opacity 0 → 1, slight translateY
"Cascades" text: fades out
```

### Scene 3 → 4 (35–55% scroll)
```
D3 SVG map: opacity 1 → 0
Lake aerial photo: opacity 0 → 1
Background: color transitions from #080E1C → #071A22 (slightly warmer)
```

### Scene 4 → 5 (55–75% scroll)
```
Lake photo: transform scale(1.35) → scale(1.0)  — "descending into the lake"
Names overlay: opacity 0 → 0.12  — ghosted on the water
Photo vignette: subtle dark edge, narrows
```

### Scene 5 → 6 (75–100% scroll)
```
Lake photo: remains at scale(1.0), slight brightness increase
Names: opacity 0.12 → 1, slight blur(4px) → blur(0) — "emerging from the water"
Couple photo card: translateY(40px) → translateY(0), opacity 0 → 1
Date line: opacity 0 → 1, delay 200ms
CTA button: opacity 0 → 1, scale(0.9) → scale(1), delay 400ms
```

---

## Scene 6 Wedding Reveal — Framer Motion Config

```jsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
// Elements in order: eyebrow → names → photo card → date → CTA
```

GSAP calls `setRevealVisible(true)` (React state) when scroll progress crosses 0.75. Framer Motion then runs the stagger from that moment.

---

## Mobile Fallback (< 768px)

No scroll-jacking on mobile — touch scroll-hijacking feels broken on iOS/Android.

Replacement: simple IntersectionObserver sequence:
1. Page loads with the dark USA map visible (static, no animation)
2. User scrolls naturally
3. When the map section enters viewport: plays a 4-second CSS animation auto-sequence (zoom → crossfade → reveal) without any scroll control
4. After the animation: normal content below

---

## New Components

```
src/
  components/
    ScrollJourney/
      index.jsx             ← Orchestrator. Owns the GSAP timeline + pin.
      MapLayer.jsx           ← D3 SVG map (or pre-rendered frames). Receives progress prop.
      LakePhotoLayer.jsx     ← Aerial photo img. Receives opacity from progress.
      WeddingReveal.jsx      ← Scene 6 content. Framer Motion stagger reveal.
      useScrollProgress.js   ← Hook: returns 0→1 progress from GSAP ScrollTrigger.
      frames/
        frame-usa.svg         ← Pre-rendered D3 frame 1
        frame-wa.svg          ← Pre-rendered D3 frame 2
        frame-cascades.svg    ← Pre-rendered D3 frame 3
```

---

## New Dependencies

```json
"gsap": "^3.12.x",
"framer-motion": "^11.x"
```

D3 and TopoJSON are **not needed** — the map zoom is pre-rendered video, not runtime SVG.

## Asset Production Steps (one-time, before coding)

1. **Create a free Mapbox account** at mapbox.com
2. In Mapbox Studio, duplicate the "Satellite Streets" style and strip it down: remove labels, roads, reduce to dark satellite base
3. Open a local HTML file with Mapbox GL JS. Set the starting camera (zoom 2.5, center USA), animate to the 4 keyframes, screen-record at 60fps
4. Trim in iMovie/DaVinci/ffmpeg to 8s, export as H.264 mp4
5. Convert to webm/vp9: `ffmpeg -i map-zoom.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 map-zoom.webm`
6. Extract first frame as poster: `ffmpeg -ss 0 -i map-zoom.mp4 -frames:v 1 map-zoom-poster.jpg`
7. For the lake aerial photo: extract from `docs/original_pdf.pdf` page 2 (already available), or license from Unsplash
8. Place all files in `public/`: `map-zoom.webm`, `map-zoom.mp4`, `map-zoom-poster.jpg`, `lake-aerial.jpg`

---

## Implementation Order

1. **Produce assets first** (see Asset Production Steps above) — nothing works without `map-zoom.webm` + `lake-aerial.jpg`
2. Scaffold `ScrollJourney/index.jsx` with GSAP pin + video scrub (`video.currentTime` tied to scroll progress)
3. Build `LakePhotoLayer.jsx` — `<img>` overlaid at `position: absolute`, fades in at 65% scroll
4. Build `WeddingReveal.jsx` — Framer Motion stagger, triggered when progress > 0.80
5. Wire all layers with absolute positioning inside the pinned container
6. Add mobile fallback (auto-play CSS animation, no pin, static poster image)
7. Polish: vignette overlay, name ghost fade, background color transition
8. Performance audit: ensure 60fps on mid-range hardware (Chrome DevTools Performance tab)
9. iOS test: confirm video scrub works on real iPhone (Safari + low-power mode)

---

## Geographic Coordinates

- Lake Wenatchee: `[-120.8571, 47.8196]`
- Wenatchee city: `[-120.3103, 47.4235]`  
- Washington state center: `[-120.5015, 47.3826]`
- Pacific Northwest bounding box: `[[-124.8, 45.5], [-116.9, 49.1]]`

---

## Reference Sites Using This Pattern

- apple.com/iphone — product feature scroll-driven reveals
- stripe.com — animated infrastructure diagrams tied to scroll
- linear.app — scroll-driven feature showcase
- pudding.cool — data journalism with scroll-controlled narrative
- cosmos.so — dark immersive scroll experience

---

*Color palette, typography, and component architecture: see `vivid-design-plan.md`*  
*Storyboard frames: in-conversation mockups (scroll_journey_storyboard widget)*
