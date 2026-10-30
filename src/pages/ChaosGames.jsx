import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Coins, Gamepad2, Sparkles, Trophy, Zap } from 'lucide-react'
import { games } from '../data/content'
import GameCard from '../components/GameCard'
import PageHeader from '../components/PageHeader'
import Overlay from '../components/Overlay'
import { useSound } from '../context/SoundContext'
import { useChaos } from '../context/ChaosContext'
import {
  CatchGame,
  DecisionMaker,
  DodgeGame,
  HiddenGame,
  ImpossibleClick,
  QuizGame,
  ReactionGame,
} from '../components/games/GameExperiences'

const gameComponents = {
  catch: CatchGame,
  impossible: ImpossibleClick,
  reaction: ReactionGame,
  quiz: QuizGame,
  decision: DecisionMaker,
  dodge: DodgeGame,
  hidden: HiddenGame,
}

const recordLabels = {
  catch: 'cows caught',
  impossible: 'clicks landed',
  reaction: 'ms average',
  quiz: 'correct answers',
  decision: 'decisions ruined',
  dodge: 'seconds survived',
  hidden: 'weirdos found',
}

function ScoreValue({ id, value }) {
  if (value === undefined || value === null) return <span className="text-white/20">Not played</span>
  if (id === 'reaction') return <span className="text-electric">{value} ms</span>
  if (id === 'quiz') return <span className="text-grape">{value} / 5</span>
  if (id === 'dodge') return <span className="text-hotpink">{value}s</span>
  return <span className="text-acid">{value}</span>
}

export default function ChaosGames() {
  const [activeGame, setActiveGame] = useState(null)
  const navigate = useNavigate()
  const { play } = useSound()
  const { addToast, unlock } = useChaos()
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('chaosverse-records') || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('chaosverse-records', JSON.stringify(records))
    } catch {
      // The leaderboard remains a mystery.
    }
  }, [records])

  const recordResult = useCallback(
    (id, value) => {
      const previous = records[id]
      const lowerIsBetter = id === 'reaction'
      const isBetter = previous === undefined || (lowerIsBetter ? value < previous : value > previous)
      if (isBetter) {
        setRecords((current) => ({ ...current, [id]: value }))
        addToast(`New personal best: ${recordLabels[id]}. The arcade is mildly impressed.`, 'secret', 4800)
        play('success')
      }
      unlock('game_win')
    },
    [addToast, play, records, unlock],
  )

  const playGame = (game) => {
    setActiveGame(game)
    play('coin')
  }

  const resetRecords = () => {
    setRecords({})
    play('fail')
    addToast('Your arcade legacy has been erased. The tiny cow has already forgotten.', 'default')
  }

  const ActiveGame = activeGame ? gameComponents[activeGame.id] : null
  const totalPlayed = useMemo(() => Object.keys(records).length, [records])

  return (
    <>
      <PageHeader
        number="03"
        kicker="The chaotic arcade · tokens not required"
        title={'CHAOS\nGAMES.'}
        accent="#35e6ff"
        emoji="🕹️"
        description="Seven small games with big personalities. Catch things, dodge things, decide things and discover that failure is also content. Your personal bests are stored locally, because we respect your privacy and your delusions of grandeur."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="chip border-electric/25 text-electric"><Gamepad2 size={11} /> Player 01</span>
          <span className="chip"><Coins size={11} /> Tokens: ∞</span>
          <span className="chip"><Trophy size={11} /> {totalPlayed} / 7 games attempted</span>
        </div>
      </PageHeader>

      <div className="relative z-10 border-y border-white/10 bg-[#0a0614] py-3">
        <div className="marquee-track gap-8">
          {[...Array(2)].flatMap((_, group) => [
            'INSERT ENTHUSIASM',
            'HIGH SCORES: YOURS, PROBABLY',
            'NO QUARTERS NEEDED',
            'THE COW IS PLAYER TWO',
            'FAILURE IS A FEATURE',
            'DO NOT LICK THE CARTRIDGE',
          ].map((item, index) => (
            <span key={`${group}-${item}-${index}`} className="flex shrink-0 items-center gap-8 font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
              {item} <span className="text-electric">▶</span>
            </span>
          )))}
        </div>
      </div>

      <section className="section-shell relative z-10 py-20 md:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Select your distraction</p>
            <h2 className="font-display text-4xl md:text-5xl">THE <span className="text-electric">ARCADE.</span></h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { play('coin'); addToast('A coin has been inserted. It was imaginary. The machine accepted it anyway.', 'default') }} className="btn-ghost text-xs">
              <Coins size={14} /> Insert imaginary coin
            </button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} onPlay={playGame} />
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex min-h-[18rem] flex-col items-center justify-center overflow-hidden rounded-[26px] border border-dashed border-white/10 bg-white/[0.015] p-6 text-center"
          >
            <div className="absolute inset-0 grid-lines opacity-20" />
            <span className="relative text-5xl">🚧</span>
            <h3 className="relative mt-4 font-display text-3xl">MORE GAMES<br />COMING NEVER.</h3>
            <p className="relative mt-2 max-w-[15rem] text-xs leading-relaxed text-white/30">The development team consists of one pigeon and it is currently on a bread break.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-shell relative z-10 pb-24">
        <div className="relative overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#0b0715] p-6 md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-electric/10 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="eyebrow flex items-center gap-2"><Trophy size={12} className="text-acid" /> Local leaderboard</p>
              <h2 className="mt-2 font-display text-4xl">YOUR QUESTIONABLE<br /><span className="text-electric">LEGACY.</span></h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">Stored on this device only</span>
              <button type="button" onClick={resetRecords} className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35 underline decoration-white/20 underline-offset-4 transition hover:text-hotpink">
                Erase legacy
              </button>
            </div>
          </div>
          <div className="mt-2">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-5 font-mono text-[9px] text-white/20">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-xl">{game.emoji}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white/75">{game.title}</p>
                    <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">{recordLabels[game.id]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px]"><ScoreValue id={game.id} value={records[game.id]} /></span>
                  <button type="button" onClick={() => playGame(game)} className="hidden rounded-full border border-white/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-white/40 transition hover:border-white/25 hover:text-white sm:block">
                    Play
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-[10px] text-white/20"><Zap size={11} /> Scores are local, meaningless and deeply personal.</p>
        </div>
      </section>

      <section className="section-shell relative z-10 pb-24">
        <div className="glass flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[30px] p-7 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow">Need a bigger challenge?</p>
            <h2 className="mt-2 font-display text-4xl leading-none">TRY NOT TO CLICK<br /><span className="text-hotpink">THE SURPRISE BUTTON.</span></h2>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/40">You will fail immediately. We both know it. That is the game.</p>
          </div>
          <button type="button" onClick={() => { play('whoosh'); navigate('/surprises') }} className="btn-primary shrink-0 text-xs uppercase tracking-[0.1em]">
            Press the forbidden button <ArrowRight size={14} />
          </button>
        </div>
      </section>

      <Overlay
        open={Boolean(activeGame)}
        onClose={() => setActiveGame(null)}
        label={activeGame ? `${activeGame.title} mini game` : 'Chaos mini game'}
        tone={activeGame?.accent}
        closeText="Quit game"
      >
        {ActiveGame && activeGame && (
          <ActiveGame
            onClose={() => setActiveGame(null)}
            play={play}
            onResult={recordResult}
          />
        )}
      </Overlay>
    </>
  )
}
