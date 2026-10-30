let audioContext = null

function getContext() {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!audioContext) audioContext = new AudioCtx()
  if (audioContext.state === 'suspended') audioContext.resume()
  return audioContext
}

function tone(freq, duration, type = 'sine', volume = 0.04, slideTo = null, delay = 0) {
  const ctx = getContext()
  if (!ctx) return
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  const start = ctx.currentTime + delay
  oscillator.type = type
  oscillator.frequency.setValueAtTime(freq, start)
  if (slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 20), start + duration)
  }
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.05)
}

function noiseBurst(duration = 0.15, volume = 0.035, highpass = 800) {
  const ctx = getContext()
  if (!ctx) return
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = Math.random() * 2 - 1
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = highpass
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start()
}

export const soundMap = {
  click: () => {
    tone(440, 0.07, 'triangle', 0.035, 620)
  },
  pop: () => {
    tone(280, 0.1, 'sine', 0.05, 700)
  },
  hover: () => {
    tone(760, 0.035, 'sine', 0.012)
  },
  success: () => {
    ;[523, 659, 784, 1046].forEach((freq, i) => tone(freq, 0.16, 'triangle', 0.035, null, i * 0.075))
  },
  error: () => {
    tone(180, 0.24, 'sawtooth', 0.03, 90)
    tone(140, 0.2, 'square', 0.016, 80, 0.02)
  },
  boing: () => {
    tone(180, 0.32, 'sine', 0.055, 640)
    tone(260, 0.22, 'triangle', 0.025, 520, 0.02)
  },
  whoosh: () => {
    noiseBurst(0.26, 0.025, 500)
    tone(280, 0.3, 'sine', 0.018, 900)
  },
  sparkle: () => {
    ;[1046, 1318, 1568, 2093].forEach((freq, i) => tone(freq, 0.12, 'sine', 0.02, null, i * 0.055))
  },
  fanfare: () => {
    ;[392, 523, 659, 784, 1046, 1318].forEach((freq, i) => tone(freq, 0.22, 'triangle', 0.035, null, i * 0.09))
    tone(196, 0.75, 'sine', 0.015, 196)
  },
  glitch: () => {
    noiseBurst(0.12, 0.04, 1200)
    tone(74, 0.2, 'square', 0.025, 220)
  },
  ding: () => {
    tone(880, 0.4, 'sine', 0.03, 880)
    tone(1320, 0.25, 'sine', 0.015, 1320, 0.02)
  },
  fail: () => {
    tone(330, 0.18, 'sawtooth', 0.028, 220)
    tone(180, 0.32, 'triangle', 0.025, 90, 0.14)
  },
  drumroll: () => {
    for (let i = 0; i < 14; i += 1) {
      noiseBurst(0.035, 0.018, 300 + i * 40)
      tone(120 + (i % 3) * 20, 0.04, 'triangle', 0.01, null, i * 0.065)
    }
  },
  moo: () => {
    tone(190, 0.46, 'sawtooth', 0.025, 120)
    tone(240, 0.38, 'sine', 0.02, 160, 0.05)
  },
  coin: () => {
    tone(988, 0.08, 'square', 0.022, 1319)
    tone(1319, 0.2, 'square', 0.018, 1319, 0.08)
  },
  win: () => {
    ;[523, 659, 784, 1046, 1318, 1568].forEach((freq, i) => tone(freq, 0.2, 'triangle', 0.038, null, i * 0.1))
  },
  teleport: () => {
    tone(900, 0.25, 'sine', 0.025, 120)
    noiseBurst(0.2, 0.018, 1400)
  },
}

export function playSound(name, enabled = true) {
  if (!enabled) return
  const sound = soundMap[name]
  if (!sound) return
  try {
    sound()
  } catch {
    // Audio is a garnish, never a requirement.
  }
}
