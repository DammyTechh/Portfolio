import { useState } from 'react'
import { useReveal, useRevealGroup } from '../hooks/useReveal'
import styles from './Contact.module.css'

const socials = [
  {
    label: 'Email',
    value: 'baloolani@gmail.com',
    href: 'mailto:baloolani@gmail.com',
    icon: '✉',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/balogun-kabiru-00b580167',
    href: 'https://www.linkedin.com/in/balogun-kabiru-00b580167',
    icon: '◈',
  },
  {
    label: 'GitHub',
    value: 'github.com/Olawalekaybee',
    href: 'https://github.com/Olawalekaybee',
    icon: '⬡',
  },
]

export default function Contact() {
  const labelRef = useReveal()
  const groupRef = useRevealGroup(0.1)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = e => {
    e.preventDefault()
    // Opens mail client with pre-filled content
    const body = encodeURIComponent(`Hi Olawale,\n\n${form.message}\n\n— ${form.name}`)
    const subject = encodeURIComponent(form.subject || 'Project Inquiry')
    window.open(`mailto:baloolani@gmail.com?subject=${subject}&body=${body}`)
    setSent(true)
  }

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.topBar} />
      <div className="container">
        <div ref={labelRef} className="reveal" style={{ marginBottom: 60 }}>
          <span className="section-label">Get In Touch</span>
          <h2 className={styles.heading}>
            Let's build something<br /><em>together</em>
          </h2>
          <p className={styles.sub}>
            Have a project that needs embedded, IoT, or robotics expertise? I'm available for
            freelance contracts, consulting, and long-term collaborations.
          </p>
        </div>

        <div ref={groupRef} className={styles.grid}>
          {/* Info side */}
          <div className={styles.info}>
            <p className={`reveal ${styles.infoText}`}>
              Whether you need firmware written from scratch, a PCB designed for production,
              an IoT system architected end-to-end, or a smart second opinion on your
              hardware — reach out and let's talk.
            </p>

            <div className={`reveal ${styles.socialsGrid}`}>
              {socials.map(s => (
                <a key={s.label} href={s.href} className={styles.socialCard}
                  target="_blank" rel="noopener noreferrer" data-cursor>
                  <span className={styles.socialIcon}>{s.icon}</span>
                  <div>
                    <span className={styles.socialLabel}>{s.label}</span>
                    <span className={styles.socialVal}>{s.value}</span>
                  </div>
                  <svg className={styles.socialArrow} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>

            <div className={`reveal ${styles.availBadge}`}>
              <span className={styles.availDot} />
              <span>Available for new work right now</span>
            </div>
          </div>

          {/* Form side */}
          <div className={`reveal ${styles.formWrap}`}>
            {sent ? (
              <div className={styles.success}>
                <span className={styles.successIcon}>◉</span>
                <h3>Opening your mail app…</h3>
                <p>Your message details are pre-filled. Just hit send in your email client.</p>
                <button className={styles.resetBtn}
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
                  Send another
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label>Your Name</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
                  </div>
                  <div className={styles.field}>
                    <label>Your Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com" required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>What are you working on?</label>
                  <input name="subject" value={form.subject} onChange={handleChange}
                    placeholder="e.g. IoT system for cold storage, PCB design for drone…" required />
                </div>
                <div className={styles.field}>
                  <label>Tell me more</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Describe your project — timeline, budget, and what you need from me…"
                    rows={5} required />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  <span>Send Message</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
