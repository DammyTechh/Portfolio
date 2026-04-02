import { useReveal, useRevealGroup } from '../hooks/useReveal'
import styles from './Stack.module.css'

const categories = [
  {
    label: 'Embedded Systems', icon: '⬡', color: 'var(--sky-400)',
    items: [{ name: 'ESP32 / Arduino', level: 95 }, { name: 'Raspberry Pi 5', level: 88 }, { name: 'Real-Time Firmware', level: 85 }, { name: 'Sensor Integration', level: 92 }],
  },
  {
    label: 'IoT & Cloud', icon: '◉', color: 'var(--cyan-400)',
    items: [{ name: 'Firebase / Blynk', level: 87 }, { name: 'AWS IoT', level: 78 }, { name: 'MQTT / REST APIs', level: 90 }, { name: 'Data Logging', level: 85 }],
  },
  {
    label: 'Hardware Design', icon: '◈', color: 'var(--indigo-400)',
    items: [{ name: 'PCB Design (200+ comp)', level: 82 }, { name: 'Power Systems', level: 88 }, { name: 'SSR / VFD Control', level: 85 }, { name: 'Battery & Solar', level: 80 }],
  },
  {
    label: 'AI & Data', icon: '◎', color: 'var(--emerald-400)',
    items: [{ name: 'Edge Computing', level: 75 }, { name: 'Image Processing', level: 72 }, { name: 'Python / Streamlit', level: 83 }, { name: 'SQL / Data Pipelines', level: 80 }],
  },
]

const tools = [
  'ESP32','Arduino','Raspberry Pi','AWS IoT','Firebase','Blynk','MQTT','Python',
  'Streamlit','SQL Server','OpenCV','I2C','SPI','UART','VFD','SSR','PCB Design',
  'Solar MPPT','BMS','GPS Module','DHT22','Dallas Sensors','Load Cells','CYD Display',
  'TensorFlow Lite','C/C++','FreeRTOS','KiCad',
]

function SkillBar({ name, level, color }) {
  return (
    <div className={styles.skillRow}>
      <div className={styles.skillMeta}>
        <span className={styles.skillName}>{name}</span>
        <span className={styles.skillPct} style={{ color }}>{level}%</span>
      </div>
      <div className={styles.skillTrack}>
        <div className={styles.skillFill} style={{ '--fill': `${level}%`, '--color': color }} />
      </div>
    </div>
  )
}

export default function Stack() {
  const labelRef = useReveal()
  const groupRef = useRevealGroup(0.05)
  return (
    <section className={styles.stack} id="stack">
      <div className="container">
        <div ref={labelRef} className="reveal" style={{ marginBottom: 52 }}>
          <span className="section-label">Technical Stack</span>
          <h2 className={styles.heading}>Tools of the <em>trade</em></h2>
        </div>
        <div ref={groupRef} className={styles.catGrid}>
          {categories.map(cat => (
            <div key={cat.label} className={`reveal noise-card ${styles.catCard}`}>
              <div className={styles.catHeader}>
                <span className={styles.catIcon} style={{ color: cat.color }}>{cat.icon}</span>
                <span className={styles.catLabel}>{cat.label}</span>
              </div>
              {cat.items.map(item => <SkillBar key={item.name} {...item} color={cat.color} />)}
            </div>
          ))}
        </div>
        <div className={`reveal ${styles.toolCloud}`}>
          <p className={styles.toolCloudLabel}>Full toolkit</p>
          <div className={styles.toolRow}>
            {tools.map(t => <span key={t} className={styles.toolPill}>{t}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
