import { useState, useEffect } from 'react'
import { useReveal, useRevealGroup } from '../hooks/useReveal'
import { getPublishedProjects } from '../lib/supabase'
import styles from './Projects.module.css'

// Fallback demo projects shown when Supabase isn't configured yet
const DEMO_PROJECTS = [
  {
    id: 'demo-1',
    title: 'Smart IoT Freezer Monitoring System',
    category: 'IoT · Embedded',
    year: '2024',
    tagline: 'Real-time cold storage monitoring with remote control and automatic safety cutoffs.',
    highlights: ['Temperature monitoring via Dallas sensors', '4×50kg load cell weight tracking', 'Auto AC cut-off via SSR relay', 'Real-time remote monitoring via Blynk'],
    stack: ['ESP32', 'Arduino Nano', 'Dallas Sensors', 'Load Cells', 'Blynk', 'SSR'],
    image_url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=700&q=80',
    link: '#',
    accent: 'var(--sky-400)',
  },
  {
    id: 'demo-2',
    title: 'AI-Powered Crop Monitoring Drone',
    category: 'AI · Robotics · IoT',
    year: '2024',
    tagline: 'Aerial imaging + AI analysis for precision agriculture and early disease detection.',
    highlights: ['Onboard image capture & preprocessing', 'AI-driven crop health classification', 'AWS IoT cloud transmission pipeline', 'Early disease detection at scale'],
    stack: ['Raspberry Pi 5', 'Camera Module', 'Python', 'AWS IoT', 'OpenCV', 'Edge AI'],
    image_url: 'https://images.unsplash.com/photo-1527430253228-e93688616381?w=700&q=80',
    link: '#',
    accent: 'var(--cyan-400)',
  },
  {
    id: 'demo-3',
    title: 'Industrial Temp & Motor Control System',
    category: 'Embedded · Automation',
    year: '2023',
    tagline: 'CYD touchscreen UI with SSR heating and VFD motor automation.',
    highlights: ['320×240 custom CYD touchscreen UI', 'Multi-zone SSR-controlled heating', 'VFD motor automation integration', 'GPS + internet time synchronization'],
    stack: ['CYD Display', 'ESP32', 'SSR', 'VFD', 'GPS Module'],
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&q=80',
    link: '#',
    accent: 'var(--indigo-400)',
  },
  {
    id: 'demo-4',
    title: 'Solar/Battery Hybrid Inverter',
    category: 'Power Systems · PCB',
    year: '2023',
    tagline: 'Custom hybrid inverter for refrigeration with solar and lithium battery.',
    highlights: ['26650 lithium battery pack design', 'MPPT solar charge controller', 'AC/DC dual charging system', 'Power-optimized for refrigeration loads'],
    stack: ['26650 Li Cells', 'Solar MPPT', 'AC/DC Charging', 'PCB Design', 'BMS'],
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=700&q=80',
    link: '#',
    accent: 'var(--emerald-400)',
  },
  {
    id: 'demo-5',
    title: 'Multi-Touch Sensor Mapping System',
    category: 'Embedded · Sensing',
    year: '2023',
    tagline: '28-channel capacitive sensor grid with real-time position mapping.',
    highlights: ['28 independent touch channels', 'Real-time position mapping', 'Python visualization dashboard', 'Low-latency scanning firmware'],
    stack: ['ESP32', '28-Channel ADC', 'Python', 'I2C MUX', 'Streamlit'],
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
    link: '#',
    accent: 'var(--amber-400)',
  },
  {
    id: 'demo-6',
    title: 'IoT Data Pipeline & Dashboard',
    category: 'Cloud · Visualization',
    year: '2022',
    tagline: 'End-to-end sensor data pipeline: ESP32 → SQL Server → Streamlit analytics.',
    highlights: ['Sensor-to-cloud REST pipeline', 'SQL Server time-series storage', 'Interactive Streamlit dashboard', 'Historical trend analysis'],
    stack: ['ESP32', 'REST API', 'SQL Server', 'Python', 'Streamlit', 'Pandas'],
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80',
    link: '#',
    accent: 'var(--sky-300)',
  },
]

function ProjectCard({ project, index, isFirst }) {
  const [hovered, setHovered] = useState(false)
  const stackArr = Array.isArray(project.stack)
    ? project.stack
    : (project.stack || '').split(',').map(s => s.trim()).filter(Boolean)
  const highlightsArr = Array.isArray(project.highlights)
    ? project.highlights
    : (project.highlights || '').split('\n').map(s => s.trim()).filter(Boolean)
  const accent = project.accent || 'var(--sky-400)'

  return (
    <article
      className={`reveal noise-card ${styles.card} ${isFirst ? styles.cardFeatured : ''}`}
      style={{ '--accent': accent }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.cardImg}>
        {project.video_url ? (
          <video
            src={project.video_url}
            className={styles.cardVideo}
            autoPlay muted loop playsInline
          />
        ) : (
          <img
            src={project.image_url || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80`}
            alt={project.title}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80' }}
          />
        )}
        <div className={styles.cardOverlay} />
        <div className={styles.cardMeta}>
          {project.category && <span className={styles.metaTag}>{project.category}</span>}
          {project.year && <span className={styles.metaYear}>{project.year}</span>}
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        {project.tagline && <p className={styles.cardTagline}>{project.tagline}</p>}

        {highlightsArr.length > 0 && (
          <ul className={styles.highlights}>
            {highlightsArr.slice(0, 4).map((h, i) => (
              <li key={i}><span className={styles.hlDot} />{h}</li>
            ))}
          </ul>
        )}

        {stackArr.length > 0 && (
          <div className={styles.stackRow}>
            {stackArr.slice(0, 5).map(t => (
              <span key={t} className={styles.stackTag}>{t}</span>
            ))}
            {stackArr.length > 5 && <span className={styles.stackMore}>+{stackArr.length - 5}</span>}
          </div>
        )}

        {project.link && project.link !== '#' && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.cardLink} data-cursor>
            <span>View Project</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>

      <div className={`${styles.cardGlow} ${hovered ? styles.cardGlowOn : ''}`} />
    </article>
  )
}

function SkeletonCard({ wide }) {
  return (
    <div className={`${styles.card} ${wide ? styles.cardFeatured : ''} ${styles.skeleton}`}>
      <div className={styles.skeletonImg} />
      <div className={styles.cardBody}>
        <div className={styles.skeletonLine} style={{ width: '70%', height: 22, marginBottom: 10 }} />
        <div className={styles.skeletonLine} style={{ width: '90%', height: 14, marginBottom: 6 }} />
        <div className={styles.skeletonLine} style={{ width: '60%', height: 14 }} />
      </div>
    </div>
  )
}

export default function Projects() {
  const labelRef = useReveal()
  const groupRef = useRevealGroup(0.05)
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    getPublishedProjects()
      .then(data => {
        if (data.length > 0) {
          setProjects(data)
        } else {
          setProjects(DEMO_PROJECTS)
        }
      })
      .catch(() => {
        setProjects(DEMO_PROJECTS)
        setUsingDemo(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className={styles.projects} id="projects">
      <div className="container">
        <div className={styles.header}>
          <div ref={labelRef} className="reveal">
            <span className="section-label">Featured Projects</span>
          </div>
          <h2 className={`reveal ${styles.heading}`}>
            Systems built from <em>silicon to cloud</em>
          </h2>
          <p className={`reveal ${styles.subheading}`}>
            End-to-end engineering — circuit design, firmware, connectivity, and data analytics.
          </p>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} wide={i === 0} />)}
          </div>
        ) : (
          <div ref={groupRef} className={styles.grid}>
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} isFirst={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
