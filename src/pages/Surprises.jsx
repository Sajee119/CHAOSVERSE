import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  BellRing,
  CloudLightning,
  Dices,
  Flame,
  Gift,
  Quote,
  RotateCcw,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'

const chaosMeta = {
  confetti: { label: 'Confetti detonation', emoji: '🎉', color: '#c8ff3d' },
  award: { label: 'Unwarranted award', emoji: '🏆', color: '#ff7a18' },
  takeover: { label: 'Reality takeover', emoji: '🚨', color: '#ff2e97' },
  cameo: { label: 'Uninvited cameo', emoji: '👽', color: '#35e6ff' },
  glitch: { label: 'Reality glitch', emoji: '📺', color: '#35e6ff' },
  emojiRain: { label: 'Emoji weather', emoji: '🌧️', color: '#8b5cf6' },
  spin: { label: 'Vertical spin incident', emoji: '🌀', color: '#c8ff3d' },
  captcha: { label: 'Very human check', emoji: '🤖', color: '#35e6ff' },
  quote: { label: 'Transmission from nowhere', emoji: '📡', color: '#c8ff3d' },
  weather: { label: 'Urgent weather bulletin', emoji: '⛈️', color: '#ff7a18' },
  disco: { label: 'Unscheduled disco', emoji: '🕺', color: '#ff2e97' },
  tinycow: { label: 'Tiny cow crossing', emoji: '🐄', color: '#c8ff3d' },
  unlock: { label: 'Secret frequency found', emoji: '🗝️', color: '#c8ff3d' },
  invert: { label: 'Reality inversion', emoji: '🪞', color: '#8b5cf6' },
  toast: { label: 'Suspicious notification', emoji: '🔔', color: '#8b5cf6' },
}

const manualEvents = [
  { type: 'confetti', title: 'Confetti strike', desc: 'An unreasonable amount of paper for no occasion.', emoji: '🎉', accent: '#c8ff3d', icon: Sparkles },
  { type: 'award', title: 'Claim an award', desc: 'A certificate nobody asked for, signed by nobody.', emoji: '🏆', accent: '#ff7a18', icon: Trophy },
  { type: 'weather', title: 'Weather alert', desc: 'Emotional drizzle expected well into the evening.', emoji: '⛈️', accent: '#ff7a18', icon: CloudLightning },
  { type: 'cameo', title: 'Summon a cameo', desc: 'Someone uninvited has opinions about your choices.', emoji: '👽', accent: '#35e6ff', icon: Star },
  { type: 'quote', title: 'Hear the void', desc: 'A transmission with the confidence of a fortune cookie.', emoji: '📡', accent: '#c8ff3d', icon: Quote },
  { type: 'disco', title: 'Start a disco', desc: 'The lights were not consulted. Neither were you.', emoji: '🕺', accent: '#ff2e97', icon: Dices },
  { type: 'tinycow', title: 'Release the cow', desc: 'Small cow. Large agenda. Moderate speed.', emoji: '🐄', accent: '#c8ff3d', icon: ArrowUpRight },
  { type: 'captcha', title: 'Prove your humanity', desc: 'A test designed by robots who do not trust you.', emoji: '🤖', accent: '#35e6ff', icon: BellRing },
]

const levelNames = [
  [1, 'Suspiciously calm'],
  [25, 'Mildly unhinged'],
  [55, 'Professionally chaotic'],
  [80, 'Legally concerning'],
  [101, 'Fully CHAOSVERSE'],
]

function getLevelName(clicks) {
  if (clicks === 0) return 'Suspiciously calm'
  return levelNames.find(([limit]) => clicks < limit)?.[1] || 'Fully CHAOSVERSE'
}

function readClickCount() {
  try {
    return Number(window.localStorage.getItem('chaosverse-surprise-clicks')) || 0
  } catch {
    return 0
  }
}

export default function Surprises() {
  const { triggerChaos, addToast, discoverSecret, secretFound } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()
  const [clicks, setClicks] = useState(readClickCount)
  const [rolling, setRolling] = useState(false)
  const [last, setLast] = useState(null)
  const [log, setLog] = useState([])
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('chaosverse-surprise-clicks', String(clicks))
    } catch {
      // The counter can live in the moment.
    }
  }, [clicks])

  const recordOutcome = (payload) => {
    const meta = chaosMeta[payload.type] || { label: payload.type, emoji: '❓', color: '#8b5cf6' }
    setLast({
      id: payload.id,
      type: payload.type,
      label: meta.label,
      emoji: meta.emoji,
      color: meta.color,
      message: payload.message,
    })
    setLog((current) => [
      {
        id: payload.id,
        type: payload.type,
        label: meta.label,
        emoji: meta.emoji,
        message: payload.message,
        at: new Date(),
      },
      ...current,
    ].slice(0, 7))
  }

  const runChaos = (forcedType = null) => {
    if (rolling) return
    setRolling(true)
    play('drumroll')
    const nextCount = clicks + 1
    setClicks(nextCount)

    timeoutRef.current = window.setTimeout(() => {
      const payload = triggerChaos(forcedType)
      recordOutcome(payload)
      setRolling(false)
      play('sparkle')
      if (!secretFound && nextCount === 10) {
        discoverSecret('ten consecutive acts of surrender')
      }
    }, forcedType ? 320 : 560)
  }

  const resetLedger = () => {
    setLog([])
    setLast(null)
    play('fail')
    addToast('The evidence has been deleted. The button remembers anyway.', 'default')
  }

  const level = clicks === 0 ? 0 : Math.min(100, 8 + clicks * 6 + log.length * 2)
  const levelName = getLevelName(clicks)
  const lastMeta = last ? last : null

  return (
    <div className="relative">
      <PageHeader
        number="04"
        kicker="The surprise department · no adult supervision"
        title={'RANDOM\nSURPRISES.'}
        accent="#ff7a18"
        emoji="🎁"
        description="One button with an empty calendar and a rich inner life. Press it and receive a completely different consequence every time: awards, weather, disco, cows, or a brief visit from the void. Nothing is real except the mild concern."
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="chip border-tangerine/30 text-tangerine"><Zap size={11} /> {clicks} button presses survived</span>
          <span className="chip"><Gift size={11} /> Every click: different</span>
          <span className="chip"><Timer size={11} /> Outcomes are fleeting</span>
        </div>
      </PageHeader>

      <div className="relative z-10 -rotate-1 border-y border-white/10 bg-tangerine py-3 text-ink">
        <div className="marquee-track gap-8">
          {[...Array(3)].flatMap(() => [
            'SURPRISE SHIPPED DAILY',
            'THE BUTTON HAS NO PLAN',
            'REFUNDS: EMOTIONALLY UNAVAILABLE',
            'EXPECT THE UNEXPECTED*',
            'A COW MAY BE INVOLVED',
            'PLEASE REMAIN MILDLY CALM',
          ]).map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
              {item} <span className="text-ink/40">✳</span>
            </span>
          ))}
        </div>
      </div>

      <section className="section-shell relative z-10 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="relative flex flex-col items-center">
            <div className="relative flex h-[min(82vw,30rem)] w-[min(82vw,30rem)] items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-tangerine/25"
                animate={reducedMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-[8%] rounded-full border border-white/10"
                animate={reducedMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              >
                <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tangerine shadow-[0_0_18px_#ff7a18]" />
                <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-electric shadow-[0_0_12px_#35e6ff]" />
              </motion.div>
              <div className="absolute inset-[15%] rounded-full border border-white/[0.06]" />
              <div className="absolute inset-[17%] rounded-full opacity-80" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(255,122,24,.2), rgba(255,46,151,.08) 45%, transparent 68%)' }} />

              <motion.button
                type="button"
                onClick={() => runChaos()}
                disabled={rolling}
                whileHover={reducedMotion || rolling ? undefined : { scale: 1.035, rotate: -1 }}
                whileTap={reducedMotion ? undefined : { scale: 0.955 }}
                className="group relative flex h-[64%] w-[64%] flex-col items-center justify-center gap-1 rounded-full border border-tangerine/50 bg-[#170b05]/80 text-center shadow-[0_0_80px_rgba(255,122,24,.18)] backdrop-blur-md disabled:cursor-wait"
                aria-label="Press the chaos button and receive a random surprise"
              >
                <span className="pointer-events-none absolute inset-0 rounded-full ring-pulse" />
                <span className="pointer-events-none absolute inset-3 rounded-full border border-dashed border-tangerine/25" />
                <span className="relative font-mono text-[8px] uppercase tracking-[0.3em] text-tangerine/70">{rolling ? 'consulting the void' : 'chaos delivery system'}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rolling ? 'rolling' : 'ready'}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative font-display text-[clamp(3rem,10vw,6.5rem)] leading-[0.8] text-white"
                  >
                    {rolling ? 'WAIT' : 'PRESS'}
                  </motion.span>
                </AnimatePresence>
                <span className="relative mt-1 max-w-[10rem] text-[10px] leading-snug text-white/40">
                  {rolling ? 'Something is being decided. Probably badly.' : 'The button has no plan. Neither do we.'}
                </span>
                <span className="relative mt-2 flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.18em] text-tangerine">
                  <Sparkles size={9} /> no refunds
                </span>
              </motion.button>

              <span className="absolute right-[3%] top-[12%] rotate-12 rounded-full bg-acid px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-ink">do not trust</span>
              <span className="absolute bottom-[8%] left-[2%] -rotate-6 rounded-full border border-white/15 bg-[#0b0618]/90 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">outcome unknown</span>
            </div>

            <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">Press responsibly. Or do not. We are a website, not a parent.</p>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0c0816] p-6"
            >
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-tangerine/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-tangerine">Immediate consequence</p>
                    <h2 className="mt-2 font-display text-4xl leading-none">WHAT JUST<br /><span className="text-tangerine">HAPPENED?</span></h2>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
                    {lastMeta ? lastMeta.emoji : '👀'}
                  </span>
                </div>

                <div aria-live="polite" className="mt-6 min-h-[7rem] rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                  <AnimatePresence mode="wait">
                    {lastMeta ? (
                      <motion.div
                        key={lastMeta.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <p className="font-mono text-[8px] uppercase tracking-[0.18em]" style={{ color: lastMeta.color }}>{lastMeta.label}</p>
                        <p className="mt-2 text-sm leading-relaxed text-white/70">“{lastMeta.message}”</p>
                      </motion.div>
                    ) : (
                      <p className="text-sm leading-relaxed text-white/35">Nothing has happened yet. The button is pretending it did not see you.</p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">
                    <span className="flex items-center gap-1.5"><Flame size={11} className="text-tangerine" /> Chaos level</span>
                    <span className="text-tangerine">{level}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-acid via-tangerine to-hotpink"
                      animate={{ width: `${level}%` }}
                      transition={{ type: 'spring', stiffness: 130, damping: 20 }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">{levelName}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">{clicks} total</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="glass flex items-start gap-3 rounded-2xl p-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-acid/10 text-acid"><Sparkles size={15} /></span>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-acid">Scientifically accurate note</p>
                <p className="mt-1 text-xs leading-relaxed text-white/45">
                  Every outcome is rendered locally, lasts a few seconds, and can be escaped with the Escape key. No files, notifications, systems or cows are real. The confusion is genuine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-white/[0.025] py-20 md:py-24">
        <div className="section-shell">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow mb-3">The manual override console</p>
              <h2 className="section-title">ORDER OFF<br /><span className="text-tangerine">THE MENU.</span></h2>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-white/40">
              The random button is a wildcard. These eight switches are for people who like their chaos with a side of control. The chaos is not improved. It is just more specific.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {manualEvents.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.type}
                  type="button"
                  onClick={() => runChaos(item.type)}
                  disabled={rolling}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: index * 0.035 }}
                  whileHover={reducedMotion ? undefined : { y: -4 }}
                  className="group relative overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0b0715]/80 p-5 text-left transition-colors hover:border-white/20 disabled:opacity-60"
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-25" style={{ background: item.accent }} />
                  <div className="relative flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">{item.emoji}</span>
                    <Icon size={14} style={{ color: item.accent }} className="opacity-50 transition group-hover:opacity-100" />
                  </div>
                  <h3 className="relative mt-4 font-display text-2xl leading-none tracking-wide">{item.title}</h3>
                  <p className="relative mt-2 text-[11px] leading-relaxed text-white/35">{item.desc}</p>
                  <span className="relative mt-4 flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.15em]" style={{ color: item.accent }}>
                    Trigger <ArrowUpRight size={10} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 py-20 md:py-28">
        <div className="grid gap-6 lg:grid-cols-[0.62fr_1.38fr] lg:gap-10">
          <div>
            <p className="eyebrow mb-4">The official record</p>
            <h2 className="section-title">THE CHAOS<br /><span className="text-stroke">LEDGER.</span></h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/40">
              A completely accurate, mildly dramatized account of the last seven things that happened to you on this page. It persists until you refresh or wipe the evidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={resetLedger} className="btn-ghost text-xs" disabled={!log.length}>
                <RotateCcw size={14} /> Wipe the evidence
              </button>
            </div>
            <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">Total lifetime presses: {clicks}. Stored locally. Judged silently.</p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0a0614]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40"><Star size={12} className="text-tangerine" /> Recent incidents</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">{log.length} / 7</span>
            </div>
            <div aria-live="polite" className="divide-y divide-white/[0.06]">
              <AnimatePresence initial={false}>
                {log.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 py-12 text-center">
                    <span className="text-4xl">🗒️</span>
                    <p className="mt-3 text-sm text-white/35">No incidents. No evidence. No fun.</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">Press the button. Give the ledger a purpose.</p>
                  </motion.div>
                )}
                {log.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 14 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-3 px-5 py-4"
                  >
                    <span className="mt-0.5 w-5 shrink-0 font-mono text-[9px] text-white/20">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-lg leading-none">{entry.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white/70">{entry.label}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/30">{entry.message}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[8px] text-white/20">
                      {entry.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/10 p-4">
              {secretFound ? (
                <Link to="/secret" className="flex items-center justify-between gap-3 rounded-xl border border-acid/25 bg-acid/[0.05] px-4 py-3 transition hover:bg-acid/[0.09]">
                  <span className="flex items-center gap-2 text-xs text-acid"><Sparkles size={13} /> The unmarked door is still open.</span>
                  <ArrowUpRight size={14} className="text-acid" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    play('sparkle')
                    if (clicks < 4) {
                      addToast('The tile is sealed. It seems to respond to commitment. Or at least four more clicks.', 'default', 5000)
                    } else {
                      discoverSecret('the unmarked tile in the ledger')
                    }
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 text-left transition hover:border-acid/35 hover:bg-acid/[0.04]"
                >
                  <span className="text-xs text-white/35">There is a small unmarked tile here.</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/25">{clicks < 4 ? 'sealed' : 'press'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 pb-24">
        <div className="relative overflow-hidden rounded-[32px] border border-tangerine/20 bg-[#160c06] p-7 md:p-10">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-tangerine/10 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow text-tangerine">Chaos insurance · policy #000404</p>
              <h2 className="mt-3 font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.88]">PROTECT YOURSELF<br /><span className="text-tangerine">FROM NOTHING.</span></h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/45">
                For zero dollars a month, you are covered against spontaneous confetti, unsolicited awards and brief visits from a cow. Claims are reviewed by a pigeon with a clipboard and a personal grudge.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    play('fail')
                    addToast('Claim denied. Reason: "You clicked the button voluntarily, repeatedly, and with enthusiasm."', 'default', 6000)
                  }}
                  className="btn-primary text-xs uppercase tracking-[0.1em]"
                >
                  <Gift size={14} /> File a claim
                </button>
                <Link to="/meme-factory" onClick={() => play('whoosh')} className="btn-ghost text-xs uppercase tracking-[0.1em]">
                  Turn this into a meme <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">Policy summary</p>
              <ul className="mt-3 space-y-2.5 text-[11px] leading-relaxed text-white/40">
                <li className="flex gap-2"><span className="text-acid">✓</span> Covers imaginary damages up to ∞.</li>
                <li className="flex gap-2"><span className="text-acid">✓</span> 24/7 support from an unstaffed inbox.</li>
                <li className="flex gap-2"><span className="text-hotpink">✕</span> Does not cover regret.</li>
                <li className="flex gap-2"><span className="text-hotpink">✕</span> Does not cover cows, tiny or otherwise.</li>
              </ul>
              <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[7px] uppercase leading-relaxed tracking-[0.12em] text-white/20">
                CHAOSVERSE is not an insurer, a therapist or a responsible adult. This policy is a joke and also legally binding in a parallel universe.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
