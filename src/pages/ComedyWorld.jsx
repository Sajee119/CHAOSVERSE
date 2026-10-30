import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Dices,
  Laugh,
  Mic2,
  Quote,
  RefreshCw,
  Shuffle,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { jokes, oneLiners, scenarioParts } from '../data/content'
import { pick, shuffle } from '../lib/utils'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'
import PageHeader from '../components/PageHeader'
import ComedyCard from '../components/ComedyCard'
import { Link } from 'react-router-dom'

const laughReactions = [
  'A single polite chuckle. Progress.',
  'The tiny cow giggled. This is a big deal.',
  'That was objectively terrible. You laughed anyway.',
  'Somewhere, a comedian felt a disturbance.',
  'The audience is confused but entertained.',
  'Your laugh has been recorded for quality purposes.',
  'This is now a core memory. Unfortunately.',
  'The laugh meter is blushing.',
  'Comedy police have been notified. They are laughing too.',
  'You have achieved: Mild Amusement (Gold Tier).',
]

const stageLines = [
  'Is this thing on?',
  'I flew here on a budget airline. My soul arrived three days later.',
  'My therapist says I use humor as a defense mechanism. Anyway, she is a pigeon.',
  'You have been a great audience. I have been a confusing comedian.',
]

export default function ComedyWorld() {
  const { play } = useSound()
  const { addToast, unlock, triggerChaos } = useChaos()
  const reducedMotion = useReducedMotion()
  const [joke, setJoke] = useState(() => pick(jokes))
  const [revealed, setRevealed] = useState(false)
  const [jokesSeen, setJokesSeen] = useState(1)
  const [laughs, setLaughs] = useState(0)
  const [laughReaction, setLaughReaction] = useState('The meter is waiting. No pressure.')
  const [scenario, setScenario] = useState(() => ({
    who: pick(scenarioParts.who),
    where: pick(scenarioParts.where),
    problem: pick(scenarioParts.problem),
  }))
  const [scenarioRolling, setScenarioRolling] = useState(false)
  const [linerSet, setLinerSet] = useState(() => shuffle(oneLiners).slice(0, 6))
  const [stageLine, setStageLine] = useState(stageLines[0])
  const [boos, setBoos] = useState(0)
  const laughMilestone = useRef(false)

  const nextJoke = () => {
    const options = jokes.filter((candidate) => candidate.setup !== joke.setup)
    setJoke(pick(options))
    setRevealed(false)
    setJokesSeen((count) => {
      const next = count + 1
      if (next >= 10 && !laughMilestone.current) {
        laughMilestone.current = true
        unlock('comedy_10')
        addToast('Achievement unlocked: Certified Giggle Goblin. Ten jokes survived.', 'secret')
      }
      return next
    })
    play('whoosh')
  }

  const reveal = () => {
    if (revealed) {
      nextJoke()
      return
    }
    setRevealed(true)
    play('success')
  }

  const laugh = () => {
    const next = laughs + 1
    setLaughs(next)
    setLaughReaction(pick(laughReactions))
    play(next >= 10 ? 'fanfare' : 'pop')
    if (next === 10) {
      triggerChaos('confetti')
      addToast('Laugh meter maxed. You are now legally funny. This will not hold up in court.', 'secret', 5500)
    }
  }

  const boo = () => {
    setBoos((count) => count + 1)
    play('fail')
    addToast(pick([
      'Boo received. The comedian has left the stage to reconsider everything.',
      'Your boo has been added to the official complaint pile. It is a large pile.',
      'The pigeon in the front row agrees with you. That hurts more.',
    ]), 'default')
  }

  const rollScenario = () => {
    if (scenarioRolling) return
    setScenarioRolling(true)
    play('drumroll')
    window.setTimeout(() => {
      setScenario({
        who: pick(scenarioParts.who),
        where: pick(scenarioParts.where),
        problem: pick(scenarioParts.problem),
      })
      setScenarioRolling(false)
      play('sparkle')
    }, 520)
  }

  const rerollLiners = () => {
    setLinerSet(shuffle(oneLiners).slice(0, 6))
    play('whoosh')
  }

  const copyScenario = async () => {
    try {
      await navigator.clipboard.writeText(`A ${scenario.who} ${scenario.where} ${scenario.problem}.`)
      play('success')
      addToast('Absurd scenario copied. Please use it for good, or at least for a group chat.', 'default')
    } catch {
      play('fail')
      addToast('Clipboard refused. The scenario is too powerful.', 'default')
    }
  }

  const nextStageLine = () => {
    const options = stageLines.filter((line) => line !== stageLine)
    setStageLine(pick(options))
    play('pop')
  }

  const laughPercent = Math.min((laughs / 10) * 100, 100)

  return (
    <div className="relative">
      <PageHeader
        number="02"
        kicker="The comedy district · laughs not guaranteed"
        title={'COMEDY\nWORLD.'}
        accent="#c8ff3d"
        emoji="🤡"
        description="A fully operational joke laboratory staffed by one suspicious pigeon and a tiny cow with a microphone. Every refresh is a new set. The laugh track is real. The comedian is not."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="chip border-acid/25 text-acid"><Mic2 size={11} /> Live-ish from the void</span>
          <span className="chip"><Laugh size={11} /> {laughs} laughs recorded</span>
          <span className="chip"><Sparkles size={11} /> Jokes seen: {jokesSeen}</span>
        </div>
      </PageHeader>

      <div className="relative z-10 border-y border-white/10 bg-acid py-3 text-ink">
        <div className="marquee-track-reverse gap-8">
          {[...Array(3)].flatMap(() => [
            'LAUGH TRACK INCLUDED',
            'NO REFUNDS FOR BAD JOKES',
            'THE PIGEON IS WATCHING',
            'PUNS DEPLOYED ON SIGHT',
            'CRINGE LEVELS: ARTISANAL',
          ]).map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
              {item} <span className="text-white/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="section-shell relative z-10 py-20 md:py-28">
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[32px] border border-acid/20 bg-[#0d1206] p-6 sm:p-9 md:p-12"
          >
            <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at 50% 0%,rgba(200,255,61,.14),transparent 50%)' }} />
            <div className="absolute inset-0 grid-lines opacity-20" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-dashed border-acid/20" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-acid">The joke machine · model 404</p>
                  <h2 className="mt-2 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.85]">ONE JOKE,<br /><span className="text-acid">FRESHLY MADE.</span></h2>
                </div>
                <motion.div
                  animate={reducedMotion ? undefined : { rotate: [-6, 6, -6], y: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-acid/25 bg-acid/10 text-3xl"
                >
                  🎤
                </motion.div>
              </div>

              <div className="mt-10 min-h-[11rem] rounded-2xl border border-white/10 bg-black/20 p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div key={joke.setup} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <p className="text-xl font-medium leading-relaxed text-white/85 sm:text-2xl">{joke.setup}</p>
                    {revealed ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 border-t border-acid/20 pt-5">
                        <p className="text-sm leading-relaxed text-acid sm:text-base">{joke.punchline}</p>
                      </motion.div>
                    ) : (
                      <button
                        type="button"
                        onClick={reveal}
                        className="mt-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white/60 transition hover:border-acid/40 hover:text-acid"
                      >
                        <Volume2 size={13} /> Deliver the punchline
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={reveal} className="rounded-full bg-acid px-5 py-3 text-xs font-bold text-ink transition hover:scale-105">
                    {revealed ? 'Another joke' : 'Reveal punchline'}
                  </button>
                  {revealed && (
                    <>
                      <button type="button" onClick={laugh} className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-3 text-xs font-semibold text-white/60 transition hover:bg-white/10">
                        😂 That was good
                      </button>
                      <button type="button" onClick={boo} className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-3 text-xs font-semibold text-white/60 transition hover:bg-white/10">
                        🍅 That was bad
                      </button>
                    </>
                  )}
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/25">{boos} tomatoes thrown</span>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass relative overflow-hidden rounded-[28px] p-6"
            >
              <p className="eyebrow">Audience participation</p>
              <h3 className="mt-2 font-display text-4xl">THE LAUGH<br /><span className="text-hotpink">METER.</span></h3>
              <p className="mt-3 text-xs leading-relaxed text-white/40">Laugh at things. The meter cannot tell if it is real. It is just happy to be included.</p>
              <div className="mt-6">
                <div className="flex justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">
                  <span>Amusement</span>
                  <span className="text-hotpink">{laughs} / 10</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-hotpink to-acid" animate={{ width: `${laughPercent}%` }} />
                </div>
              </div>
              <p className="mt-4 min-h-[2.5rem] text-xs italic leading-relaxed text-white/40">{laughReaction}</p>
              <button type="button" onClick={laugh} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-hotpink px-5 py-3 text-xs font-bold text-ink transition hover:scale-[1.02]">
                <Laugh size={14} /> Laugh on command
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#100a1c] p-6"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-electric/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-electric">Open mic night</p>
                  <span className="flex h-2 w-2 rounded-full bg-hotpink ring-pulse" />
                </div>
                <p className="mt-5 min-h-[4rem] text-sm leading-relaxed text-white/65">“{stageLine}”</p>
                <button type="button" onClick={nextStageLine} className="mt-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-electric transition hover:gap-3">
                  Next heckle <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-white/[0.025] py-20 md:py-28">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:items-start">
            <div>
              <p className="eyebrow mb-4">The absurdity generator</p>
              <h2 className="section-title">MAKE IT<br /><span className="text-tangerine">WEIRDER.</span></h2>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/40">
                Three random ingredients. One deeply unnecessary situation. Copy it, read it aloud, watch the room change.
              </p>
              <button type="button" onClick={rollScenario} className="btn-primary mt-6 text-xs uppercase tracking-[0.1em]">
                <Dices size={15} /> {scenarioRolling ? 'Mixing nonsense...' : 'Roll a situation'}
              </button>
            </div>

            <motion.div
              animate={scenarioRolling ? { opacity: [1, 0.3, 1], filter: ['blur(0px)', 'blur(8px)', 'blur(0px)'] } : {}}
              className="relative overflow-hidden rounded-[30px] border border-tangerine/20 bg-[#160c06] p-7 md:p-10"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-tangerine/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-tangerine">Situation #{Math.floor(Math.random() * 900 + 100)}</span>
                  <button type="button" onClick={copyScenario} className="flex items-center gap-1.5 text-[10px] text-white/35 transition hover:text-tangerine"><Copy size={12} /> Copy</button>
                </div>
                <p className="mt-8 font-display text-[clamp(2.1rem,4.5vw,4.2rem)] leading-[0.94]">
                  A <span className="text-tangerine">{scenario.who}</span><br />
                  {scenario.where}<br />
                  <span className="text-acid">{scenario.problem}.</span>
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
                  <span>★ 100% original</span>
                  <span>★ 0% fact-checked</span>
                  <span>★ 1 tiny cow cameo</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 py-20 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-4">The one-liner vending machine</p>
            <h2 className="section-title">SMALL JOKES.<br /><span className="text-stroke">BIG EYEROLLS.</span></h2>
          </div>
          <button type="button" onClick={rerollLiners} className="btn-ghost text-xs">
            <RefreshCw size={14} /> Reroll six
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {linerSet.map((liner, index) => (
            <ComedyCard key={liner} joke={liner} index={index} label="ONE-LINER" onNext={() => setLinerSet(shuffle(oneLiners).slice(0, 6))} />
          ))}
        </div>
      </section>

      <section className="section-shell relative z-10 pb-24">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0c0816] p-7 md:p-10">
          <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 80% 20%,rgba(139,92,246,.16),transparent 45%)' }} />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow">The comedy department recommends</p>
              <h2 className="mt-3 font-display text-[clamp(2.8rem,6vw,5.3rem)] leading-[0.88]">TAKE THE JOKE<br /><span className="text-grape">TO THE MEME FACTORY.</span></h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/45">Why let a joke end when you can give it a poorly designed visual identity? The factory never sleeps. Mostly because we forgot to install beds.</p>
            </div>
            <Link to="/meme-factory" className="btn-primary shrink-0 text-xs uppercase tracking-[0.1em]">
              Manufacture a meme <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
