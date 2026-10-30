import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'
import { useKeySequence } from '../lib/hooks'
import { pick, randomInt } from '../lib/utils'

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

const secretWhispers = [
  'You have found a secret frequency. The tiny cow approves.',
  'A secret is not a secret if you tell everyone. Please tell everyone.',
  'The door is closer than you think. Check the footer.',
  'You are the chosen one. The chosen one of this tab, at least.',
]

export default function EasterEggManager() {
  const { discoverSecret, unlock, addToast, triggerChaos } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()
  const [orb, setOrb] = useState(null)
  const [whisper, setWhisper] = useState(null)
  const konamiBuffer = useRef([])
  const whisperTimeout = useRef(null)
  const revealTimeout = useRef(null)

  useKeySequence('chaos', () => {
    play('sparkle')
    discoverSecret('the ancient keyboard word')
  })

  useEffect(() => {
    const onKeyDown = (event) => {
      konamiBuffer.current = [...konamiBuffer.current, event.key.toLowerCase()].slice(-KONAMI.length)
      if (konamiBuffer.current.join(',') === KONAMI.join(',')) {
        konamiBuffer.current = []
        unlock('konami')
        triggerChaos('confetti')
        addToast('Ancient code accepted. You have unlocked absolutely nothing tangible.', 'secret', 6000)
        play('fanfare')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [addToast, play, triggerChaos, unlock])

  useEffect(() => {
    if (reducedMotion) return undefined
    let timeout
    const scheduleOrb = () => {
      timeout = window.setTimeout(() => {
        const size = 44
        setOrb({
          id: Date.now(),
          x: randomInt(8, Math.max(10, window.innerWidth - size - 8)),
          y: randomInt(120, Math.max(160, window.innerHeight - size - 100)),
        })
        revealTimeout.current = window.setTimeout(() => setOrb(null), 7500)
        scheduleOrb()
      }, randomInt(24000, 42000))
    }
    scheduleOrb()
    return () => {
      window.clearTimeout(timeout)
      window.clearTimeout(revealTimeout.current)
    }
  }, [reducedMotion])

  useEffect(() => {
    const onOver = (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-whisper]') : null
      if (!target) return
      const message = target.getAttribute('data-whisper')
      const rect = target.getBoundingClientRect()
      setWhisper({ message, x: Math.min(Math.max(rect.left + rect.width / 2, 130), window.innerWidth - 130), y: rect.top - 12 })
      if (whisperTimeout.current) window.clearTimeout(whisperTimeout.current)
      whisperTimeout.current = window.setTimeout(() => setWhisper(null), 2400)
    }
    window.addEventListener('pointerover', onOver)
    return () => {
      window.removeEventListener('pointerover', onOver)
      if (whisperTimeout.current) window.clearTimeout(whisperTimeout.current)
    }
  }, [])

  const catchOrb = () => {
    play('sparkle')
    setOrb(null)
    const roll = Math.random()
    if (roll < 0.4) {
      discoverSecret('the hidden wandering orb')
    } else if (roll < 0.7) {
      triggerChaos('cameo')
    } else {
      addToast(pick(secretWhispers), 'secret', 6000)
      play('moo')
    }
  }

  return (
    <>
      <AnimatePresence>
        {orb && (
          <motion.button
            key={orb.id}
            type="button"
            onClick={catchOrb}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.75, 1], scale: 1, rotate: 360 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ opacity: { duration: 1.2, repeat: Infinity }, scale: { type: 'spring' }, rotate: { duration: 12, repeat: Infinity, ease: 'linear' } }}
            className="fixed z-[55] flex h-11 w-11 items-center justify-center rounded-full border border-acid/30 bg-acid/[0.06] text-acid backdrop-blur-sm"
            style={{ left: orb.x, top: orb.y }}
            aria-label="A suspicious little orb. Probably nothing."
            title="Probably nothing."
          >
            <Sparkles size={14} />
            <span className="absolute inset-0 -z-10 rounded-full bg-acid/20 blur-xl" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {whisper && (
          <motion.div
            key={whisper.message}
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="pointer-events-none fixed z-[790] max-w-[17rem] -translate-x-1/2 rounded-xl border border-acid/20 bg-[#0a0713]/95 px-3.5 py-2.5 text-center text-[10px] leading-relaxed text-white/70 shadow-xl backdrop-blur"
            style={{ left: whisper.x, top: whisper.y, transform: 'translate(-50%, -100%)' }}
          >
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-acid">whisper</span>
            <p className="mt-0.5">{whisper.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
