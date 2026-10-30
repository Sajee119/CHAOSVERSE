import { Volume2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSound } from '../context/SoundContext'

export default function SoundController({ compact = false }) {
  const { enabled, toggle } = useSound()

  return (
    <button
      type="button"
      onClick={toggle}
      className={`group inline-flex items-center gap-2 rounded-full border transition-colors ${
        compact
          ? 'h-10 w-10 justify-center border-white/10 bg-white/[0.04]'
          : 'border-white/10 bg-white/[0.04] px-3 py-2'
      } ${enabled ? 'text-acid' : 'text-white/45'} hover:border-white/25 hover:bg-white/[0.08]`}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
      title={enabled ? 'Sound is on — click to silence the chaos' : 'Sound is off — click to awaken the chaos'}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {enabled ? (
            <motion.span
              key="on"
              initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, rotate: 25, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Volume2 size={16} strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="off"
              initial={{ scale: 0.4, rotate: 25, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, rotate: -25, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <VolumeX size={16} strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
        {enabled && (
          <motion.span
            className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-acid"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </span>
      {!compact && <span className="font-mono text-[10px] uppercase tracking-[0.16em]">{enabled ? 'Sound on' : 'Sound off'}</span>}
    </button>
  )
}
