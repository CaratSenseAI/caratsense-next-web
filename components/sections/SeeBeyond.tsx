'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'
import { SPECTRUM } from '@/lib/site'
import { Caustic } from '@/components/ui'

gsap.registerPlugin(DrawSVGPlugin)

/**
 * §8 — See Beyond. 2900–3250vh, pinned.
 *
 * A single beam enters, refracts, and exits as a labelled spectrum. One input,
 * every answer — literally what a cut gemstone does, literally what a system
 * does.
 *
 * The spectrum is SVG, not generated: five correctly-spelled labels at small
 * size is a fight image models lose, and real <text> is selectable and
 * translatable. The gem still (A-09) drops in behind it.
 */
export function SeeBeyond() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('#beam, .band', { drawSVG: '100%' })
        gsap.set('.band-label, [data-tagline], [data-cta]', { opacity: 1, y: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=320%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.from('#beam', { drawSVG: '0%', ease: 'none', duration: 0.8 })
          .from('.band', { drawSVG: '0%', stagger: 0.08, ease: 'none', duration: 0.8 }, '>-0.15')
          .from('.band-label', { opacity: 0, x: -10, stagger: 0.08, duration: 0.4 }, '<0.25')
          .from('[data-tagline]', { opacity: 0, y: 26, duration: 0.7, ease: 'expo.out' }, '>-0.1')
          .from('[data-cta]', { opacity: 0, y: 16, duration: 0.5 }, '<0.2')

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="contact" className="relative">
      <div ref={root} className="relative flex h-svh flex-col items-center justify-center overflow-hidden">
        <Caustic />

        {/* refraction diagram */}
        <div className="shell relative w-full">
          <svg
            viewBox="0 0 1200 620"
            className="mx-auto w-full max-w-[68rem]"
            aria-label="One input, every answer"
          >
            {/* the stone — A-09 render composites behind this; the facet outline
                keeps the section legible on its own */}
            <g opacity="0.9">
              <path
                d="M600 232 L668 292 L640 380 L560 380 L532 292 Z"
                fill="none"
                stroke="var(--color-violet)"
                strokeWidth="1.25"
              />
              <path
                d="M532 292 L668 292 M600 232 L560 380 M600 232 L640 380 M560 380 L668 292 M640 380 L532 292"
                fill="none"
                stroke="var(--color-violet)"
                strokeWidth="0.75"
                opacity="0.5"
              />
            </g>

            {/* white light in */}
            <line
              id="beam"
              x1="40"
              y1="310"
              x2="530"
              y2="310"
              stroke="#ffffff"
              strokeWidth="1.75"
            />

            {/* spectrum out — violet→gold ramp, not a literal rainbow */}
            {SPECTRUM.map((b) => (
              <g key={b.label}>
                <path
                  className="band"
                  d={`M670 310 L810 ${b.y} L1000 ${b.y}`}
                  stroke={b.c}
                  strokeWidth="1.75"
                  fill="none"
                />
                <text
                  className="band-label"
                  x="1016"
                  y={b.y + 5}
                  fill={b.c}
                  fontSize="15"
                  letterSpacing="0.02em"
                  fontFamily="var(--font-sans)"
                >
                  {b.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="shell relative mt-4 text-center md:-mt-4">
          <h2 data-tagline className="t-hero text-gold">
            See beyond.
          </h2>

          <div data-cta className="mt-10 flex flex-col items-center gap-5">
            <a
              href="mailto:hello@caratsense.in"
              className="group flex items-center gap-3 rounded-full bg-violet-deep px-7 py-4 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet"
            >
              Connect with us
              <svg viewBox="0 0 12 12" className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden>
                <path
                  d="M1 6h9M6.5 2 10.5 6l-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <p className="t-micro text-ink-3">hello@caratsense.in · Mumbai</p>
          </div>
        </div>
      </div>
    </section>
  )
}
