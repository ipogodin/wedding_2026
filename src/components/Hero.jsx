import { useState, useEffect } from 'react'
import { FloralTopLeft, FloralTopRight, FloralBottomLeft, FloralBottomRight } from './FloralDecor'
import couplePhoto from '../../couple.jpg'

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

export default function Hero({ onScrollToCheck }) {
  const { days, hours, minutes, seconds } = useCountdown('2026-07-03T09:00:00')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={styles.section}>
      <FloralTopLeft opacity={0.5} />
      <FloralTopRight opacity={0.5} />
      <FloralBottomLeft opacity={0.4} />
      <FloralBottomRight opacity={0.4} />

      {/* Gold divider line top */}
      <div style={styles.goldDivider} />

      <div style={{ ...styles.content, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.9s ease' }}>
        <p style={styles.pretitle}>The Wedding of</p>

        {/* Oval photo */}
        <div style={styles.ovalWrapper}>
          <div style={styles.ovalBorder}>
            <img src={couplePhoto} alt="Ciaran and Polina" style={styles.ovalPhoto} />
          </div>
        </div>

        {/* Names */}
        <h1 style={styles.names}>
          <span style={styles.name}>Ciaran</span>
          <span style={styles.amp}>&amp;</span>
          <span style={styles.name}>Polina</span>
        </h1>

        {/* Date & location */}
        <p style={styles.dateLocation}>3 · July · 2026 &nbsp;·&nbsp; Lake Wenatchee, WA</p>

        {/* Thin gold rule */}
        <div style={styles.thinRule} />

        {/* Countdown */}
        <div style={styles.countdownRow}>
          {[
            { val: days, label: 'Days' },
            { val: hours, label: 'Hours' },
            { val: minutes, label: 'Min' },
            { val: seconds, label: 'Sec' },
          ].map(({ val, label }, i) => (
            <div key={i} style={styles.countBox}>
              <span style={styles.countNum}>{String(val ?? '--').padStart(2, '0')}</span>
              <span style={styles.countLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onScrollToCheck} style={styles.cta}>
          Are you on the list?
        </button>

        <p style={styles.scrollHint}>↓ scroll to check your invitation</p>
      </div>

      {/* Gold divider line bottom */}
      <div style={styles.goldDivider} />
    </section>
  )
}

const styles = {
  section: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #FEFAF2 0%, #FDF6E8 50%, #FEFAF2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem 1rem',
  },
  goldDivider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #C4973A55, #C4973A, #C4973A55, transparent)',
    position: 'absolute',
    left: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
    gap: '0.15rem',
  },
  pretitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#8B7340',
    marginBottom: '1.2rem',
  },
  ovalWrapper: {
    marginBottom: '1.5rem',
  },
  ovalBorder: {
    width: 220,
    height: 280,
    borderRadius: '50%',
    border: '2px solid #C4973A',
    padding: 4,
    boxShadow: '0 0 0 1px #E8C87A55, 0 8px 40px rgba(196,151,58,0.18)',
    overflow: 'hidden',
    background: '#FEFAF2',
  },
  ovalPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  names: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.4rem, 6vw, 4rem)',
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#7A5C1E',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    lineHeight: 1.1,
  },
  name: {},
  amp: {
    color: '#C4973A',
    fontSize: '0.8em',
  },
  dateLocation: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#8B7340',
    marginTop: '0.5rem',
  },
  thinRule: {
    width: 80,
    height: 1,
    background: '#C4973A',
    opacity: 0.5,
    margin: '1rem 0',
  },
  countdownRow: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.8rem',
  },
  countBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  countNum: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.2rem',
    fontWeight: 500,
    color: '#C4973A',
    lineHeight: 1,
    minWidth: '2.5rem',
    textAlign: 'center',
  },
  countLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.62rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#B8A070',
  },
  cta: {
    padding: '0.75rem 2.5rem',
    borderRadius: '40px',
    background: 'transparent',
    border: '1.5px solid #C4973A',
    color: '#7A5C1E',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    marginTop: '0.5rem',
  },
  scrollHint: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    color: '#B8A070',
    marginTop: '1rem',
    letterSpacing: '0.04em',
  },
}
