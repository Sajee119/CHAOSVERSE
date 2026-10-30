import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ children, className = '', intensity = 8, glare = true, ...props }) {
  const ref = useRef(null)
  const reducedMotion = useReducedMotion()
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [intensity, -intensity]), { stiffness: 180, damping: 22 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-intensity, intensity]), { stiffness: 180, damping: 22 })
  const glareX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const glareY = useTransform(mouseY, [0, 1], ['0%', '100%'])

  const onPointerMove = (event) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((event.clientX - rect.left) / rect.width)
    mouseY.set((event.clientY - rect.top) / rect.height)
  }

  const reset = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`perspective ${className}`}
      {...props}
    >
      {children}
      {glare && !reducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,.1), transparent 42%)`,
            ),
          }}
        />
      )}
    </motion.div>
  )
}
