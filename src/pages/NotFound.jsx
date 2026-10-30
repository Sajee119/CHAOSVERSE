import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Eye, Flag, Ghost, Home, Search, Sparkles } from 'lucide-react'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'
import { pick } from '../lib/utils'

const lostMessages = [
  'The page was last seen near the exit, looking nervous. It has not been heard from since.',
  'We checked the sofa cushions, the recycling bin and the group chat. No page.',
  'This URL is technically valid, emotionally unavailable, and physically missing.',
  'The page was deleted, promoted, or taken by a cow with a clipboard. The cow is not answering questions.',
  'You have reached a room that does not exist. The acoustics are excellent.',
  'The page left a note. The note says "gone to get snacks." That was four years ago.',
]

export default function NotFound() {
  const location = useLocation()
  const { addToast, discoverSecret, secretFound } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()
  const [message] = useState(() => pick(lostMessages))
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(null)

  const submitSearch = (event) => {
    event.preventDefault()
    play('fail')
    setSearched(query.trim() || 'absolutely nothing')
    addToast(
      query.trim()
        ? `Search complete: 0 results for “${query.trim()}”. The void has no search index, only opinions.`
        : 'Search complete: 0 results for nothing. Statistically, that is impressive.',
      'default',
      5200,
    )
  }

  return (
    <div className="relative">
      <section className="section-shell relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pb-24 pt-32 text-center">
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
        <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.08]" />

        <div className="relative flex flex-wrap items-center justify-center gap-2">
          <span className="chip border-hotpink/30 text-hotpink"><Ghost size={11} /> Error 404</span>
          <span className="chip">Page not found, probably</span>
          <span className="chip">Reality: updating</span>
        </div>

        <h1
          data-whisper="Four oh four. The page has left the building and taken the snacks."
          className="glitch-text relative mt-7 font-display text-[clamp(8rem,28vw,21rem)] leading-[0.7] tracking-[0.02em] text-white"
          data-text="404"
        >
          404
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mt-4 max-w-2xl"
        >
          <h2 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.88]">THE PAGE HAS<br /><span className="text-gradient-hot">EVAPORATED.</span></h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/50">{message}</p>
          <p className="mt-4 inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">
            <span className="text-hotpink">GET</span>
            <span className="truncate normal-case text-white/45">{location.pathname}</span>
            <span className="text-white/20">→ 404</span>
          </p>
        </motion.div>

        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" onClick={() => play('sparkle')} className="btn-primary text-xs uppercase tracking-[0.08em]">
            <Home size={14} /> Return to safety
          </Link>
          <Link to="/surprises" onClick={() => play('whoosh')} className="btn-ghost text-xs uppercase tracking-[0.08em]">
            <Sparkles size={14} /> Press something random
          </Link>
          <button
            type="button"
            onClick={() => {
              play('error')
              addToast('Report received. It has been forwarded to a folder named "lol". Nobody monitors that folder.', 'default', 5000)
            }}
            className="btn-ghost text-xs uppercase tracking-[0.08em]"
          >
            <Flag size={14} /> Report this page
          </button>
        </div>

        <div className="relative mt-12 w-full max-w-xl">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">Or search the void manually</p>
          <form onSubmit={submitSearch} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">Search for the missing page</span>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="input-chaos pl-10"
                  placeholder="Where were you trying to go?"
                  maxLength={80}
                />
              </div>
            </label>
            <button type="submit" className="btn-ghost shrink-0 text-xs">
              <Search size={14} /> Search
            </button>
          </form>
          {searched && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-left">
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-hotpink">0 results</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                We searched for “{searched}”. We found a receipt, a small cow and a note that says “try the homepage.” The note was unhelpful but polite.
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative mt-14 text-3xl"
          aria-hidden="true"
        >
          🐄
        </motion.div>

        <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2 font-mono text-[7px] uppercase tracking-[0.15em] text-white/20">
          <span>PAGE_NOT_FOUND</span>
          <span>·</span>
          <span>REALITY_MISPLACED</span>
          <span>·</span>
          <span>COW_INTERFERENCE</span>
        </div>

        <div className="relative mt-8">
          {secretFound ? (
            <Link to="/secret" onClick={() => play('sparkle')} className="inline-flex items-center gap-2 rounded-full border border-acid/25 bg-acid/[0.05] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-acid">
              <Eye size={12} /> The secret room is expecting you <ArrowRight size={11} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                play('sparkle')
                discoverSecret('the missing page')
              }}
              className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/20 transition hover:text-acid"
              title="The logo remembers three clicks. The footer notices everything. The keyboard listens."
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition group-hover:border-acid/40">
                <Eye size={12} />
              </span>
              Some pages are hidden on purpose
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
