import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LakePhotoLayer from './LakePhotoLayer'
import WeddingReveal from './WeddingReveal'

gsap.registerPlugin(ScrollTrigger)

const SCROLL_DISTANCE = 4000

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

// ── Mobile auto-play version (no scroll-jacking) ─────────────────
function MobileJourney({ onScrollToCheck }) {
  const videoRef = useRef(null)
  const [phase, setPhase] = useState('video') // video | lake | reveal

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Play the video through once, then crossfade to lake photo + reveal
    video.play().catch(() => {
      // Autoplay blocked — skip straight to reveal
      setPhase('reveal')
    })

    const onEnded = () => {
      setPhase('lake')
      setTimeout(() => setPhase('reveal'), 1000)
    }

    // Safety timeout — if video doesn't end in 15s, proceed anyway
    const timeout = setTimeout(() => {
      if (phase === 'video') { setPhase('lake'); setTimeout(() => setPhase('reveal'), 1000) }
    }, 15000)

    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('ended', onEnded)
      clearTimeout(timeout)
    }
  }, [])

  const lakeOpacity = phase === 'lake' ? 1 : phase === 'reveal' ? 1 : 0

  return (
    <div style={styles.mobileWrapper}>
      <div style={styles.bg} />

      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster="/wenachee_map_1-poster.jpg"
        style={{
          ...styles.video,
          opacity: phase === 'video' ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <source src="/wenachee_map_1.mp4" type="video/mp4" />
      </video>

      <div style={{ transition: 'opacity 1s ease', opacity: lakeOpacity }}>
        <LakePhotoLayer opacity={1} />
      </div>

      <WeddingReveal visible={phase === 'reveal'} onScrollToCheck={onScrollToCheck} />
    </div>
  )
}

// ── Desktop scroll-scrub version ─────────────────────────────────
export default function ScrollJourney({ onScrollToCheck }) {
  const containerRef  = useRef(null)
  const stickyRef     = useRef(null)
  const videoRef      = useRef(null)
  const [lakeOpacity,   setLakeOpacity]   = useState(0)
  const [revealVisible, setRevealVisible] = useState(false)
  const [mobile] = useState(isMobile)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    // Mobile and reduced-motion both skip GSAP entirely
    if (mobile || prefersReduced) {
      setLakeOpacity(1)
      setRevealVisible(true)
      return
    }

    const video = videoRef.current
    if (!video) return

    const init = () => {
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
            const lakeP = Math.max(0, Math.min(1, (p - 0.60) / 0.20))
            setLakeOpacity(lakeP)
            if (p >= 0.78) setRevealVisible(true)
            else setRevealVisible(false)
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
  }, [mobile, prefersReduced])

  // ── Mobile / reduced-motion fallback ─────────────────────────
  if (mobile) return <MobileJourney onScrollToCheck={onScrollToCheck} />

  if (prefersReduced) {
    return (
      <div style={styles.reducedWrapper}>
        <LakePhotoLayer opacity={1} />
        <WeddingReveal visible onScrollToCheck={onScrollToCheck} />
      </div>
    )
  }

  // ── Desktop scroll-scrub ──────────────────────────────────────
  return (
    <div ref={containerRef} style={{ height: `calc(100vh + ${SCROLL_DISTANCE}px)` }}>
      <div ref={stickyRef} style={styles.sticky}>
        <div style={styles.bg} />

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

        <LakePhotoLayer opacity={lakeOpacity} />
        <WeddingReveal visible={revealVisible} onScrollToCheck={onScrollToCheck} />

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
  mobileWrapper: {
    position: 'relative',
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
