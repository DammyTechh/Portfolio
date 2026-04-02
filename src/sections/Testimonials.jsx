import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import styles from './Testimonials.module.css'

const testimonials = [
  {
    quote: "Olawale delivered an IoT monitoring system that exceeded every specification. His ability to bridge hardware and cloud is genuinely rare — the system has run flawlessly for 14 months with zero downtime.",
    name: 'Chukwuemeka Adeyemi', role: 'Operations Director', org: 'FreshChain Logistics, Lagos',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80',
    accent: 'var(--sky-400)',
  },
  {
    quote: "The AI-powered crop monitoring drone system Olawale built has transformed our farm management. Early disease detection alone saved us significant losses this harvest season.",
    name: 'Dr. Amina Yusuf', role: 'Head of AgriTech Research', org: 'Sahel Innovation Centre, Abuja',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80',
    accent: 'var(--cyan-400)',
  },
  {
    quote: "As a mentor, Olawale's impact on our engineering team has been transformational. He structured a full embedded systems curriculum that took our junior engineers from zero to prototype in 8 weeks.",
    name: 'Babatunde Fashola', role: 'CEO', org: 'INNOV8 Hub, Abuja',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80',
    accent: 'var(--indigo-400)',
  },
  {
    quote: "The industrial temperature and motor control system Olawale designed cut our energy waste by 23%. The CYD touchscreen interface was so intuitive that floor operators needed zero training.",
    name: 'Ngozi Okafor', role: 'Plant Manager', org: 'Vertex Industries, Onitsha',
    avatar: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=80&q=80',
    accent: 'var(--emerald-400)',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const labelRef = useReveal()
  const t = testimonials[active]
  const prev = () => setActive(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive(i => (i + 1) % testimonials.length)

  return (
    <section className={styles.section} id="testimonials">
      <div className="container">
        <div ref={labelRef} className="reveal" style={{ marginBottom: 56 }}>
          <span className="section-label">Testimonials</span>
          <h2 className={styles.heading}>What clients &amp; <em>collaborators</em> say</h2>
        </div>

        <div className={styles.carousel}>
          <div className={styles.quoteMark}>"</div>
          <div className={styles.quoteBody} key={active}>
            <p className={styles.quote}>{t.quote}</p>
            <div className={styles.author}>
              <div className={styles.avatarWrap} style={{ '--ac': t.accent }}>
                <img src={t.avatar} alt={t.name} className={styles.avatar} />
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{t.name}</span>
                <span className={styles.authorRole}>{t.role} · <em>{t.org}</em></span>
              </div>
            </div>
          </div>
          <div className={styles.controls}>
            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => setActive(i)} aria-label={`Go to testimonial ${i + 1}`} />
              ))}
            </div>
            <div className={styles.arrows}>
              <button className={styles.arrow} onClick={prev} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className={styles.arrow} onClick={next} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.previews}>
          {testimonials.map((t2, i) => (
            <button key={i}
              className={`${styles.preview} ${i === active ? styles.previewActive : ''}`}
              onClick={() => setActive(i)} style={{ '--ac': t2.accent }}>
              <img src={t2.avatar} alt={t2.name} className={styles.previewAvatar} />
              <div>
                <span className={styles.previewName}>{t2.name}</span>
                <span className={styles.previewOrg}>{t2.org}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
