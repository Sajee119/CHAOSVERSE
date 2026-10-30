import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Eye,
  Ghost,
  KeyRound,
  LockKeyhole,
  Star,
  Trophy,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { achievements, secretRiddles, vaultRewards } from '../data/content'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'

const artifacts = [
  { emoji: '🐄', name: 'The Founder', line: 'The tiny cow started this website in a laundry basket. It has never attended a single meeting.' },
  { emoji: '🦆', name: 'The Moderator', line: 'The judging duck approves every comment before it is posted. It approves almost none of them.' },
  { emoji: '🧦', name: 'The First Sock', line: 'This sock has been missing since 2011. It says the dryer is a portal and it has no plans to return.' },
  { emoji: '🕯️', name: 'The Emergency Candle', line: 'For use only when the vibes are fully dark. It smells faintly of birthday cake and unresolved tension.' },
  { emoji: '🫖', name: 'The Kettle That Knows', line: 'It does not boil water. It boils secrets. Unfortunately, most of them are about you.' },
]

const constitution = [
  'Article 1: Every snack is communal until someone claims it with eye contact.',
  'Article 2: A button may run, but it may not hide under the sofa forever.',
  'Article 3: No cow shall be referred to as small without its written consent.',
  'Article 4: The void is allowed one dramatic entrance per calendar year.',
  'Article 5: Confetti is not a crime. Repeated confetti is a personality.',
  'Article 6: Anyone who says "quick question" must first surrender their slideshow.',
]

function LockedGate({ onUnlock }) {
  const { play } = useSound()
  const reducedMotion = useReducedMotion()
  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (value.trim().toLowerCase() === 'chaos') {
      play('fanfare')
      onUnlock()
      return
    }
    setAttempts((count) => count + 1)
    setError(value.trim() ? 'Incorrect frequency. The door is pretending it did not hear you.' : 'The door requires a passphrase. It is not a mind reader.')
    setValue('')
    play('fail')
  }

  const hint = attempts >= 5
    ? 'Fine. The passphrase is "chaos". Type it. We are not good at secrets.'
    : attempts >= 3
      ? 'It is five letters. It is the first word of the website, minus the verse.'
      : attempts >= 1
        ? 'The passphrase is hiding in plain sight. It is not "password".'
        : 'The logo remembers three clicks. The footer notices everything. The keyboard listens.'

  return (
    <div className="relative">
      <PageHeader
        compact
        number="06"
        kicker="Restricted realm · access denied"
        title={'SECRET\nROOM.'}
        accent="#c8ff3d"
        emoji="🔒"
        description="This page is not in the navigation. It is not in the sitemap. It is barely in this dimension. If you are here, either you found a hidden door or you typed the URL out of pure suspicion. Both are valid."
      />

      <section className="section-shell relative pb-24 pt-4">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-acid/20 bg-[#0a1204] p-6 sm:p-10"
          >
            <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(200,255,61,.14), transparent 55%)' }} />
            <div className="absolute inset-0 grid-lines opacity-20" />
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-acid/10 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <motion.div
                className="relative flex h-32 w-32 items-center justify-center rounded-full border border-acid/30 bg-acid/[0.05]"
                animate={reducedMotion ? undefined : { rotate: [0, 1.5, -1.5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="absolute inset-2 rounded-full border border-dashed border-acid/20" />
                <LockKeyhole size={38} className="text-acid" />
                <span className="absolute -bottom-1 rounded-full border border-acid/30 bg-[#0a1204] px-3 py-1 font-mono text-[7px] uppercase tracking-[0.18em] text-acid">locked</span>
              </motion.div>

              <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.3em] text-acid">Access point 06 / no signal</p>
              <h2 className="mt-3 font-display text-[clamp(3rem,8vw,6rem)] leading-[0.85]">THE DOOR<br /><span className="text-acid">IS LISTENING.</span></h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
                Three layers guard this room: a passphrase, three riddles, and a vault with no insurance policy. The passphrase is not written here. That would be embarrassing for everyone.
              </p>

              <form onSubmit={submit} className="mt-8 w-full max-w-md">
                <label className="block text-left">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">Whisper the passphrase</span>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={value}
                      onChange={(event) => {
                        setValue(event.target.value)
                        setError('')
                      }}
                      className="input-chaos flex-1 text-center font-mono uppercase tracking-[0.2em] sm:text-left"
                      placeholder="•••••"
                      maxLength={24}
                      autoComplete="off"
                      aria-label="Secret room passphrase"
                      aria-invalid={Boolean(error)}
                    />
                    <button type="submit" className="btn-primary shrink-0 text-xs uppercase tracking-[0.1em]">
                      <KeyRound size={14} /> Transmit
                    </button>
                  </div>
                </label>
                <div aria-live="polite" className="mt-3 min-h-[1.5rem] text-left">
                  {error ? (
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-hotpink">{error}</p>
                  ) : (
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/20">The door has no patience and excellent hearing.</p>
                  )}
                </div>
              </form>

              <div className="mt-6 w-full max-w-md rounded-xl border border-white/[0.08] bg-black/20 p-4 text-left">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-acid">Whispered hint</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/40">{hint}</p>
                {attempts > 0 && (
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">{attempts} failed attempt{attempts === 1 ? '' : 's'} logged. The duck is taking notes.</p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/" className="btn-ghost text-xs">
                  <ArrowRight size={14} className="rotate-180" /> Return to the surface
                </Link>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">Or keep guessing. It is a website, not a bank.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default function SecretRoom() {
  const { secretFound, discoverSecret, unlocked, unlock, addToast, triggerChaos } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()
  const vaultAlreadyOpen = unlocked.includes('vault')
  const [picks, setPicks] = useState({})
  const [solved, setSolved] = useState(() => (vaultAlreadyOpen ? [0, 1, 2] : []))
  const [vaultOpen, setVaultOpen] = useState(vaultAlreadyOpen)
  const [cowPokes, setCowPokes] = useState(0)

  if (!secretFound) {
    return <LockedGate onUnlock={() => discoverSecret('the whispered passphrase')} />
  }

  const allRiddlesSolved = solved.length === secretRiddles.length
  const vaultReady = allRiddlesSolved || vaultAlreadyOpen
  const achievementCount = achievements.filter((achievement) => unlocked.includes(achievement.id)).length

  const answerRiddle = (index, option) => {
    if (solved.includes(index)) return
    setPicks((current) => ({ ...current, [index]: option }))
    if (option !== secretRiddles[index].answer) {
      play('fail')
      addToast('Not quite. The answer is nearby, possibly hiding behind a slightly worse answer.', 'default', 4200)
      return
    }
    const next = [...solved, index]
    setSolved(next)
    play('success')
    if (next.length === secretRiddles.length) {
      addToast('All three sigils collected. The vault is now pretending to be impressed.', 'secret', 6200)
    } else {
      addToast(`Sigil ${next.length} of 3 collected. The door has stopped pretending not to notice you.`, 'secret', 5000)
    }
  }

  const openVault = () => {
    if (!vaultReady || vaultOpen) return
    setVaultOpen(true)
    unlock('vault')
    play('fanfare')
    triggerChaos('confetti')
    addToast('The inner vault is open. Please handle the secrets with clean hands and low expectations.', 'secret', 7000)
  }

  const pokeArtifact = (artifact, index) => {
    play(index === 0 ? 'moo' : 'pop')
    if (index === 0) {
      const next = cowPokes + 1
      setCowPokes(next)
      if (next >= 3) {
        setCowPokes(0)
        triggerChaos('tinycow')
        addToast('You poked the founder three times. It has summoned itself. This is considered a promotion.', 'secret', 6000)
        return
      }
    }
    addToast(`${artifact.emoji} ${artifact.name}: ${artifact.line}`, 'secret', 6200)
  }

  return (
    <div className="relative">
      <PageHeader
        number="06"
        kicker="Restricted realm · unauthorised clarity"
        title={'SECRET\nROOM.'}
        accent="#c8ff3d"
        emoji="🗝️"
        description="You found the room behind the website. It contains a passphrase gate you already defeated, three riddles with questionable stakes, a vault of facts, and a small collection of objects that should not be clickable. Welcome. Please do not tell the homepage."
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="chip border-acid/30 text-acid"><Eye size={11} /> Clearance: unlicensed</span>
          <span className="chip"><Star size={11} /> {solved.length} / 3 sigils</span>
          <span className="chip"><Trophy size={11} /> {achievementCount} / {achievements.length} achievements</span>
          <span className="chip"><LockKeyhole size={11} /> Vault: {vaultOpen ? 'open' : vaultReady ? 'ready' : 'sealed'}</span>
        </div>
      </PageHeader>

      <div className="relative z-10 -rotate-1 border-y border-ink/20 bg-acid py-3 text-ink">
        <div className="marquee-track gap-8">
          {[...Array(3)].flatMap(() => [
            'YOU ARE NOT SUPPOSED TO BE HERE',
            'THE COW KNOWS',
            'NO CAMERAS*',
            'THE VAULT REMEMBERS',
            'CLICK THE OBJECTS. WHAT COULD GO WRONG.',
            'THIS TEXT IS NOT A HINT',
          ]).map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
              {item} <span className="text-white/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="section-shell relative z-10 py-20 md:py-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { number: '01', title: 'The Gate', status: 'Cleared', copy: 'You whispered the word. The door pretended it was not waiting for you.', open: true },
            { number: '02', title: 'The Riddles', status: `${solved.length} / 3 solved`, copy: 'Three questions. Zero qualifications required. One very judgmental duck.', open: solved.length > 0 },
            { number: '03', title: 'The Vault', status: vaultOpen ? 'Open' : vaultReady ? 'Ready' : 'Sealed', copy: 'Eight secrets, one suspiciously convenient lock and absolutely no refund policy.', open: vaultOpen },
          ].map((layer, index) => (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.08 }}
              className={`relative overflow-hidden rounded-[24px] border p-5 ${layer.open ? 'border-acid/25 bg-acid/[0.05]' : 'border-white/[0.08] bg-white/[0.02]'}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">Layer {layer.number}</span>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] ${layer.open ? 'border-acid/40 text-acid' : 'border-white/10 text-white/30'}`}>
                  {layer.open ? <Check size={12} /> : <LockKeyhole size={11} />}
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl leading-none">{layer.title}</h2>
              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.15em]" style={{ color: layer.open ? '#c8ff3d' : 'rgba(255,255,255,.3)' }}>{layer.status}</p>
              <p className="mt-3 text-[11px] leading-relaxed text-white/35">{layer.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-white/[0.02] py-20 md:py-24">
        <div className="section-shell">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow mb-3">Layer 02 / prove you were paying attention</p>
              <h2 className="section-title">THE THREE<br /><span className="text-acid">RIDDLES.</span></h2>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-white/35">
              The questions are nonsense. The answers are also nonsense. The only way to lose is to take this seriously.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {secretRiddles.map((riddle, index) => {
              const isSolved = solved.includes(index)
              const selected = picks[index]
              const wrong = selected !== undefined && !isSolved && selected !== riddle.answer
              return (
                <motion.div
                  key={riddle.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={`relative overflow-hidden rounded-[26px] border p-5 ${isSolved ? 'border-acid/30 bg-[#0b1305]' : 'border-white/[0.09] bg-[#0a0713]'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">Riddle {String(index + 1).padStart(2, '0')}</span>
                    {isSolved ? (
                      <span className="flex items-center gap-1 rounded-full border border-acid/30 bg-acid/10 px-2.5 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-acid"><Check size={9} /> solved</span>
                    ) : (
                      <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">unsolved</span>
                    )}
                  </div>
                  <p className="mt-4 min-h-[4rem] text-sm font-medium leading-relaxed text-white/75">{riddle.question}</p>
                  <div className="mt-4 space-y-2">
                    {riddle.options.map((option, optionIndex) => {
                      const isPicked = selected === optionIndex
                      const isCorrect = isSolved && optionIndex === riddle.answer
                      const isWrongPick = wrong && isPicked
                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={isSolved}
                          onClick={() => answerRiddle(index, optionIndex)}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[11px] transition ${
                            isCorrect
                              ? 'border-acid/40 bg-acid/10 text-acid'
                              : isWrongPick
                                ? 'border-hotpink/40 bg-hotpink/10 text-hotpink'
                                : isSolved
                                  ? 'border-white/[0.06] bg-white/[0.01] text-white/20'
                                  : 'border-white/10 bg-white/[0.03] text-white/50 hover:border-white/25 hover:text-white/80'
                          }`}
                        >
                          <span>{option}</span>
                          {isCorrect && <Check size={12} />}
                          {isWrongPick && <span className="font-mono text-[8px] uppercase tracking-[0.1em]">no</span>}
                        </button>
                      )
                    })}
                  </div>
                  {wrong && <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-hotpink">The duck shakes its head. Try another answer.</p>}
                  {isSolved && <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-acid">Sigil collected. The room smells faintly of approval.</p>}
                </motion.div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
              {allRiddlesSolved ? 'All sigils collected. The vault is ready for its moment.' : `Collect all three sigils to wake the vault. ${3 - solved.length} remaining.`}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-acid">{solved.length} / 3</span>
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 py-20 md:py-24">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
          <div>
            <p className="eyebrow mb-4">Layer 03 / the inner vault</p>
            <h2 className="section-title">EIGHT THINGS<br /><span className="text-stroke">YOU SHOULD<br />NOT KNOW.</span></h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/40">
              The vault contains the official secrets of CHAOSVERSE. They are all true, none are useful, and one of them involves a toaster with feelings.
            </p>

            <motion.div
              whileHover={reducedMotion || !vaultReady || vaultOpen ? undefined : { scale: 1.01 }}
              className={`relative mt-7 overflow-hidden rounded-[28px] border p-6 ${vaultOpen ? 'border-acid/30 bg-[#0b1305]' : 'border-white/10 bg-[#0a0713]'}`}
            >
              <div className="absolute inset-0 grid-lines opacity-15" />
              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={reducedMotion || !vaultReady || vaultOpen ? undefined : { rotate: [0, 4, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed ${vaultOpen ? 'border-acid/40 text-acid' : 'border-white/15 text-white/40'}`}
                >
                  {vaultOpen ? <Eye size={24} /> : <LockKeyhole size={22} />}
                </motion.div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-acid">{vaultOpen ? 'Vault status: open' : vaultReady ? 'Vault status: ready' : 'Vault status: sealed'}</p>
                  <p className="mt-1 text-sm font-semibold text-white/70">{vaultOpen ? 'The secrets are loose. Please do not feed them.' : vaultReady ? 'The lock is pretending it can still stop you.' : 'The lock requires all three sigils. It is very serious about this.'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={openVault}
                disabled={!vaultReady || vaultOpen}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  vaultOpen
                    ? 'border border-acid/30 bg-acid/10 text-acid'
                    : vaultReady
                      ? 'bg-acid text-ink hover:scale-[1.01]'
                      : 'border border-white/10 bg-white/[0.03] text-white/25'
                }`}
              >
                {vaultOpen ? <><Eye size={14} /> Vault already open</> : vaultReady ? <><KeyRound size={14} /> Open the inner vault</> : <><LockKeyhole size={14} /> Collect all sigils first</>}
              </button>
              <p className="mt-3 text-center font-mono text-[7px] uppercase tracking-[0.13em] text-white/20">
                Contains {vaultRewards.length} secrets. Side effects may include knowing things.
              </p>
            </motion.div>
          </div>

          <div className={`transition-all duration-500 ${vaultOpen ? 'blur-0' : 'blur-[5px]'}`}>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {vaultRewards.map((reward, index) => {
                const [label, ...rest] = reward.split(': ')
                return (
                  <motion.div
                    key={reward}
                    initial={vaultOpen ? { opacity: 1 } : { opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0715] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-acid/20 bg-acid/[0.06] font-mono text-[8px] text-acid">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/25">{label}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/55">{rest.join(': ')}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            {!vaultOpen && (
              <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
                {vaultReady ? 'Unlock the vault to bring these into focus. Or squint. Squinting is free.' : 'These secrets are blurred for your protection. And for ours.'}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-white/[0.02] py-20 md:py-24">
        <div className="section-shell">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">The suspicious objects shelf</p>
              <h2 className="section-title">DO NOT<br /><span className="text-acid">TOUCH THESE.</span></h2>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-white/35">Every object tells a story. None of the stories are useful. The founder is sensitive about being poked.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {artifacts.map((artifact, index) => (
              <motion.button
                key={artifact.name}
                type="button"
                onClick={() => pokeArtifact(artifact, index)}
                whileHover={reducedMotion ? undefined : { y: -5, rotate: index % 2 ? 1.5 : -1.5 }}
                className="group relative flex flex-col items-center overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0b0715] p-5 text-center transition hover:border-acid/30"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 50% 30%,rgba(200,255,61,.08),transparent 60%)' }} />
                <span className="relative text-4xl transition-transform group-hover:scale-110">{artifact.emoji}</span>
                <span className="relative mt-4 font-display text-xl leading-none">{artifact.name}</span>
                <span className="relative mt-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">poke carefully</span>
                {index === 0 && cowPokes > 0 && (
                  <span className="relative mt-2 font-mono text-[7px] uppercase tracking-[0.12em] text-acid">{cowPokes} / 3 pokes</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 py-20 md:py-24">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[30px] border border-acid/20 bg-[#0b1305] p-6 sm:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-acid/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-acid">The cow's constitution</p>
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">Ratified in a laundry basket</span>
              </div>
              <h2 className="mt-3 font-display text-4xl">RULES OF<br /><span className="text-acid">THE ROOM.</span></h2>
              <ul className="mt-6 space-y-3">
                {constitution.map((rule) => (
                  <li key={rule} className="flex gap-3 text-[11px] leading-relaxed text-white/45">
                    <span className="mt-0.5 text-acid">✦</span>
                    {rule}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/10 pt-4 font-mono text-[7px] uppercase leading-relaxed tracking-[0.13em] text-white/20">
                Signed by the founder, witnessed by a duck, disputed by nobody with authority.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0713] p-6 sm:p-8">
            <p className="eyebrow">Your clearance record</p>
            <h2 className="mt-3 font-display text-4xl">PROOF OF<br /><span className="text-grape">CURIOSITY.</span></h2>
            <div className="mt-6 space-y-2.5">
              {achievements.map((achievement) => {
                const earned = unlocked.includes(achievement.id)
                return (
                  <div key={achievement.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${earned ? 'border-acid/25 bg-acid/[0.04]' : 'border-white/[0.07] bg-white/[0.015]'}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${earned ? 'border-acid/35 text-acid' : 'border-white/10 text-white/20'}`}>
                      {earned ? <Check size={11} /> : <LockKeyhole size={10} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11px] font-semibold ${earned ? 'text-white/75' : 'text-white/30'}`}>{achievement.label}</p>
                      <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">{achievement.desc}</p>
                    </div>
                    <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">{earned ? 'earned' : 'locked'}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
                <span>Curiosity completion</span>
                <span className="text-acid">{Math.round((achievementCount / achievements.length) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-acid to-electric" animate={{ width: `${(achievementCount / achievements.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 pb-24">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0c0816] p-7 md:p-10">
          <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(circle at 80% 20%,rgba(200,255,61,.12),transparent 45%)' }} />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">End of the secret room</p>
              <h2 className="mt-2 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.88]">THERE IS NO<br /><span className="text-acid">EMERGENCY EXIT.</span></h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/40">
                There is a regular exit, disguised as the home page. It works perfectly. The emergency exit is a poster of a door and has fooled three people today.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  play('fail')
                  addToast('The emergency exit is a poster. It appreciates your optimism.', 'default')
                }}
                className="btn-ghost text-xs"
              >
                <Ghost size={14} /> Emergency exit
              </button>
              <Link to="/" onClick={() => play('sparkle')} className="btn-primary text-xs uppercase tracking-[0.1em]">
                Actually leave <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
