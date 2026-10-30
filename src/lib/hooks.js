import { useEffect, useRef } from 'react'

export function useEscape(callback, active = true) {
  useEffect(() => {
    if (!active) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') callback(event)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [callback, active])
}

export function useBodyLock(locked = true) {
  useEffect(() => {
    if (!locked) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}

export function useKeySequence(sequence, callback) {
  const buffer = useRef([])
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase()
      if (key.length !== 1) return
      buffer.current = [...buffer.current, key].slice(-sequence.length)
      if (buffer.current.join('') === sequence.toLowerCase()) {
        buffer.current = []
        callbackRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sequence])
}

export function useInterval(callback, delay) {
  const savedCallback = useRef(callback)
  savedCallback.current = callback

  useEffect(() => {
    if (delay === null) return undefined
    const id = window.setInterval(() => savedCallback.current(), delay)
    return () => window.clearInterval(id)
  }, [delay])
}
