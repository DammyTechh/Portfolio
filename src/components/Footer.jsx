import styles from './Footer.module.css'

const NAV = [
  { label: 'About',      href: '#about' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Services',   href: '#services' },
  { label: 'Stack',      href: '#stack' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
]

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/Olawalekaybee',                          icon: '⬡' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/balogun-kabiru-00b580167',       icon: '◈' },
  { label: 'Email',    href: 'mailto:baloolani@gmail.com',                                 icon: '✉' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandLogoRow}>
              <span className={styles.initials}>OKB</span>
              <span className={styles.dot} />
            </div>
            <p className={styles.brandName}>Olawale Kabiru Balogun</p>
            <p className={styles.brandRole}>Embedded Systems · IoT · Robotics · AI</p>
            <p className={styles.brandTagline}>
              Building intelligent hardware — from silicon to cloud.
            </p>
          </div>

          {/* Navigation */}
          <div className={styles.navCol}>
            <span className={styles.colLabel}>Navigation</span>
            {NAV.map(l => (
              <a key={l.href} href={l.href} className={styles.navLink}
                onClick={e => { e.preventDefault(); document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' }) }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Connect */}
          <div className={styles.navCol}>
            <span className={styles.colLabel}>Connect</span>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} className={styles.navLink}
                target="_blank" rel="noopener noreferrer">
                <span className={styles.socialIcon}>{s.icon}</span>
                {s.label}
              </a>
            ))}
            <a href="mailto:baloolani@gmail.com" className={styles.ctaBtn}>
              Let's Work Together →
            </a>
          </div>
        </div>

        {/* Bottom bar — no admin link */}
        <div className={styles.bottom}>
          <p className={styles.copy}>© {year} Olawale Kabiru Balogun · All rights reserved</p>
          <p className={styles.madeWith}>Built with precision & intent</p>
        </div>
      </div>
    </footer>
  )
}
