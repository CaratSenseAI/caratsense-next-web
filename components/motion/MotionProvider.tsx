'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { Flip } from 'gsap/Flip'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Observer } from 'gsap/Observer'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  Flip,
  SplitText,
  DrawSVGPlugin,
  Observer,
)

/**
 * Must wrap the whole page, and must create ScrollSmoother BEFORE any pinned
 * ScrollTrigger exists — otherwise pins land at the wrong scroll position, and
 * typically only in production, only after images load.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // A single long frame must not desync every scrub.
    gsap.ticker.lagSmoothing(500, 33)

    if (process.env.NODE_ENV === 'development') {
      Object.assign(window, { __gsap: gsap, __ScrollTrigger: ScrollTrigger })
    }

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        normalizeScroll: true,
        // above ~1.6 this stops feeling premium and starts feeling laggy
      })
      // ScrollSmoother owns scrolling, so window.scrollTo does not drive it.
      // Exposed so visual tests and debugging can seek deterministically.
      ;(window as unknown as { __smoother?: ScrollSmoother }).__smoother = smoother
      return () => smoother.kill()
    })

    return () => mm.revert()
  }, [])

  /**
   * Fonts and images change layout height after ScrollTrigger has measured.
   * This is the single most common cause of "the pin is off by 200px".
   */
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 0)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => clearTimeout(t)
  }, [])

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content">{children}</div>
    </div>
  )
}
