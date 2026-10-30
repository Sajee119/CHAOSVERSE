import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { awards, surpriseMessages } from '../data/content'
import { pick } from '../lib/utils'

const ChaosContext = createContext(null)

export const EVENT_TYPES = [
  'confetti',
  'toast',
  'award',
  'takeover',
  'cameo',
  'glitch',
  'emojiRain',
  'spin',
  'captcha',
  'quote',
  'weather',
  'disco',
  'tinycow',
  'unlock',
  'invert',
]

const eventLabels = {
  confetti: 'Confetti detonation',
  toast: 'Suspicious notification',
  award: 'Unwarranted award',
  takeover: 'Reality takeover',
  cameo: 'Uninvited cameo',
  glitch: 'Reality glitch',
  emojiRain: 'Emoji weather event',
  spin: 'Vertical spin incident',
  captcha: 'Very human check',
  quote: 'Transmission from nowhere',
  weather: 'Urgent weather bulletin',
  disco: 'Unscheduled disco',
  tinycow: 'Tiny cow crossing',
  unlock: 'Secret frequency found',
  invert: 'Reality inversion',
}

const cameos = [
  { emoji: '🐄', name: 'The Tiny Cow', line: 'Moo. That means you are doing great. Or it means lettuce. Translation is imperfect.' },
  { emoji: '🦆', name: 'The Judging Duck', line: 'I have reviewed your choices. I have notes. Mostly about the snack situation.' },
  { emoji: '👽', name: 'Gary From Space', line: 'We traveled 4,000 light years for this website. We have questions. Mostly about the button.' },
  { emoji: '🧙', name: 'The Vibe Wizard', line: 'Your aura is 80% glitter and 20% unresolved browser tabs. Fascinating.' },
  { emoji: '🤖', name: 'A Slightly Lost Robot', line: 'I was told this was a productivity site. I have been here for six hours.' },
  { emoji: '🫠', name: 'Your Motivation', line: 'I am melting. It is fine. Everything is fine. Please stop clicking.' },
]

export function ChaosProvider({ children }) {
  const [event, setEvent] = useState(null)
  const [toasts, setToasts] = useState([])
  const [eventHistory, setEventHistory] = useState([])
  const [chaosCount, setChaosCount] = useState(0)
  const recentEvents = useRef([])
  const toastTimers = useRef(new Map())

  const [unlocked, setUnlocked] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('chaosverse-achievements') || '[]')
    } catch {
      return []
    }
  })

  const [secretFound, setSecretFound] = useState(() => {
    try {
      return window.localStorage.getItem('chaosverse-secret') === 'found'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('chaosverse-achievements', JSON.stringify(unlocked))
    } catch {
      // No memory. Just vibes.
    }
  }, [unlocked])

  useEffect(() => {
    try {
      if (secretFound) window.localStorage.setItem('chaosverse-secret', 'found')
    } catch {
      // The secret remains a secret from local storage.
    }
  }, [secretFound])

  const unlock = useCallback((id) => {
    setUnlocked((current) => (current.includes(id) ? current : [...current, id]))
  }, [])

  const addToast = useCallback((message, tone = 'default', duration = 4200) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((current) => [...current.slice(-3), { id, message, tone }])
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
      toastTimers.current.delete(id)
    }, duration)
    toastTimers.current.set(id, timer)
    return id
  }, [])

  const dismissToast = useCallback((id) => {
    const timer = toastTimers.current.get(id)
    if (timer) window.clearTimeout(timer)
    toastTimers.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    return () => {
      toastTimers.current.forEach((timer) => window.clearTimeout(timer))
      toastTimers.current.clear()
    }
  }, [])

  const dismissEvent = useCallback(() => setEvent(null), [])

  const triggerChaos = useCallback(
    (forcedType = null) => {
      let type = forcedType
      if (!type) {
        const available = EVENT_TYPES.filter((candidate) => !recentEvents.current.includes(candidate))
        type = pick(available.length ? available : EVENT_TYPES)
      }
      recentEvents.current = [...recentEvents.current.slice(-5), type]

      const payload = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        message: pick(surpriseMessages),
        award: pick(awards),
        cameo: pick(cameos),
        created: Date.now(),
      }
      setEvent(payload)
      setChaosCount((count) => count + 1)
      setEventHistory((history) => [{ id: payload.id, type, label: eventLabels[type] || type, at: new Date() }, ...history].slice(0, 8))

      if (type === 'unlock') {
        setSecretFound(true)
        setUnlocked((current) => (current.includes('secret_found') ? current : [...current, 'secret_found']))
      }

      return payload
    },
    [],
  )

  const discoverSecret = useCallback(
    (source = 'unknown') => {
      const firstTime = !secretFound
      setSecretFound(true)
      setUnlocked((current) => (current.includes('secret_found') ? current : [...current, 'secret_found']))
      if (firstTime) {
        addToast('Secret frequency found. The hidden door is now awake. Look for "Secret Room" in the footer.', 'secret', 7500)
        setEvent({
          id: `${Date.now()}-unlock`,
          type: 'unlock',
          message: `The door opened via ${source}.`,
          created: Date.now(),
        })
        setEventHistory((history) => [
          { id: `${Date.now()}-unlock`, type: 'unlock', label: 'Secret frequency found', at: new Date() },
          ...history,
        ].slice(0, 8))
        setChaosCount((count) => count + 1)
      } else {
        addToast('The secret room already knows you. It is pretending not to.', 'secret')
      }
      return firstTime
    },
    [addToast, secretFound],
  )

  const value = useMemo(
    () => ({
      event,
      toasts,
      eventHistory,
      chaosCount,
      unlocked,
      secretFound,
      unlock,
      addToast,
      dismissToast,
      triggerChaos,
      dismissEvent,
      discoverSecret,
    }),
    [
      event,
      toasts,
      eventHistory,
      chaosCount,
      unlocked,
      secretFound,
      unlock,
      addToast,
      dismissToast,
      triggerChaos,
      dismissEvent,
      discoverSecret,
    ],
  )

  return <ChaosContext.Provider value={value}>{children}</ChaosContext.Provider>
}

export function useChaos() {
  const context = useContext(ChaosContext)
  if (!context) throw new Error('useChaos must be used inside ChaosProvider')
  return context
}
