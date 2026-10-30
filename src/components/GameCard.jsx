import { motion } from 'framer-motion'
import { Bomb, Brain, MousePointerClick, Play, Search, Shuffle, Target, Timer, Trophy } from 'lucide-react'
import { useSound } from '../context/SoundContext'
import TiltCard from './TiltCard'

const icons = { Target, MousePointerClick, Timer, Brain, Shuffle, Bomb, Search }

export default function GameCard({ game, index = 0, onPlay }) {
  const Icon = icons[game.icon] || Play
  const { play } = useSound()

  return (
    <TiltCard intensity={7} className="group relative h-full rounded-[26px]">
      <motion.article
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25) }}
        className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#0b0715]/80 p-6 transition-colors duration-500 hover:border-white/20"
      >
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-[0.12] blur-3xl transition-opacity group-hover:opacity-25" style={{ background: game.accent }} />
        <div className="relative z-10 flex items-start justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
            <span className="group-hover:hidden">{game.emoji}</span>
            <Icon size={23} style={{ color: game.accent }} className="hidden group-hover:block" />
          </span>
          <span className="chip">{game.difficulty}</span>
        </div>
        <div className="relative z-10 mt-8 flex-1">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: game.accent }}>{game.kicker}</p>
          <h3 className="mt-2 font-display text-[2.15rem] leading-[0.92] tracking-wide">{game.title}</h3>
          <p className="mt-3 text-[12px] leading-relaxed text-white/45">{game.description}</p>
        </div>
        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30"><Timer size={10} /> {game.duration}</span>
          <button
            type="button"
            onClick={() => {
              play('click')
              onPlay(game)
            }}
            className="flex h-10 items-center gap-1.5 rounded-full pl-4 pr-3 text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-transform hover:scale-105"
            style={{ background: game.accent }}
            aria-label={`Play ${game.title}`}
          >
            Play <Play size={11} fill="currentColor" />
          </button>
        </div>
        <Trophy size={13} className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/0 transition-colors group-hover:text-white/10" />
      </motion.article>
    </TiltCard>
  )
}
