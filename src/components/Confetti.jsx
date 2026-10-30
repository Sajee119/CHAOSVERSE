import { useMemo } from 'react'
import { randomInt } from '../lib/utils'

const colors = ['#c8ff3d', '#ff2e97', '#35e6ff', '#8b5cf6', '#ff7a18', '#ffffff']

export default function Confetti({ count = 90, active = true, persistent = false }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        drift: `${randomInt(-180, 180)}px`,
        rot: `${randomInt(360, 1080)}deg`,
        delay: `${Math.random() * 0.5}s`,
        time: `${2.1 + Math.random() * 2.2}s`,
        color: colors[index % colors.length],
        width: `${randomInt(5, 11)}px`,
        height: `${randomInt(8, 18)}px`,
        round: Math.random() > 0.75,
      })),
    [count],
  )

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[500] overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            width: piece.width,
            height: piece.height,
            borderRadius: piece.round ? '50%' : '2px',
            '--drift': piece.drift,
            '--rot': piece.rot,
            '--delay': piece.delay,
            '--fall-time': piece.time,
            animationIterationCount: persistent ? 'infinite' : 1,
          }}
        />
      ))}
    </div>
  )
}
