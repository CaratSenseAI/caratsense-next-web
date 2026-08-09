'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { FrameSequence } from '@/components/motion/FrameSequence'
import { SPECTRUM } from '@/lib/site'

/**
 * §8 — See Beyond. Pinned.
 *
 * A-09 supplies the gem: a brilliant cut with white light entering left and a
 * real dispersion fan exiting right, rotating to edge-on at mid-clip.
 *
 * The photograph's spectrum is a literal rainbow, which breaks the violet→gold
 * rule in design-language.md §3. Kept anyway — it is what a cut stone actually
 * does, and drawing synthetic violet bands over a photoreal rainbow would fight
 * it. The brand carries in the labels instead: gold bullets, ink text.
 */
export function SeeBeyond() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-band], [data-tagline], [data-cta]', { opacity: 1, x: 0, y: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 4,
            scrub: 1,
          },
        })

        // the answers arrive along the dispersion, one at a time
        tl.from('[data-band]', { opacity: 0, x: -18, stagger: 0.06, duration: 0.1 }, 0.3)
          .from('[data-tagline]', { opacity: 0, y: 30, duration: 0.16, ease: 'expo.out' }, 0.62)
          .from('[data-cta]', { opacity: 0, y: 16, duration: 0.12 }, 0.72)

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
    <section id="contact" ref={root} className="relative">
      <FrameSequence
        dir="/seq/A-09_gem"
        count={80}
        mobileCount={80}
        poster="/render/A-09_gem-spectrum.webp"
        scrollLength="400%"
        fit="contain"
      >
        {/* floor scrim — the gem is the brightest thing on the site and the
            tagline has to sit over its lower half */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[52%]"
          style={{ background: 'linear-gradient(to top, var(--color-void) 12%, rgb(5 3 9 / .82) 42%, transparent 100%)' }}
        />
        {/* the five answers, ranged along the exit side of the dispersion */}
        <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-end pr-[6vw] md:flex">
          <ul className="space-y-3.5">
            {SPECTRUM.map((b) => (
              <li
                key={b.label}
                data-band
                className="flex items-center gap-3 text-[clamp(0.9375rem,1.2vw,1.125rem)] text-ink"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-gold" />
                {b.label}
              </li>
            ))}
          </ul>
        </div>

        {/* one input, on the entry side */}
        <div className="pointer-events-none absolute inset-y-0 left-[6vw] z-10 hidden items-center md:flex">
          <p className="t-mono max-w-[12ch] rounded border border-line bg-void/70 px-2.5 py-1.5 text-ink-3 backdrop-blur-md">One input</p>
        </div>

        <div className="relative z-20 flex h-full flex-col items-center justify-end pb-[7vh]">
          <div className="shell text-center">
            <h2 data-tagline className="t-hero text-gold">
              See beyond.
            </h2>

            <div data-cta className="mt-10 flex flex-col items-center gap-5">
              <a
                href="mailto:hello@caratsense.in"
                className="group flex items-center gap-3 rounded-full bg-violet-deep px-7 py-4 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet"
              >
                Connect with us
                <svg
                  viewBox="0 0 12 12"
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
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
      </FrameSequence>
    </section>
  )
}
