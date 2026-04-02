import { useReveal, useRevealGroup } from '../hooks/useReveal'
import styles from './About.module.css'

const skills = [
  'Embedded Systems', 'IoT Architecture', 'Edge AI', 'PCB Design',
  'Motor Control', 'Cloud Integration', 'Robotics', 'Python / Streamlit',
]

const facts = [
  { icon: '◈', label: 'Based in',     val: 'Abuja, Nigeria' },
  { icon: '◉', label: 'Currently at', val: 'INNOV8 Hub — Head of Impact Lab' },
  { icon: '✉', label: 'Email',        val: 'baloolani@gmail.com', href: 'mailto:baloolani@gmail.com' },
  { icon: '⬡', label: 'GitHub',       val: 'github.com/Olawalekaybee', href: 'https://github.com/Olawalekaybee' },
  { icon: '◎', label: 'Open to',      val: 'Freelance, Contracts & Collaborations' },
]

export default function About() {
  const labelRef = useReveal()
  const groupRef = useRevealGroup()

  return (
    <section className={styles.about} id="about">
      <div className="container">
        <div ref={labelRef} className={`reveal ${styles.labelWrap}`}>
          <span className="section-label">About Me</span>
        </div>

        <div className={styles.grid}>
          {/* Portrait */}
          <div className={styles.portraitCol}>
            <div className={styles.imgFrame}>
              {/* Wale's actual photo — transparent background PNG */}
              <img
                src="https://i.imgur.com/4sQ0tnU.png"
                alt="Olawale Kabiru Balogun"
                className={styles.img}
              />
              <div className={styles.nameCard}>
                <span className={styles.nameCardMain}>Olawale Kabiru Balogun</span>
                <span className={styles.nameCardSub}>Embedded Systems · IoT · Robotics · AI</span>
              </div>
            </div>

            <div className={styles.chips}>
              <div className={styles.chip}>
                <span className={styles.chipVal}>5+</span>
                <span className={styles.chipLabel}>Years</span>
              </div>
              <div className={styles.chip}>
                <span className={styles.chipVal}>20+</span>
                <span className={styles.chipLabel}>Projects</span>
              </div>
              <div className={styles.chip}>
                <span className={styles.chipVal}>Abuja</span>
                <span className={styles.chipLabel}>Nigeria</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div ref={groupRef} className={styles.text}>
            <h2 className={`reveal ${styles.heading}`}>
              Engineer. Builder.<br /><em>Problem solver.</em>
            </h2>

            <p className={`reveal ${styles.body}`}>
              I'm an Electrical/Electronics Engineer who lives at the intersection of hardware and
              software. My work spans the full technical depth — from reading datasheets and laying
              out PCBs to writing cloud pipelines and deploying AI models on constrained edge devices.
            </p>

            <p className={`reveal ${styles.body}`}>
              I started building circuits because I wanted things to actually <em>work</em> in the
              real world — not just on paper. That drive has taken me through designing power
              systems, writing bare-metal firmware, architecting IoT networks, and integrating
              machine learning into hardware that ships to real end users.
            </p>

            <p className={`reveal ${styles.body}`}>
              What sets me apart isn't any single skill — it's the ability to hold the whole system
              in mind at once. From voltage regulators to REST endpoints, I reason about every layer
              and make them work together without cracks.
            </p>

            <div className={`reveal ${styles.pillsRow}`}>
              {skills.map(p => (
                <span key={p} className={styles.pill}>{p}</span>
              ))}
            </div>

            <div className={`reveal ${styles.facts}`}>
              {facts.map(f => (
                <div key={f.label} className={styles.fact}>
                  <span className={styles.factIcon}>{f.icon}</span>
                  <div>
                    <span className={styles.factLabel}>{f.label}</span>
                    {f.href
                      ? <a href={f.href} target="_blank" rel="noopener noreferrer" className={styles.factLink}>{f.val}</a>
                      : <span className={styles.factVal}>{f.val}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
