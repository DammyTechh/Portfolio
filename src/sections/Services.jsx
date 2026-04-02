import { useRef } from 'react'
import { useReveal, useRevealGroup } from '../hooks/useReveal'
import styles from './Services.module.css'

const services = [
  {
    icon: '⬡', title: 'Embedded Systems Development',
    desc: 'From hardware selection and schematic design to firmware, RTOS integration, and production-ready deployment. I write the C/C++ that talks directly to silicon.',
    tags: ['ESP32', 'Arduino', 'RPi', 'RTOS', 'C/C++'],
    color: 'var(--sky-400)', glow: 'rgba(14,165,233,0.15)',
    grad: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(14,165,233,0.03))',
  },
  {
    icon: '◉', title: 'IoT Architecture & Cloud',
    desc: 'I design full IoT pipelines — device firmware, MQTT/REST connectivity, cloud ingestion via AWS IoT or Firebase, and live dashboards that make sense of your data.',
    tags: ['AWS IoT', 'Firebase', 'MQTT', 'REST', 'Streamlit'],
    color: 'var(--cyan-400)', glow: 'rgba(6,182,212,0.15)',
    grad: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.03))',
  },
  {
    icon: '◈', title: 'PCB Design & Power Electronics',
    desc: 'Custom PCB layout for complex systems, including battery management, solar MPPT, inverter design, SSR and VFD motor drive circuits.',
    tags: ['PCB Layout', 'Power Systems', 'SSR', 'VFD', 'BMS'],
    color: 'var(--indigo-400)', glow: 'rgba(99,102,241,0.15)',
    grad: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.03))',
  },
  {
    icon: '◎', title: 'Robotics & Drone Systems',
    desc: 'Design and build of autonomous platforms — from flight controller firmware and sensor fusion to ground-based automation with computer vision.',
    tags: ['Drones', 'OpenCV', 'Servo Control', 'Automation'],
    color: 'var(--emerald-400)', glow: 'rgba(52,211,153,0.15)',
    grad: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(52,211,153,0.03))',
  },
  {
    icon: '⬢', title: 'Edge AI & Data Pipelines',
    desc: 'I deploy ML models onto constrained hardware — image classification, anomaly detection, and sensor analytics running locally without cloud dependency.',
    tags: ['Edge AI', 'Python', 'TFLite', 'OpenCV', 'Pandas'],
    color: 'var(--sky-300)', glow: 'rgba(125,211,252,0.15)',
    grad: 'linear-gradient(135deg, rgba(125,211,252,0.1), rgba(125,211,252,0.03))',
  },
  {
    icon: '◆', title: 'Technical Consulting',
    desc: 'Stuck on a hardware problem? Need a second opinion on your system architecture? I offer focused consulting for engineering teams who need embedded or IoT expertise fast.',
    tags: ['Architecture Review', 'Debugging', 'Proof of Concept', 'Advisory'],
    color: 'var(--amber-400)', glow: 'rgba(251,191,36,0.15)',
    grad: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.03))',
  },
]

function TiltCard({ service }) {
  const cardRef = useRef(null)
  const onMouseMove = e => {
    const card = cardRef.current; if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    card.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`
    card.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    card.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const onMouseLeave = () => {
    const card = cardRef.current; if (!card) return
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)'
  }
  return (
    <div ref={cardRef} className={`reveal noise-card ${styles.card}`}
      style={{ '--glow': service.glow, '--col': service.color, background: service.grad }}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className={styles.spotlight} />
      <div className={styles.iconWrap} style={{ color: service.color, boxShadow: `0 0 20px ${service.glow}` }}>
        {service.icon}
      </div>
      <h3 className={styles.cardTitle}>{service.title}</h3>
      <p className={styles.cardDesc}>{service.desc}</p>
      <div className={styles.tags}>
        {service.tags.map(t => (
          <span key={t} className={styles.tag} style={{ borderColor: service.color + '55', color: service.color }}>{t}</span>
        ))}
      </div>
      <div className={styles.corner} />
    </div>
  )
}

export default function Services() {
  const labelRef = useReveal()
  const groupRef = useRevealGroup(0.05)
  return (
    <section className={styles.services} id="services">
      <div className="container">
        <div ref={labelRef} className="reveal" style={{ marginBottom: 56 }}>
          <span className="section-label">What I Do</span>
          <h2 className={styles.heading}>Services &amp; <em>Expertise</em></h2>
          <p className={styles.sub}>Hire me for a specific layer or bring me in across the whole stack — from silicon to cloud.</p>
        </div>
        <div ref={groupRef} className={styles.grid}>
          {services.map(s => <TiltCard key={s.title} service={s} />)}
        </div>
      </div>
    </section>
  )
}
