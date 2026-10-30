import { motion } from 'framer-motion'
import { Copy, Quote } from 'lucide-react'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'

export default function ComedyCard({ joke, index = 0, onNext, label = 'JOKE' }) {
  const { addToast } = useChaos()
  const { play } = useSound()

  const copy = async () => {
    const text = joke.punchline ? `${joke.setup} ${joke.punchline}` : joke
    try {
      await navigator.clipboard.writeText(text)
      play('success')
      addToast('Joke copied. Deploy it responsibly at parties.', 'default')
    } catch {
      play('fail')
      addToast('Your clipboard said no. The joke remains with you.', 'default')
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.25) }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/[0.09] bg-white/[0.035] p-6 transition-colors hover:border-acid/25"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-acid">{label}</span>
        <Quote size={16} className="text-white/15" />
      </div>
      <p className="mt-6 flex-1 text-[15px] leading-relaxed text-white/75">{joke.setup || joke}</p>
      {joke.punchline && (
        <p className="mt-3 text-[13px] leading-relaxed text-white/40 italic">— {joke.punchline}</p>
      )}
      <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">CHAOS COMEDY DEPT.</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={copy} className="text-white/30 transition hover:text-acid" aria-label="Copy joke"><Copy size={14} /></button>
          {onNext && (
            <button type="button" onClick={onNext} className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45 transition hover:text-white">
              Next →
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
