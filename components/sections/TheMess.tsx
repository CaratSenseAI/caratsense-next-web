'use client'

import Image from 'next/image'
import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { jitter } from '@/lib/cn'
import { ChatBubble, FileChip, Plate, StickyNote, SheetFragment } from '@/components/artefacts'
import { SHEET_PRESETS } from '@/lib/site'

/**
 * §2 — the suspension. 400–700vh, pinned.
 *
 * Gravity leaves the desk. This is the only section where the intended feeling
 * is unease, and it holds that for a full beat before §3 resolves it.
 *
 * Built in DOM rather than as a video sequence (A-05 §Cheaper alternative):
 * the artefacts are already real nodes, which means the §2→§3 handoff has no
 * seam to hide — there was never a canvas to hand off from.
 */

const KINDS = ['chat', 'sticky', 'plate', 'file', 'sheet'] as const

const TEXTS = [
  'did u get my last msg?',
  'stock hai kya?',
  'actually make it 1.5kg sorry',
  'where is order 41',
  'kal ka order confirm hai?',
  'hello?',
  'batch no.?',
  'which plant made this',
]
const NOTES = ['STOCK CHECK???', 'Sat 2pm clash!!', 'Anjali — 1.5kg', 'call back!!', 'reorder??', 'confirm price']

/** 44 sprites, deterministically placed. Reads as 200 at this density. */
const SPRITES = Array.from({ length: 44 }, (_, i) => ({
  kind: KINDS[i % KINDS.length],
  x: Math.round((4 + (jitter(i, 0.5) + 0.5) * 92) * 100) / 100,
  y: Math.round((2 + (jitter(i + 17, 0.5) + 0.5) * 96) * 100) / 100,
  depth: Math.round((0.34 + Math.abs(jitter(i + 5, 0.62))) * 1000) / 1000,
  rot: jitter(i + 31, 16),
  text: TEXTS[i % TEXTS.length],
  note: NOTES[i % NOTES.length],
  tone: (['yellow', 'pink', 'orange'] as const)[i % 3],
}))

function Sprite({ s }: { s: (typeof SPRITES)[number] }) {
  switch (s.kind) {
    case 'chat':
      return <ChatBubble text={s.text} time="21:44" ticks={2} />
    case 'sticky':
      return <StickyNote tone={s.tone}>{s.note}</StickyNote>
    case 'file':
      return <FileChip name="Sales_Report_v2_FINAL_final.xlsx" />
    case 'sheet':
      return <SheetFragment {...SHEET_PRESETS.xl02} />
    default:
      return <Plate>₹ ?</Plate>
  }
}

export function TheMess() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-float]', { opacity: 1, y: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-float]')

        // the lift — weightless, never wind. "scatter" reads as an explosion.
        const lift = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        items.forEach((el, i) => {
          const d = Number(el.dataset.depth ?? 1)
          lift.fromTo(
            el,
            { y: 0, opacity: 0, scale: d * 0.9 },
            { y: -60 * d, opacity: 0.2 + d * 0.5, scale: d, ease: 'none', duration: 0.3 },
            i * 0.004,
          )
          // continues drifting through the hold
          lift.to(
            el,
            { y: `-=${90 * d}`, rotate: `+=${jitter(i + 91, 9)}`, ease: 'none', duration: 0.7 },
            0.3,
          )
        })

        // the desk itself sinks away as the paper leaves it
        lift.fromTo(
          '[data-desk]',
          { opacity: 0.55, scale: 1.04 },
          { opacity: 0.1, scale: 1.12, ease: 'none', duration: 0.6 },
          0,
        )

        // the sentence fills word by word across the hold. one of only four
        // places on the site that uses the Terminal text-fill.
        const split = new SplitText('[data-mess-line]', { type: 'words' })
        lift.fromTo(
          split.words,
          { opacity: 0.35 },
          { opacity: 1, stagger: 0.04, ease: 'none', duration: 0.45 },
          0.1,
        )

        return () => {
          lift.scrollTrigger?.kill()
          lift.kill()
          split.revert()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative flex h-svh items-center justify-center overflow-hidden bg-void"
    >
      {/* A-04 top-down plate — the desk the paper lifts off. Dimmed hard: it is
          the ground the section stands on, not the subject. */}
      <div aria-hidden data-desk className="pointer-events-none absolute inset-0 opacity-55">
        <Image
          src="/render/A-04_desk-top.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-void/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
      </div>

      {/* the suspension field */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SPRITES.map((s, i) => (
          <div
            key={i}
            data-float
            data-depth={s.depth.toFixed(3)}
            className="absolute w-[clamp(84px,10vw,168px)] origin-center opacity-0"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              rotate: `${s.rot}deg`,
              filter: `grayscale(1) brightness(${(0.55 + s.depth * 0.4).toFixed(3)}) blur(${((1 - s.depth) * 2.2).toFixed(2)}px)`,
              zIndex: Math.round(s.depth * 10),
            }}
          >
            <Sprite s={s} />
          </div>
        ))}
      </div>

      {/* scrim so the sentence stays legible over the desk */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(58% 42% at 50% 50%, rgb(5 3 9 / .88) 0%, rgb(5 3 9 / .55) 55%, transparent 100%)',
        }}
      />

      {/* held for one full beat. let it be uncomfortable. */}
      <div className="shell relative z-20 text-center">
        <h2
          data-mess-line
          className="t-d1 mx-auto max-w-[26ch] [text-shadow:0_2px_40px_var(--color-void)]"
        >
          Every business below was running on memory, spreadsheets, or WhatsApp before we got
          there.
        </h2>
      </div>
    </section>
  )
}
