import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId, W, H
    const particles = []
    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    const init = () => {
      resize()
      particles.length = 0
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.4 + 0.1,
        })
      }
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(56,189,248,${p.alpha})`; ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    init(); draw()
    window.addEventListener('resize', init)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init) }
  }, [])

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Signal lost</h1>
        <p className={styles.body}>
          This page doesn't exist — like a packet that never arrived.
        </p>
        <Link to="/" className={styles.btnHome}>← Back to Portfolio</Link>
      </div>
    </div>
  )
}
