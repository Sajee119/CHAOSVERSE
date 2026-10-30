import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Flame,
  LockKeyhole,
  MousePointerClick,
  Quote,
  RotateCw,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react'
import { heroMessages, pranks, randomTeases, tickerItems, worlds } from '../data/content'
import { pick } from '../lib/utils'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'
import FloatingCharacters from '../components/FloatingCharacters'
import PrankCard from '../components/PrankCard'
import SurpriseButton from '../components/SurpriseButton'
import TiltCard from '../components/TiltCard'

const reviews = [
  { name: 'A Confused Pigeon', role: 'Internet reviewer', quote: 'I came for the bread. I stayed for the tiny cow. Still no bread.', rating: 5, emoji: '🦆' },
  { name: 'Your Left Sock', role: 'Formerly missing', quote: 'This website found me. I have mixed feelings about being found.', rating: 4, emoji: '🧦' },
  { name: 'Kevin, 34', role: 'Alleged adult', quote: 'I clicked a button and received a certificate. My boss is asking questions.', rating: 5, emoji: '🧑‍💼' },
]

const forecasts = {
  vibes: ['Aggressively fine', 'Suspiciously sparkly', 'Emotionally buffering', 'Legally chaotic', 'Mostly microwave', 'Tiny cow approved'],
  weather: ['Light drizzle of nonsense', 'Scattered brain fog', '100% chance of drama', 'Sunny with a chance of pigeons', 'Humid with emotional damage', 'A light breeze of regret'],
  warnings: ['Do not trust the progress bar.', 'A small decision will haunt you at 3 a.m.', 'The button is aware of you.', 'Keep snacks within reach.', 'Avoid eye contact with the duck.', 'Your Wi-Fi is plotting.'],
  luck: ['Questionable', 'Surprisingly okay', 'Pending', 'Overripe', 'Excellent*', 'Do not test it'],
}

function HeroPortal() {
  const { addToast } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()
  const [tease, setTease] = useState(randomTeases[0])

  useEffect(() => {
    const id = window.setInterval(() => setTease(pick(randomTeases)), 5200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[25rem] sm:max-w-[29rem]">
      <div className="absolute inset-[7%] rounded-full border border-white/[0.07]" />
      <motion.div
        className="absolute inset-[14%] rounded-full border border-dashed border-white/15"
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[23%] rounded-full border border-white/[0.09]" />
      <motion.div
        className="absolute inset-[4%] rounded-full border border-hotpink/20"
        animate={reducedMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hotpink shadow-[0_0_16px_#ff2e97]" />
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-electric shadow-[0_0_12px_#35e6ff]" />
      </motion.div>

      <div className="aurora absolute inset-[18%] overflow-hidden rounded-full border border-white/10 shadow-[0_0_100px_rgba(139,92,246,.25)]">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.12),transparent_42%)]" />
        <motion.button
          type="button"
          onClick={() => {
            play('moo')
            addToast('The portal says: "Moo." This is considered a warm welcome where it comes from.')
          }}
          whileHover={reducedMotion ? undefined : { scale: 1.08, rotate: 4 }}
          whileTap={{ scale: 0.92 }}
          className="absolute left-1/2 top-1/2 flex h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-acid/30 bg-[#0b1305]/60 text-[clamp(3rem,8vw,5.5rem)] backdrop-blur-md"
          aria-label="Poke the portal"
        >
          🌀
          <span className="absolute inset-0 rounded-full border border-acid/30 ring-pulse" />
        </motion.button>
        <span className="absolute left-[22%] top-[24%] text-2xl opacity-60">✦</span>
        <span className="absolute bottom-[28%] right-[18%] text-xl opacity-40">✦</span>
        <span className="absolute bottom-[18%] left-[30%] text-sm opacity-30">✦</span>
      </div>

      <div className="absolute -left-4 top-[18%] rounded-xl border border-white/10 bg-[#0c0716]/90 px-3 py-2 backdrop-blur sm:-left-10">
        <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/30">Threat level</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-acid"><Flame size={12} /> Delightfully unstable</p>
      </div>

      <motion.div
        key={tease}
        initial={{ opacity: 0, y: 8, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute -right-3 bottom-[10%] max-w-[13rem] rounded-xl border border-white/10 bg-[#0c0716]/90 p-3 backdrop-blur sm:-right-8"
      >
        <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-hotpink">Live transmission</p>
        <p className="mt-1 text-[10px] leading-snug text-white/60">{tease}</p>
      </motion.div>

      <div className="absolute -right-2 top-[6%] rotate-12 rounded-full bg-acid px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-ink sm:-right-4">
        Do not lick
      </div>
    </div>
  )
}

function WorldCard({ world, index, className = '' }) {
  const { play } = useSound()
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative ${className}`}
    >
      <Link
        to={world.to}
        onMouseEnter={() => play('hover')}
        onClick={() => play('click')}
        className="relative flex h-full min-h-[15rem] flex-col justify-between overflow-hidden rounded-[28px] border border-white/[0.09] bg-gradient-to-br p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 md:p-7"
        style={{ backgroundImage: `linear-gradient(140deg, ${world.color}14, rgba(10,6,19,.88) 48%, rgba(10,6,19,.96))` }}
      >
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-[0.09] blur-3xl transition-all duration-500 group-hover:opacity-25" style={{ background: world.color }} />
        <div className="pointer-events-none absolute right-5 top-2 select-none font-display text-[7rem] leading-none text-white/[0.035] transition-transform duration-500 group-hover:scale-110">
          {world.number}
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
            {world.emoji}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all group-hover:border-white/30 group-hover:text-white">
            <ArrowUpRight size={15} />
          </span>
        </div>
        <div className="relative z-10 mt-9">
          <p className="font-mono text-[8px] uppercase tracking-[0.22em]" style={{ color: world.color }}>{world.tagline}</p>
          <h3 className="mt-2 font-display text-[2.6rem] leading-[0.9] tracking-wide text-white md:text-[3rem]">{world.title}</h3>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-white/40">{world.description}</p>
          <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">{world.stat}</p>
        </div>
      </Link>
    </motion.div>
  )
}

function ChaosForecast() {
  const { play } = useSound()
  const [forecast, setForecast] = useState(() => ({
    vibes: pick(forecasts.vibes),
    weather: pick(forecasts.weather),
    warnings: pick(forecasts.warnings),
    luck: pick(forecasts.luck),
  }))
  const [spinning, setSpinning] = useState(false)

  const reroll = () => {
    if (spinning) return
    setSpinning(true)
    play('drumroll')
    window.setTimeout(() => {
      setForecast({
        vibes: pick(forecasts.vibes),
        weather: pick(forecasts.weather),
        warnings: pick(forecasts.warnings),
        luck: pick(forecasts.luck),
      })
      setSpinning(false)
      play('sparkle')
    }, 620)
  }

  return (
    <div className="glass relative overflow-hidden rounded-[30px] p-6 md:p-8">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-electric/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Today's chaos forecast</p>
          <h3 className="mt-2 font-display text-4xl leading-none">THE VIBE<br /><span className="text-electric">REPORT.</span></h3>
        </div>
        <button
          type="button"
          onClick={reroll}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:rotate-180 hover:border-electric/40 hover:text-electric"
          aria-label="Reroll the chaos forecast"
        >
          <RotateCw size={16} className={spinning ? 'animate-spin' : ''} />
        </button>
      </div>
      <motion.div
        animate={spinning ? { opacity: [1, 0.2, 1], filter: ['blur(0px)', 'blur(6px)', 'blur(0px)'] } : {}}
        transition={{ duration: 0.55 }}
        className="relative mt-8 space-y-4"
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">Overall vibes</span>
          <span className="text-right text-sm font-bold text-acid">{forecast.vibes}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">Weather</span>
          <span className="text-right text-sm font-semibold text-white/75">{forecast.weather}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">Luck</span>
          <span className="text-right text-sm font-bold text-hotpink">{forecast.luck}</span>
        </div>
      </motion.div>
      <div className="relative mt-5 rounded-xl border border-tangerine/20 bg-tangerine/[0.06] p-3.5">
        <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-tangerine">Active warning</p>
        <p className="mt-1 text-xs leading-relaxed text-white/55">{forecast.warnings}</p>
      </div>
      <p className="mt-4 text-center font-mono text-[7px] uppercase tracking-[0.15em] text-white/20">Accuracy not guaranteed. Vibes are final.</p>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { addToast, secretFound } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()
  const [heroMessage, setHeroMessage] = useState(heroMessages[0])
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 800], [0, 160])
  const heroOpacity = useTransform(scrollY, [0, 650], [1, 0.2])
  const featuredPranks = useMemo(() => [pranks[0], pranks[2], pranks[6]], [])

  useEffect(() => {
    const id = window.setInterval(() => setHeroMessage(pick(heroMessages)), 5700)
    return () => window.clearInterval(id)
  }, [])

  const launchPrank = (prank) => {
    navigate('/prank-lab', { state: { openPrank: prank.id } })
  }

  return (
    <div className="relative">
      <section className="relative min-h-[100svh] overflow-hidden pb-16 pt-28 md:pt-32">
        <FloatingCharacters />
        <div className="section-shell relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/55">Transmission live from the void</span>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">Visitor #84,612</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">No exit found</span>
            </div>
          </div>

          <motion.div style={reducedMotion ? undefined : { y: heroY, opacity: heroOpacity }} className="mt-8 md:mt-12">
            <p className="eyebrow mb-4 flex items-center gap-2 text-acid">
              <Sparkles size={12} />
              The internet's most unpredictable entertainment website
            </p>
            <h1
              className="relative font-display text-[clamp(5.6rem,17.8vw,17.5rem)] leading-[0.73] tracking-[0.005em]"
              data-whisper="The letters are not moving. You are moving. Probably."
            >
              <motion.span
                className="block text-gradient"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                CHAOS
              </motion.span>
              <span className="flex items-end gap-4">
                <motion.span
                  className="text-stroke block"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  VERSE
                </motion.span>
                <motion.span
                  className="mb-[2.5vw] hidden h-2 w-2 shrink-0 rounded-full bg-hotpink shadow-[0_0_20px_#ff2e97] sm:block"
                  animate={reducedMotion ? undefined : { scale: [1, 1.8, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
              </span>
            </h1>
          </motion.div>

          <div className="mt-10 grid items-start gap-10 md:mt-14 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative z-20 max-w-xl"
            >
              <div className="flex min-h-[3.5rem] items-start gap-3">
                <Quote size={18} className="mt-1 shrink-0 text-hotpink" />
                <p className="text-lg font-medium leading-snug text-white/80 md:text-xl">{heroMessage}</p>
              </div>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/45">
                A digital playground of harmless pranks, ridiculous games, questionable comedy and one extremely tiny cow. You were warned. You clicked anyway. We respect that.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <SurpriseButton label="Enter the madness" sublabel="May summon confetti, cows or an unsolicited award" />
                <Link to="/prank-lab" onClick={() => play('click')} className="btn-ghost mt-0">
                  Explore the lab <ArrowRight size={15} />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.08] pt-5">
                <div>
                  <p className="font-display text-2xl leading-none">00</p>
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/25">Rules</p>
                </div>
                <div>
                  <p className="font-display text-2xl leading-none text-acid">09</p>
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/25">Pranks</p>
                </div>
                <div>
                  <p className="font-display text-2xl leading-none text-electric">07</p>
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/25">Games</p>
                </div>
                <div>
                  <p className="font-display text-2xl leading-none text-hotpink">01</p>
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/25">Secret</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative -mt-2 hidden sm:block"
            >
              <HeroPortal />
            </motion.div>
          </div>

          <div className="mt-14 flex items-center justify-between border-t border-white/[0.08] pt-4">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">Scroll if you dare</span>
            <motion.span
              animate={reducedMotion ? undefined : { y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40"
            >
              <ArrowDownRight size={15} />
            </motion.span>
          </div>
        </div>
      </section>

      <div className="relative z-10 -rotate-1 border-y border-white/[0.08] bg-acid py-3 text-ink">
        <div className="marquee-track gap-8">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
              {item}
              <span className="text-white/60">✳</span>
            </span>
          ))}
        </div>
      </div>

      <section className="section-shell relative z-10 py-24 md:py-32">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">The universe / 05 realms</p>
            <h2 className="section-title">PICK YOUR<br /><span className="text-gradient-hot">POISON.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/40">
            Five doors. Each one leads somewhere deeply unnecessary. One of them is unlocked only for the curious.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <WorldCard world={worlds[0]} index={0} className="md:col-span-7 md:row-span-2" />
          <WorldCard world={worlds[1]} index={1} className="md:col-span-5" />
          <WorldCard world={worlds[2]} index={2} className="md:col-span-5" />
          <WorldCard world={worlds[3]} index={3} className="md:col-span-6" />
          <WorldCard world={worlds[4]} index={4} className="md:col-span-6" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 md:col-span-12"
          >
            <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)' }} />
            <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/35">
                  {secretFound ? <Eye size={18} className="text-acid" /> : <LockKeyhole size={17} />}
                </span>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">Restricted realm / 06</p>
                  <p className="mt-1 text-sm font-semibold text-white/60">{secretFound ? 'The secret room is expecting you.' : 'There is a room that does not appear on the map.'}</p>
                </div>
              </div>
              {secretFound ? (
                <Link to="/secret" onClick={() => play('sparkle')} className="btn-primary text-[11px] uppercase tracking-[0.1em]">
                  Open the door <ArrowUpRight size={14} />
                </Link>
              ) : (
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">Hint: the logo remembers three clicks.</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-white/[0.02] py-24 md:py-28">
        <div className="section-shell">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow mb-4">From the laboratory</p>
              <h2 className="section-title">FRESHLY BREWED<br /><span className="text-stroke">BAD IDEAS.</span></h2>
            </div>
            <Link to="/prank-lab" onClick={() => play('click')} className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-white/45 transition hover:text-white">
              View all 9 experiments <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredPranks.map((prank, index) => (
              <PrankCard key={prank.id} prank={prank} index={index} onLaunch={launchPrank} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 py-24 md:py-32">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-15">
          <div className="lg:pr-6">
            <p className="eyebrow mb-4">Free of charge / worth every penny</p>
            <h2 className="section-title max-w-[10ch]">THE VIBE<br /><span className="text-electric">REPORT.</span></h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/45">
              The universe has opinions and most of them are about you. Reroll your day until it says something nice. It will probably not.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  play('success')
                  addToast('Forecast approved by a committee of one very small cow.')
                }}
                className="btn-ghost text-xs"
              >
                <Star size={14} /> Rate the universe
              </button>
              <Link to="/surprises" className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 transition hover:text-white">
                Or just press a random button →
              </Link>
            </div>
          </div>
          <ChaosForecast />
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-[#090510]/60 py-24 md:py-28">
        <div className="section-shell">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-4">Certified reviews from real* people</p>
              <h2 className="section-title">THE PEOPLE<br /><span className="text-hotpink">HAVE SPOKEN.</span></h2>
            </div>
            <span className="hidden font-mono text-[8px] uppercase tracking-[0.18em] text-white/20 sm:block">*Legally speaking, entities</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6"
              >
                <div className="flex items-center gap-1 text-acid">
                  {Array.from({ length: review.rating }).map((_, star) => <Star key={star} size={12} fill="currentColor" />)}
                </div>
                <p className="mt-5 min-h-[4.5rem] text-sm leading-relaxed text-white/65">“{review.quote}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-lg">{review.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold">{review.name}</p>
                    <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 py-24 md:py-36">
        <TiltCard intensity={4} className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0b0715]">
          <div className="absolute inset-0 aurora opacity-60" />
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-hotpink/15 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-electric/10 blur-[100px]" />
          <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center md:py-24">
            <motion.span
              animate={reducedMotion ? undefined : { rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-5xl"
            >
              🐄
            </motion.span>
            <p className="mt-5 eyebrow text-acid">The tiny cow has a message</p>
            <h2 className="mt-4 max-w-[13ch] font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.86]">
              CLICK SOMETHING.<br /><span className="text-stroke">ANYTHING.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
              The website is waiting. The button is nervous. The tiny cow has prepared a small speech about moo-tivation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <SurpriseButton label="Create a small disaster" sublabel="Instantly regrettable. Always harmless." />
              <button
                type="button"
                onClick={() => {
                  play('moo')
                  addToast('The tiny cow says moo. That is the entire speech. It took three months to write.')
                }}
                className="btn-ghost text-xs uppercase tracking-[0.08em]"
              >
                <MousePointerClick size={14} /> Ask the cow
              </button>
            </div>
            <p className="mt-8 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
              <Zap size={11} /> No downloads. No sign-up. No escape route.
            </p>
          </div>
        </TiltCard>
      </section>
    </div>
  )
}
