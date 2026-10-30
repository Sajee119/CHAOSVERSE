import { motion } from 'framer-motion'
import {
  BellRing,
  Download,
  Ghost,
  LoaderCircle,
  MousePointer2,
  PackageOpen,
  ShieldAlert,
  Siren,
  TriangleAlert,
  ArrowUpRight,
  Clock3,
} from 'lucide-react'
import { useSound } from '../context/SoundContext'
import TiltCard from './TiltCard'

const icons = {
  Download,
  LoaderCircle,
  MousePointer2,
  TriangleAlert,
  Siren,
  BellRing,
  Ghost,
  ShieldAlert,
  PackageOpen,
}

export default function PrankCard({ prank, index = 0, onLaunch, compact = false }) {
  const Icon = icons[prank.icon] || Siren
  const { play } = useSound()

  return (
    <TiltCard
      intensity={compact ? 5 : 8}
      className="group relative h-full rounded-[26px]"
    >
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
        className={`relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#0c0716]/75 transition-all duration-500 hover:border-white/20 ${
          compact ? 'p-5' : 'p-6 md:p-7'
        }`}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-[0.13] blur-3xl transition-opacity duration-500 group-hover:opacity-30"
          style={{ background: prank.accent }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]" style={{ color: prank.accent }}>
            <Icon size={21} strokeWidth={1.8} />
          </span>
          <div className="text-right">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">EXP-{String(index + 1).padStart(2, '0')}</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em]" style={{ color: prank.accent }}>{prank.kicker}</p>
          </div>
        </div>

        <div className="relative z-10 mt-7 flex-1">
          <h3 className={`font-display leading-[0.92] tracking-wide text-white ${compact ? 'text-3xl' : 'text-[2.35rem] md:text-[2.8rem]'}`}>{prank.title}</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-white/45">{prank.description}</p>
        </div>

        <div className="relative z-10 mt-6 flex items-end justify-between gap-3 border-t border-white/[0.07] pt-4">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.13em] text-white/30">
            <span className="flex items-center gap-1"><Clock3 size={10} /> {prank.duration}</span>
            <span className="hidden sm:inline">CHAOS {prank.danger}/3</span>
          </div>
          <button
            type="button"
            onClick={() => {
              play('click')
              onLaunch(prank)
            }}
            onMouseEnter={() => play('hover')}
            className="group/btn inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-all hover:gap-2.5"
            style={{ borderColor: `${prank.accent}45`, color: prank.accent, background: `${prank.accent}0d` }}
            aria-label={`Launch ${prank.title}`}
          >
            Launch
            <ArrowUpRight size={13} />
          </button>
        </div>
      </motion.article>
    </TiltCard>
  )
}
