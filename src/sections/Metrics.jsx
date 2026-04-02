import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import styles from './Metrics.module.css'

// All personal engineering milestones — no org branding
const metrics = [
  { value: 5,   suffix: '+',  label: 'Years Engineering',    desc: 'Embedded, IoT & power systems', icon: '◈' },
  { value: 20,  suffix: '+',  label: 'Projects Shipped',     desc: 'Prototype → production',        icon: '⬡' },
  { value: 200, suffix: '+',  label: 'PCB Components',       desc: 'On a single board design',      icon: '◉' },
  { value: 28,  suffix: 'ch', label: 'Sensor Channels',      desc: 'On multi-touch mapping system', icon: '◎' },
  { value: 3,   suffix: '',   label: 'Countries',            desc: 'Where my work has shipped',     icon: '⬢' },
  { value: 4,   suffix: '+',  label: 'Domains Mastered',     desc: 'Hardware, firmware, IoT, AI',   icon: '◆' },
]

function Counter({ value, suffix, active }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = now => {
      const t = Math.min((now - start) / 1600, 1)
      setDisplay(Math.round((1 - Math.pow(1 - t, 4)) * value))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, value])
  return <>{display}{suffix}</>
}

export default function Metrics() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(false)
  const labelRef = useReveal()

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setActive(true); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className={styles.metrics} ref={sectionRef}>
      <div className={styles.bgStrip} />
      <div className="container">
        <div ref={labelRef} className={`reveal ${styles.labelRow}`}>
          <span className="section-label">By The Numbers</span>
          <h2 className={styles.heading}>My engineering <em>in numbers</em></h2>
        </div>

        <div className={styles.grid}>
          {metrics.map((m, i) => (
            <div key={m.label} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>{m.icon}</span>
                <span className={styles.val}><Counter value={m.value} suffix={m.suffix} active={active} /></span>
              </div>
              <span className={styles.label}>{m.label}</span>
              <span className={styles.desc}>{m.desc}</span>
              <div className={styles.bar} style={{ animationDelay: `${i * 0.15 + 0.5}s` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
