import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}

export function useRevealGroup(threshold = 0.1) {
  const ref = useRef(null)

  useEffect(() => {
    const parent = ref.current
    if (!parent) return

    const children = parent.querySelectorAll('.reveal')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 120)
          })
          observer.unobserve(parent)
        }
      },
      { threshold }
    )

    observer.observe(parent)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
