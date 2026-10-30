import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight
    let frame = 0
    let animationId = null
    const mouse = { x: width / 2, y: height / 2, active: false }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const particles = []
    const palette = ['#35e6ff', '#c8ff3d', '#ff2e97', '#8b5cf6', '#ffffff', '#ff7a18']
    const getCount = () => (width < 700 ? 46 : width < 1100 ? 80 : 118)

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles.length = 0
      const count = getCount()
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.8 + 0.35,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.5 + 0.16,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    const shooters = []
    let nextShooter = Date.now() + 3000

    function drawStar(x, y, radius, color, alpha) {
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.globalAlpha = alpha
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    function render() {
      ctx.clearRect(0, 0, width, height)

      if (Date.now() > nextShooter && !prefersReducedMotion) {
        shooters.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.3,
          vx: 4 + Math.random() * 4,
          vy: 1.4 + Math.random() * 2,
          life: 1,
        })
        nextShooter = Date.now() + 5000 + Math.random() * 8000
      }

      particles.forEach((particle) => {
        if (!prefersReducedMotion) {
          particle.x += particle.vx
          particle.y += particle.vy
          particle.pulse += 0.012
          if (mouse.active) {
            const dx = mouse.x - particle.x
            const dy = mouse.y - particle.y
            const distSq = dx * dx + dy * dy
            if (distSq < 22000) {
              const force = (22000 - distSq) / 22000
              particle.x -= dx * 0.0009 * force
              particle.y -= dy * 0.0009 * force
            }
          }
        }

        if (particle.x < -10) particle.x = width + 10
        if (particle.x > width + 10) particle.x = -10
        if (particle.y < -10) particle.y = height + 10
        if (particle.y > height + 10) particle.y = -10
        const twinkle = particle.alpha * (0.65 + Math.sin(particle.pulse) * 0.35)
        drawStar(particle.x, particle.y, particle.r, particle.color, twinkle)
      })

      shooters.forEach((shooter, index) => {
        shooter.x += shooter.vx
        shooter.y += shooter.vy
        shooter.life -= 0.012
        ctx.globalAlpha = Math.max(0, shooter.life)
        const gradient = ctx.createLinearGradient(shooter.x, shooter.y, shooter.x - 80, shooter.y - 30)
        gradient.addColorStop(0, 'rgba(255,255,255,.95)')
        gradient.addColorStop(1, 'rgba(200,255,61,0)')
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(shooter.x, shooter.y)
        ctx.lineTo(shooter.x - 80, shooter.y - 30)
        ctx.stroke()
        if (shooter.life <= 0) shooters.splice(index, 1)
      })

      ctx.globalAlpha = 1
      frame += 1
      animationId = window.requestAnimationFrame(render)
    }

    const onMouseMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
      mouse.active = true
    }
    const onMouseLeave = () => {
      mouse.active = false
    }

    resize()
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((particle) => drawStar(particle.x, particle.y, particle.r, particle.color, particle.alpha))
    } else {
      render()
    }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      if (animationId) window.cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [prefersReducedMotion])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-[12%] top-[8%] h-[34rem] w-[34rem] rounded-full bg-grape/15 blur-[120px]" />
      <div className="absolute -right-[10%] top-[28%] h-[30rem] w-[30rem] rounded-full bg-electric/10 blur-[130px]" />
      <div className="absolute bottom-[-14%] left-[34%] h-[32rem] w-[32rem] rounded-full bg-hotpink/10 blur-[140px]" />
      <div className="absolute inset-0 grid-lines opacity-[0.35]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,3,15,0.7)_100%)]" />
    </div>
  )
}
