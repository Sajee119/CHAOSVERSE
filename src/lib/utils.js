export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds))
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}
