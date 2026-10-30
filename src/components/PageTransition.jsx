import { motion, useReducedMotion } from 'framer-motion'

export default function PageTransition({ children, routeKey }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      key={routeKey}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(6px)' }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  )
}
