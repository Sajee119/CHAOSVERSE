import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Cat,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  Lightbulb,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import { decisionExtras, quizQuestions } from '../../data/content'
import { formatTime, pick, randomInt, shuffle } from '../../lib/utils'
import { useSound } from '../../context/SoundContext'
import { useChaos } from '../../context/ChaosContext'

const dodgeEmojis = ['💣', '📉', '🧾', '🦆', '🧦', '🔥', '📢', '🥊']

function GameShell({ accent = '#c8ff3d', kicker, title, subtitle, children }) {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#070410] px-4 pb-16 pt-16 sm:px-6 md:pt-20">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute -left-28 top-1/4 h-80 w-80 rounded-full opacity-[0.09] blur-[110px]" style={{ background: accent }} />
      <div className="absolute -right-28 bottom-1/4 h-80 w-80 rounded-full opacity-[0.07] blur-[110px]" style={{ background: '#8b5cf6' }} />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 pr-28 sm:flex-row sm:items-end sm:justify-between sm:pr-32">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.24em]" style={{ color: accent }}>{kicker}</p>
            <h1 className="mt-1 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.85]">{title}</h1>
          </div>
          <p className="max-w-[17rem] text-xs leading-relaxed text-white/35 sm:text-right">{subtitle}</p>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

function ResultCard({ emoji, title, subtitle, stats, onReplay, onClose, accent = '#c8ff3d' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="mx-auto mt-8 w-full max-w-xl rounded-[28px] border bg-[#0e091a] p-7 text-center"
      style={{ borderColor: `${accent}35` }}
    >
      <motion.div
        animate={{ rotate: [0, 7, -7, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="text-6xl"
      >
        {emoji}
      </motion.div>
      <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.22em]" style={{ color: accent }}>{subtitle}</p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      {stats && <div className="mx-auto mt-5 flex max-w-sm items-stretch justify-center gap-2">{stats}</div>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onReplay} className="rounded-full px-5 py-3 text-xs font-bold text-ink transition hover:scale-105" style={{ background: accent }}>
          <RefreshCw size={13} className="mr-1 inline" /> Play again
        </button>
        <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white/55 transition hover:bg-white/[0.08]">
          Back to arcade
        </button>
      </div>
    </motion.div>
  )
}

function StatBox({ label, value, accent }) {
  return (
    <div className="min-w-[5rem] rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
      <p className="font-display text-2xl leading-none" style={{ color: accent }}>{value}</p>
      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">{label}</p>
    </div>
  )
}

export function CatchGame({ onClose, play, onResult }) {
  const [phase, setPhase] = useState('idle')
  const [timeLeft, setTimeLeft] = useState(20)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [misses, setMisses] = useState(0)
  const [target, setTarget] = useState({ x: 50, y: 45 })
  const reported = useRef(false)

  const moveTarget = () => setTarget({ x: randomInt(15, 85), y: randomInt(18, 82) })

  useEffect(() => {
    if (phase !== 'playing') return undefined
    const moveTimer = window.setInterval(moveTarget, 720)
    const clock = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setPhase('over')
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => {
      window.clearInterval(moveTimer)
      window.clearInterval(clock)
    }
  }, [phase])

  useEffect(() => {
    if ((phase === 'over' || phase === 'won') && !reported.current) {
      reported.current = true
      onResult('catch', score)
    }
  }, [phase, score, onResult])

  const start = () => {
    reported.current = false
    setScore(0)
    setCombo(0)
    setMisses(0)
    setTimeLeft(20)
    moveTarget()
    setPhase('playing')
    play('whoosh')
  }

  const hit = (event) => {
    event.stopPropagation()
    if (phase !== 'playing') return
    setScore((current) => current + 1)
    setCombo((current) => current + 1)
    play('coin')
    moveTarget()
  }

  const miss = () => {
    if (phase !== 'playing') return
    setMisses((current) => current + 1)
    setCombo(0)
    play('fail')
  }

  const rating = score >= 14 ? 'Certified Chaos Catcher' : score >= 8 ? 'Respectable Reflex Goblin' : score >= 3 ? 'You Tried™' : 'The Cow Escaped'

  return (
    <GameShell accent="#c8ff3d" kicker="Chaos arcade · reflex division" title={<>CATCH THE<br /><span className="text-acid">CHAOS.</span></>} subtitle="Twenty seconds. One flying tiny cow. Zero cow-related injuries guaranteed.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
          <span className="flex items-center gap-1.5"><Clock3 size={12} /> {formatTime(timeLeft)}</span>
          <span className="flex items-center gap-1.5"><Target size={12} /> {score} caught</span>
          <span className="hidden items-center gap-1.5 sm:flex"><X size={12} /> {misses} whiffs</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-acid">
          <Zap size={12} /> combo x{combo}
        </div>
      </div>

      {phase === 'idle' && (
        <div className="flex min-h-[25rem] flex-col items-center justify-center rounded-[28px] border border-acid/20 bg-[#0c1205] p-8 text-center">
          <motion.div animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl">🐄</motion.div>
          <h2 className="mt-5 font-display text-4xl">A WILD TINY COW APPEARS</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">It will fly around this arena. Click it as many times as you can before the timer runs out. Clicking empty space counts as a whiff. The cow is judging you.</p>
          <button type="button" onClick={start} className="mt-6 flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:scale-105">
            <Play size={14} fill="currentColor" /> Start catching
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div onClick={miss} className="relative min-h-[27rem] cursor-crosshair overflow-hidden rounded-[28px] border border-acid/20 bg-[#0a1004]">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="absolute left-4 top-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">Click the cow. Do not click the void.</div>
          <motion.button
            type="button"
            onClick={hit}
            animate={{ left: `${target.x}%`, top: `${target.y}%` }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-acid/30 bg-acid/10 text-4xl shadow-[0_0_40px_rgba(200,255,61,.18)] backdrop-blur-sm transition-transform hover:scale-110"
            aria-label="Catch the tiny cow"
          >
            🐄
            <span className="absolute inset-0 rounded-full border border-acid/25 ring-pulse" />
          </motion.button>
          <div className="absolute bottom-4 right-4 font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">Cow velocity: emotionally unstable</div>
        </div>
      )}

      {(phase === 'over' || phase === 'won') && (
        <ResultCard
          emoji={score >= 8 ? '🏆' : '🐄'}
          title={rating}
          subtitle={`You caught ${score} cow${score === 1 ? '' : 's'}`}
          accent="#c8ff3d"
          stats={(
            <>
              <StatBox label="Caught" value={score} accent="#c8ff3d" />
              <StatBox label="Whiffs" value={misses} accent="#ff2e97" />
              <StatBox label="Rating" value={score >= 8 ? 'A' : score >= 3 ? 'C' : '?'} accent="#35e6ff" />
            </>
          )}
          onReplay={start}
          onClose={onClose}
        />
      )}
    </GameShell>
  )
}

export function ImpossibleClick({ onClose, play, onResult }) {
  const [phase, setPhase] = useState('idle')
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [message, setMessage] = useState('Begin when ready. The button is not ready.')
  const reported = useRef(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (phase !== 'playing') return undefined
    const id = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setPhase('lost')
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase])

  useEffect(() => {
    if ((phase === 'won' || phase === 'lost') && !reported.current) {
      reported.current = true
      onResult('impossible', clicks)
    }
  }, [phase, clicks, onResult])

  const start = () => {
    reported.current = false
    setClicks(0)
    setTimeLeft(20)
    setPosition({ x: 50, y: 50 })
    setMessage('Click the button. It has been warned about you.')
    setPhase('playing')
    play('whoosh')
  }

  const clickTarget = (event) => {
    event.stopPropagation()
    if (phase !== 'playing') return
    const next = clicks + 1
    setClicks(next)
    play('click')
    if (next >= 25) {
      setPhase('won')
      setMessage('You did it. The button is filing a complaint.')
      play('win')
      return
    }
    if (next % 2 === 0) {
      setPosition({ x: randomInt(15, 82), y: randomInt(25, 75) })
    }
    setMessage(pick([
      'The button is reconsidering its career.',
      'That one almost hurt its feelings.',
      'You are persistent. It is concerned.',
      'The button has started a support group.',
      'It is shrinking out of self-respect.',
    ]))
  }

  const size = Math.max(52, 108 - clicks * 2)

  return (
    <GameShell accent="#ff2e97" kicker="Chaos arcade · patience division" title={<>THE IMPOSSIBLE<br /><span className="text-hotpink">CLICK.</span></>} subtitle="Click the button twenty-five times. It will shrink, move, and develop a personality. You will not be compensated.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
          <span className="flex items-center gap-1.5"><Clock3 size={12} /> {formatTime(timeLeft)}</span>
          <span className="flex items-center gap-1.5"><Target size={12} /> {clicks} / 25 clicks</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-hotpink">Button morale: declining</span>
      </div>

      {phase === 'idle' && (
        <div className="flex min-h-[25rem] flex-col items-center justify-center rounded-[28px] border border-hotpink/20 bg-[#150812] p-8 text-center">
          <motion.span animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-7xl">🔴</motion.span>
          <h2 className="mt-5 font-display text-4xl">A VERY NERVOUS BUTTON</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">It has read the terms and conditions of being clicked. It has questions. You have 20 seconds and 25 clicks. Physics is optional.</p>
          <button type="button" onClick={start} className="mt-6 flex items-center gap-2 rounded-full bg-hotpink px-7 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:scale-105">
            <Play size={14} fill="currentColor" /> Attempt the impossible
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="relative min-h-[27rem] overflow-hidden rounded-[28px] border border-hotpink/20 bg-[#10060d]">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="absolute left-4 top-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">No tricks. Just vibes.</div>
          <motion.button
            type="button"
            onClick={clickTarget}
            animate={{ left: `${position.x}%`, top: `${position.y}%`, width: size, height: size, rotate: reducedMotion ? 0 : clicks * 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hotpink/40 bg-hotpink text-ink shadow-[0_0_50px_rgba(255,46,151,.28)]"
            aria-label="Click the shrinking button"
          >
            <span className="font-display" style={{ fontSize: Math.max(13, size / 4) }}>CLICK</span>
          </motion.button>
          <p className="absolute bottom-4 left-1/2 w-full -translate-x-1/2 px-5 text-center text-xs italic text-white/35">{message}</p>
        </div>
      )}

      {(phase === 'won' || phase === 'lost') && (
        <ResultCard
          emoji={phase === 'won' ? '🥇' : '🫠'}
          title={phase === 'won' ? 'You Clicked the Unclickable' : 'The Button Prevailed'}
          subtitle={phase === 'won' ? '25 clicks. One emotionally exhausted button.' : 'You ran out of time. The button is smug.'}
          accent="#ff2e97"
          stats={(
            <>
              <StatBox label="Clicks" value={clicks} accent="#ff2e97" />
              <StatBox label="Time" value={formatTime(timeLeft)} accent="#35e6ff" />
              <StatBox label="Mercy" value="Low" accent="#c8ff3d" />
            </>
          )}
          onReplay={start}
          onClose={onClose}
        />
      )}
    </GameShell>
  )
}

export function ReactionGame({ onClose, play, onResult }) {
  const [phase, setPhase] = useState('idle')
  const [round, setRound] = useState(1)
  const [times, setTimes] = useState([])
  const [lastTime, setLastTime] = useState(null)
  const [startedAt, setStartedAt] = useState(null)
  const timeoutRef = useRef(null)
  const reported = useRef(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const arm = () => {
    setPhase('waiting')
    setLastTime(null)
    play('click')
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      setStartedAt(performance.now())
      setPhase('go')
      play('ding')
    }, randomInt(1500, 4000))
  }

  const start = () => {
    reported.current = false
    setRound(1)
    setTimes([])
    setLastTime(null)
    arm()
  }

  const handleClick = () => {
    if (phase === 'early') {
      arm()
      return
    }
    if (phase === 'waiting') {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      setPhase('early')
      play('fail')
      return
    }
    if (phase !== 'go') return
    const reaction = Math.max(1, Math.round(performance.now() - startedAt))
    const nextTimes = [...times, reaction]
    setTimes(nextTimes)
    setLastTime(reaction)
    play(reaction < 350 ? 'success' : 'pop')
    if (nextTimes.length >= 3) {
      setPhase('done')
      const average = Math.round(nextTimes.reduce((sum, value) => sum + value, 0) / nextTimes.length)
      onResult('reaction', average)
      reported.current = true
    } else {
      setPhase('roundDone')
    }
  }

  const nextRound = () => {
    setRound((current) => current + 1)
    arm()
  }

  const average = times.length ? Math.round(times.reduce((sum, value) => sum + value, 0) / times.length) : 0
  const verdict = average < 250 ? 'Frighteningly Awake' : average < 380 ? 'Respectably Human' : average < 550 ? 'Running on Biscuits' : 'Legally Asleep'

  return (
    <GameShell accent="#35e6ff" kicker="Chaos arcade · reflex lab" title={<>ARE YOU<br /><span className="text-electric">AWAKE?</span></>} subtitle="Wait for green. Click. Repeat three times. The green is not personal. The red is.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
          <span className="flex items-center gap-1.5"><Timer size={12} /> Round {Math.min(round, 3)} / 3</span>
          <span className="flex items-center gap-1.5"><Zap size={12} /> {times.length} recorded</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-electric">Best: {times.length ? Math.min(...times) : '—'} ms</span>
      </div>

      {phase === 'idle' && (
        <div className="flex min-h-[25rem] flex-col items-center justify-center rounded-[28px] border border-electric/20 bg-[#061318] p-8 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-electric/30 bg-electric/10 text-4xl">⚡</div>
          <h2 className="mt-5 font-display text-4xl">THREE ROUNDS OF TRUTH</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">When the screen turns green, click. Not before. Your browser will know. The tiny cow will know. Everyone will know.</p>
          <button type="button" onClick={start} className="mt-6 flex items-center gap-2 rounded-full bg-electric px-7 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:scale-105">
            <Play size={14} fill="currentColor" /> Test my reflexes
          </button>
        </div>
      )}

      {(phase === 'waiting' || phase === 'go' || phase === 'early') && (
        <button
          type="button"
          onClick={handleClick}
          className={`flex min-h-[27rem] w-full flex-col items-center justify-center rounded-[28px] border p-8 text-center transition-colors duration-100 ${
            phase === 'go'
              ? 'border-acid bg-acid text-ink'
              : phase === 'early'
                ? 'border-hotpink/30 bg-hotpink/10'
                : 'border-electric/20 bg-[#100a1a]'
          }`}
        >
          {phase === 'waiting' && (
            <>
              <motion.span animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="text-6xl">🔴</motion.span>
              <h2 className="mt-5 font-display text-5xl">WAIT FOR GREEN.</h2>
              <p className="mt-3 text-sm text-white/40">Do not click. We know you want to. Do not.</p>
            </>
          )}
          {phase === 'go' && (
            <>
              <motion.span animate={{ scale: [1, 1.14, 1] }} transition={{ duration: 0.35, repeat: Infinity }} className="text-7xl">⚡</motion.span>
              <h2 className="mt-4 font-display text-[clamp(4rem,12vw,8rem)] leading-none">CLICK NOW!</h2>
            </>
          )}
          {phase === 'early' && (
            <>
              <span className="text-6xl">🦆</span>
              <h2 className="mt-4 font-display text-4xl text-hotpink">TOO SOON.</h2>
              <p className="mt-3 max-w-sm text-sm text-white/45">You clicked before green. The duck is disappointed. It had faith in you.</p>
              <span className="mt-5 rounded-full bg-hotpink px-5 py-3 text-xs font-bold text-ink">Try this round again</span>
            </>
          )}
        </button>
      )}

      {phase === 'roundDone' && (
        <div className="flex min-h-[27rem] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#0b0715] p-8 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-electric">Round {round} complete</p>
          <p className="mt-4 font-display text-7xl text-acid">{lastTime}<span className="text-3xl text-white/40"> ms</span></p>
          <p className="mt-2 text-sm text-white/45">{lastTime < 250 ? 'Suspiciously fast. Are you a robot? Blink twice.' : lastTime < 450 ? 'Solid human behavior. We are impressed.' : 'Your reflexes are currently buffering.'}</p>
          <button type="button" onClick={nextRound} className="mt-6 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-ink transition hover:scale-105">
            Next round <ArrowRight size={14} />
          </button>
        </div>
      )}

      {phase === 'early' && null}

      {phase === 'done' && (
        <ResultCard
          emoji={average < 300 ? '⚡' : average < 500 ? '🙂' : '🐢'}
          title={verdict}
          subtitle={`Average reaction: ${average} ms`}
          accent="#35e6ff"
          stats={times.map((time, index) => <StatBox key={`${time}-${index}`} label={`Round ${index + 1}`} value={`${time}ms`} accent="#35e6ff" />)}
          onReplay={start}
          onClose={onClose}
        />
      )}
    </GameShell>
  )
}

export function QuizGame({ onClose, play, onResult }) {
  const [questions] = useState(() => shuffle(quizQuestions).slice(0, 5))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState('playing')
  const reported = useRef(false)
  const question = questions[index]

  useEffect(() => {
    if (phase === 'done' && !reported.current) {
      reported.current = true
      onResult('quiz', score)
    }
  }, [phase, score, onResult])

  const choose = (optionIndex) => {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === question.answer) {
      setScore((current) => current + 1)
      play('success')
    } else {
      play('fail')
    }
  }

  const next = () => {
    if (index >= questions.length - 1) {
      setPhase('done')
      return
    }
    setIndex((current) => current + 1)
    setSelected(null)
    play('click')
  }

  const restart = () => {
    reported.current = false
    setIndex(0)
    setSelected(null)
    setScore(0)
    setPhase('playing')
  }

  return (
    <GameShell accent="#8b5cf6" kicker="Chaos arcade · questionable academics" title={<>RIDICULOUS<br /><span className="text-grape">IQ.</span></>} subtitle="Five questions. No correct answers were harmed in the making of this quiz. One of them might be true.">
      {phase === 'playing' ? (
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {questions.map((_, dotIndex) => (
                <span key={dotIndex} className={`h-1.5 rounded-full transition-all ${dotIndex === index ? 'w-8 bg-grape' : dotIndex < index ? 'w-4 bg-grape/40' : 'w-4 bg-white/10'}`} />
              ))}
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">Question {index + 1} / {questions.length} · Score {score}</span>
          </div>
          <motion.div key={question.q} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-grape/20 bg-[#0e091a] p-6 md:p-8">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-grape">The Department of Made-Up Knowledge</p>
            <h2 className="mt-3 text-xl font-semibold leading-snug text-white/85 md:text-2xl">{question.q}</h2>
            <div className="mt-6 grid gap-2.5">
              {question.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === question.answer
                const isSelected = selected === optionIndex
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(optionIndex)}
                    disabled={selected !== null}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                      selected === null
                        ? 'border-white/10 bg-white/[0.03] text-white/60 hover:border-grape/40 hover:bg-grape/[0.06] hover:text-white'
                        : isCorrect
                          ? 'border-acid/40 bg-acid/10 text-acid'
                          : isSelected
                            ? 'border-hotpink/40 bg-hotpink/10 text-hotpink'
                            : 'border-white/[0.05] bg-white/[0.015] text-white/25'
                    }`}
                  >
                    <span>{option}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/20 font-mono text-[9px]">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                  </button>
                )
              })}
            </div>
            <AnimatePresence>
              {selected !== null && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className={`text-xs font-bold ${selected === question.answer ? 'text-acid' : 'text-hotpink'}`}>
                    {selected === question.answer ? 'Correct-ish! The universe is surprised.' : 'Incorrect. Beautifully incorrect.'}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/45">{question.joke}</p>
                  <button type="button" onClick={next} className="mt-4 flex items-center gap-1.5 rounded-full bg-grape px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition hover:scale-105">
                    {index >= questions.length - 1 ? 'See my fate' : 'Next question'} <ChevronRight size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : (
        <ResultCard
          emoji={score >= 4 ? '🧠' : score >= 2 ? '🤔' : '🥔'}
          title={score >= 4 ? 'Certified Nonsense Scholar' : score >= 2 ? 'Adequately Confused' : 'Potato With Potential'}
          subtitle={`${score} out of ${questions.length} ridiculous questions`}
          accent="#8b5cf6"
          stats={(
            <>
              <StatBox label="Score" value={`${score}/${questions.length}`} accent="#8b5cf6" />
              <StatBox label="Facts" value="Optional" accent="#c8ff3d" />
              <StatBox label="Vibes" value="Immaculate" accent="#35e6ff" />
            </>
          )}
          onReplay={restart}
          onClose={onClose}
        />
      )}
    </GameShell>
  )
}

export function DecisionMaker({ onClose, play, onResult }) {
  const [optionA, setOptionA] = useState('Order pizza')
  const [optionB, setOptionB] = useState('Cook something')
  const [spinning, setSpinning] = useState(false)
  const [display, setDisplay] = useState('???')
  const [result, setResult] = useState(null)
  const [spins, setSpins] = useState(0)
  const spinRef = useRef(null)
  const reported = useRef(false)

  useEffect(() => {
    return () => {
      if (spinRef.current) window.clearTimeout(spinRef.current)
    }
  }, [])

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    play('drumroll')
    let ticks = 0
    const interval = window.setInterval(() => {
      setDisplay(Math.random() > 0.5 ? optionA || 'Option A' : optionB || 'Option B')
      ticks += 1
      if (ticks > 12) window.clearInterval(interval)
    }, 110)
    spinRef.current = window.setTimeout(() => {
      window.clearInterval(interval)
      const nap = Math.random() < 0.14
      const winner = nap ? 'Take a nap instead' : Math.random() > 0.5 ? optionA || 'Option A' : optionB || 'Option B'
      setDisplay(winner)
      setResult({ winner, reason: pick(decisionExtras), nap })
      setSpinning(false)
      setSpins((count) => count + 1)
      play(nap ? 'moo' : 'fanfare')
      if (!reported.current) {
        reported.current = true
        onResult('decision', 1)
      }
    }, 1500)
  }

  return (
    <GameShell accent="#ff7a18" kicker="Chaos arcade · life admin" title={<>THE DECISION<br /><span className="text-tangerine">DESTROYER.</span></>} subtitle="Two options. One machine with no credentials. It will choose, you will blame it, balance is restored.">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#120c06] p-6">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-tangerine">Step 1 · provide the dilemma</p>
          <label className="mt-5 block">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">Option A</span>
            <input value={optionA} onChange={(e) => setOptionA(e.target.value)} maxLength={48} className="input-chaos mt-2" placeholder="Order pizza" />
          </label>
          <label className="mt-4 block">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">Option B</span>
            <input value={optionB} onChange={(e) => setOptionB(e.target.value)} maxLength={48} className="input-chaos mt-2" placeholder="Cook something" />
          </label>
          <p className="mt-4 text-[10px] leading-relaxed text-white/25">There is a small chance the machine invents a third option. It is not sorry. It is never sorry.</p>
          <button type="button" onClick={spin} disabled={spinning} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-tangerine px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:scale-[1.02] disabled:opacity-60">
            <Sparkles size={14} /> {spinning ? 'Consulting the void...' : 'Destroy my decision'}
          </button>
          <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">{spins} decisions ruined</p>
        </div>

        <div className="relative flex min-h-[24rem] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-tangerine/20 bg-[#170d05] p-6 text-center">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="absolute h-72 w-72 rounded-full border border-dashed border-tangerine/15 orbit" />
          <div className="relative z-10">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-tangerine">The wheel of questionable outcomes</p>
            <motion.p
              key={display + spins}
              initial={{ opacity: 0.4, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-7 max-w-md font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9]"
            >
              {display}
            </motion.p>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-tangerine/20 bg-tangerine/[0.06] p-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-tangerine">The machine has spoken</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{result.reason}</p>
                {result.nap && <p className="mt-2 text-xs text-acid">Third option unlocked: the nap. It was always the nap.</p>}
              </motion.div>
            )}
            {!result && <p className="mt-6 max-w-xs text-xs leading-relaxed text-white/30">{spinning ? 'The machine is making a big show of it. That is half the service.' : 'Enter your options and surrender control. It is freeing. Probably.'}</p>}
          </div>
          {result && (
            <button type="button" onClick={spin} className="relative z-10 mt-5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white">
              <RotateCcw size={12} /> Regret immediately
            </button>
          )}
        </div>
      </div>
      <div className="mt-5 text-center">
        <button type="button" onClick={onClose} className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25 underline decoration-white/10 underline-offset-4 hover:text-white/60">Escape the consequences</button>
      </div>
    </GameShell>
  )
}

export function DodgeGame({ onClose, play, onResult }) {
  const [phase, setPhase] = useState('idle')
  const [objects, setObjects] = useState([])
  const [player, setPlayer] = useState({ x: 50, y: 68 })
  const [lives, setLives] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const [hitFlash, setHitFlash] = useState(false)
  const [best, setBest] = useState(0)
  const arenaRef = useRef(null)
  const playerRef = useRef(player)
  const objectsRef = useRef([])
  const livesRef = useRef(3)
  const elapsedRef = useRef(0)
  const reported = useRef(false)
  const hitTimeout = useRef(null)

  useEffect(() => {
    playerRef.current = player
  }, [player])

  useEffect(() => {
    if (phase !== 'playing') return undefined
    let frame
    let last = performance.now()
    let lastSpawn = 0
    let lastHud = 0
    const start = performance.now()
    const loop = (now) => {
      const dt = Math.min(now - last, 60)
      last = now
      const timeAlive = (now - start) / 1000
      elapsedRef.current = timeAlive
      if (now - lastHud > 100) {
        setElapsed(timeAlive)
        lastHud = now
      }
      if (now - lastSpawn > Math.max(280, 620 - timeAlive * 10)) {
        objectsRef.current = [
          ...objectsRef.current,
          { id: `${now}-${Math.random()}`, x: randomInt(8, 92), y: -6, speed: randomInt(22, 38), emoji: pick(dodgeEmojis), wobble: Math.random() * 6 },
        ].slice(-30)
        lastSpawn = now
      }
      const currentPlayer = playerRef.current
      let collided = false
      objectsRef.current = objectsRef.current
        .map((object) => ({ ...object, y: object.y + (object.speed * dt) / 1000 }))
        .filter((object) => {
          if (object.y > 108) return false
          const nearX = Math.abs(object.x - currentPlayer.x) < 8
          const nearY = Math.abs(object.y - currentPlayer.y) < 9
          if (nearX && nearY) {
            collided = true
            return false
          }
          return true
        })
      if (collided) {
        livesRef.current -= 1
        setLives(livesRef.current)
        setHitFlash(true)
        play('error')
        if (hitTimeout.current) window.clearTimeout(hitTimeout.current)
        hitTimeout.current = window.setTimeout(() => setHitFlash(false), 240)
        if (livesRef.current <= 0) {
          setPhase('over')
          return
        }
      }
      if (timeAlive >= 20) {
        setPhase('won')
        return
      }
      setObjects([...objectsRef.current])
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)
    return () => {
      window.cancelAnimationFrame(frame)
      if (hitTimeout.current) window.clearTimeout(hitTimeout.current)
    }
  }, [phase, play])

  useEffect(() => {
    if ((phase === 'won' || phase === 'over') && !reported.current) {
      reported.current = true
      const score = Math.floor(elapsedRef.current)
      setBest((current) => Math.max(current, score))
      onResult('dodge', score)
    }
  }, [phase, onResult])

  const move = (event) => {
    if (phase !== 'playing' || !arenaRef.current) return
    const rect = arenaRef.current.getBoundingClientRect()
    const x = Math.min(96, Math.max(4, ((event.clientX - rect.left) / rect.width) * 100))
    const y = Math.min(92, Math.max(8, ((event.clientY - rect.top) / rect.height) * 100))
    playerRef.current = { x, y }
    setPlayer({ x, y })
  }

  const start = () => {
    reported.current = false
    objectsRef.current = []
    livesRef.current = 3
    elapsedRef.current = 0
    setObjects([])
    setLives(3)
    setElapsed(0)
    setPlayer({ x: 50, y: 68 })
    playerRef.current = { x: 50, y: 68 }
    setPhase('playing')
    play('whoosh')
  }

  const hearts = Array.from({ length: 3 }, (_, index) => index < lives)

  return (
    <GameShell accent="#ff2e97" kicker="Chaos arcade · survival division" title={<>DODGE THE<br /><span className="text-hotpink">CONSEQUENCES.</span></>} subtitle="Move your cursor or finger. Avoid the falling problems. You only have three lives and all of them are your responsibility.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
          <span className="flex items-center gap-1.5"><Clock3 size={12} /> {formatTime(Math.max(0, 20 - elapsed))}</span>
          <span className="flex items-center gap-1.5"><Target size={12} /> {Math.floor(elapsed)}s survived</span>
          <span className="flex items-center gap-1.5"><Trophy size={12} /> best {best}s</span>
        </div>
        <div className="flex items-center gap-1 text-hotpink">
          {hearts.map((alive, index) => <Heart key={index} size={14} fill={alive ? 'currentColor' : 'none'} className={alive ? '' : 'opacity-25'} />)}
        </div>
      </div>

      {phase === 'idle' && (
        <div className="flex min-h-[25rem] flex-col items-center justify-center rounded-[28px] border border-hotpink/20 bg-[#150812] p-8 text-center">
          <motion.span animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 2.8, repeat: Infinity }} className="text-7xl">💣</motion.span>
          <h2 className="mt-5 font-display text-4xl">HERE COMES EVERYTHING</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">Bombs, bills, ducks, socks. They are all falling. Move the little you around and try to last twenty seconds. Your cursor is the protagonist.</p>
          <button type="button" onClick={start} className="mt-6 flex items-center gap-2 rounded-full bg-hotpink px-7 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:scale-105">
            <Play size={14} fill="currentColor" /> Face the consequences
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div
          ref={arenaRef}
          onPointerMove={move}
          onPointerDown={move}
          className={`relative min-h-[28rem] touch-none overflow-hidden rounded-[28px] border bg-[#0d0612] ${hitFlash ? 'border-hotpink' : 'border-white/10'}`}
        >
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className={`absolute inset-0 transition-colors duration-200 ${hitFlash ? 'bg-hotpink/20' : 'bg-transparent'}`} />
          <div className="absolute left-4 top-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">Move to dodge · avoid everything</div>
          {objects.map((object) => (
            <span
              key={object.id}
              className="absolute select-none text-3xl drop-shadow-lg"
              style={{ left: `${object.x}%`, top: `${object.y}%`, transform: `translate(-50%,-50%) rotate(${object.wobble}deg)` }}
            >
              {object.emoji}
            </span>
          ))}
          <motion.div
            className="absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-acid bg-acid/15 text-2xl shadow-[0_0_30px_rgba(200,255,61,.3)]"
            animate={{ left: `${player.x}%`, top: `${player.y}%` }}
            transition={{ type: 'spring', stiffness: 900, damping: 55 }}
          >
            🐄
            <span className="absolute inset-0 rounded-full border border-acid/30 ring-pulse" />
          </motion.div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">The cow is you. The cow believes in you.</div>
        </div>
      )}

      {(phase === 'won' || phase === 'over') && (
        <ResultCard
          emoji={phase === 'won' ? '🛡️' : '💥'}
          title={phase === 'won' ? 'You Survived the Consequences' : 'The Consequences Got You'}
          subtitle={phase === 'won' ? 'Twenty seconds of pure avoidance. Impressive.' : `You lasted ${Math.floor(elapsedRef.current)} seconds. The consequences have won.`}
          accent="#ff2e97"
          stats={(
            <>
              <StatBox label="Survived" value={`${Math.floor(elapsedRef.current)}s`} accent="#ff2e97" />
              <StatBox label="Best" value={`${best}s`} accent="#35e6ff" />
              <StatBox label="Lives" value={lives} accent="#c8ff3d" />
            </>
          )}
          onReplay={start}
          onClose={onClose}
        />
      )}
    </GameShell>
  )
}

const hiddenEmojis = ['🥔', '🦆', '🧦', '🍕', '🐸', '👽', '🪐', '🥕', '🎩', '🐛', '🍞', '🫠']
const findMessages = ['Not it. But a lovely potato.', 'A duck. Close, in spirit.', 'The sock has been found. It is not the weirdo.', 'Pizza is not a personality, but it is close.', 'A frog. It knows things.', 'Wrong. But the alien appreciates the visit.', 'The planet is not the weirdo. It is just big-boned.', 'Just a carrot. Living its best life.', 'A hat. The weirdo is not under it.', 'A worm. It says hello.', 'Bread. Not the weirdo. Still valid.', 'A puddle of motivation. Not our guy.']

export function HiddenGame({ onClose, play, onResult }) {
  const [hidden, setHidden] = useState(() => randomInt(0, 35))
  const [revealed, setRevealed] = useState({})
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState('One of these tiles contains The Weirdo. The others contain mild disappointment.')
  const [found, setFound] = useState(false)
  const [hint, setHint] = useState(null)
  const reported = useRef(false)

  useEffect(() => {
    if (found && !reported.current) {
      reported.current = true
      onResult('hidden', 1)
    }
  }, [found, onResult])

  const clickTile = (index) => {
    if (found || revealed[index]) return
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    if (index === hidden) {
      setFound(true)
      setRevealed((current) => ({ ...current, [index]: '👁️' }))
      setMessage('FOUND IT. It was wearing tiny sunglasses the whole time.')
      play('win')
      return
    }
    setRevealed((current) => ({ ...current, [index]: hiddenEmojis[index % hiddenEmojis.length] }))
    setMessage(findMessages[index % findMessages.length])
    play('pop')
    if (nextAttempts >= 8 && !hint) {
      setHint(`The weirdo is hiding in row ${Math.floor(hidden / 6) + 1}. Do with that what you will.`)
    }
  }

  const restart = () => {
    reported.current = false
    setHidden(randomInt(0, 35))
    setRevealed({})
    setAttempts(0)
    setFound(false)
    setHint(null)
    setMessage('New weirdo, new hiding spot. Same deeply questionable tiles.')
  }

  return (
    <GameShell accent="#35e6ff" kicker="Chaos arcade · observation division" title={<>FIND THE<br /><span className="text-electric">WEIRDO.</span></>} subtitle="Thirty-six tiles. One weirdo. It is wearing sunglasses. That is the only clue. The cow refuses to elaborate.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
          <span className="flex items-center gap-1.5"><Search size={12} /> {attempts} guesses</span>
          <span className="flex items-center gap-1.5"><Sparkles size={12} /> {36 - Object.keys(revealed).length} tiles remain</span>
        </div>
        <button type="button" onClick={restart} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-electric transition hover:text-white">
          <RefreshCw size={11} /> Reset hunt
        </button>
      </div>

      <div className="mx-auto max-w-3xl">
        <p className="mb-4 min-h-[2.5rem] rounded-xl border border-electric/15 bg-electric/[0.04] px-4 py-3 text-center text-xs leading-relaxed text-white/55">{message}</p>
        {hint && !found && (
          <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center justify-center gap-2 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-acid">
            <Lightbulb size={12} /> {hint}
          </motion.p>
        )}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {Array.from({ length: 36 }, (_, index) => {
            const isRevealed = revealed[index]
            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => clickTile(index)}
                whileHover={!isRevealed && !found ? { scale: 1.06, rotate: randomInt(-2, 2) } : undefined}
                whileTap={{ scale: 0.92 }}
                className={`flex aspect-square items-center justify-center rounded-xl border text-2xl transition-colors sm:text-3xl ${
                  isRevealed
                    ? index === hidden && found
                      ? 'border-acid bg-acid/20 text-4xl'
                      : 'border-white/[0.05] bg-white/[0.015] opacity-60'
                    : 'border-white/10 bg-white/[0.04] hover:border-electric/40 hover:bg-electric/[0.06]'
                }`}
                aria-label={isRevealed ? 'Revealed tile' : `Tile ${index + 1}`}
              >
                {isRevealed || '?'}
              </motion.button>
            )
          })}
        </div>
        {found && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[24px] border border-acid/25 bg-acid/[0.06] p-6 text-center">
            <p className="text-5xl">👁️</p>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-acid">The Weirdo has been located</p>
            <h2 className="mt-2 font-display text-4xl">IT WAS RIGHT THERE.</h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/45">It has no further comment. It would like to return to its sunglasses and its mysterious little life.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={restart} className="rounded-full bg-acid px-5 py-3 text-xs font-bold text-ink transition hover:scale-105">Find another weirdo</button>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white/55 transition hover:bg-white/[0.08]">Back to arcade</button>
            </div>
          </motion.div>
        )}
      </div>
    </GameShell>
  )
}
