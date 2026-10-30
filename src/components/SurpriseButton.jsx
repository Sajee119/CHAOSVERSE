import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'

export default function SurpriseButton({
  label = 'Enter the madness',
  sublabel = 'Warning: results may include joy',
  onClick,
  variant = 'primary',
  className = '',
}) {
  const { triggerChaos } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()

  const handleClick = () => {
    play('whoosh')
    if (onClick) onClick()
    else triggerChaos()
  }

  return (
    <div className={`relative inline-flex flex-col items-start gap-2 ${className}`}>
      <div className="relative">
        {!reducedMotion && (
          <>
            <span className="absolute inset-0 rounded-full border border-acid/25 ring-pulse" />
            <motion.span
              className="absolute -inset-3 rounded-full border border-dashed border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}
        <motion.button
          type="button"
          onClick={handleClick}
          whileHover={reducedMotion ? undefined : { scale: 1.035, rotate: -0.6 }}
          whileTap={reducedMotion ? undefined : { scale: 0.96 }}
          className={
            variant === 'primary'
              ? 'btn-primary group relative z-10 min-h-[56px] px-7 text-[13px] uppercase tracking-[0.08em]'
              : 'btn-ghost group relative z-10 min-h-[56px] px-7 text-[13px] uppercase tracking-[0.08em]'
          }
        >
          <Zap size={16} fill="currentColor" className="transition-transform group-hover:rotate-12" />
          <span>{label}</span>
          <Sparkles size={14} className="opacity-50 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
      {sublabel && <span className="pl-1 font-mono text-[8px] uppercase tracking-[0.17em] text-white/30">{sublabel}</span>}
    </div>
  )
}
