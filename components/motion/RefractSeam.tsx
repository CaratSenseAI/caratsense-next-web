'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

type Variant = 'cut' | 'dispersion' | 'soft' | 'close'

const VARIANTS: Record<Variant, { angle: number; width: number; dur: number; hue: string }> = {
  // fast, hard-edged. a cutting plane. gold-dominant.
  cut: { angle: 20, width: 3, dur: 0.5, hue: 'gold' },
  // the hero transition — twice the width, full spectrum. lands where the
  // page's argument resolves, so the other three stay restrained for it.
  dispersion: { angle: 20, width: 9, dur: 1, hue: 'full' },
  // purple only, barely there
  soft: { angle: 20, width: 5, dur: 0.8, hue: 'violet' },
  // reversed direction — signals the close
  close: { angle: -20, width: 4, dur: 0.7, hue: 'violet' },
}

const GRADIENTS = {
  gold: `transparent 46%, rgb(212 175 55 / .5) 49.4%, rgb(242 206 91 / .9) 50%, rgb(212 175 55 / .5) 50.6%, transparent 54%`,
  violet: `transparent 44%, rgb(168 85 247 / .3) 48%, rgb(168 85 247 / .7) 50%, rgb(168 85 247 / .3) 52%, transparent 56%`,
  full: `transparent 40%, rgb(201 166 255 / .35) 45%, rgb(168 85 247 / .6) 48%, rgb(232 121 184 / .8) 50%, rgb(242 206 91 / .8) 52%, rgb(212 175 55 / .5) 55%, transparent 60%`,
} as const

/**
 * The connective tissue. A prism edge crosses the viewport between sections so
 * the page reads as one continuous descent rather than a stack of set pieces.
 *
 * Route A from docs/scroll-concepts/07 — CSS + clip-path, no WebGL. Compositing
 * a full-screen blended layer is not free, so the overlay only mounts while its
 * seam is in range.
 */
export function RefractSeam({ variant = 'soft' }: { variant?: Variant }) {
  const seam = useRef<HTMLDivElement>(null)
  const edge = useRef<HTMLDivElement>(null)
  const v = VARIANTS[variant]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = edge.current!
        el.style.setProperty('--p', '0')
        gsap.set(el, { opacity: 0 })

        // No tween. ScrollTrigger's own progress drives the CSS variable.
        //
        // Deliberate: `gsap.to(plainObject, { scrollTrigger })` throws inside
        // ScrollTrigger.refresh ("animation.revert(...).invalidate is not a
        // function") because a plain-object target gives it an animation whose
        // revert() is not chainable. Reading progress directly is simpler,
        // cheaper, and has no tween to keep in sync.
        const st = ScrollTrigger.create({
          trigger: seam.current,
          start: 'top 95%',
          end: 'top 5%',
          onUpdate: (self) => el.style.setProperty('--p', String(self.progress)),
          // only composite the blended layer while the seam is in range
          onToggle: ({ isActive }) =>
            gsap.to(el, { opacity: isActive ? 1 : 0, duration: 0.2, overwrite: 'auto' }),
        })

        return () => st.kill()
      })

      return () => mm.revert()
    },
    { scope: seam },
  )

  return (
    <div ref={seam} aria-hidden className="relative h-px w-full">
      <div
        ref={edge}
        className="pointer-events-none fixed inset-0 z-40 opacity-0"
        style={{ mixBlendMode: 'screen' }}
      >
        <div
          className="absolute -inset-[25%]"
          style={{
            background: `linear-gradient(90deg, ${GRADIENTS[v.hue as keyof typeof GRADIENTS]})`,
            backgroundSize: `${v.width * 11}% 100%`,
            transform: `rotate(${v.angle}deg) translateX(calc((var(--p) * 260%) - 130%))`,
            filter: 'blur(0.5px)',
          }}
        />
      </div>
    </div>
  )
}
