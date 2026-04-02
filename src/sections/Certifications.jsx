import { useState, useEffect } from 'react'
import { useReveal, useRevealGroup } from '../hooks/useReveal'
import { getPublishedCerts } from '../lib/supabase'
import styles from './Certifications.module.css'

function CertCard({ cert }) {
  const dateStr = cert.issued_date
    ? new Date(cert.issued_date + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : null
  const expiryStr = cert.expiry_date
    ? new Date(cert.expiry_date + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : null

  return (
    <div className={`reveal ${styles.card}`}>
      <div className={styles.cardTop}>
        {cert.image_url
          ? <img src={cert.image_url} alt={cert.issuer} className={styles.badge} />
          : <div className={styles.badgePlaceholder}><span>🏅</span></div>
        }
        {cert.credential_url && (
          <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
            className={styles.verifyBtn} data-cursor>
            Verify ↗
          </a>
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.certTitle}>{cert.title}</h3>
        <p className={styles.certIssuer}>{cert.issuer}</p>

        <div className={styles.certMeta}>
          {dateStr && (
            <span className={styles.metaItem}>
              <span className={styles.metaIcon}>◈</span>
              Issued {dateStr}
            </span>
          )}
          {expiryStr && (
            <span className={styles.metaItem}>
              <span className={styles.metaIcon}>◎</span>
              Expires {expiryStr}
            </span>
          )}
          {cert.credential_id && (
            <span className={styles.metaItem}>
              <span className={styles.metaIcon}>⬡</span>
              ID: {cert.credential_id}
            </span>
          )}
        </div>
      </div>

      <div className={styles.cardGlow} />
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`}>
      <div className={styles.skeletonBadge} />
      <div className={styles.cardBody}>
        <div className={styles.skeletonLine} style={{ width: '75%', height: 18, marginBottom: 8 }} />
        <div className={styles.skeletonLine} style={{ width: '50%', height: 13 }} />
      </div>
    </div>
  )
}

export default function Certifications() {
  const labelRef = useReveal()
  const groupRef = useRevealGroup(0.05)
  const [certs,   setCerts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublishedCerts()
      .then(setCerts)
      .catch(() => setCerts([]))
      .finally(() => setLoading(false))
  }, [])

  // Don't render the section at all if there are no certs and not loading
  if (!loading && certs.length === 0) return null

  return (
    <section className={styles.section} id="certifications">
      <div className="container">
        <div ref={labelRef} className="reveal" style={{ marginBottom: 56 }}>
          <span className="section-label">Certifications</span>
          <h2 className={styles.heading}>
            Professional <em>credentials</em>
          </h2>
          <p className={styles.sub}>
            Verified certifications and professional qualifications.
          </p>
        </div>

        {loading ? (
          <div ref={groupRef} className={styles.grid}>
            {Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div ref={groupRef} className={styles.grid}>
            {certs.map(cert => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
