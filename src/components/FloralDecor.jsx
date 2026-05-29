export function FloralTopLeft({ opacity = 0.45 }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, left: 0, width: 220, height: 220, opacity, pointerEvents: 'none' }}
    >
      {/* Blue flower large */}
      <circle cx="38" cy="42" r="30" fill="#6B9AB8" opacity="0.55" />
      <circle cx="25" cy="28" r="20" fill="#6B9AB8" opacity="0.4" />
      <circle cx="58" cy="22" r="16" fill="#6B9AB8" opacity="0.35" />
      <circle cx="14" cy="62" r="18" fill="#5588A8" opacity="0.4" />
      {/* Petals */}
      <ellipse cx="38" cy="14" rx="8" ry="14" fill="#A8C8DC" opacity="0.5" transform="rotate(-10 38 14)" />
      <ellipse cx="12" cy="30" rx="7" ry="12" fill="#A8C8DC" opacity="0.45" transform="rotate(40 12 30)" />
      {/* Gold leaf stems */}
      <path d="M80 0 C70 40 50 80 20 110" stroke="#C4973A" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="95" cy="18" rx="10" ry="16" fill="#C4973A" opacity="0.3" transform="rotate(-25 95 18)" />
      <ellipse cx="72" cy="35" rx="8" ry="13" fill="#C4973A" opacity="0.25" transform="rotate(15 72 35)" />
      {/* Yellow watercolor blob */}
      <circle cx="130" cy="8" r="22" fill="#E8C87A" opacity="0.35" />
      <circle cx="115" cy="18" r="14" fill="#E8C87A" opacity="0.25" />
    </svg>
  )
}

export function FloralTopRight({ opacity = 0.45 }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, right: 0, width: 220, height: 220, opacity, pointerEvents: 'none' }}
    >
      {/* Yellow flower */}
      <circle cx="182" cy="38" r="32" fill="#E8C87A" opacity="0.6" />
      <circle cx="198" cy="22" r="22" fill="#E8C87A" opacity="0.45" />
      <circle cx="162" cy="20" r="18" fill="#E8C87A" opacity="0.4" />
      <ellipse cx="182" cy="8" rx="10" ry="16" fill="#F0D090" opacity="0.5" />
      <ellipse cx="208" cy="42" rx="8" ry="14" fill="#F0D090" opacity="0.45" transform="rotate(20 208 42)" />
      {/* Blue accent flower */}
      <circle cx="210" cy="80" r="18" fill="#6B9AB8" opacity="0.4" />
      <circle cx="220" cy="65" r="12" fill="#6B9AB8" opacity="0.3" />
      {/* Gold stems */}
      <path d="M140 0 C150 35 165 70 190 100" stroke="#C4973A" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="125" cy="15" rx="9" ry="15" fill="#C4973A" opacity="0.3" transform="rotate(20 125 15)" />
    </svg>
  )
}

export function FloralBottomLeft({ opacity = 0.45 }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, left: 0, width: 220, height: 220, opacity, pointerEvents: 'none' }}
    >
      {/* Large blue flower */}
      <circle cx="32" cy="185" r="34" fill="#6B9AB8" opacity="0.55" />
      <circle cx="14" cy="170" r="22" fill="#6B9AB8" opacity="0.4" />
      <circle cx="58" cy="200" r="20" fill="#5588A8" opacity="0.4" />
      <ellipse cx="8" cy="180" rx="8" ry="14" fill="#A8C8DC" opacity="0.5" transform="rotate(-20 8 180)" />
      {/* Yellow blobs */}
      <circle cx="100" cy="210" r="22" fill="#E8C87A" opacity="0.4" />
      <circle cx="82" cy="220" r="14" fill="#E8C87A" opacity="0.3" />
      {/* Gold stem */}
      <path d="M20 140 C40 160 60 190 80 220" stroke="#C4973A" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="52" cy="158" rx="8" ry="13" fill="#C4973A" opacity="0.3" transform="rotate(30 52 158)" />
    </svg>
  )
}

export function FloralBottomRight({ opacity = 0.45 }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, width: 220, height: 220, opacity, pointerEvents: 'none' }}
    >
      {/* Pink/rose tones */}
      <circle cx="188" cy="188" r="30" fill="#D4A8B8" opacity="0.5" />
      <circle cx="205" cy="205" r="20" fill="#D4A8B8" opacity="0.4" />
      <circle cx="170" cy="205" r="22" fill="#C898A8" opacity="0.4" />
      <ellipse cx="210" cy="172" rx="8" ry="14" fill="#E0B8C8" opacity="0.45" transform="rotate(15 210 172)" />
      {/* Yellow accent */}
      <circle cx="145" cy="210" r="18" fill="#E8C87A" opacity="0.4" />
      {/* Gold leaf */}
      <path d="M200 140 C195 165 188 195 175 220" stroke="#C4973A" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="168" cy="168" rx="9" ry="15" fill="#C4973A" opacity="0.3" transform="rotate(-20 168 168)" />
    </svg>
  )
}
