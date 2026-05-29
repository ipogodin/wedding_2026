import { useState, useRef } from 'react'
import Celebration from './Celebration'

const GUESTS = [
  'Christina', 'Illia', 'Luca', 'Sofia', 'Laura',
  'Oleksii', 'Sergii', 'Anastasiia', 'Matthew', 'Eddie',
  'Kori', 'Bob', 'Alana', 'Sansa', 'Anna',
  'Serhii', 'Rado', 'Arthur', 'Gregory',
]

function normalize(s) {
  return s.trim().toLowerCase()
}

function findGuest(input) {
  const q = normalize(input)
  if (!q) return null
  return GUESTS.find(g => normalize(g) === q || normalize(g).startsWith(q)) || null
}

export default function GuestCheck({ sectionRef, onConfirmed }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle') // idle | checking | found | notFound
  const [foundName, setFoundName] = useState(null)
  const [celebrate, setCelebrate] = useState(false)
  const inputRef = useRef(null)

  function handleCheck() {
    if (!value.trim()) return
    setStatus('checking')
    setTimeout(() => {
      const match = findGuest(value)
      if (match) {
        setFoundName(match)
        setStatus('found')
        setCelebrate(true)
        onConfirmed?.(match)
        setTimeout(() => setCelebrate(false), 4500)
      } else {
        setStatus('notFound')
      }
    }, 700)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleCheck()
  }

  function handleReset() {
    setValue('')
    setStatus('idle')
    setFoundName(null)
    inputRef.current?.focus()
  }

  return (
    <>
      <Celebration active={celebrate} />
      <section ref={sectionRef} style={styles.section}>
        <div style={styles.inner}>
          {/* Decorative heading */}
          <div style={styles.headingWrap}>
            <span style={styles.thinLine} />
            <p style={styles.eyebrow}>Guest Invitation</p>
            <span style={styles.thinLine} />
          </div>
          <h2 style={styles.heading}>Are you on the list?</h2>
          <p style={styles.sub}>Enter your first name to check your invitation</p>

          {/* Input area */}
          {(status === 'idle' || status === 'checking') && (
            <div style={styles.inputGroup}>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={e => { setValue(e.target.value); setStatus('idle') }}
                onKeyDown={handleKeyDown}
                placeholder="Your first name…"
                style={styles.input}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                onClick={handleCheck}
                disabled={!value.trim() || status === 'checking'}
                style={{
                  ...styles.btn,
                  opacity: (!value.trim() || status === 'checking') ? 0.55 : 1,
                }}
              >
                {status === 'checking' ? 'Checking…' : 'Check my invite'}
              </button>
            </div>
          )}

          {/* Found state */}
          {status === 'found' && (
            <div style={styles.resultCard}>
              <div style={styles.resultIconWrap}>
                <span style={styles.resultIcon}>✦</span>
              </div>
              <p style={styles.resultTag}>You're invited!</p>
              <p style={styles.resultName}>Welcome, {foundName}!</p>
              <p style={styles.resultMessage}>
                We're so happy you'll be celebrating with us at&nbsp;Lake&nbsp;Wenatchee.
              </p>
              <button onClick={handleReset} style={styles.resetBtn}>Check another name</button>
            </div>
          )}

          {/* Not found state */}
          {status === 'notFound' && (
            <div style={{ ...styles.resultCard, ...styles.resultCardNeutral }}>
              <div style={styles.resultIconWrap}>
                <span style={{ ...styles.resultIcon, color: '#B8A070' }}>○</span>
              </div>
              <p style={{ ...styles.resultTag, color: '#8B7340', background: '#F5EDD8' }}>Not found</p>
              <p style={{ ...styles.resultName, color: '#5C4820' }}>Hmm, we couldn't find "{value}"</p>
              <p style={styles.resultMessage}>
                Double-check the spelling of your first name, or reach out to Ciaran or Polina directly.
              </p>
              <button onClick={handleReset} style={styles.resetBtn}>Try again</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

const styles = {
  section: {
    minHeight: '60vh',
    background: '#FEFAF2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 1rem',
    borderTop: '1px solid #E8D8B055',
    borderBottom: '1px solid #E8D8B055',
  },
  inner: {
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headingWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  thinLine: {
    display: 'block',
    width: 40,
    height: 1,
    background: '#C4973A',
    opacity: 0.5,
  },
  eyebrow: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.65rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#B8A070',
  },
  heading: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#7A5C1E',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    color: '#9A876A',
    marginBottom: '2.5rem',
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  input: {
    width: '100%',
    maxWidth: 340,
    padding: '0.85rem 1.25rem',
    borderRadius: 40,
    border: '1.5px solid #D4B882',
    background: '#FFFDF8',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    color: '#3D2B0E',
    outline: 'none',
    textAlign: 'center',
    transition: 'border-color 0.2s',
  },
  btn: {
    padding: '0.75rem 2.2rem',
    borderRadius: 40,
    background: '#C4973A',
    border: 'none',
    color: '#FFFDF8',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'transform 0.15s, opacity 0.15s',
  },
  resultCard: {
    width: '100%',
    background: '#FFFBF0',
    border: '1.5px solid #D4B882',
    borderRadius: 16,
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    animation: 'fadeUp 0.5s ease forwards',
  },
  resultCardNeutral: {
    background: '#FAFAF7',
    border: '1.5px solid #D8D0C0',
  },
  resultIconWrap: {
    marginBottom: '0.25rem',
  },
  resultIcon: {
    fontSize: '1.8rem',
    color: '#C4973A',
  },
  resultTag: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.65rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '4px 14px',
    borderRadius: 20,
    background: '#F0E4C0',
    color: '#8B6820',
  },
  resultName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.8rem',
    fontStyle: 'italic',
    color: '#7A5C1E',
    marginTop: '0.25rem',
  },
  resultMessage: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    color: '#9A876A',
    textAlign: 'center',
    lineHeight: 1.6,
    maxWidth: 320,
  },
  resetBtn: {
    marginTop: '0.75rem',
    padding: '0.55rem 1.5rem',
    borderRadius: 40,
    background: 'transparent',
    border: '1px solid #C4973A',
    color: '#8B7340',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    letterSpacing: '0.06em',
  },
}
