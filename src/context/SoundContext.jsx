import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { playSound } from '../lib/audio'

const SoundContext = createContext(null)

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    try {
      const saved = window.localStorage.getItem('chaosverse-sound')
      return saved === null ? true : saved === 'on'
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('chaosverse-sound', enabled ? 'on' : 'off')
    } catch {
      // Storage can be moody. That is fine.
    }
  }, [enabled])

  const play = useCallback(
    (name) => {
      playSound(name, enabled)
    },
    [enabled],
  )

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current
      if (next) window.setTimeout(() => playSound('sparkle', true), 30)
      return next
    })
  }, [])

  const value = useMemo(() => ({ enabled, play, toggle }), [enabled, play, toggle])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound must be used inside SoundProvider')
  return context
}
