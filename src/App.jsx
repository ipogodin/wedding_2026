import { useRef, useState } from 'react'
import ScrollJourney from './components/ScrollJourney'
import GuestCheck from './components/GuestCheck'
import EventDetails from './components/EventDetails'

export default function App() {
  const checkRef = useRef(null)
  const [confirmedGuest, setConfirmedGuest] = useState(null)

  function scrollToCheck() {
    checkRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleConfirmed(name) {
    setConfirmedGuest(name)
    // Scroll to event details after a short delay for the animation
    setTimeout(() => {
      document.getElementById('event-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 1600)
  }

  return (
    <main>
      <ScrollJourney onScrollToCheck={scrollToCheck} />
      <GuestCheck sectionRef={checkRef} onConfirmed={handleConfirmed} />
      <div id="event-details">
        <EventDetails visible={!!confirmedGuest} />
      </div>
      <footer style={styles.footer}>
        <p style={styles.footerText}>Made with love for Ciaran &amp; Polina · 4 July 2026</p>
        <p style={styles.footerSub}>Lake Wenatchee North Campground · Washington</p>
      </footer>
    </main>
  )
}

const styles = {
  footer: {
    background: '#3D2B0E',
    padding: '2rem 1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  footerText: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '1rem',
    color: '#E8C87A',
  },
  footerSub: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    color: '#8B7340',
  },
}
