import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, LockKeyhole, Menu, X } from 'lucide-react'
import { navLinks } from '../data/content'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'
import SoundController from './SoundController'
import { useBodyLock, useEscape } from '../lib/hooks'

function LogoMark() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center">
      <span className="absolute inset-0 rounded-full border border-acid/50" />
      <span className="absolute inset-[5px] rounded-full border border-dashed border-white/30" />
      <span className="h-2 w-2 rounded-full bg-acid shadow-[0_0_14px_rgba(200,255,61,.9)]" />
      <span className="absolute -right-0.5 top-0 h-1 w-1 rounded-full bg-hotpink" />
      <span className="absolute -bottom-0.5 left-0 h-1 w-1 rounded-full bg-electric" />
    </span>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const logoClicks = useRef(0)
  const clickTimer = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { discoverSecret, secretFound } = useChaos()
  const { play } = useSound()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  useBodyLock(open)
  useEscape(() => setOpen(false), open)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (clickTimer.current) window.clearTimeout(clickTimer.current)
    }
  }, [])

  const onLogoClick = () => {
    play('click')
    logoClicks.current += 1
    if (clickTimer.current) window.clearTimeout(clickTimer.current)
    if (logoClicks.current >= 3) {
      logoClicks.current = 0
      discoverSecret('the triple-clicked logo')
      navigate('/secret')
      return
    }
    clickTimer.current = window.setTimeout(() => {
      logoClicks.current = 0
    }, 900)
  }

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-acid via-electric to-hotpink"
        style={{ scaleX: progress }}
      />
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
          scrolled ? 'border-b border-white/[0.08] bg-ink/75 backdrop-blur-2xl' : 'bg-transparent'
        }`}
      >
        <div className="section-shell flex h-[74px] items-center justify-between gap-4">
          <button type="button" onClick={onLogoClick} className="group flex items-center gap-3 text-left" aria-label="CHAOSVERSE home. Secret hint: click three times.">
            <LogoMark />
            <span className="flex flex-col">
              <span className="font-display text-[25px] leading-none tracking-[0.08em] text-white">CHAOSVERSE</span>
              <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.38em] text-white/35">Est. in a fever dream</span>
            </span>
          </button>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => play('click')}
                className={({ isActive }) =>
                  `group relative rounded-full px-3.5 py-2 text-[12px] font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-acid opacity-0 transition-opacity group-hover:opacity-100" />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SoundController />
            </div>
            <div className="sm:hidden">
              <SoundController compact />
            </div>
            {secretFound && (
              <Link
                to="/secret"
                onClick={() => play('sparkle')}
                className="hidden h-10 items-center gap-1.5 rounded-full border border-acid/25 bg-acid/[0.06] px-3 font-mono text-[9px] uppercase tracking-[0.16em] text-acid transition hover:bg-acid/10 sm:flex"
              >
                <LockKeyhole size={12} />
                Secret
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(true)
                play('whoosh')
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10 xl:hidden"
              aria-label="Open navigation menu"
              aria-expanded={open}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-[#08040f]/97 backdrop-blur-2xl xl:hidden"
            initial={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 92% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-shell flex h-[74px] shrink-0 items-center justify-between">
              <div className="flex items-center gap-3">
                <LogoMark />
                <span className="font-display text-[25px] tracking-[0.08em]">CHAOSVERSE</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  play('click')
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="section-shell flex flex-1 flex-col justify-center gap-1 overflow-y-auto pb-12 pt-5">
              <p className="eyebrow mb-5">Choose your chaos / 06 realms</p>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + index * 0.055, duration: 0.4 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => play('click')}
                    className={({ isActive }) =>
                      `group flex items-center justify-between border-b border-white/[0.08] py-4 ${
                        isActive ? 'text-acid' : 'text-white'
                      }`
                    }
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] text-white/30">{link.short}</span>
                      <span className="font-display text-[clamp(2.3rem,9vw,4rem)] leading-none tracking-wide">{link.label}</span>
                    </span>
                    <ArrowUpRight className="text-white/30 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={22} />
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-8 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  {secretFound ? (
                    <Link to="/secret" className="chip border-acid/30 text-acid">
                      <LockKeyhole size={12} /> Secret room open
                    </Link>
                  ) : (
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">The logo remembers three clicks.</span>
                  )}
                </div>
                <SoundController />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
