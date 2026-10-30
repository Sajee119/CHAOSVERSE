import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function PageHeader({ number, kicker, title, accent, description, emoji, children, compact = false }) {
  return (
    <header className={`section-shell relative ${compact ? 'pb-10 pt-32' : 'pb-14 pt-32 md:pb-20 md:pt-40'}`}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="chip transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft size={11} /> Home
          </Link>
          <span className="chip" style={{ borderColor: `${accent}35`, color: accent }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            {kicker}
          </span>
          <span className="label-number">{number} / CHAOSVERSE</span>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -top-16 right-[4%] hidden select-none text-[10rem] leading-none opacity-[0.06] md:block" aria-hidden="true">
            {emoji}
          </div>
          <h1 className="max-w-[13ch] font-display text-[clamp(4.2rem,11vw,10.5rem)] leading-[0.82] tracking-[0.015em]">
            {title.split('\n').map((line, index) => (
              <span key={line} className="block">
                {index === 0 ? (
                  line
                ) : (
                  <span style={{ color: accent }}>{line}</span>
                )}
              </span>
            ))}
          </h1>
          <div className="mt-7 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-[1fr_auto] md:items-start">
            <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">{description}</p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">Protocol 404</span>
              <Sparkles size={14} style={{ color: accent }} />
            </div>
          </div>
        </div>
        {children}
      </motion.div>
    </header>
  )
}
