import { useState } from 'react'
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
}

const item = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
}

const nameVariant = {
  hidden:  { opacity: 0, letterSpacing: '0.4em' },
  visible: { opacity: 1, letterSpacing: '0.12em', transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
}

const photoVariant = {
  hidden:  { opacity: 0, y: 36, scale: 0.92 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

export default function WeddingReveal({ visible, onScrollToCheck }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    const rx = ((e.clientY - cy) / (rect.height / 2)) * 7
    const ry = ((e.clientX - cx) / (rect.width  / 2)) * -7
    setTilt({ x: rx, y: ry })
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      style={styles.wrapper}
    >
      {/* Vignette */}
      <div style={styles.vignette} />

      {/* Content */}
      <div style={styles.content}>
        <motion.p variants={item} style={styles.eyebrow}>
          YOU ARE INVITED
        </motion.p>

        {/* Couple photo — oval frame with tilt on hover */}
        <motion.div
          variants={photoVariant}
          style={styles.photoFrame}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <img src="/couple.jpg" alt="Ciaran & Polina" style={styles.photo} />
          {/* Teal glow ring */}
          <div style={styles.photoGlow} />
        </motion.div>

        <motion.h1 variants={nameVariant} style={styles.names}>
          CIARAN &amp; POLINA
        </motion.h1>

        <motion.div variants={item} style={styles.divider} />

        <motion.p variants={item} style={styles.date}>
          3 · July · 2026
        </motion.p>

        <motion.p variants={item} style={styles.location}>
          Lake Wenatchee, Washington
        </motion.p>

        <motion.button
          variants={item}
          style={styles.cta}
          onClick={onScrollToCheck}
          whileHover={{ scale: 1.04, backgroundColor: '#00E5CE' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          Check My Invitation
        </motion.button>
      </div>
    </motion.div>
  )
}

const styles = {
  wrapper: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,5,15,0.75) 100%)',
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
    padding: '2rem',
    pointerEvents: 'auto',
  },
  eyebrow: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(0.55rem, 1.2vw, 0.7rem)',
    fontWeight: 500,
    letterSpacing: '0.3em',
    color: '#00C9B1',
    textTransform: 'uppercase',
  },
  photoFrame: {
    position: 'relative',
    width: 'clamp(110px, 14vw, 160px)',
    height: 'clamp(140px, 18vw, 200px)',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #00C9B1',
    boxShadow: '0 0 28px #00C9B144, 0 8px 32px rgba(0,0,0,0.5)',
    cursor: 'default',
    flexShrink: 0,
    perspective: 400,
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    display: 'block',
  },
  photoGlow: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    boxShadow: 'inset 0 0 20px rgba(0,201,177,0.15)',
    pointerEvents: 'none',
  },
  names: {
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    fontSize: 'clamp(2rem, 5.5vw, 4rem)',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#FFFFFF',
    textShadow: '0 2px 40px rgba(0,0,0,0.6)',
    lineHeight: 1.1,
  },
  divider: {
    width: 60,
    height: 1,
    background: 'linear-gradient(90deg, transparent, #00C9B1, transparent)',
    margin: '0.25rem 0',
  },
  date: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
    fontWeight: 400,
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.85)',
  },
  location: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)',
    fontWeight: 400,
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  cta: {
    marginTop: '0.75rem',
    padding: '0.85rem 2.2rem',
    background: '#00C9B1',
    color: '#02050F',
    border: 'none',
    borderRadius: 4,
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
}
