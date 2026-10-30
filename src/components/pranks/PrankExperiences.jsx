import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AlertTriangle,
  BellRing,
  Check,
  DownloadCloud,
  Frown,
  Ghost,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Terminal,
  X,
  Zap,
} from 'lucide-react'
import { fakeErrors, loadingStatuses, mysteryOutcomes, notificationMessages, scanFiles } from '../../data/content'
import { pick, randomInt, shuffle } from '../../lib/utils'
import Confetti from '../Confetti'

const patienceLines = [
  'Your patience has been noted and will be ignored during the next update.',
  'The computer appreciates your support. It is still not finishing.',
  'You have unlocked: Sitting Quietly (Level 2).',
  'Progress bars are a social construct. You are doing great.',
  'The update is thinking about its life choices.',
]

const errorRetorts = [
  'Report sent to a pigeon. The pigeon has follow-up questions.',
  'Error successfully ignored. This is now a personality trait.',
  'The error has been promoted to feature. Please applaud.',
  'We tried to fix it. It bit us. We have decided to respect its boundaries.',
]

const broadcastLines = [
  'A rogue emoji has breached the second dimension.',
  'The tiny cow has assumed control of the snack supply.',
  'Reality has been paused for a quick stretch.',
  'A pigeon is now in charge of quality control.',
  'The void would like to remind you: no running in the corridors.',
]

const dodgeTaunts = [
  'Nope.',
  'Too slow.',
  'The button has plans.',
  'Catch me if you care.',
  'This is not my first rodeo.',
  'Absolutely not.',
  'I have a family.',
  'You seem nice. Still no.',
  'The button is in its flop era.',
]

const scanResults = [
  {
    title: 'Extreme Cuteness Detected',
    level: 'CRITICAL',
    body: 'The tiny cow in your system is operating at maximum adorable capacity. There is no known cure. We recommend embracing it.',
    action: 'Quarantine my vibes',
    emoji: '🐄',
  },
  {
    title: 'Browser History: Illegal Amounts of Curiosity',
    level: 'SEVERE',
    body: 'You have opened 47 tabs and bookmarked none. The browser is not angry. It is disappointed. It has called your mother.',
    action: 'Accept my past',
    emoji: '🌐',
  },
  {
    title: 'One (1) Unresolved Feeling',
    level: 'MODERATE',
    body: 'We found a feeling from 2019 hiding behind a meme. It is not dangerous, but it would like to talk when you have a minute.',
    action: 'Schedule a chat',
    emoji: '🫠',
  },
  {
    title: 'Terminal Case of Main Character Energy',
    level: 'UNHINGED',
    body: 'Your confidence levels are off the charts. Side effects include starting sentences with "So anyway" and owning far too many tote bags.',
    action: 'Keep the energy',
    emoji: '💅',
  },
]

function PrankIntro({ eyebrow, title, accent, description }) {
  return (
    <div className="text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: accent }}>{eyebrow}</p>
      <h2 className="mt-3 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.88]">{title}</h2>
      {description && <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/45">{description}</p>}
    </div>
  )
}

export function FakeUpdate({ onClose, play }) {
  const [progress, setProgress] = useState(37)
  const [line, setLine] = useState(0)
  const [retort, setRetort] = useState('Please keep your computer on. It is going through something.')
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 97) return 41
        return current + randomInt(1, 5)
      })
      setLine((current) => (current + 1) % patienceLines.length)
    }, 1400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#071018] px-5 py-20 text-center sm:px-8">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-electric/10 blur-[120px]" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-grape/10 blur-[120px]" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <motion.div
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="relative flex h-24 w-24 items-center justify-center rounded-full border border-electric/30"
        >
          <div className="absolute inset-2 rounded-full border border-dashed border-white/10" />
          <DownloadCloud size={34} className="text-electric" />
        </motion.div>
        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.25em] text-electric">ChaosOS · Extremely important update</p>
        <h2 className="mt-4 font-display text-[clamp(3.3rem,9vw,7rem)] leading-[0.84]">WORKING ON<br /><span className="text-electric">UPDATES.</span></h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
          Your device is receiving a vital security patch for a problem that does not exist. Please do not turn it off. It is very emotionally attached.
        </p>

        <div className="mt-9 w-full max-w-xl">
          <div className="flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
            <span>{line % 2 === 0 ? 'Installing chaos...' : 'Still installing chaos...'}</span>
            <span className="text-2xl font-bold text-electric">{progress}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-grape to-electric" animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
          </div>
          <div className="mt-3 flex justify-between font-mono text-[8px] uppercase tracking-[0.15em] text-white/25">
            <span>{Math.floor(progress * 14)} files of 4,096</span>
            <span>Est. time: 4h 12m + one existential crisis</span>
          </div>
        </div>

        <p className="mt-6 min-h-[1.5rem] text-xs italic text-white/40">{retort}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              play('pop')
              setRetort(patienceLines[line])
            }}
            className="rounded-full border border-electric/30 bg-electric/10 px-5 py-3 text-xs font-semibold text-electric transition hover:bg-electric/15"
          >
            Wait patiently
          </button>
          <button
            type="button"
            onClick={() => {
              play('error')
              setRetort('You need your computer? Bold. It needs you too. It has abandonment issues and a small therapy appointment on Thursday.')
            }}
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white/60 transition hover:bg-white/[0.08]"
          >
            I need my computer
          </button>
        </div>
        <button type="button" onClick={onClose} className="mt-8 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25 underline decoration-white/20 underline-offset-4 hover:text-white/60">
          This is a fictional prank. Escape while you can.
        </button>
      </div>
      <p className="relative z-10 mt-12 font-mono text-[8px] uppercase tracking-[0.16em] text-white/15">Do not turn off your computer. Or do. We are a website, not a cop.</p>
    </div>
  )
}

export function EndlessLoader({ onClose, play }) {
  const [progress, setProgress] = useState(3)
  const [statusIndex, setStatusIndex] = useState(0)
  const [cancelAttempts, setCancelAttempts] = useState(0)
  const [mercy, setMercy] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const statuses = useMemo(() => shuffle(loadingStatuses), [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((current) => {
        if (current > 88) return randomInt(11, 23)
        return current + randomInt(1, 4)
      })
      setStatusIndex((current) => (current + 1) % statuses.length)
    }, 780)
    return () => window.clearInterval(id)
  }, [statuses.length])

  useEffect(() => {
    const timer = window.setTimeout(() => setMercy(true), 8000)
    return () => window.clearTimeout(timer)
  }, [])

  const tryCancel = () => {
    const next = cancelAttempts + 1
    setCancelAttempts(next)
    play('boing')
    setMessage(
      next === 1
        ? 'Cancel request received. We have sent it to a department that does not exist.'
        : next === 2
          ? 'Cancel failed successfully. The loading bar feels seen.'
          : next === 3
            ? 'The cancel button has resigned. It left a very polite note.'
            : 'Please stop. The bar is trying its best. We are all trying our best.',
    )
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0a0713] px-5 py-20 text-center">
      <div className="absolute inset-0 opacity-[0.18] [background:radial-gradient(circle_at_center,#8b5cf6_0,transparent_55%)]" />
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-grape/30 bg-grape/10">
          <LoaderCircle size={32} className="animate-spin text-grape" />
        </div>
        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.25em] text-grape">99% complete since 2019</p>
        <h2 className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.85]">LOADING<br /><span className="text-stroke">FOREVER.</span></h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/45">
          We are preparing something incredible. We cannot tell you what. We cannot tell you when. We cannot confirm that anything is preparing at all.
        </p>

        <div className="mt-9">
          <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">
            <span>{statuses[statusIndex]}</span>
            <span className="text-grape">{progress}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-grape via-hotpink to-tangerine" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
          <p className="mt-4 min-h-[3rem] rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 text-xs leading-relaxed text-white/45">{message}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            type="button"
            onClick={tryCancel}
            animate={{ x: cancelAttempts * 8, rotate: cancelAttempts * -2 }}
            className="rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 text-xs font-semibold text-white/55 transition hover:bg-white/10"
          >
            {cancelAttempts === 0 ? 'Cancel' : cancelAttempts < 3 ? 'Cancel again' : 'You cannot cancel vibes'}
          </motion.button>
          {mercy && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => {
                play('fanfare')
                onClose()
              }}
              className="rounded-full bg-acid px-5 py-3 text-xs font-bold text-ink transition hover:scale-105"
            >
              Fine. Show me the joke.
            </motion.button>
          )}
        </div>
        <p className="mt-8 max-w-md text-xs leading-relaxed text-white/30">
          Spoiler: the page loaded instantly. The loading screen is the entertainment. You are the content. We are all content.
        </p>
        <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">Fictional prank · your browser is fine · your patience is not</p>
      </div>
    </div>
  )
}

export function CowardlyButton({ onClose, play }) {
  const [position, setPosition] = useState({ x: 50, y: 55 })
  const [escapes, setEscapes] = useState(0)
  const [taunt, setTaunt] = useState('Click me. I promise I will stay.')
  const [won, setWon] = useState(false)
  const lastDodge = useRef(0)
  const reducedMotion = useReducedMotion()

  const dodge = () => {
    const now = Date.now()
    if (now - lastDodge.current < 130) return
    lastDodge.current = now
    const next = escapes + 1
    setEscapes(next)
    play('boing')
    if (next >= 8) {
      setWon(true)
      setTaunt('Okay. Fine. I am tired. You win.')
      return
    }
    setPosition({ x: randomInt(8, 76), y: randomInt(24, 72) })
    setTaunt(dodgeTaunts[next % dodgeTaunts.length])
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0b0614] px-5 py-20">
      <div className="absolute inset-0 grid-lines opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,46,151,.08),transparent_50%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <PrankIntro
          eyebrow="Button psychology · session 01"
          title={<>THE COWARDLY<br /><span className="text-hotpink">BUTTON.</span></>}
          accent="#ff2e97"
          description="It has commitment issues. Every approach makes it reconsider everything. Reach it 8 times and it will finally admit defeat."
        />
        <div className="mt-6 flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
          <span>Escapes: {Math.min(escapes, 8)} / 8</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>Current mood: {won ? 'defeated' : 'skittish'}</span>
        </div>

        <div className="relative mt-7 min-h-[22rem] flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025]">
          <div className="absolute inset-0 grid-lines opacity-30" />
          <div className="absolute left-4 top-4 font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">Click zone / no refunds</div>
          <AnimatePresence mode="wait">
            {!won ? (
              <motion.button
                key="escape"
                type="button"
                onPointerEnter={dodge}
                onClick={dodge}
                animate={reducedMotion ? { left: `${position.x}%`, top: `${position.y}%` } : { left: `${position.x}%`, top: `${position.y}%`, rotate: [0, 3, -3, 0] }}
                transition={{ type: 'spring', stiffness: 400, damping: 22, rotate: { duration: 0.5 } }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-hotpink/40 bg-hotpink px-6 py-3 text-xs font-bold text-ink shadow-[0_0_40px_rgba(255,46,151,.3)]"
              >
                {taunt}
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.span animate={reducedMotion ? undefined : { rotate: [0, 8, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl">😮‍💨</motion.span>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-hotpink">The button has surrendered</p>
                <h3 className="mt-2 font-display text-4xl">“I BELIEVE YOU.”</h3>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/45">It has agreed to be clicked once. This is a historic moment for buttons everywhere.</p>
                <button
                  type="button"
                  onClick={() => {
                    play('win')
                    onClose()
                  }}
                  className="mt-6 rounded-full bg-acid px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:scale-105"
                >
                  Click the button (gently)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">
            {won ? 'peace was never an option. until now.' : 'approach with confidence. or snacks.'}
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">Harmless fictional prank · button feelings are simulated</p>
      </div>
    </div>
  )
}

export function ErrorMixer({ onClose, play }) {
  const [error, setError] = useState(() => pick(fakeErrors))
  const [retort, setRetort] = useState('')
  const [count, setCount] = useState(1)

  const roll = () => {
    let next = pick(fakeErrors)
    if (next.code === error.code) next = fakeErrors[(fakeErrors.indexOf(next) + 1) % fakeErrors.length]
    setError(next)
    setCount((c) => c + 1)
    play('error')
  }

  const respond = (good) => {
    play(good ? 'success' : 'fail')
    setRetort(good ? pick(errorRetorts) : 'The report was sent directly to the void. The void has marked it as "LOL" and moved on.')
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#09060f] px-4 py-20">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-tangerine/[0.07] blur-[120px]" />
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          key={error.code}
          initial={{ opacity: 0, scale: 0.95, rotate: -0.7 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="overflow-hidden rounded-2xl border border-white/15 bg-[#171221] shadow-[0_30px_100px_rgba(0,0,0,.6)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-hotpink/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-tangerine/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-acid/60" />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">ChaosOS error center</span>
            <span className="h-2 w-2 rounded-full bg-white/10" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-hotpink/10 text-hotpink"><AlertTriangle size={24} /></span>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-hotpink">{error.code}</p>
                <h3 className="mt-1.5 text-xl font-bold">{error.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{error.body}</p>
              </div>
            </div>
            <div className="mt-6 h-px bg-white/10" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/25">Error #{String(count).padStart(3, '0')} · 100% fictional</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => respond(false)} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/50 transition hover:bg-white/[0.08]">Don't send report</button>
                <button type="button" onClick={() => respond(true)} className="rounded-lg border border-hotpink/30 bg-hotpink/10 px-4 py-2.5 text-xs font-semibold text-hotpink transition hover:bg-hotpink/15">Send report</button>
              </div>
            </div>
            {retort && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-lg border border-acid/15 bg-acid/[0.05] p-3 text-xs leading-relaxed text-acid/80">{retort}</motion.p>}
          </div>
        </motion.div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={roll} className="flex items-center gap-2 rounded-full bg-tangerine px-5 py-3 text-xs font-bold text-ink transition hover:scale-105">
            <RefreshCw size={14} /> Generate another catastrophe
          </button>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-5 py-3 text-xs font-semibold text-white/45 transition hover:bg-white/[0.05]">Tell no one</button>
        </div>
        <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">Your device is fine. Your search history remains unread. We are scared of it.</p>
      </div>
    </div>
  )
}

export function ScreenTakeover({ onClose, play }) {
  const [index, setIndex] = useState(0)
  const [response, setResponse] = useState(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const id = window.setInterval(() => setIndex((current) => (current + 1) % broadcastLines.length), 3200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#13030a] px-5 py-20 text-center">
      <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 50% 30%,rgba(255,46,151,.18),transparent 45%), radial-gradient(circle at 20% 90%,rgba(255,122,24,.12),transparent 40%)' }} />
      <div className="absolute inset-0 grid-lines opacity-10" />
      <div className="absolute inset-x-0 top-0 h-1 bg-hotpink" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-hotpink" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <motion.div
          animate={reducedMotion ? undefined : { scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-hotpink/40 bg-hotpink/10 text-3xl"
        >
          👁️
        </motion.div>
        <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.3em] text-hotpink">Emergency broadcast · not really</p>
        <h2 className="mt-3 font-display text-[clamp(4rem,13vw,11rem)] leading-[0.78] text-white">THIS IS<br /><span className="text-hotpink">NOT A DRILL.</span></h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/55">
          The website has temporarily taken over the website. This is legal. Probably. Please enjoy the emotional buffet.
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-7 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">
              <span className="text-hotpink">LIVE:</span> {broadcastLines[index]}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              play('boing')
              setResponse('Fear logged. It has been converted into confetti and released into the wild.')
            }}
            className="rounded-full bg-hotpink px-6 py-3 text-xs font-bold text-ink transition hover:scale-105"
          >
            I am scared
          </button>
          <button
            type="button"
            onClick={() => {
              play('success')
              setResponse('Entertainment logged. You are now part of the broadcast. The broadcast is grateful.')
            }}
            className="rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-xs font-semibold text-white/65 transition hover:bg-white/10"
          >
            I am entertained
          </button>
        </div>
        {response && <p className="mt-5 max-w-md text-xs leading-relaxed text-acid/80">{response}</p>}
        <div className="mt-9 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-hotpink" /> Broadcast will end eventually. Probably.
        </div>
        <button type="button" onClick={onClose} className="mt-8 rounded-full border border-white/10 px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30 transition hover:border-white/25 hover:text-white/70">
          End broadcast
        </button>
      </div>
      <div className="pointer-events-none absolute bottom-5 left-5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/15">FICTIONAL PRANK · YOUR DEVICE IS NOT POSSESSED</div>
    </div>
  )
}

let notificationSequence = 0

export function NotificationStorm({ onClose, play }) {
  const [items, setItems] = useState([])
  const [cleared, setCleared] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    const add = () => {
      if (indexRef.current >= 10) return
      const base = notificationMessages[indexRef.current % notificationMessages.length]
      notificationSequence += 1
      const entry = {
        ...base,
        id: `notification-${notificationSequence}`,
        rotation: randomInt(-2, 2),
      }
      setItems((current) => (current.some((item) => item.id === entry.id) ? current : [...current, entry]))
      indexRef.current += 1
    }
    add()
    add()
    const id = window.setInterval(add, 850)
    return () => window.clearInterval(id)
  }, [])

  const dismiss = (id) => {
    play('pop')
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#070410] px-4 py-20">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-grape/10 blur-[120px]" />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col">
        <div className="text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-grape">Priority level: extremely unnecessary</p>
          <h2 className="mt-3 font-display text-[clamp(3rem,8vw,6rem)] leading-[0.84]">NOTIFICATION<br /><span className="text-grape">STORM.</span></h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/45">
            You have {cleared ? 'zero' : items.length} new messages. All of them are important. None of them matter. The pigeon is typing.
          </p>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-3xl flex-1 content-start gap-3 sm:grid-cols-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -22, scale: 0.9, rotate: item.rotation }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: item.rotation }}
                exit={{ opacity: 0, scale: 0.85, x: 40 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="rounded-2xl border border-white/10 bg-[#151021]/95 p-4 shadow-[0_14px_50px_rgba(0,0,0,.4)] backdrop-blur"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-grape/15 text-grape"><BellRing size={14} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/30">{item.app}</p>
                      <button type="button" onClick={() => dismiss(item.id)} className="text-white/25 hover:text-white" aria-label="Dismiss notification"><X size={12} /></button>
                    </div>
                    <p className="mt-1 text-xs font-bold">{item.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/45">{item.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {!cleared ? (
            <>
              <button
                type="button"
                onClick={() => {
                  play('success')
                  setItems([])
                  setCleared(true)
                }}
                className="rounded-full bg-grape px-6 py-3 text-xs font-bold text-white transition hover:scale-105"
              >
                Mark all as read
              </button>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-6 py-3 text-xs font-semibold text-white/45 transition hover:bg-white/[0.05]">
                Escape the inbox
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <p className="text-sm font-semibold text-acid">Inbox zero. Suspiciously quiet.</p>
              <p className="mt-1 text-xs text-white/40">The silence is judging you. The tiny cow has sent a follow-up.</p>
              <button type="button" onClick={onClose} className="mt-4 rounded-full bg-acid px-6 py-3 text-xs font-bold text-ink transition hover:scale-105">Leave on read</button>
            </motion.div>
          )}
        </div>
        <p className="mt-6 text-center font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">All notifications are fictional · the pigeon is real</p>
      </div>
    </div>
  )
}

export function DisappearingButton({ onClose, play }) {
  const [attempts, setAttempts] = useState(0)
  const [visible, setVisible] = useState(true)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [message, setMessage] = useState('It is right there. Surely it will stay this time.')
  const [found, setFound] = useState(false)
  const hideTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [])

  const vanish = () => {
    if (found) return
    play('teleport')
    setVisible(false)
    setAttempts((current) => current + 1)
    setMessage(pick([
      'Gone. Like your motivation on a Sunday.',
      'It was here a second ago. It sends its regards.',
      'The button has entered witness protection.',
      'You are getting warmer. Emotionally. Not physically.',
      'The button is now a myth. Tell your friends.',
    ]))
    hideTimer.current = window.setTimeout(() => {
      setPosition({ x: randomInt(12, 78), y: randomInt(22, 72) })
      setVisible(true)
      if (attempts >= 4) {
        setFound(true)
        setMessage('Fine. You found its hiding spot. It would like to discuss boundaries.')
        play('sparkle')
      }
    }, 900)
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#061318] px-5 py-20">
      <div className="absolute inset-0 grid-lines opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(53,230,255,.08),transparent_50%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <PrankIntro
          eyebrow="Object permanence · beginner level"
          title={<>NOW YOU SEE<br /><span className="text-electric">ME. MAYBE.</span></>}
          accent="#35e6ff"
          description="One button. One simple task. A profound lack of object permanence. Click it before it gets shy."
        />
        <div className="relative mt-7 flex min-h-[23rem] flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025]">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="absolute left-4 top-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">Attempts: {String(attempts).padStart(2, '0')} · Probability of success: vibes</div>
          <AnimatePresence mode="wait">
            {visible ? (
              <motion.button
                key={`${position.x}-${position.y}-${found}`}
                type="button"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, left: `${position.x}%`, top: `${position.y}%` }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: 'spring', stiffness: 330, damping: 22 }}
                onPointerEnter={() => {
                  if (!found && attempts < 4) vanish()
                }}
                onClick={() => {
                  if (found) {
                    play('win')
                    onClose()
                  } else {
                    vanish()
                  }
                }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full px-7 py-3.5 text-xs font-bold shadow-lg transition-transform hover:scale-105 ${
                  found ? 'bg-acid text-ink' : 'border border-electric/40 bg-electric text-ink'
                }`}
              >
                {found ? 'You found me. Click once.' : 'Click me'}
              </motion.button>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <p className="text-5xl">👻</p>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">Button temporarily out of office</p>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="absolute bottom-4 left-1/2 w-full -translate-x-1/2 px-5 text-center text-xs italic text-white/40">{message}</p>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">Tip: hovering counts as a formal approach.</p>
          <button type="button" onClick={onClose} className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/30 underline decoration-white/20 underline-offset-4 hover:text-white">
            Give up gracefully
          </button>
        </div>
      </div>
    </div>
  )
}

export function VirusScan({ onClose, play }) {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])
  const [done, setDone] = useState(false)
  const [result] = useState(() => pick(scanResults))
  const fileList = useMemo(() => shuffle(scanFiles), [])

  useEffect(() => {
    if (done) return undefined
    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + randomInt(1, 3))
        if (next >= 100) setDone(true)
        return next
      })
    }, 150)
    const logTimer = window.setInterval(() => {
      setLogs((current) => {
        const nextFile = fileList[current.length % fileList.length]
        return [...current.slice(-5), nextFile]
      })
    }, 620)
    return () => {
      window.clearInterval(progressTimer)
      window.clearInterval(logTimer)
    }
  }, [done, fileList])

  const finish = () => {
    setDone(true)
    setProgress(100)
    play('error')
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#050b0b] px-5 py-20">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-acid/[0.04] to-transparent" />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={17} className="text-acid" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">ChaosGuard™ Total Security</span>
          </div>
          <span className="rounded-full border border-acid/20 bg-acid/[0.06] px-3 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-acid">Simulation</span>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
              <div className="relative mx-auto mt-12 flex h-40 w-40 items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-acid/20" />
                <div className="absolute inset-4 rounded-full border border-dashed border-white/10 orbit" />
                <div className="absolute inset-8 rounded-full border border-acid/20" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[18%] rounded-full border-2 border-transparent border-t-acid border-r-acid/30"
                />
                <ShieldCheck size={34} className="text-acid" />
              </div>
              <h2 className="mt-7 text-center font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.9]">SCANNING YOUR<br /><span className="text-acid">ENTIRE VIBE.</span></h2>
              <p className="mx-auto mt-3 max-w-sm text-center text-sm text-white/40">Do not panic. Panic is not due until phase two.</p>
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
                  <span>Checking {Math.floor(progress * 8.46)} files</span>
                  <span className="text-acid">{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div className="h-full rounded-full bg-acid" animate={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
                </div>
                <div className="mt-4 min-h-[7rem] space-y-1.5 font-mono text-[9px] text-white/30">
                  {logs.map((log, index) => (
                    <p key={`${log}-${index}`} className="truncate"><span className="text-acid/60">›</span> Scanning {log}</p>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button type="button" onClick={finish} className="rounded-full border border-white/10 px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 transition hover:border-acid/30 hover:text-acid">
                  Skip to the bad news
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-hotpink/40 bg-hotpink/10 text-hotpink">
                <ShieldX size={34} />
              </div>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.24em] text-hotpink">1 threat detected · {result.level}</p>
              <h2 className="mx-auto mt-3 max-w-[16ch] font-display text-[clamp(2.7rem,7vw,5.2rem)] leading-[0.88]">{result.title}</h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/50">{result.body}</p>
              <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
                <span className="text-3xl">{result.emoji}</span>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-acid">Threat quarantined to your personality</p>
                  <p className="mt-1 text-xs text-white/40">No files were harmed. Your browser is fine. The scan was 100% pretend.</p>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => { play('success'); onClose() }} className="rounded-full bg-acid px-6 py-3 text-xs font-bold text-ink transition hover:scale-105">{result.action}</button>
                <button type="button" onClick={() => { setDone(false); setProgress(0); setLogs([]) }} className="rounded-full border border-white/10 px-6 py-3 text-xs font-semibold text-white/50 transition hover:bg-white/[0.05]">Scan again (why?)</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-8 text-center font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">Fictional security theater · no actual scanning · your vibes remain your business</p>
      </div>
    </div>
  )
}

export function MysteryBox({ onClose, play }) {
  const [result, setResult] = useState(null)
  const [opening, setOpening] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const open = useReducedMotion()
  const timer = useRef(null)

  useEffect(() => {
    setReducedMotion(Boolean(open))
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [open])

  const roll = () => {
    if (opening) return
    play('drumroll')
    setOpening(true)
    setResult(null)
    const nextResult = pick(mysteryOutcomes)
    timer.current = window.setTimeout(() => {
      setResult(nextResult)
      setOpening(false)
      play(nextResult.rarity === 'LEGENDARY' ? 'fanfare' : 'sparkle')
    }, 750)
  }

  const rarityColor = result?.rarity === 'LEGENDARY' ? '#c8ff3d' : result?.rarity === 'RARE' ? '#ff7a18' : result?.rarity === 'UNCOMMON' ? '#35e6ff' : '#8b5cf6'

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0d0716] px-5 py-20 text-center">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tangerine/[0.07] blur-[110px]" />
      {result?.rarity === 'LEGENDARY' && <Confetti count={80} />}
      <div className="relative z-10 w-full max-w-xl">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-tangerine">Handle with curiosity</p>
        <h2 className="mt-3 font-display text-[clamp(3rem,8vw,6rem)] leading-[0.86]">THE MYSTERY<br /><span className="text-tangerine">BOX.</span></h2>
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <motion.button
                type="button"
                onClick={roll}
                whileHover={reducedMotion ? undefined : { scale: 1.04, rotate: -1.5 }}
                whileTap={{ scale: 0.94 }}
                className="relative mx-auto mt-12 flex h-48 w-48 flex-col items-center justify-center rounded-[30px] border border-tangerine/35 bg-gradient-to-br from-tangerine/25 to-grape/10 shadow-[0_0_80px_rgba(255,122,24,.14)]"
                aria-label="Open the mystery box"
              >
                <span className="absolute inset-3 rounded-[22px] border border-dashed border-white/10" />
                <motion.span animate={opening ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.1, 1] } : { y: [0, -8, 0] }} transition={{ duration: 0.5, repeat: opening ? Infinity : 3 }} className="text-7xl">
                  {opening ? '✨' : '🎁'}
                </motion.span>
                <span className="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/60">{opening ? 'opening...' : 'click to open'}</span>
              </motion.button>
              <p className="mt-6 text-xs text-white/35">Contents may include: a duck, a prophecy, or a potato. No refunds.</p>
            </motion.div>
          ) : (
            <motion.div key={result.title} initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="mt-10 rounded-[28px] border bg-[#100a1d] p-7" style={{ borderColor: `${rarityColor}40` }}>
              <span className="inline-flex rounded-full border px-3 py-1 font-mono text-[8px] uppercase tracking-[0.2em]" style={{ borderColor: `${rarityColor}55`, color: rarityColor, background: `${rarityColor}12` }}>{result.rarity} FIND</span>
              <p className="mt-5 text-6xl">{result.emoji}</p>
              <h3 className="mt-4 font-display text-4xl">{result.title}</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/50">{result.text}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={roll} className="rounded-full bg-tangerine px-5 py-3 text-xs font-bold text-ink transition hover:scale-105">Open another box</button>
                <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-5 py-3 text-xs font-semibold text-white/50 transition hover:bg-white/[0.05]">Take the box home</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-8 font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">Box contains 100% fiction · the duck is not real · the potato might be</p>
      </div>
    </div>
  )
}
