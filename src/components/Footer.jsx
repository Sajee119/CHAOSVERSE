import { ArrowUpRight, Eye, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { footerLore, navLinks, tickerItems } from '../data/content'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'
import SoundController from './SoundController'

export default function Footer() {
  const { triggerChaos, discoverSecret, secretFound } = useChaos()
  const { play } = useSound()

  const surprise = () => {
    triggerChaos()
    play('whoosh')
  }

  const pokeEye = () => {
    discoverSecret('the suspicious eye in the footer')
    play('sparkle')
  }

  return (
    <footer className="relative z-10 mt-28 overflow-hidden border-t border-white/10 bg-[#07040e]/80">
      <div className="border-b border-white/[0.08] py-5">
        <div className="marquee-track gap-8" aria-hidden="true">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8 font-mono text-[10px] uppercase tracking-[0.26em] text-white/45">
              {item}
              <span className="text-acid">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="section-shell pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.6fr_0.7fr_0.7fr]">
          <div>
            <p className="eyebrow mb-5">One last questionable decision</p>
            <h2 className="max-w-[15ch] font-display text-[clamp(3.6rem,7vw,7rem)] leading-[0.88]">
              BORED? <span className="text-gradient-hot">IMPOSSIBLE.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
              You have reached the bottom of the internet. There is a small cow here. It has been waiting for you.
            </p>
            <button type="button" onClick={surprise} className="btn-primary mt-7">
              <Sparkles size={16} />
              Poke the void
            </button>
          </div>

          <div>
            <p className="eyebrow mb-5">Realms</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => play('click')}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <span className="font-mono text-[9px] text-white/25">{link.short}</span>
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Find the door</p>
            {secretFound ? (
              <Link
                to="/secret"
                onClick={() => play('sparkle')}
                className="group inline-flex items-center gap-2 rounded-full border border-acid/30 bg-acid/[0.06] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-acid"
              >
                <Eye size={14} />
                Secret room
                <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={pokeEye}
                className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30 transition hover:text-acid"
                title="Some doors need to be looked at closely."
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 transition group-hover:border-acid/40">
                  <Eye size={12} />
                </span>
                Nothing to see here
              </button>
            )}
            <p className="mt-5 text-xs leading-relaxed text-white/30">
              The logo remembers three clicks. The footer notices everything. The tiny cow knows.
            </p>
            <div className="mt-6">
              <SoundController />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 text-[10px] text-white/30 md:flex-row md:items-center md:justify-between">
          <p className="font-mono uppercase tracking-[0.14em]">© {new Date().getFullYear()} CHAOSVERSE. All rights reserved. None of it makes sense.</p>
          <div className="flex flex-wrap gap-5 font-mono uppercase tracking-[0.14em]">
            <span>No cookies*</span>
            <span>No refunds</span>
            <span>*We lied</span>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-white/[0.06] py-5">
          {footerLore.map((line) => (
            <p key={line} className="text-[10px] leading-relaxed text-white/20">{line}</p>
          ))}
        </div>
      </div>

      <motion.div
        className="pointer-events-none relative -mb-[1.8vw] select-none overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <div className="whitespace-nowrap text-center font-display text-[clamp(5rem,17vw,17rem)] leading-[0.7] tracking-[0.02em] text-white/[0.055]">
          STAY WEIRD
        </div>
      </motion.div>
    </footer>
  )
}
