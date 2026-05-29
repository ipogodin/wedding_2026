import { useEffect, useRef } from 'react'

const PETAL_COLORS = ['#6B9AB8', '#A8C8DC', '#E8C87A', '#C4973A', '#D4B882', '#F0D090', '#8EB8CC']
const GOLD_COLORS = ['#FFD700', '#C4973A', '#E8C87A', '#F5E090', '#FFE44D']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

class Particle {
  constructor(canvas, type) {
    this.canvas = canvas
    this.type = type // 'petal' | 'sparkle'
    this.reset(true)
  }

  reset(fromTop = false) {
    const { width, height } = this.canvas
    this.x = randomBetween(0, width)
    this.y = fromTop ? randomBetween(-120, -10) : randomBetween(-120, height + 20)
    this.size = this.type === 'petal' ? randomBetween(6, 14) : randomBetween(2, 5)
    this.speedY = randomBetween(1.2, 3.5)
    this.speedX = randomBetween(-1.2, 1.2)
    this.rotation = randomBetween(0, Math.PI * 2)
    this.rotationSpeed = randomBetween(-0.04, 0.04)
    this.opacity = randomBetween(0.6, 1)
    this.color = this.type === 'petal'
      ? PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]
      : GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)]
    this.wobble = randomBetween(0, Math.PI * 2)
    this.wobbleSpeed = randomBetween(0.02, 0.06)
    this.life = 1
    this.decay = randomBetween(0.003, 0.008)
  }

  update() {
    this.y += this.speedY
    this.x += this.speedX + Math.sin(this.wobble) * 0.6
    this.wobble += this.wobbleSpeed
    this.rotation += this.rotationSpeed
    this.life -= this.decay
    if (this.y > this.canvas.height + 20 || this.life <= 0) this.reset(true)
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity * Math.min(this.life * 3, 1)
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.fillStyle = this.color

    if (this.type === 'petal') {
      ctx.beginPath()
      ctx.ellipse(0, 0, this.size * 0.45, this.size, 0, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // 4-point star sparkle
      const r = this.size
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4
        const len = i % 2 === 0 ? r : r * 0.38
        ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len)
      }
      ctx.closePath()
      ctx.fill()
    }

    ctx.restore()
  }
}

export default function Celebration({ active }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const particlesRef = useRef([])
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create particles: 60 petals + 40 sparkles
    particlesRef.current = [
      ...Array.from({ length: 60 }, () => new Particle(canvas, 'petal')),
      ...Array.from({ length: 40 }, () => new Particle(canvas, 'sparkle')),
    ]
    startTimeRef.current = performance.now()

    function animate(now) {
      const elapsed = now - startTimeRef.current
      const fadeStart = 3200
      const fadeDuration = 1200
      const globalAlpha = elapsed > fadeStart
        ? Math.max(0, 1 - (elapsed - fadeStart) / fadeDuration)
        : 1

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = globalAlpha

      particlesRef.current.forEach(p => { p.update(); p.draw(ctx) })

      if (elapsed < fadeStart + fadeDuration) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    />
  )
}
