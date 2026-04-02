import { useReveal, useRevealGroup } from '../hooks/useReveal'
import styles from './Experience.module.css'

const experience = [
  {
    role: 'Head of Impact Lab — Technical',
    org: 'INNOV8 Hub', location: 'Abuja, Nigeria',
    period: '2022 — Present', type: 'Full-time',
    accent: 'var(--sky-500)',
    desc: 'Overseeing the technical operations of eight engineering labs, guiding hardware and firmware projects from concept through to working prototypes, and running structured training programs for junior engineers.',
    bullets: [
      'Designing and delivering hands-on engineering curricula for emerging hardware developers',
      'Leading prototype development across embedded systems, IoT, and robotics projects',
      'Collaborating with stakeholders to align lab output with real industry problems',
      'Mentoring engineers from schematic design through firmware to cloud integration',
    ],
  },
  {
    role: 'Embedded Systems & IoT Engineer',
    org: 'Freelance / Independent', location: 'Remote & On-site, Nigeria',
    period: '2020 — 2022', type: 'Contract',
    accent: 'var(--cyan-400)',
    desc: 'Designed and shipped end-to-end embedded and IoT solutions for clients in cold chain logistics, agriculture, and industrial automation — handling everything from schematics and PCB layout to firmware and cloud dashboards.',
    bullets: [
      'Engineered custom PCBs with 200+ component layouts for industrial environments',
      'Built IoT cold-storage monitoring systems deployed in live logistics operations',
      'Designed solar/lithium hybrid inverter systems for off-grid refrigeration',
      'Delivered SSR and VFD-based motor control automation for factory floors',
    ],
  },
  {
    role: 'Electronics Engineering Intern',
    org: 'Private Engineering Firm', location: 'Nigeria',
    period: '2018 — 2019', type: 'Internship',
    accent: 'var(--indigo-400)',
    desc: 'Gained hands-on grounding in circuit design, component testing, and basic firmware development. Assisted senior engineers on power electronics projects.',
    bullets: [
      'Assisted in schematic capture and PCB prototyping workflows',
      'Tested and characterised power supply circuits and motor drivers',
      'Wrote introductory Arduino firmware for sensor interfacing projects',
    ],
  },
]

const strengths = [
  { icon: '⬡', title: 'Full-Stack Hardware', body: 'I think in whole systems — from the voltage regulator on a PCB all the way to a REST endpoint and a live dashboard.' },
  { icon: '◈', title: 'Ships to Production', body: "I've delivered projects in live environments — cold stores, factory floors, farms — so I know what it takes to make hardware that actually holds up." },
  { icon: '◉', title: 'Clear Communicator', body: 'I can explain a VFD drive to a non-technical client and write firmware docs a junior engineer can follow without hand-holding.' },
]

export default function Experience() {
  const labelRef = useReveal()
  const groupRef = useRevealGroup(0.1)
  return (
    <section className={styles.experience} id="experience">
      <div className="container">
        <div ref={labelRef} className="reveal" style={{ marginBottom: 60 }}>
          <span className="section-label">Experience</span>
          <h2 className={styles.heading}>Where I've built<br /><em>real things</em></h2>
        </div>
        <div className={styles.layout}>
          <div ref={groupRef} className={styles.timeline}>
            {experience.map((exp, i) => (
              <div key={exp.role} className={`reveal ${styles.expItem}`}>
                <div className={styles.node} style={{ '--accent': exp.accent }}>
                  <div className={styles.nodeDot} />
                  {i < experience.length - 1 && <div className={styles.nodeLine} />}
                </div>
                <div className={`noise-card ${styles.expCard}`} style={{ '--accent': exp.accent }}>
                  <div className={styles.expMeta}>
                    <span className={styles.expPeriod}>{exp.period}</span>
                    <span className={styles.expType}>{exp.type}</span>
                  </div>
                  <h3 className={styles.expRole}>{exp.role}</h3>
                  <div className={styles.expOrg}>
                    <span className={styles.orgName}>{exp.org}</span>
                    <span className={styles.orgLoc}>· {exp.location}</span>
                  </div>
                  <p className={styles.expDesc}>{exp.desc}</p>
                  <ul className={styles.expBullets}>
                    {exp.bullets.map(b => (
                      <li key={b}><span className={styles.bmark} />{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <aside className={`reveal ${styles.sidebar}`}>
            {strengths.map(s => (
              <div key={s.title} className={styles.sideCard}>
                <div className={styles.sideIcon}>{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  )
}
