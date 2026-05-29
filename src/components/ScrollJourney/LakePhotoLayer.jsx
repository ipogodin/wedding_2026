// Lake aerial photo layer — fades in over the map video at ~65% scroll progress
export default function LakePhotoLayer({ opacity }) {
  return (
    <div style={{ ...styles.wrapper, opacity }}>
      <img
        src="/wenachee_lake.webp"
        alt="Lake Wenatchee aerial"
        style={styles.photo}
      />
      {/* Subtle dark bottom gradient so wedding text reads cleanly */}
      <div style={styles.gradient} />
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.05s linear',
    willChange: 'opacity',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    // Cinematic grade — deepens teal water, cools sky, adds drama
    filter: 'saturate(1.3) contrast(1.1) brightness(0.82) hue-rotate(-8deg)',
    display: 'block',
  },
  gradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(2,5,15,0.55) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}
