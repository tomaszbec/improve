import { useEffect, useRef, useMemo, useState } from 'react'

interface Particle {
  id: number
  shape: 'circle' | 'square' | 'triangle' | 'ring' | 'diamond' | 'cross'
  size: number
  x: number
  color: string
  opacity: number
  duration: number
  delay: number
  driftX: number
  rotation: number
}

const COLORS = [
  'rgba(16, 185, 129, VAR)',   // emerald
  'rgba(5, 150, 105, VAR)',    // dark emerald
  'rgba(52, 211, 153, VAR)',   // light emerald
  'rgba(59, 130, 246, VAR)',   // blue
  'rgba(6, 182, 212, VAR)',    // cyan
  'rgba(139, 92, 246, VAR)',   // violet
  'rgba(20, 184, 166, VAR)',   // teal
]

const SHAPES: Particle['shape'][] = ['circle', 'square', 'triangle', 'ring', 'diamond', 'cross']

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const opacity = 0.15 + Math.random() * 0.35
    const colorTemplate = COLORS[Math.floor(Math.random() * COLORS.length)]
    return {
      id: i,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: 4 + Math.random() * 18,
      x: Math.random() * 100,
      color: colorTemplate.replace('VAR', String(opacity)),
      opacity,
      duration: 12 + Math.random() * 25,
      delay: Math.random() * -30,
      driftX: -60 + Math.random() * 120,
      rotation: Math.random() * 360,
    }
  })
}

export function AntigravityBackground() {
  const glowRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const particles = useMemo(() => generateParticles(45), [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Floating particles */}
      <div className="antigravity-canvas" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`antigravity-particle antigravity-particle--${p.shape}`}
            style={{
              '--particle-color': p.color,
              '--particle-opacity': p.opacity,
              '--drift-x': `${p.driftX}px`,
              '--rotation': `${p.rotation}deg`,
              '--size': `${p.size / 2}px`,
              left: `${p.x}%`,
              width: p.shape !== 'triangle' ? `${p.size}px` : undefined,
              height: p.shape !== 'triangle' ? `${p.size}px` : undefined,
              background: !['triangle', 'ring', 'cross'].includes(p.shape)
                ? p.color
                : undefined,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Mouse-following glow */}
      <div
        ref={glowRef}
        className="antigravity-glow"
        style={{
          left: mousePos.x,
          top: mousePos.y,
        }}
      />
    </>
  )
}
