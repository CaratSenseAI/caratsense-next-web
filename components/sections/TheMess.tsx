'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { FrameSequence } from '@/components/motion/FrameSequence'

/**
 * §2 — the suspension. Pinned.
 *
 * Gravity leaves the desk. The A-05 sequence carries it: the paper lifts off the
 * same A-04 desk plate §2 used to show statically, hangs suspended, then rotates
 * flat and aligns into a grid — which is the hand-off into §3's dashboard.
 *
 * The headline fades out before the grid forms. Once the frame fills with white
 * paper there is no scrim strong enough to keep light text readable over it, so
 * the copy leaves rather than fights.
 */
export function TheMess() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // one of only four places on the site that uses the Terminal text-fill
        const split = new SplitText('[data-mess-line]', { type: 'words' })

        // Driven by a timeline on the SAME geometry as the frame sequence.
        // Percentage start/end values are relative to viewport height, not to
        // the pin, so on a 450% pin they land far too early — the copy was
        // gone by 15% of the section.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 4.5,
            scrub: 1,
          },
        })

        tl.fromTo(
          split.words,
          { opacity: 0.32 },
          { opacity: 1, stagger: 0.04, ease: 'none', duration: 0.22 },
          0,
        )
        // holds through the suspension, then leaves before the paper flattens
        // into the bright grid — no scrim keeps light text readable over that
        tl.to('[data-mess-copy]', { opacity: 0, y: -30, filter: 'blur(6px)', duration: 0.14 }, 0.58)

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
          split.revert()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative">
      <FrameSequence
        dir="/seq/A-05_paper-storm"
        count={153}
        mobileCount={102}
        poster="/render/A-04_desk-top-poster.webp"
        scrollLength="450%"
      >
        {/* scrim — the plate is warm and busy under the copy */}
        <div
          aria-hidden
          data-mess-copy
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'radial-gradient(60% 44% at 50% 50%, rgb(5 3 9 / .9) 0%, rgb(5 3 9 / .6) 55%, transparent 100%)',
          }}
        />

        <div className="relative z-20 flex h-full items-center">
          <div data-mess-copy className="shell text-center">
            <h2 data-mess-line className="t-d1 mx-auto max-w-[26ch]">
              Every business below was running on memory, spreadsheets, or WhatsApp before we got
              there.
            </h2>
          </div>
        </div>
      </FrameSequence>
    </section>
  )
}
