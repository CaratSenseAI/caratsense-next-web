'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { FrameSequence } from '@/components/motion/FrameSequence'
import { SPECTRUM } from '@/lib/site'
import { CONTACT } from '@/lib/contact'
import { BookCall } from '@/components/ui/BookCall'

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
              <div className="flex flex-wrap items-center justify-center gap-3">
                <BookCall />
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 rounded-full border border-line px-6 py-3.5 text-[0.9375rem] text-ink transition-colors hover:border-violet/50"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp us
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="rounded-full border border-line px-6 py-3.5 text-[0.9375rem] text-ink transition-colors hover:border-violet/50"
                >
                  Email us
                </a>
                <a
                  href={CONTACT.phoneHref}
                  className="rounded-full border border-line px-6 py-3.5 text-[0.9375rem] text-ink transition-colors hover:border-violet/50 nums"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </div>
              <p className="t-micro text-ink-3">{CONTACT.responseNote}</p>
              <p className="t-micro text-ink-3/60">{CONTACT.location}</p>
            </div>
          </div>
        </div>
      </FrameSequence>
    </section>
  )
}
