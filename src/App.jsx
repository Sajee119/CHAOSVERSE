import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import CustomCursor from './components/CustomCursor'
import EasterEggManager from './components/EasterEggManager'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import ParticleBackground from './components/ParticleBackground'
import RandomEventEngine from './components/RandomEventEngine'
import { loadingStatuses } from './data/content'
import { useEscape } from './lib/hooks'
import ChaosGames from './pages/ChaosGames'
import ComedyWorld from './pages/ComedyWorld'
import Home from './pages/Home'
import MemeFactory from './pages/MemeFactory'
import NotFound from './pages/NotFound'
import PrankLab from './pages/PrankLab'
import SecretRoom from './pages/SecretRoom'
import Surprises from './pages/Surprises'

const pageTitles = {
  '/': 'CHAOSVERSE — Enter the Madness',
  '/prank-lab': 'Prank Lab — CHAOSVERSE',
  '/comedy': 'Comedy World — CHAOSVERSE',
  '/games': 'Chaos Games — CHAOSVERSE',
  '/surprises': 'Random Surprises — CHAOSVERSE',
  '/meme-factory': 'Meme Factory — CHAOSVERSE',
  '/secret': 'Secret Room — CHAOSVERSE',
}

function ScrollManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function BootScreen({ onFinish }) {
  const reducedMotion = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)

  useEscape(onFinish, true)

  useEffect(() => {
    const start = Date.now()
    const progressTimer = window.setInterval(() => {
      setProgress(Math.min(100, ((Date.now() - start) / 1500) * 100))
    }, 60)
    const statusTimer = window.setInterval(() => {
      setStatusIndex((index) => (index + 1) % loadingStatuses.length)
    }, 320)
    const finishTimer = window.setTimeout(onFinish, 1950)
    return () => {
      window.clearInterval(progressTimer)
      window.clearInterval(statusTimer)
      window.clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#04020a] px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="status"
      aria-live="polite"
      aria-label="Loading CHAOSVERSE"
    >
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(139,92,246,.16), transparent 46%)' }} />

      <motion.div
        className="relative flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center rounded-full border border-acid/30 bg-acid/[0.04]"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute inset-2 rounded-full border border-dashed border-white/15" />
          <span className="absolute inset-5 rounded-full border border-hotpink/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-acid shadow-[0_0_20px_#c8ff3d]" />
          <span className="absolute -right-0.5 top-0 h-1.5 w-1.5 rounded-full bg-hotpink" />
          <span className="absolute -bottom-0.5 left-0 h-1.5 w-1.5 rounded-full bg-electric" />
        </motion.div>

        <p className="mt-7 font-mono text-[8px] uppercase tracking-[0.32em] text-acid">Initialising a questionable experience</p>
        <h1 className="mt-3 font-display text-[clamp(3rem,10vw,7rem)] leading-[0.8] tracking-[0.02em]">
          CHAOS<span className="text-acid">VERSE</span>
        </h1>

        <div className="mt-8 w-[min(78vw,22rem)]">
          <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
            <span>Reality assembly</span>
            <span className="text-acid">{String(Math.round(progress)).padStart(2, '0')}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-electric via-acid to-hotpink" animate={{ width: `${progress}%` }} transition={{ duration: 0.12 }} />
          </div>
          <p className="mt-3 min-h-[1.25rem] font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">{loadingStatuses[statusIndex]}</p>
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="mt-5 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25 underline decoration-white/15 underline-offset-4 transition hover:text-white/60"
        >
          <Sparkles size={10} /> Skip the ceremony
        </button>
      </motion.div>

      <p className="absolute bottom-6 left-1/2 w-full max-w-md -translate-x-1/2 px-5 text-center font-mono text-[7px] uppercase leading-relaxed tracking-[0.14em] text-white/20">
        No audio plays without permission. We are chaotic, not rude.
      </p>
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const [booting, setBooting] = useState(true)
  const finishBoot = useCallback(() => setBooting(false), [])

  useEffect(() => {
    document.title = pageTitles[location.pathname] || 'Page Not Found — CHAOSVERSE'
  }, [location.pathname])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10002] focus:rounded-full focus:bg-acid focus:px-4 focus:py-2.5 focus:font-mono focus:text-[10px] focus:uppercase focus:tracking-[0.16em] focus:text-ink"
      >
        Skip to content
      </a>

      <ParticleBackground />
      <CustomCursor />
      <ScrollManager />
      <Navbar />

      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname} routeKey={location.pathname}>
          <main id="main" className="relative min-h-[60vh]">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/prank-lab" element={<PrankLab />} />
              <Route path="/comedy" element={<ComedyWorld />} />
              <Route path="/games" element={<ChaosGames />} />
              <Route path="/surprises" element={<Surprises />} />
              <Route path="/meme-factory" element={<MemeFactory />} />
              <Route path="/secret" element={<SecretRoom />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </PageTransition>
      </AnimatePresence>

      <RandomEventEngine />
      <EasterEggManager />

      <AnimatePresence>
        {booting && <BootScreen key="boot" onFinish={finishBoot} />}
      </AnimatePresence>
    </>
  )
}
