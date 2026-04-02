import { useState, useEffect } from 'react'
import { getCV } from '../lib/supabase'
import styles from './Navbar.module.css'

const LINKS = [
  { label: 'About',           href: '#about' },
  { label: 'Projects',        href: '#projects' },
  { label: 'Services',        href: '#services' },
  { label: 'Stack',           href: '#stack' },
  { label: 'Experience',      href: '#experience' },
  { label: 'Certifications',  href: '#certifications' },
  { label: 'Contact',         href: '#contact' },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [activeHref, setActiveHref] = useState('')
  const [scrollPct,  setScrollPct]  = useState(0)
  const [cvUrl,      setCvUrl]      = useState('/cv.pdf') // fallback
  const [cvLabel,    setCvLabel]    = useState('Download CV')

  // Fetch live CV URL from Supabase
  useEffect(() => {
    getCV()
      .then(data => {
        if (data?.file_url) { setCvUrl(data.file_url); setCvLabel(data.label || 'Download CV') }
      })
      .catch(() => {}) // silently fall back to /cv.pdf
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const winH = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(winH > 0 ? (window.scrollY / winH) * 100 : 0)
      setScrolled(window.scrollY > 60)
      let current = ''
      for (const link of LINKS) {
        const el = document.querySelector(link.href)
        if (el && el.getBoundingClientRect().top <= 120) current = link.href
      }
      setActiveHref(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNav = href => {
    setMenuOpen(false)
    // Skip scroll for certifications if section is hidden (no certs yet)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className={styles.progressBar} style={{ width: `${scrollPct}%` }} />

      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <a className={styles.logo} href="#hero"
            onClick={e => { e.preventDefault(); handleNav('#hero') }}>
            <span className={styles.logoMark}>OKB</span>
            <span className={styles.logoDot} />
          </a>

          <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
            {LINKS.map((link, i) => (
              <li key={link.href} style={{ '--li': i }}>
                <button
                  onClick={() => handleNav(link.href)}
                  className={`${styles.link} ${activeHref === link.href ? styles.linkActive : ''}`}
                >
                  <span className={styles.linkNum}>0{i + 1}</span>
                  {link.label}
                  {activeHref === link.href && <span className={styles.linkActiveDot} />}
                </button>
              </li>
            ))}
          </ul>

          <a href={cvUrl} className={styles.cvBtn} target="_blank" rel="noopener noreferrer" download>
            {cvLabel}
          </a>

          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </>
  )
}
