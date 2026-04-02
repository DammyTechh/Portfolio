import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

/* ── Particle canvas ──────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let animId, W, H, particles = [], mouse = { x: -9999, y: -9999 }
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
    const mkP = () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.5 + 0.1,
      hue: [200, 190, 220][Math.floor(Math.random() * 3)],
    })
    const init = () => { resize(); particles = Array.from({ length: 140 }, mkP) }
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.strokeStyle = `hsla(200,80%,65%,${0.06 * (1 - d / 110)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y
        const md = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < 90) { p.vx += (mdx / md) * 0.25; p.vy += (mdy / md) * 0.25 }
        p.vx *= 0.992; p.vy *= 0.992
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},80%,72%,${p.alpha})`; ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    const onMouse = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    init(); draw()
    window.addEventListener('resize', init)
    window.addEventListener('mousemove', onMouse)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init); window.removeEventListener('mousemove', onMouse) }
  }, [])
  return <canvas ref={ref} className={styles.canvas} />
}

/* ── DNA Helix ────────────────────────────────────────────────── */
function DNAHelix() {
  return (
    <div className={styles.dna}>
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} className={styles.dnaSegment} style={{ '--i': i }}>
          <div className={styles.dnaNodeA} />
          <div className={styles.dnaBridge} />
          <div className={styles.dnaNodeB} />
        </div>
      ))}
    </div>
  )
}

/* ── Morphing Sphere ──────────────────────────────────────────── */
function MorphSphere() {
  return (
    <div className={styles.sphere}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={styles.sphereRing} style={{ '--ri': i, '--rn': 10 }} />
      ))}
      <div className={styles.sphereCore} />
    </div>
  )
}

/* ── Rotating Cube ────────────────────────────────────────────── */
function Cube({ size = 60, color, delay = '0s', style = {} }) {
  const faces = ['front', 'back', 'left', 'right', 'top', 'bottom']
  return (
    <div className={styles.cube} style={{ '--cs': `${size}px`, '--cc': color, '--cd': delay, ...style }}>
      {faces.map(f => <div key={f} className={styles.cubeFace} data-face={f} />)}
    </div>
  )
}

/* ── Orbital Rings ────────────────────────────────────────────── */
function OrbitalSystem() {
  const rings = [
    { s: '340px', spd: '16s', rc: 'rgba(14,165,233,0.22)',  dc: 'rgba(56,189,248,0.9)',  delay: '0s' },
    { s: '500px', spd: '26s', rc: 'rgba(6,182,212,0.16)',   dc: 'rgba(34,211,238,0.9)',  delay: '-9s' },
    { s: '660px', spd: '38s', rc: 'rgba(99,102,241,0.12)',  dc: 'rgba(165,180,252,0.9)', delay: '-19s' },
  ]
  return (
    <div className={styles.orbital}>
      {rings.map((r, i) => (
        <div key={i}>
          <div className={styles.orbitRing} style={{ '--os': r.s, '--oc': r.rc, '--ospd': r.spd }} />
          <div className={styles.orbitDot}  style={{ '--os': r.s, '--dc': r.dc, '--ospd': r.spd, '--odelay': r.delay }} />
        </div>
      ))}
      <div className={styles.orbCenter} />
    </div>
  )
}

/* ── Circuit SVG ──────────────────────────────────────────────── */
function CircuitBoard() {
  const nodes = [
    [180, 140, 'sky'], [420, 300, 'sky'], [650, 460, 'cyan'],
    [130, 420, 'indigo'], [370, 240, 'cyan'], [500, 380, 'sky'], [820, 200, 'indigo'],
  ]
  const colours = {
    sky:    { outer: 'rgba(14,165,233,0.4)',  inner: 'rgba(14,165,233,0.85)' },
    cyan:   { outer: 'rgba(6,182,212,0.4)',   inner: 'rgba(6,182,212,0.85)' },
    indigo: { outer: 'rgba(99,102,241,0.35)', inner: 'rgba(165,180,252,0.8)' },
  }
  return (
    <svg className={styles.circuit} viewBox="0 0 900 600" fill="none">
      <path d="M0 300 H180 V140 H420 V300 H650 V460 H900" stroke="rgba(14,165,233,0.16)" strokeWidth="1.2" strokeDasharray="8 10" />
      <path d="M0 160 H130 V420 H370 V240 H720 V420 H900" stroke="rgba(6,182,212,0.12)"  strokeWidth="1"   strokeDasharray="5 12" />
      <path d="M0 440 H280 V200 H500 V380 H820 V200 H900" stroke="rgba(99,102,241,0.1)"  strokeWidth="0.8" strokeDasharray="4 14" />
      {nodes.map(([cx, cy, type], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="7"  fill={colours[type].outer} />
          <circle cx={cx} cy={cy} r="3"  fill={colours[type].inner} />
        </g>
      ))}
    </svg>
  )
}

/* ── Hero ─────────────────────────────────────────────────────── */
const ROLES = [
  'Embedded Systems Engineer',
  'IoT Solutions Architect',
  'Robotics Engineer',
  'PCB & Power Designer',
  'Edge AI Developer',
  'Firmware Engineer',
]

export default function Hero() {
  const parallaxRef = useRef(null)
  const titleRef    = useRef(null)

  useEffect(() => {
    const onMouse = e => {
      const el = parallaxRef.current; if (!el) return
      el.style.transform = `translate(${(e.clientX / window.innerWidth - 0.5) * 28}px,${(e.clientY / window.innerHeight - 0.5) * 28}px)`
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    const chars = titleRef.current?.querySelectorAll('[data-c]') || []
    chars.forEach((c, i) => { c.style.animationDelay = `${0.4 + i * 0.036}s` })
  }, [])

  const split = txt => [...txt].map((c, i) => (
    <span key={i} data-c className={styles.char}>{c === ' ' ? '\u00A0' : c}</span>
  ))

  return (
    <section className={styles.hero} id="hero">
      <ParticleCanvas />

      {/* Ambient blobs */}
      <div className={styles.blob} style={{ background: 'radial-gradient(circle,rgba(14,165,233,0.2) 0%,transparent 65%)',   width: 800, height: 800, top: -260, right: -260 }} />
      <div className={styles.blob} style={{ background: 'radial-gradient(circle,rgba(6,182,212,0.13) 0%,transparent 65%)',   width: 600, height: 600, bottom: -160, left: -180 }} />
      <div className={styles.blob} style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 65%)',  width: 400, height: 400, top: '38%', left: '26%' }} />

      {/* 3D objects — parallax layer */}
      <div className={styles.objects} ref={parallaxRef}>
        <OrbitalSystem />
        <DNAHelix />
        <MorphSphere />
        <CircuitBoard />

        {/* Floating cubes */}
        <Cube size={56} color="rgba(14,165,233,0.55)"  delay="0s"   style={{ top: '13%', right: '9%' }} />
        <Cube size={36} color="rgba(6,182,212,0.55)"   delay="1.4s" style={{ top: '70%', left: '7%' }} />
        <Cube size={26} color="rgba(99,102,241,0.5)"   delay="2.0s" style={{ top: '7%',  left: '15%' }} />
        <Cube size={18} color="rgba(16,185,129,0.5)"   delay="0.7s" style={{ bottom: '22%', right: '16%' }} />

        {/* Grid dots */}
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className={styles.gridDot} style={{
            '--gd': `${i * 0.25}s`,
            top: `${8 + Math.sin(i * 1.3) * 75}%`,
            left: `${4 + (i / 16) * 92}%`,
            width: `${2 + (i % 4)}px`,
            height: `${2 + (i % 4)}px`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgePulse} />
          <span>Open to opportunities · 2025</span>
        </div>

        <h1 className={styles.title} ref={titleRef}>
          <span className={styles.line}>{split('Olawale')}</span>
          <span className={styles.line}>{split('Kabiru')}</span>
          <span className={`${styles.line} ${styles.lineAccent}`}>{split('Balogun')}</span>
        </h1>

        <div className={styles.ticker}>
          <div className={styles.tickerTrack}>
            {[...ROLES, ...ROLES].map((r, i) => (
              <span key={i} className={styles.tickerItem}>
                {r}<span className={styles.tickerSep}>◆</span>
              </span>
            ))}
          </div>
        </div>

        <p className={styles.tagline}>
          I build intelligent hardware — from bare-metal firmware and
          custom PCBs to <em>cloud-connected IoT systems</em> and edge AI deployments.
        </p>

        <div className={styles.ctas}>
          <a href="#projects" className={styles.ctaPrimary}
            onClick={e => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}>
            <span>View My Work</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#contact" className={styles.ctaGhost}
            onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Hire Me
          </a>
        </div>

        <div className={styles.stats}>
          {[
            ['5+',   'Years Engineering'],
            ['20+',  'Projects Shipped'],
            ['200+', 'PCB Components'],
            ['3',    'Countries Reached'],
          ].map(([v, l]) => (
            <div key={l} className={styles.stat}>
              <span className={styles.statV}>{v}</span>
              <span className={styles.statL}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className={styles.scrollCue}>
        <div className={styles.scrollMouse}><div className={styles.scrollDot} /></div>
        <span>Scroll</span>
      </div>
    </section>
  )
}
