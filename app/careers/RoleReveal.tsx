'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * Scroll reveal for the careers page. Kept as a thin client wrapper so the page
 * itself stays a server component and the role copy is server-rendered — it is
 * a job posting, so it needs to be indexable.
 */
export function RoleReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const t = gsap.from('[data-reveal]', {
          opacity: 0,
          y: 18,
          duration: 0.7,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 80%' },
        })
        return () => {
          t.scrollTrigger?.kill()
          t.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return <div ref={root}>{children}</div>
}
