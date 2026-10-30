import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const reducedMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 520, damping: 38, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 520, damping: 38, mass: 0.35 })

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!finePointer || reducedMotion) return undefined

    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
      const target = event.target instanceof Element ? event.target.closest('a, button, [role="button"], input, textarea, [data-cursor]') : null
      setHovering(Boolean(target))
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [reducedMotion, x, y])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000]" aria-hidden="true">
      <motion.div
        className="absolute left-0 top-0 rounded-full border border-acid/80"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 54 : 32,
          height: hovering ? 54 : 32,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.8 : 1,
          backgroundColor: hovering ? 'rgba(200,255,61,.1)' : 'rgba(200,255,61,0)',
          rotate: hovering ? 45 : 0,
          borderRadius: hovering ? '38%' : '50%',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      >
        <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid/80" />
        <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-acid/80" />
        <span className="absolute left-0 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid/80" />
        <span className="absolute right-0 top-1/2 h-1 w-1 -translate-y-1/2 translate-x-1/2 rounded-full bg-acid/80" />
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 2.2 : hovering ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-acid/15 blur-sm"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hovering ? 78 : 46, height: hovering ? 78 : 46, opacity: visible ? 0.7 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </div>
  )
}
