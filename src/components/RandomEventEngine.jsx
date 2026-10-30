import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, CloudLightning, Sparkles, Star, X } from 'lucide-react'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'
import { useBodyLock, useEscape } from '../lib/hooks'
import Confetti from './Confetti'

const SOUND_FOR_EVENT = {
  confetti: 'fanfare',
  award: 'fanfare',
  takeover: 'glitch',
  cameo: 'pop',
  glitch: 'glitch',
  emojiRain: 'whoosh',
  spin: 'boing',
  captcha: 'ding',
  quote: 'sparkle',
  weather: 'ding',
  disco: 'success',
  tinycow: 'moo',
  unlock: 'sparkle',
  invert: 'glitch',
  toast: 'pop',
}

const AUTO_CLOSE = {
  confetti: 5200,
  award: 10000,
  takeover: 7500,
  cameo: 6500,
  glitch: 2200,
  emojiRain: 5600,
  spin: 3800,
  captcha: 13000,
  quote: 6500,
  weather: 6500,
  disco: 7000,
  tinycow: 5200,
  unlock: 11000,
  invert: 1600,
  toast: 300,
}

const FULL_EVENTS = new Set(['award', 'takeover', 'captcha', 'quote', 'disco', 'unlock'])

function ToastStack() {
  const { toasts, dismissToast } = useChaos()
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[800] flex w-[min(92vw,25rem)] flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((toast) => {
          const secret = toast.tone === 'secret'
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 70, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: 90, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`pointer-events-auto overflow-hidden rounded-2xl border p-4 shadow-[0_18px_60px_rgba(0,0,0,.45)] backdrop-blur-2xl ${
                secret ? 'border-acid/35 bg-[#101b06]/95' : 'border-white/12 bg-[#0f0a1b]/95'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    secret ? 'bg-acid/15 text-acid' : 'bg-grape/20 text-grape'
                  }`}
                >
                  {secret ? <Star size={14} /> : <Bell size={14} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">{secret ? 'SECRET FREQUENCY' : 'TRANSMISSION'}</p>
                  <p className="mt-1 text-[13px] leading-snug text-white/80">{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="text-white/30 transition hover:text-white"
                  aria-label="Dismiss message"
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function AwardEvent({ event, onClose, play }) {
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center overflow-y-auto bg-[#05030c]/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.7, rotate: -5, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border-4 border-[#d4af37] bg-[#fff8e4] p-2 text-ink shadow-[0_0_120px_rgba(212,175,55,.22)]"
      >
        <div className="noise-bg relative overflow-hidden rounded-[20px] border border-[#b48a1d]/40 p-7 text-center sm:p-12">
          <div className="absolute inset-3 rounded-xl border border-[#b48a1d]/30" />
          <div className="relative">
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#8b6a13]">The Department of Questionable Honors</p>
            <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#d4af37] bg-[#f3e3a6] text-4xl shadow-inner">
              {event.award.emoji}
            </div>
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.26em] text-[#8b6a13]">Certificate of Achievement*</p>
            <h2 className="mx-auto mt-2 max-w-[16ch] font-display text-[clamp(2.7rem,7vw,5rem)] leading-[0.88] text-[#1b1010]">{event.award.title}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#3e3020]/75">{event.award.subtitle}</p>
            <div className="mx-auto my-6 h-px w-32 bg-[#b48a1d]/40" />
            <p className="mx-auto max-w-md font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-[#6f5719]/80">{event.award.footer}</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  play('fanfare')
                  onClose()
                }}
                className="rounded-full bg-[#1b1010] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#fff8e4] transition hover:scale-[1.02]"
              >
                I accept this meaningless honor
              </button>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#6f5719]/60">*Not legal. Not valid. Still yours.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TakeoverEvent({ event, onClose, play }) {
  const [panicCount, setPanicCount] = useState(0)
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex flex-col items-center justify-center overflow-hidden bg-[#ff2e97] p-6 text-center text-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute inset-x-0 top-0 h-1 bg-ink" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-ink" />
      <motion.div
        animate={{ rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2.2 }}
        className="relative z-10 max-w-4xl"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em]">⚠ Unauthorized whimsy detected ⚠</p>
        <h2 className="mt-5 font-display text-[clamp(4rem,13vw,11rem)] leading-[0.8] text-ink">REALITY.EXE<br />HAS STOPPED<br />RESPONDING</h2>
        <p className="mx-auto mt-7 max-w-lg text-sm font-medium leading-relaxed">This is not a drill. It is a prank. But the vibes are real. Please remain calm while we reboot your sense of humor.</p>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] opacity-60">{event.message}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              play('error')
              setPanicCount((c) => c + 1)
            }}
            className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:scale-105"
          >
            {panicCount === 0 ? 'Panic' : panicCount < 3 ? `Panic harder (${panicCount})` : 'Panic achieved'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-ink/30 px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:border-ink hover:bg-ink/10"
          >
            Exit before it notices
          </button>
        </div>
        {panicCount > 0 && <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] opacity-70">Panic registered. It has been forwarded to nobody.</p>}
      </motion.div>
      <div className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[0.2em] opacity-50">This is a fictional prank. Your device is fine.</div>
    </motion.div>
  )
}

function CaptchaEvent({ event, onClose, play }) {
  const [checked, setChecked] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center bg-[#05030c]/80 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 25, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="w-full max-w-md rounded-2xl border border-white/15 bg-[#100b1d] p-2 shadow-2xl"
      >
        <div className="rounded-xl border border-white/10 bg-[#0a0713] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Humanity check</p>
              <h3 className="mt-1 text-xl font-semibold">Are you a robot?</h3>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/10 text-electric"><Check size={18} /></span>
          </div>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            {!failed ? (
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setChecked(true)
                    play('ding')
                    window.setTimeout(() => {
                      setFailed(true)
                      play('fail')
                    }, 800)
                  }}
                  className="h-5 w-5 accent-[#c8ff3d]"
                />
                <span className="text-sm text-white/70">{checked ? 'Verifying your vibes...' : 'I am definitely a human with feelings and everything.'}</span>
              </label>
            ) : (
              <div className="text-center">
                <p className="text-sm font-semibold text-hotpink">Verification failed.</p>
                <p className="mt-2 text-xs leading-relaxed text-white/50">You were too human. The robots found your emotional range suspicious. This is a compliment.</p>
                <button type="button" onClick={onClose} className="mt-4 rounded-full bg-white/10 px-5 py-2 text-xs font-semibold transition hover:bg-white/15">
                  Accept my humanity
                </button>
              </div>
            )}
          </div>
          <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.15em] text-white/25">Not a real CAPTCHA. The robots are fictional. Probably.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function QuoteEvent({ event, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center overflow-hidden bg-[#06030f]/92 p-6 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute left-1/2 top-1/2 h-[45rem] w-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.08]" />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative max-w-4xl text-center"
      >
        <p className="eyebrow mb-6">An unsolicited transmission</p>
        <p className="font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.9] text-white">“{event.message}”</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-acid/50" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-acid">The Void</span>
          <span className="h-px w-12 bg-acid/50" />
        </div>
        <button type="button" onClick={onClose} className="btn-ghost mt-8 text-xs">
          Return to reality (for now)
        </button>
      </motion.div>
    </motion.div>
  )
}

function DiscoEvent({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex flex-col items-center justify-center overflow-hidden p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%,#ff2e97,#06030f 60%)',
            'radial-gradient(circle at 80% 30%,#35e6ff,#06030f 60%)',
            'radial-gradient(circle at 50% 80%,#c8ff3d,#06030f 60%)',
            'radial-gradient(circle at 20% 20%,#8b5cf6,#06030f 60%)',
          ],
        }}
        transition={{ duration: 3.2, repeat: Infinity }}
      />
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="relative text-center">
        <motion.div
          animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-7xl"
        >
          🕺
        </motion.div>
        <h2 className="mt-5 font-display text-[clamp(4rem,14vw,12rem)] leading-[0.8] text-white">DISCO<br />MODE</h2>
        <p className="mx-auto mt-5 max-w-md text-sm text-white/65">This was not on the schedule. The lights are out of control. The tiny cow is doing its best.</p>
        <button type="button" onClick={onClose} className="mt-7 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition hover:scale-105">
          End the groove
        </button>
      </div>
    </motion.div>
  )
}

function UnlockEvent({ event, onClose }) {
  const navigate = useNavigate()
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center overflow-hidden bg-[#05030c]/94 p-6 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute h-[42rem] w-[42rem] rounded-full border border-acid/10" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-full max-w-2xl rounded-[28px] border border-acid/25 bg-acid/[0.045] p-8 text-center md:p-12"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-acid/40 text-4xl"
        >
          🗝️
        </motion.div>
        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.28em] text-acid">Secret frequency found</p>
        <h2 className="mt-3 font-display text-[clamp(3.5rem,9vw,6.5rem)] leading-[0.85]">THE DOOR<br /><span className="text-acid">IS AWAKE.</span></h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/60">
          {event.message} A hidden room has been added to the footer. The tiny cow has left a light on for you.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              onClose()
              navigate('/secret')
            }}
            className="btn-primary text-xs uppercase tracking-[0.08em]"
          >
            Enter the secret room
          </button>
          <button type="button" onClick={onClose} className="btn-ghost text-xs">
            Later, mystery
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function WeatherEvent({ event, onClose }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-24 z-[600] flex justify-center px-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-tangerine/35 bg-[#1b0e05]/95 p-4 shadow-2xl backdrop-blur-xl">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tangerine/15 text-tangerine"><CloudLightning size={20} /></span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-tangerine">Extreme weather warning</p>
          <p className="mt-1 text-sm font-semibold">Emotional drizzle expected</p>
          <p className="mt-1 text-xs leading-relaxed text-white/50">{event.message}</p>
        </div>
        <button type="button" onClick={onClose} className="text-white/35 hover:text-white" aria-label="Dismiss weather alert"><X size={14} /></button>
      </div>
    </motion.div>
  )
}

function CameoEvent({ event, onClose }) {
  return (
    <motion.div
      className="fixed bottom-5 left-4 z-[600] w-[min(90vw,23rem)] sm:bottom-6 sm:left-6"
      initial={{ x: -330, opacity: 0, rotate: -4 }}
      animate={{ x: 0, opacity: 1, rotate: 0 }}
      exit={{ x: -340, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      <div className="relative rounded-2xl border border-electric/25 bg-[#0a1320]/95 p-4 shadow-[0_20px_80px_rgba(0,0,0,.5)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <motion.span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-3xl"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {event.cameo.emoji}
          </motion.span>
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-electric">Uninvited cameo</p>
            <p className="mt-1 text-sm font-bold">{event.cameo.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/55">{event.cameo.line}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="absolute right-2 top-2 text-white/25 hover:text-white" aria-label="Dismiss cameo"><X size={13} /></button>
      </div>
    </motion.div>
  )
}

function EmojiRain({ onClose }) {
  const emojis = useRef(
    Array.from({ length: 34 }, (_, index) => ({
      id: index,
      emoji: ['🐄', '🦆', '🧦', '🍕', '🛸', '🌈', '⭐', '🫠', '👾', '🥔'][index % 10],
      left: Math.random() * 100,
      size: 16 + Math.random() * 36,
      drift: `${Math.random() * 180 - 90}px`,
      rot: `${Math.random() * 720 - 360}deg`,
      delay: `${Math.random() * 1.1}s`,
      time: `${2.6 + Math.random() * 2.6}s`,
    })),
  )
  return (
    <div className="fixed inset-0 z-[600] overflow-hidden bg-[#05030c]/35" onClick={onClose} role="presentation">
      {emojis.current.map((item) => (
        <span
          key={item.id}
          className="emoji-fall"
          style={{
            left: `${item.left}%`,
            '--size': `${item.size}px`,
            '--drift': item.drift,
            '--rot': item.rot,
            '--delay': item.delay,
            '--fall-time': item.time,
          }}
        >
          {item.emoji}
        </span>
      ))}
      <div className="absolute left-1/2 top-1/2 z-10 w-[min(88vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-[#0b0618]/90 p-6 text-center backdrop-blur-xl">
        <p className="eyebrow">Emoji weather event</p>
        <h3 className="mt-2 font-display text-4xl">THE SKY IS<br /><span className="text-electric">EMOTIONAL.</span></h3>
        <p className="mt-3 text-xs leading-relaxed text-white/50">Please remain indoors. The duck situation is under control. Mostly.</p>
        <button type="button" onClick={onClose} className="btn-ghost mt-5 text-xs">Seek shelter</button>
      </div>
    </div>
  )
}

function TinyCowEvent({ onClose }) {
  return (
    <div className="fixed inset-0 z-[600] overflow-hidden" onClick={onClose} role="presentation">
      <motion.div
        className="absolute bottom-[24%] text-7xl drop-shadow-2xl"
        initial={{ x: '-15vw', rotate: -4 }}
        animate={{ x: '110vw', rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4.4, ease: 'linear', rotate: { duration: 0.6, repeat: Infinity } }}
      >
        🐄
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-[32%] left-1/2 -translate-x-1/2 rounded-2xl border border-acid/25 bg-[#0b1305]/90 px-5 py-3 text-center backdrop-blur"
      >
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-acid">Tiny cow crossing</p>
        <p className="mt-1 text-sm text-white/70">Please yield. It has somewhere to be.</p>
      </motion.div>
    </div>
  )
}

function SpinEvent({ onClose }) {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center overflow-hidden bg-[#06030f]/55" onClick={onClose} role="presentation">
      <motion.div
        className="relative flex h-[min(78vw,32rem)] w-[min(78vw,32rem)] items-center justify-center rounded-full border border-dashed border-acid/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.6, ease: 'easeInOut' }}
      >
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="text-center">
          <p className="text-5xl">🌀</p>
          <p className="mt-3 font-display text-4xl">WORLD<br /><span className="text-acid">SPINNING</span></p>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">This is fine</p>
        </div>
      </motion.div>
    </div>
  )
}

function GlitchEvent({ onClose }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[600] overflow-hidden" onClick={onClose} role="presentation">
      <div className="absolute inset-0 bg-electric/10 mix-blend-screen" />
      <div className="scan-sweep absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-acid/20 to-transparent" />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[clamp(3rem,10vw,9rem)] text-white/80"
        animate={{ x: [-10, 12, -6, 3, 0], opacity: [1, 0.5, 1, 0.3, 1], skewX: [0, 8, -5, 0] }}
        transition={{ duration: 0.9 }}
      >
        SIGNAL LOST
      </motion.div>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,.025)_2px,rgba(255,255,255,.025)_4px)]" />
    </div>
  )
}

function InvertEvent() {
  return <div className="pointer-events-none fixed inset-0 z-[600]" style={{ backdropFilter: 'invert(1) hue-rotate(180deg)' }} />
}

function EventLayer() {
  const { event, dismissEvent, addToast } = useChaos()
  const { play } = useSound()
  const playRef = useRef(play)
  playRef.current = play
  const addToastRef = useRef(addToast)
  addToastRef.current = addToast

  useBodyLock(Boolean(event && FULL_EVENTS.has(event.type)))
  useEscape(dismissEvent, Boolean(event))

  useEffect(() => {
    if (!event) return undefined
    if (event.type === 'toast') {
      playRef.current(SOUND_FOR_EVENT.toast)
      addToastRef.current(event.message)
      const closeTimer = window.setTimeout(dismissEvent, 30)
      return () => window.clearTimeout(closeTimer)
    }
    playRef.current(SOUND_FOR_EVENT[event.type] || 'pop')
    const timer = window.setTimeout(dismissEvent, AUTO_CLOSE[event.type] || 5000)
    return () => window.clearTimeout(timer)
  }, [event, dismissEvent])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <ToastStack />
      <AnimatePresence>
        {event && (
          <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {event.type === 'confetti' && (
              <>
                <Confetti count={110} />
                <div className="pointer-events-none fixed inset-x-0 top-24 z-[610] flex justify-center px-4">
                  <motion.div
                    initial={{ y: -30, scale: 0.9 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    className="rounded-full border border-acid/30 bg-[#0b1305]/95 px-5 py-3 text-center shadow-2xl backdrop-blur"
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold text-acid"><Sparkles size={14} /> CONFETTI HAS BEEN DEPLOYED. NO REFUNDS.</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-white/35">{event.message}</p>
                  </motion.div>
                </div>
              </>
            )}
            {event.type === 'award' && <AwardEvent event={event} onClose={dismissEvent} play={play} />}
            {event.type === 'takeover' && <TakeoverEvent event={event} onClose={dismissEvent} play={play} />}
            {event.type === 'captcha' && <CaptchaEvent event={event} onClose={dismissEvent} play={play} />}
            {event.type === 'quote' && <QuoteEvent event={event} onClose={dismissEvent} />}
            {event.type === 'disco' && <DiscoEvent onClose={dismissEvent} />}
            {event.type === 'unlock' && <UnlockEvent event={event} onClose={dismissEvent} />}
            {event.type === 'weather' && <WeatherEvent event={event} onClose={dismissEvent} />}
            {event.type === 'cameo' && <CameoEvent event={event} onClose={dismissEvent} />}
            {event.type === 'emojiRain' && <EmojiRain onClose={dismissEvent} />}
            {event.type === 'tinycow' && <TinyCowEvent onClose={dismissEvent} />}
            {event.type === 'spin' && <SpinEvent onClose={dismissEvent} />}
            {event.type === 'glitch' && <GlitchEvent onClose={dismissEvent} />}
            {event.type === 'invert' && <InvertEvent />}
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  )
}

export default function RandomEventEngine() {
  return <EventLayer />
}
