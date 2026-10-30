import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, FlaskConical, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react'
import { prankCategories, pranks } from '../data/content'
import PrankCard from '../components/PrankCard'
import PageHeader from '../components/PageHeader'
import Overlay from '../components/Overlay'
import { useSound } from '../context/SoundContext'
import { useChaos } from '../context/ChaosContext'
import {
  CowardlyButton,
  DisappearingButton,
  EndlessLoader,
  ErrorMixer,
  FakeUpdate,
  MysteryBox,
  NotificationStorm,
  ScreenTakeover,
  VirusScan,
} from '../components/pranks/PrankExperiences'

const prankComponents = {
  update: FakeUpdate,
  loader: EndlessLoader,
  escape: CowardlyButton,
  error: ErrorMixer,
  takeover: ScreenTakeover,
  notifications: NotificationStorm,
  vanish: DisappearingButton,
  scan: VirusScan,
  mystery: MysteryBox,
}

export default function PrankLab() {
  const [category, setCategory] = useState('All')
  const [activePrank, setActivePrank] = useState(null)
  const { play } = useSound()
  const { addToast } = useChaos()
  const location = useLocation()
  const navigate = useNavigate()

  const filtered = useMemo(
    () => (category === 'All' ? pranks : pranks.filter((prank) => prank.category === category)),
    [category],
  )

  useEffect(() => {
    if (location.state?.openPrank) {
      const found = pranks.find((prank) => prank.id === location.state.openPrank)
      if (found) {
        setActivePrank(found)
        play('whoosh')
      }
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.state, location.pathname, navigate, play])

  const launch = (prank) => {
    setActivePrank(prank)
    play('whoosh')
  }

  const ActiveExperience = activePrank ? prankComponents[activePrank.id] : null

  return (
    <>
      <PageHeader
        number="01"
        kicker="Prank laboratory · authorised tomfoolery"
        title={'PRANK\nLAB.'}
        accent="#ff2e97"
        emoji="🧪"
        description="Nine carefully engineered experiences designed to waste your time in the most delightful way possible. Everything is fictional, harmless, and easy to escape. We are chaotic, not monsters."
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="chip border-acid/25 text-acid"><ShieldCheck size={11} /> 100% harmless</span>
          <span className="chip"><TriangleAlert size={11} /> 0% real system access</span>
          <span className="chip"><Sparkles size={11} /> ESC always works</span>
        </div>
      </PageHeader>

      <section className="section-shell pb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {prankCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item)
                  play('click')
                }}
                className={`rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition ${
                  category === item
                    ? 'border-hotpink/40 bg-hotpink/10 text-hotpink'
                    : 'border-white/10 bg-white/[0.03] text-white/40 hover:border-white/25 hover:text-white/70'
                }`}
              >
                {item}
                <span className="ml-2 opacity-50">{item === 'All' ? pranks.length : pranks.filter((prank) => prank.category === item).length}</span>
              </button>
            ))}
          </div>
          <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
            <FlaskConical size={12} /> All experiments tested on consenting pixels
          </p>
        </div>

        <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((prank, index) => (
            <PrankCard key={prank.id} prank={prank} index={index} onLaunch={launch} />
          ))}
        </motion.div>

        <div className="mt-14 grid gap-4 rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 md:grid-cols-3 md:p-8">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-hotpink">Lab safety notice</p>
            <h3 className="mt-2 font-display text-3xl">NOTHING HERE<br />IS REAL.</h3>
          </div>
          <div className="text-xs leading-relaxed text-white/40 md:col-span-2 md:border-l md:border-white/10 md:pl-8">
            <p>No files are scanned. No system is updated. No virus has been installed. No notification is real. The only thing being altered is your perception of how long a loading screen should last.</p>
            <p className="mt-3">Every experience can be closed with the exit button or the Escape key. Side effects may include mild giggling, spontaneous screenshots, and an urgent need to show someone else.</p>
          </div>
        </div>
      </section>

      <section className="section-shell pb-24">
        <div className="glass relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[30px] p-7 sm:flex-row sm:items-center md:p-9">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-acid/10 blur-3xl" />
          <div className="relative">
            <p className="eyebrow">Need a less controlled explosion?</p>
            <h2 className="mt-2 font-display text-4xl leading-none md:text-5xl">TRY THE RANDOM<br /><span className="text-acid">SURPRISE BUTTON.</span></h2>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/40">One button. Twenty possible realities. Some involving cows. All involving commitment issues.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              play('whoosh')
              addToast('The surprise button lives in the Surprises realm. It refuses to be contained.', 'default')
              navigate('/surprises')
            }}
            className="btn-primary relative shrink-0 text-xs uppercase tracking-[0.1em]"
          >
            Visit Surprises <ArrowRight size={14} />
          </button>
        </div>
      </section>

      <Overlay
        open={Boolean(activePrank)}
        onClose={() => setActivePrank(null)}
        label={activePrank ? `${activePrank.title} fictional prank` : 'Prank experience'}
        tone={activePrank?.accent}
        closeText="Escape prank"
      >
        {ActiveExperience && activePrank && (
          <ActiveExperience
            onClose={() => {
              addToast(`Prank escaped: ${activePrank.title}. Your device is still fine.`, 'default')
              setActivePrank(null)
            }}
            play={play}
          />
        )}
      </Overlay>
    </>
  )
}
