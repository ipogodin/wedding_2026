import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LakePhotoLayer from './LakePhotoLayer'
import WeddingReveal from './WeddingReveal'

gsap.registerPlugin(ScrollTrigger)

// How many px of scroll the pinned intro consumes
const SCROLL_DISTANCE = 4000

export default function ScrollJourney({ onScrollToCheck }) {
  const containerRef  = useRef(null)
  const stickyRef     = useRef(null)
  const videoRef      = useRef(null)
  const [lakeOpacity,   setLakeOpacity]   = useState(0)
  const [revealVisible, setRevealVisible] = useState(false)

  // ── Reduced motion: skip straight to reveal ──────────────────
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) {
      setLakeOpacity(1)
      setRevealVisible(true)
      return
    }

    const video = videoRef.current
    if (!video) return

    const init = () => {
      // Scrub video.currentTime with scroll progress
      const scrubTween = gsap.to(video, {
        currentTime: video.duration || 10,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${SCROLL_DISTANCE}`,
          scrub: 0.5,
          pin: stickyRef.current,
          pinSpacing: true,
          onUpdate(self) {
            const p = self.progress

            // 60–80%: lake photo fades in
            const lakeP = Math.max(0, Math.min(1, (p - 0.60) / 0.20))
            setLakeOpacity(lakeP)

            // 78%+: wedding reveal triggers
            if (p >= 0.78 && !revealVisible) setRevealVisible(true)
            if (p < 0.78 && revealVisible)   setRevealVisible(false)
          },
        },
      })

      return () => {
        scrubTween.scrollTrigger?.kill()
        scrubTween.kill()
      }
    }

    let cleanup
    if (video.readyState >= 1) {
      cleanup = init()
    } else {
      const handler = () => { cleanup = init() }
      video.addEventListener('loadedmetadata', handler)
      return () => video.removeEventListener('loadedmetadata', handler)
    }

    return () => cleanup?.()
  }, [prefersReduced])

  // ── Reduced motion fallback ────────────────────────────────────
  if (prefersReduced) {
    return (
      <div style={styles.reducedWrapper}>
        <LakePhotoLayer opacity={1} />
        <WeddingReveal visible onScrollToCheck={onScrollToCheck} />
      </div>
    )
  }

  return (
    /* Tall container that GSAP pins inside */
    <div ref={containerRef} style={{ height: `calc(100vh + ${SCROLL_DISTANCE}px)` }}>

      {/* Sticky viewport — this is what the user sees */}
      <div ref={stickyRef} style={styles.sticky}>

        {/* Layer 1: dark background */}
        <div style={styles.bg} />

        {/* Layer 2: map zoom video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster="/wenachee_map_1-poster.jpg"
          style={styles.video}
        >
          <source src="/wenachee_map_1.mp4" type="video/mp4" />
        </video>

        {/* Layer 3: lake aerial photo (fades in at 60% scroll) */}
        <LakePhotoLayer opacity={lakeOpacity} />

        {/* Layer 4: wedding reveal (animates in at 78% scroll) */}
        <WeddingReveal visible={revealVisible} onScrollToCheck={onScrollToCheck} />

        {/* Scroll hint — only visible at the very start */}
        <div style={{
          ...styles.scrollHint,
          opacity: Math.max(0, 1 - lakeOpacity * 3),
        }}>
          <span style={styles.scrollText}>scroll to begin</span>
          <div style={styles.scrollChevron}>↓</div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  sticky: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflow: 'hidden',
    background: '#02050F',
  },
  reducedWrapper: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    background: '#02050F',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: '#02050F',
  },
  video: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  scrollHint: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    zIndex: 20,
    transition: 'opacity 0.3s',
    pointerEvents: 'none',
  },
  scrollText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 500,
    letterSpacing: '0.25em',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
  },
  scrollChevron: {
    fontSize: '1rem',
    color: '#00C9B1',
    animation: 'bounce 2s ease-in-out infinite',
  },
}
