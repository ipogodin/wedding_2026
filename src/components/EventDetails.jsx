import { useState, useEffect } from 'react'

function generateICS() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ciaran & Polina Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'DTSTART:20260703T090000',
    'DTEND:20260706T200000',
    'SUMMARY:Ciaran & Polina Wedding 💛',
    'DESCRIPTION:Wedding ceremony at 9:00 AM\\nDress code: Yellow (any shade)\\nBring swimsuit\\, tent if needed\\, cozy clothes for the evening fire.',
    'LOCATION:Lake Wenatchee North Campground\\, Sites 101-197\\, Wenatchee National Forest\\, WA',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Ciaran & Polina Wedding is in 1 week!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ciaran-polina-wedding.ics'
  a.click()
  URL.revokeObjectURL(url)
}

function getGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Ciaran & Polina Wedding',
    dates: '20260702/20260707',
    details: 'Wedding ceremony at 9:00 AM on July 3rd.\nDress code: Yellow (any shade).\nBring swimsuit, tent if needed, and cozy evening clothes.\nActivities: paddle boarding, swimming, evening fire with marshmallows.',
    location: 'Lake Wenatchee North Campground, Sites 101-197, WA',
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

const ACTIVITIES = [
  { icon: '🏕️', label: 'Camping', detail: 'Sites 101–197' },
  { icon: '🏄', label: 'Paddle boarding', detail: 'Lake Wenatchee' },
  { icon: '🏊', label: 'Swimming', detail: 'Jump in the lake' },
  { icon: '🔥', label: 'Evening fire', detail: 'Marshmallows under the stars' },
]

export default function EventDetails({ visible }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (visible) setTimeout(() => setMounted(true), 100)
  }, [visible])

  if (!visible) return null

  return (
    <section
      style={{
        ...styles.section,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(32px)',
        transition: 'all 0.7s ease',
      }}
    >
      <div style={styles.container}>

        {/* Heading */}
        <div style={styles.headingRow}>
          <div style={styles.headingLine} />
          <h2 style={styles.heading}>The Event</h2>
          <div style={styles.headingLine} />
        </div>

        {/* Key info grid */}
        <div style={styles.infoGrid}>
          <InfoCard
            icon="📅"
            label="Dates"
            value="July 2–6, 2026"
            sub="Ceremony 9:00 AM · July 3rd"
          />
          <InfoCard
            icon="📍"
            label="Location"
            value="Lake Wenatchee"
            sub="North Campground · Sites 101–197 · 2hr drive"
          />
          <InfoCard
            icon="👗"
            label="Dress Code"
            value="Yellow"
            sub="Any shade · Swimsuit + cozy evening clothes"
          />
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Activities */}
        <p style={styles.sectionLabel}>What's in store</p>
        <div style={styles.activitiesGrid}>
          {ACTIVITIES.map(({ icon, label, detail }) => (
            <div key={label} style={styles.activityCard}>
              <span style={styles.activityIcon}>{icon}</span>
              <p style={styles.activityLabel}>{label}</p>
              <p style={styles.activityDetail}>{detail}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Calendar buttons */}
        <p style={styles.sectionLabel}>Save the date</p>
        <div style={styles.calRow}>
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.calBtn, ...styles.calBtnGoogle }}
          >
            <GoogleIcon />
            Add to Google Calendar
          </a>
          <button
            onClick={generateICS}
            style={{ ...styles.calBtn, ...styles.calBtnApple }}
          >
            <AppleIcon />
            Add to Apple Calendar
          </button>
        </div>
        <p style={styles.calNote}>Apple Calendar opens directly · Google opens in your browser</p>

        {/* Packing reminder */}
        <div style={styles.packingCard}>
          <p style={styles.packingTitle}>What to bring</p>
          <div style={styles.packingItems}>
            {['Swimsuit', 'Tent (if needed)', 'Cozy evening clothes', 'Best summer energy 🌻'].map(item => (
              <span key={item} style={styles.packingTag}>{item}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

function InfoCard({ icon, label, value, sub }) {
  return (
    <div style={styles.infoCard}>
      <span style={styles.infoIcon}>{icon}</span>
      <p style={styles.infoLabel}>{label}</p>
      <p style={styles.infoValue}>{value}</p>
      <p style={styles.infoSub}>{sub}</p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 3.96zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}

const styles = {
  section: {
    background: 'linear-gradient(180deg, #FEFAF2 0%, #FDF6E8 100%)',
    padding: '5rem 1rem 6rem',
    borderTop: '1px solid #E8D8B055',
  },
  container: {
    maxWidth: 720,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2.5rem',
    width: '100%',
    justifyContent: 'center',
  },
  headingLine: {
    flex: 1,
    maxWidth: 100,
    height: 1,
    background: 'linear-gradient(90deg, transparent, #C4973A)',
    opacity: 0.5,
  },
  heading: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#7A5C1E',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    width: '100%',
    marginBottom: '0.5rem',
  },
  infoCard: {
    background: '#FFFBF0',
    border: '1px solid #E8D8B0',
    borderRadius: 12,
    padding: '1.25rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 4,
  },
  infoIcon: { fontSize: '1.5rem', marginBottom: 4 },
  infoLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.6rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#B8A070',
  },
  infoValue: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: '#5C4820',
    fontWeight: 500,
  },
  infoSub: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    color: '#9A876A',
    lineHeight: 1.4,
  },
  divider: {
    width: '100%',
    height: 1,
    background: 'linear-gradient(90deg, transparent, #C4973A55, transparent)',
    margin: '2.5rem 0',
  },
  sectionLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.65rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#B8A070',
    marginBottom: '1.25rem',
  },
  activitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
    width: '100%',
  },
  activityCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0.75rem',
    borderRadius: 10,
    border: '1px solid #E8D8B0',
    background: '#FFFDF8',
    gap: 4,
  },
  activityIcon: { fontSize: '1.8rem', marginBottom: 4 },
  activityLabel: {
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: '0.8rem',
    color: '#5C4820',
  },
  activityDetail: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.72rem',
    color: '#9A876A',
    textAlign: 'center',
  },
  calRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '0.75rem',
  },
  calBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0.7rem 1.4rem',
    borderRadius: 40,
    fontFamily: 'var(--font-sans)',
    fontSize: '0.82rem',
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'transform 0.15s',
  },
  calBtnGoogle: {
    background: '#EEF4FF',
    border: '1.5px solid #B3CAFC',
    color: '#1A4DB5',
  },
  calBtnApple: {
    background: '#F2F2F2',
    border: '1.5px solid #D0D0D0',
    color: '#333',
  },
  calNote: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    color: '#B8A070',
    marginBottom: '2rem',
  },
  packingCard: {
    width: '100%',
    background: '#FFFBF0',
    border: '1px solid #E8D8B0',
    borderRadius: 12,
    padding: '1.25rem 1.5rem',
    textAlign: 'center',
  },
  packingTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1rem',
    fontStyle: 'italic',
    color: '#8B7340',
    marginBottom: '0.75rem',
  },
  packingItems: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  packingTag: {
    padding: '4px 12px',
    borderRadius: 20,
    background: '#F5EDD8',
    border: '1px solid #D4B882',
    color: '#7A5C1E',
    fontSize: '0.78rem',
    fontFamily: 'var(--font-sans)',
  },
}
