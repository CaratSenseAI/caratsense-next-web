'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { FrameSequence } from '@/components/motion/FrameSequence'
import { Caustic, Eyebrow } from '@/components/ui'
import { jitter } from '@/lib/cn'
import { ChatBubble, FileChip, Plate, StickyNote, Badge } from '@/components/artefacts'

/**
 * §1 — the rough stone. 0–400vh, pinned.
 *
 * The camera dives into an uncut stone while the artefacts of a business run on
 * memory drift around it. The A-03 frame sequence carries the camera; the
 * artefacts are DOM sprites layered over it, which is why they can survive into
 * §2 and §3 rather than being baked into video.
 */

const ORBIT = [
  { el: <ChatBubble text="did u get my last msg?" time="21:44" ticks={2} />, x: 8, y: 22, d: 0.7 },
  { el: <ChatBubble text="stock hai kya?" time="11:03" ticks={2} />, x: 78, y: 16, d: 0.5 },
  { el: <Plate>₹ ?</Plate>, x: 14, y: 70, d: 0.9 },
  { el: <StickyNote tone="yellow">STOCK CHECK???</StickyNote>, x: 84, y: 62, d: 0.6 },
  { el: <FileChip name="Sales_Report_v2_FINAL_final.xlsx" />, x: 62, y: 82, d: 0.8 },
  { el: <Badge n={47} />, x: 26, y: 12, d: 0.45 },
  { el: <ChatBubble text="kal ka order confirm hai?" time="08:12" ticks={1} hand />, x: 68, y: 42, d: 0.75 },
  { el: <StickyNote tone="pink">Sat 2pm clash!!</StickyNote>, x: 6, y: 46, d: 0.55 },
]

export function Hero() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ delay: 0.15 })

        // headline: per-line mask reveal, decisive not draggable
        const split = new SplitText('[data-hero-line]', { type: 'lines' })
        tl.from(split.lines, { yPercent: 118, duration: 1, stagger: 0.09, ease: 'expo.out' })
          .from('[data-hero-sub]', { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out' }, '-=0.5')
          .from('[data-hero-eyebrow]', { opacity: 0, duration: 0.6 }, 0)

        // line 2 resolves to gold between 25% and 40% of the section — the only
        // gold in the first 700vh
        const goldTl = gsap.to('[data-hero-gold]', {
          color: 'var(--color-gold)',
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=40%',
            scrub: true,
          },
        })

        // the copy has to be gone before the dive fills the frame — otherwise it
        // sits unreadable over the fracture tunnel for the rest of the pin
        const copyOut = gsap.to('[data-hero-copy]', {
          opacity: 0,
          y: -40,
          filter: 'blur(6px)',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top -8%', end: 'top -34%', scrub: 1 },
        })

        // artefacts drift, then push outward past the camera as it dives
        const drift = gsap.utils.toArray<HTMLElement>('[data-orbit]').map((el, i) =>
          gsap.to(el, {
            x: `+=${jitter(i, 26)}`,
            y: `+=${jitter(i + 40, 22)}`,
            rotate: `+=${jitter(i + 80, 7)}`,
            duration: 9 + Math.abs(jitter(i, 5)),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )

        const push = gsap.to('[data-orbit]', {
          scale: 2.6,
          opacity: 0,
          filter: 'blur(14px)',
          stagger: { amount: 0.3, from: 'center' },
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=70%', scrub: 1 },
        })

        return () => {
          tl.kill()
          split.revert()
          goldTl.scrollTrigger?.kill()
          goldTl.kill()
          copyOut.scrollTrigger?.kill()
          copyOut.kill()
          drift.forEach((d) => d.kill())
          push.scrollTrigger?.kill()
          push.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative">
      <FrameSequence
        dir="/seq/A-03_hero-dive"
        count={146}
        mobileCount={94}
        poster="/render/A-01_rough-stone.webp"
        // 146 frames at 1920/q88 over 450vh = one frame per 3vh. Deliberately
        // unoptimised: this is the hero and it is meant to look expensive.
        scrollLength="450%"
      >
        <Caustic />

        {/* artefact sprites — same components §3 morphs into a dashboard */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          {ORBIT.map((o, i) => (
            <div
              key={i}
              data-orbit
              className="absolute w-[clamp(110px,12vw,190px)] origin-center"
              style={{
                left: `${o.x}%`,
                top: `${o.y}%`,
                scale: String(o.d),
                opacity: (0.28 + o.d * 0.22).toFixed(3),
                rotate: `${jitter(i, 12)}deg`,
                filter: 'grayscale(1) brightness(0.8)',
              }}
            >
              {o.el}
            </div>
          ))}
        </div>

        {/* copy */}
        <div data-hero-copy className="relative z-10 flex h-full flex-col justify-center">
          <div className="shell text-center">
            <div data-hero-eyebrow className="mb-8 flex justify-center">
              <Eyebrow>Consultative AI &amp; software studio · Mumbai</Eyebrow>
            </div>

            <h1 className="t-hero mx-auto max-w-[18ch]">
              <span data-hero-line className="block">
                Turn your business chaos
              </span>
              <span data-hero-line data-hero-gold className="block text-ink-3">
                into operational clarity
              </span>
            </h1>

            <p data-hero-sub className="t-lead mx-auto mt-9 text-ink-2">
              We uncover the bottlenecks slowing your business down and build custom AI &amp; ML,
              automation, and software systems that eliminate them.
            </p>
          </div>
        </div>

        {/* scroll cue — leaves with the copy */}
        <div data-hero-copy className="absolute inset-x-0 bottom-8 flex justify-center">
          <span className="t-micro flex items-center gap-2 text-ink-3">
            Scroll
            <svg viewBox="0 0 10 16" className="h-4 w-2.5 animate-bounce" aria-hidden>
              <path d="M5 1v13M1 10l4 4 4-4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </FrameSequence>
    </section>
  )
}
