import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Shuffle,
  Sparkles,
  Trash2,
  Wand2,
  Zap,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { memeCaptions, memeTemplates } from '../data/content'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'
import { pick } from '../lib/utils'

const STORAGE_KEY = 'chaosverse-memes'

const seedCaption = memeCaptions.find((caption) => caption.includes('procrastination')) || memeCaptions[0]

function splitCaption(caption) {
  const separators = ['. ', ': ', ', ', ' but ', ' and ']
  for (const separator of separators) {
    const index = caption.indexOf(separator)
    if (index > 12 && index < caption.length - 10) {
      return [
        caption.slice(0, index).toUpperCase(),
        caption.slice(index + separator.length).toUpperCase(),
      ]
    }
  }
  const words = caption.split(' ')
  const midpoint = Math.ceil(words.length / 2)
  return [words.slice(0, midpoint).join(' ').toUpperCase(), words.slice(midpoint).join(' ').toUpperCase()]
}

function readWall() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(raw) ? raw.slice(0, 12) : []
  } catch {
    return []
  }
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((character) => character + character).join('') : clean
  const value = Number.parseInt(full, 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

function wrapCanvasText(context, text, maxWidth, maxLines) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word
    if (context.measureText(test).width <= maxWidth || !line) {
      line = test
    } else {
      lines.push(line)
      line = word
    }
  })
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines)
    trimmed[maxLines - 1] = `${trimmed[maxLines - 1].replace(/[,.;:]$/, '')}…`
    return trimmed
  }
  return lines
}

function MemePreview({ template, topText, bottomText, compact = false, chaosMode = false }) {
  const topLines = topText || 'YOUR TEXT HERE'
  const bottomLines = bottomText || 'AND YOUR REGRET HERE'

  return (
    <div
      className={`relative overflow-hidden ${compact ? 'aspect-square rounded-xl' : 'aspect-square rounded-[26px] border border-white/15 shadow-[0_30px_100px_rgba(0,0,0,.45)]'} ${chaosMode ? 'rotate-[0.6deg] saturate-125' : ''}`}
      style={{ background: template.bg }}
      role="img"
      aria-label={`Meme preview. Top text: ${topLines}. Bottom text: ${bottomLines}. Template: ${template.name}.`}
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.16] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_20%,rgba(0,0,0,.36)_100%)]" />

      <div className={`absolute ${compact ? 'left-2 top-2 text-[18px]' : 'left-5 top-4 text-5xl'} opacity-80 drop-shadow-2xl`} aria-hidden="true">
        {template.emoji}
      </div>

      {template.layout === 'alert' && (
        <div className={`absolute inset-x-0 ${compact ? 'top-1' : 'top-3'} flex justify-center`}>
          <span className={`rounded-full bg-red-600 font-mono font-bold uppercase tracking-[0.16em] text-white ${compact ? 'px-1.5 py-0.5 text-[4px]' : 'px-3 py-1 text-[8px]'}`}>
            ⚠ breaking nonsense
          </span>
        </div>
      )}

      {template.layout === 'quote' && !compact && (
        <div className="absolute left-1/2 top-[38%] -translate-x-1/2 font-display text-[8rem] leading-none text-white/[0.08]">“</div>
      )}

      {template.layout === 'center' && (
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none leading-none opacity-[0.16] ${compact ? 'text-[5rem]' : 'text-[15rem]'}`} aria-hidden="true">
          {template.emoji}
        </div>
      )}

      <div
        className={`absolute inset-x-0 ${compact ? 'top-7 px-2' : 'top-16 px-6'} text-center font-black uppercase text-white`}
        style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          letterSpacing: compact ? '0.02em' : '0.035em',
          lineHeight: 0.95,
          fontSize: compact ? '9px' : 'clamp(1.35rem, 3.8vw, 3rem)',
          textShadow: '0 2px 0 #000, 0 0 16px rgba(0,0,0,.7)',
          WebkitTextStroke: compact ? '0' : '1px rgba(0,0,0,.35)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {topLines}
      </div>

      <div
        className={`absolute inset-x-0 ${compact ? 'bottom-4 px-2' : 'bottom-12 px-6'} text-center font-black uppercase text-white`}
        style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          letterSpacing: compact ? '0.02em' : '0.035em',
          lineHeight: 0.95,
          fontSize: compact ? '9px' : 'clamp(1.1rem, 3.2vw, 2.5rem)',
          textShadow: '0 2px 0 #000, 0 0 16px rgba(0,0,0,.7)',
          WebkitTextStroke: compact ? '0' : '1px rgba(0,0,0,.3)',
          display: '-webkit-box',
          WebkitLineClamp: compact ? 2 : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {bottomLines}
      </div>

      <div className={`absolute inset-x-0 bottom-0 flex items-center justify-between font-mono uppercase text-white/40 ${compact ? 'px-2 py-1.5 text-[4px]' : 'px-5 py-3 text-[7px] tracking-[0.15em]'}`}>
        <span>chaosverse / meme factory</span>
        <span style={{ color: template.accent }}>{template.name}</span>
      </div>
    </div>
  )
}

export default function MemeFactory() {
  const { addToast } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()
  const [seedTop, seedBottom] = splitCaption(seedCaption)
  const [templateId, setTemplateId] = useState(memeTemplates[0].id)
  const [topText, setTopText] = useState(seedTop)
  const [bottomText, setBottomText] = useState(seedBottom)
  const [source, setSource] = useState(seedCaption)
  const [chaosMode, setChaosMode] = useState(false)
  const [saved, setSaved] = useState(readWall)
  const [copiedId, setCopiedId] = useState(null)
  const lastCaption = useRef(seedCaption)
  const copiedTimer = useRef(null)

  const template = memeTemplates.find((item) => item.id === templateId) || memeTemplates[0]

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      // The wall is temporary. So is everything.
    }
  }, [saved])

  useEffect(() => {
    return () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current)
    }
  }, [])

  const selectTemplate = (nextTemplate) => {
    setTemplateId(nextTemplate.id)
    play('click')
    addToast(`Template loaded: ${nextTemplate.name}. The aesthetic has been decided for you.`, 'default', 3600)
  }

  const newCaption = () => {
    const pool = memeCaptions.filter((caption) => caption !== lastCaption.current)
    const next = pick(pool)
    const [nextTop, nextBottom] = splitCaption(next)
    lastCaption.current = next
    setSource(next)
    setTopText(nextTop)
    setBottomText(nextBottom)
    play('whoosh')
  }

  const randomize = () => {
    const nextTemplate = pick(memeTemplates.filter((item) => item.id !== templateId))
    const pool = memeCaptions.filter((caption) => caption !== lastCaption.current)
    const next = pick(pool)
    const [nextTop, nextBottom] = splitCaption(next)
    lastCaption.current = next
    setTemplateId(nextTemplate.id)
    setSource(next)
    setTopText(nextTop)
    setBottomText(nextBottom)
    setChaosMode(Math.random() > 0.55)
    play('drumroll')
    window.setTimeout(() => play('sparkle'), 420)
  }

  const copyText = async (text = `${topText}\n${bottomText}`, id = 'studio') => {
    try {
      await navigator.clipboard.writeText(text)
      play('success')
      setCopiedId(id)
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current)
      copiedTimer.current = window.setTimeout(() => setCopiedId(null), 1800)
      addToast('Meme text copied. Please deploy it responsibly, or at least in a group chat.', 'default', 4000)
    } catch {
      play('fail')
      addToast('The clipboard refused. It has seen your memes before.', 'default')
    }
  }

  const saveMeme = () => {
    if (!topText.trim() && !bottomText.trim()) {
      play('fail')
      addToast('A meme with no text is just a very confident gradient.', 'default')
      return
    }
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      templateId,
      topText: topText.slice(0, 80),
      bottomText: bottomText.slice(0, 80),
      at: new Date().toISOString(),
    }
    setSaved((current) => [entry, ...current].slice(0, 12))
    play('success')
    addToast('Meme added to the wall. The wall is not happy about it. The wall is a wall.', 'secret', 4800)
  }

  const removeMeme = (id) => {
    setSaved((current) => current.filter((entry) => entry.id !== id))
    play('fail')
  }

  const clearWall = () => {
    setSaved([])
    play('fail')
    addToast('The wall has been cleared. It feels lighter. Emotionally empty, but lighter.', 'default')
  }

  const downloadMeme = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1080
    const context = canvas.getContext('2d')
    if (!context) {
      play('fail')
      addToast('Your browser declined to draw the meme. A reasonable position.', 'default')
      return
    }

    const background = context.createLinearGradient(0, 0, 1080, 1080)
    background.addColorStop(0, '#08040f')
    background.addColorStop(0.55, '#150a28')
    background.addColorStop(1, '#06030f')
    context.fillStyle = background
    context.fillRect(0, 0, 1080, 1080)

    const glow = context.createRadialGradient(540, 480, 30, 540, 480, 760)
    glow.addColorStop(0, hexToRgba(template.accent, 0.34))
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = glow
    context.fillRect(0, 0, 1080, 1080)

    context.strokeStyle = 'rgba(255,255,255,.055)'
    context.lineWidth = 1
    for (let position = 0; position <= 1080; position += 90) {
      context.beginPath()
      context.moveTo(position, 0)
      context.lineTo(position, 1080)
      context.stroke()
      context.beginPath()
      context.moveTo(0, position)
      context.lineTo(1080, position)
      context.stroke()
    }

    context.textAlign = 'center'
    context.globalAlpha = 0.82
    context.font = '230px "Segoe UI Emoji", "Apple Color Emoji", serif'
    context.fillText(template.emoji, 540, 650)
    context.globalAlpha = 1

    context.font = '900 70px Impact, "Bebas Neue", sans-serif'
    context.lineJoin = 'round'
    context.lineWidth = 12
    context.strokeStyle = '#000000'
    context.fillStyle = '#ffffff'

    const topLines = wrapCanvasText(context, topText || 'YOUR TEXT HERE', 900, 4)
    const bottomLines = wrapCanvasText(context, bottomText || 'AND YOUR REGRET HERE', 900, 4)
    const lineHeight = 74

    topLines.forEach((line, index) => {
      const y = 120 + index * lineHeight
      context.strokeText(line, 540, y)
      context.fillText(line, 540, y)
    })

    bottomLines
      .slice()
      .reverse()
      .forEach((line, index) => {
        const y = 1000 - index * lineHeight
        context.strokeText(line, 540, y)
        context.fillText(line, 540, y)
      })

    context.globalAlpha = 0.65
    context.font = '500 24px "DM Mono", monospace'
    context.fillStyle = '#ffffff'
    context.fillText('CHAOSVERSE / MEME FACTORY', 540, 1042)
    context.globalAlpha = 1

    canvas.toBlob((blob) => {
      if (!blob) {
        play('fail')
        addToast('The meme could not be exported. It has chosen to remain mysterious.', 'default')
        return
      }
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `chaosverse-${template.id}-meme.png`
      anchor.click()
      URL.revokeObjectURL(url)
      play('success')
      addToast('Meme downloaded. You now own a high-resolution mistake.', 'secret', 4600)
    }, 'image/png')
  }

  const quality = Math.min(99, 58 + ((topText.length * 3 + bottomText.length * 2 + template.id.length) % 42))

  return (
    <div className="relative">
      <PageHeader
        number="05"
        kicker="The meme factory · quality control absent"
        title={'MEME\nFACTORY.'}
        accent="#8b5cf6"
        emoji="🧠"
        description="An industrial facility where ordinary thoughts are flattened into bold text and questionable graphics. Choose a template, adjust the words, export your mistake. The factory runs on confidence and has no safety inspector."
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="chip border-grape/30 text-grape"><ImageIcon size={11} /> {saved.length} memes on the wall</span>
          <span className="chip"><Sparkles size={11} /> 08 templates, 28 captions</span>
          <span className="chip"><Zap size={11} /> Zero approvals requested</span>
        </div>
      </PageHeader>

      <div className="relative z-10 border-y border-white/10 bg-grape py-3 text-ink">
        <div className="marquee-track-reverse gap-8">
          {[...Array(3)].flatMap(() => [
            'FRESHLY MANUFACTURED NONSENSE',
            'NO QUALITY CONTROL DEPARTMENT',
            'IMPORTED FROM THE GROUP CHAT',
            'BOLD TEXT = COMEDY',
            'EXPORT RESPONSIBLY',
            'THE PIGEON APPROVES*',
          ]).map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
              {item} <span className="text-white/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="section-shell relative z-10 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <div className="relative">
              <MemePreview template={template} topText={topText} bottomText={bottomText} chaosMode={chaosMode} />
              <span className="absolute -left-3 -top-3 rotate-[-8deg] rounded-full bg-acid px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-ink">live preview</span>
              <span className="absolute -bottom-3 right-4 rounded-full border border-white/15 bg-[#0b0618]/95 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">
                {template.name}
              </span>
            </div>

            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-grape">Source material</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50">{source}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText()}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.13em] text-white/45 transition hover:border-white/25 hover:text-white"
                >
                  {copiedId === 'studio' ? <Check size={11} className="text-acid" /> : <Copy size={11} />}
                  {copiedId === 'studio' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
                  <span>Certified nonsense</span>
                  <span className="text-grape">{quality}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-electric via-grape to-hotpink" animate={{ width: `${quality}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-grape">Meme assembly line</p>
                <h2 className="mt-2 font-display text-4xl leading-none md:text-5xl">BUILD A<br /><span className="text-grape">BAD IDEA.</span></h2>
              </div>
              <span className="hidden font-mono text-[8px] uppercase tracking-[0.16em] text-white/20 sm:block">Station 05</span>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">01 / Select a template</p>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">{memeTemplates.length} available</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {memeTemplates.map((item) => {
                  const active = item.id === templateId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectTemplate(item)}
                      aria-pressed={active}
                      className={`group relative overflow-hidden rounded-xl border text-left transition ${active ? 'border-white/40 ring-1 ring-white/20' : 'border-white/10 hover:border-white/25'}`}
                    >
                      <span className="relative block h-14 overflow-hidden" style={{ background: item.bg }}>
                        <span className="absolute left-1.5 top-1 text-base">{item.emoji}</span>
                        <span className="absolute inset-x-1 bottom-1 h-1 rounded-full bg-white/15" />
                        {active && <Check size={11} className="absolute right-1.5 top-1.5 text-white drop-shadow" />}
                      </span>
                      <span className="block bg-[#0b0715] px-2 py-2 font-mono text-[7px] uppercase leading-tight tracking-[0.08em] text-white/45">{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-7 grid gap-4">
              <label className="block">
                <span className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                  <span>02 / Top text</span>
                  <span className="text-white/20">{topText.length} / 80</span>
                </span>
                <input
                  value={topText}
                  onChange={(event) => setTopText(event.target.value.slice(0, 80))}
                  maxLength={80}
                  className="input-chaos mt-2 font-bold uppercase tracking-wide"
                  placeholder="TYPE SOMETHING CONFIDENT"
                  aria-label="Top meme text"
                />
              </label>
              <label className="block">
                <span className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                  <span>03 / Bottom text</span>
                  <span className="text-white/20">{bottomText.length} / 80</span>
                </span>
                <input
                  value={bottomText}
                  onChange={(event) => setBottomText(event.target.value.slice(0, 80))}
                  maxLength={80}
                  className="input-chaos mt-2 font-bold uppercase tracking-wide"
                  placeholder="ADD THE UNNECESSARY PUNCHLINE"
                  aria-label="Bottom meme text"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={newCaption} className="btn-ghost text-[11px]">
                <Wand2 size={14} /> New caption
              </button>
              <button type="button" onClick={randomize} className="btn-ghost text-[11px]">
                <Shuffle size={14} /> Randomize everything
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopText('')
                  setBottomText('')
                  play('click')
                }}
                className="btn-ghost text-[11px]"
              >
                <RefreshCw size={14} /> Clear text
              </button>
              <button
                type="button"
                onClick={() => {
                  setChaosMode((value) => !value)
                  play('boing')
                }}
                aria-pressed={chaosMode}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-[11px] font-semibold transition ${
                  chaosMode ? 'border-acid/40 bg-acid/10 text-acid' : 'border-white/15 bg-white/[0.04] text-white/50 hover:text-white'
                }`}
              >
                <Zap size={13} /> Chaos filter {chaosMode ? 'on' : 'off'}
              </button>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={downloadMeme} className="btn-primary text-xs uppercase tracking-[0.08em]">
                <Download size={15} /> Download PNG
              </button>
              <button type="button" onClick={saveMeme} className="btn-ghost text-xs uppercase tracking-[0.08em]">
                <Plus size={15} /> Add to the wall
              </button>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
              <span className="mt-0.5 text-sm">🧾</span>
              <p className="text-[10px] leading-relaxed text-white/30">
                The download is a real PNG rendered in your browser. The wall is stored on this device. The quality department has been notified and has declined to comment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-white/[0.02] py-20 md:py-24">
        <div className="section-shell">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">The wall / local storage</p>
              <h2 className="section-title">RECENTLY<br /><span className="text-stroke">MANUFACTURED.</span></h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">{saved.length} / 12 saved</span>
              <button
                type="button"
                onClick={clearWall}
                disabled={!saved.length}
                className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35 underline decoration-white/20 underline-offset-4 transition hover:text-hotpink disabled:opacity-30"
              >
                Clear the wall
              </button>
            </div>
          </div>

          {saved.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AnimatePresence initial={false}>
                {saved.map((entry) => {
                  const entryTemplate = memeTemplates.find((item) => item.id === entry.templateId) || memeTemplates[0]
                  return (
                    <motion.article
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0715] p-2"
                    >
                      <MemePreview template={entryTemplate} topText={entry.topText} bottomText={entry.bottomText} compact />
                      <div className="mt-2 flex items-center justify-between gap-2 px-1 pb-1">
                        <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/25">
                          {new Date(entry.at).toLocaleDateString([], { month: 'short', day: 'numeric' })} · {entryTemplate.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => copyText(`${entry.topText}\n${entry.bottomText}`, entry.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/35 transition hover:border-white/25 hover:text-white"
                            aria-label="Copy meme text"
                          >
                            {copiedId === entry.id ? <Check size={10} className="text-acid" /> : <Copy size={10} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMeme(entry.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/25 transition hover:border-hotpink/40 hover:text-hotpink"
                            aria-label="Delete meme"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">
              <motion.span animate={reducedMotion ? undefined : { rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-5xl">🏭</motion.span>
              <h3 className="mt-4 font-display text-3xl">THE WALL IS EMPTY.</h3>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/30">
                That is either minimalist or deeply sad. Manufacture something above and it will appear here, stored safely in your own browser and nowhere important.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell relative z-10 py-20 md:py-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { emoji: '🧠', stat: '28', label: 'Caption fragments', copy: 'Written by a committee of one tired person and a pigeon with a thesaurus.' },
            { emoji: '🎨', stat: '08', label: 'Original templates', copy: 'Built from gradients, emoji and the belief that more glow equals more funny.' },
            { emoji: '📉', stat: '0', label: 'Approval ratings', copy: 'The quality department resigned in protest. We replaced it with a lamp.' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-6"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-display text-4xl text-grape">{item.stat}</span>
              </div>
              <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">{item.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/40">{item.copy}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[30px] border border-white/10 bg-[#0c0816] p-7 sm:flex-row sm:items-center md:p-9">
          <div>
            <p className="eyebrow">Need more raw material?</p>
            <h2 className="mt-2 font-display text-4xl leading-none">THE COMEDY WORLD<br /><span className="text-grape">HAS SPARE JOKES.</span></h2>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/40">Steal a punchline. Give it a gradient. This is the entire creative process.</p>
          </div>
          <Link to="/comedy" className="btn-primary shrink-0 text-xs uppercase tracking-[0.1em]">
            Visit the joke mine <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  )
}
