'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { PANELS, SHEET_PRESETS, type PanelDef } from '@/lib/site'
import {
  ChatBubble,
  SheetFragment,
  FileChip,
  AlertRow,
  Plate,
  StickyNote,
} from '@/components/artefacts'
import { PanelChart } from '@/components/artefacts/Charts'
import { Eyebrow } from '@/components/ui'

gsap.registerPlugin(DrawSVGPlugin)

/**
 * §3 — Sixteen Problems, One Screen. Named after case study 03.
 *
 * The resolved dashboard is the real DOM layout: every panel is a CSS grid item
 * at its final position, always. The scattered state is expressed purely as a
 * transform away from that, measured on mount, and scroll tweens it back to
 * identity.
 *
 * Deliberately NOT GSAP Flip. Flip's `absolute: true` repositions elements
 * against their offsetParent, which fights ScrollTrigger's pin transform and
 * lands panels hundreds of pixels off. It also forces
 * `invalidateOnRefresh: false`, because Flip replaces revert() on its timeline
 * with a non-chainable function (Flip.js:870) and ScrollTrigger.refresh() then
 * throws. Measuring the delta ourselves is ~20 lines, transform-only, and exact.
 */

/** 6 columns × 6 rows, hand-assigned. "rowStart / colStart / rowEnd / colEnd" */
const GRID: Record<number, string> = {
  12: '1 / 1 / 3 / 2',
  15: '3 / 1 / 5 / 2',
  11: '5 / 1 / 7 / 2',
  1: '1 / 2 / 2 / 7',
  5: '2 / 2 / 3 / 4',
  8: '2 / 4 / 3 / 5',
  7: '2 / 5 / 3 / 6',
  2: '2 / 6 / 3 / 7',
  4: '3 / 2 / 4 / 5',
  10: '4 / 2 / 5 / 5',
  14: '5 / 2 / 6 / 5',
  13: '6 / 2 / 7 / 5',
  6: '3 / 5 / 5 / 7',
  9: '5 / 5 / 6 / 7',
  3: '6 / 5 / 7 / 7',
}

/** Mobile drops to 8 panels in one column — not a scaled-down desktop. */
const MOBILE_PANELS = [1, 5, 4, 6, 8, 2, 3, 16]

function Before({ p }: { p: PanelDef }) {
  const b = p.before as Record<string, never>
  switch (p.kind) {
    case 'chat':
      return <ChatBubble text={b.text} time={b.time} ticks={b.ticks} out />
    case 'sheet':
      return <SheetFragment {...SHEET_PRESETS[b.preset as unknown as 'xl01']} />
    case 'file':
      return <FileChip name={b.name} />
    case 'alert':
      return <AlertRow label={b.label} sub={b.sub} />
    case 'sticky':
      return <StickyNote tone={b.tone}>{b.text}</StickyNote>
    default:
      return (
        <Plate tone="muted" className="h-full">
          <span className={p.id === 16 ? 'text-[0.8125rem] leading-snug' : ''}>{b.value}</span>
        </Plate>
      )
  }
}

function After({ p }: { p: PanelDef }) {
  const value = (
    <span
      className={cn(
        'shrink-0 truncate text-[clamp(0.9375rem,1.4vw,1.375rem)] leading-none nums',
        p.after.gold ? 'text-gold' : 'text-ink',
      )}
    >
      {p.after.value}
    </span>
  )

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden rounded-xl border border-line bg-surface px-3.5 py-2.5">
      <span className="t-micro shrink-0 truncate text-ink-3">{p.after.label}</span>
      {/* spacer takes the slack; the chart stays chart-sized and sits with the
          value it belongs to, however tall the tile is */}
      <span className="min-h-0 flex-1" />
      {p.after.chart && p.after.chartInline ? (
        <div className="flex shrink-0 items-end justify-between gap-6">
          {value}
          <PanelChart chart={p.after.chart} gold={p.after.gold} className="w-auto flex-1" />
        </div>
      ) : (
        <>
          {/* the chart is the only shrinkable child, so on the short KPI row it
              squeezes to a sparkline instead of pushing the value out */}
          {p.after.chart && <PanelChart chart={p.after.chart} gold={p.after.gold} />}
          {value}
        </>
      )}
    </div>
  )
}

export function SixteenToOne() {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const stage = root.current!
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-panel]', { clearProps: 'transform,filter' })
        gsap.set('[data-before]', { opacity: 0 })
        gsap.set('[data-after]', { opacity: 1 })
        gsap.set('[data-frame]', { opacity: 0 })
        // charts render at their final state; nothing draws, nothing pulses
        if (counter.current) counter.current.textContent = '1'
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', stage)

        /** Express each panel's scattered pose as a delta from its grid slot. */
        const scatter = () => {
          const sr = stage.getBoundingClientRect()
          panels.forEach((el) => {
            const id = Number(el.dataset.id)
            const def = PANELS.find((p) => p.id === id)
            if (!def) return
            gsap.set(el, { x: 0, y: 0, rotate: 0, scale: 1 })
            const r = el.getBoundingClientRect()
            if (!r.width) return

            // target scattered centre, in stage coordinates
            const tx = (parseFloat(def.pos.left) / 100) * sr.width
            const ty = (parseFloat(def.pos.top) / 100) * sr.height
            // current grid-slot centre, same coordinate space
            const gx = r.left - sr.left + r.width / 2
            const gy = r.top - sr.top + r.height / 2

            const sc = id === 16 ? 0.5 : def.pos.scale
            gsap.set(el, {
              x: tx - gx,
              y: ty - gy,
              rotate: def.pos.rot,
              scale: sc,
              filter: 'grayscale(1) brightness(0.85)',
            })
            // counter-scale the artefact: the cell grows around it, the note
            // itself stays the size a note should be
            gsap.set(el.querySelector('[data-before] > div'), { scale: 1 / sc })
          })
        }

        gsap.set('[data-after]', { opacity: 0 })
        gsap.set('[data-frame]', { opacity: 1 })
        scatter()

        const tl = gsap.timeline({ paused: true })

        // converge — every transform back to identity. rotate landing on
        // exactly 0 is most of the satisfaction.
        tl.to(
          panels,
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            filter: 'grayscale(0) brightness(1)',
            duration: 1,
            ease: 'power2.inOut',
            stagger: { amount: 0.4, from: 'random' },
          },
          0,
        )

        // content swaps mid-flight while everything is still moving, so the cut
        // is invisible — you only notice afterwards that the question became an
        // answer.
        tl.to('[data-before] > div', { scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
        tl.to('[data-before]', { opacity: 0, duration: 0.12 }, 0.6)
        tl.to('[data-after]', { opacity: 1, duration: 0.12 }, 0.64)

        // panel 16 dissolves; the frame it leaves behind holds the other fifteen
        tl.to('[data-frame]', { opacity: 0, duration: 0.15 }, 0.55)

        // charts draw as the tiles land. On the same scrubbed timeline rather
        // than a one-shot on entry, so scrolling back un-draws them and the
        // section is identical every pass — no "already played" state to get
        // out of sync with the pin.
        tl.from('.ch-line', { drawSVG: '0%', duration: 0.3, ease: 'none', stagger: 0.012 }, 0.66)
          .from('.ch-area', { opacity: 0, duration: 0.25 }, 0.7)
          .from(
            '.ch-bar',
            { scaleY: 0, duration: 0.28, ease: 'power2.out', stagger: 0.006 },
            0.66,
          )
          .from(
            '.ch-ring',
            { drawSVG: '0%', duration: 0.34, ease: 'power2.out', stagger: 0.02 },
            0.66,
          )
          .from(
            '.ch-track',
            { scaleX: 0, duration: 0.26, ease: 'power2.out', stagger: 0.008 },
            0.68,
          )
          .from('.ch-dot', { scale: 0, duration: 0.2, ease: 'back.out(3)' }, 0.82)

        const st = ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 2.5,
          pin: true,
          scrub: 1,
          animation: tl,
          onRefresh: () => {
            if (tl.progress() < 0.02) scatter()
          },
          onUpdate: (self) => {
            if (!counter.current) return
            const n = Math.round(16 - Math.min(1, self.progress / 0.62) * 15)
            counter.current.textContent = String(Math.max(1, Math.min(16, n)))
          },
        })

        // the one thing that never stops: a slow pulse on each sparkline tip.
        // A dashboard that is completely still reads as a screenshot.
        const pulse = gsap.to('.ch-dot', {
          scale: 2.1,
          opacity: 0.35,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: { each: 0.4, from: 'random' },
        })

        return () => {
          st.kill()
          tl.kill()
          pulse.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="proof" className="relative">
      <div
        ref={root}
        className="relative isolate grid h-svh w-full gap-2.5 overflow-hidden p-4 md:gap-3 md:p-6"
        style={{
          gridTemplateColumns: 'minmax(110px,0.9fr) repeat(5, minmax(0,1fr))',
          gridTemplateRows: '66px 88px repeat(4, minmax(0,1fr))',
        }}
      >
        {/* the frame panel 16 leaves behind: what lived in one person's head is
            now the container holding everything else */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2 rounded-2xl border border-line md:inset-4"
        />

        <div className="pointer-events-none absolute bottom-7 right-7 z-20 md:bottom-10 md:right-11">
          <Eyebrow>
            <span ref={counter} className="text-ink nums">
              16
            </span>
            <span className="ml-1.5">systems</span>
          </Eyebrow>
        </div>

        {PANELS.filter((p) => p.id !== 16).map((p) => (
          <article
            key={p.id}
            data-panel
            data-id={p.id}
            className={cn(
              'relative origin-center',
              !MOBILE_PANELS.includes(p.id) && 'hidden md:block',
            )}
            style={{ gridArea: GRID[p.id] }}
          >
            <div data-before className="absolute inset-0 grid place-items-center">
              <div className="w-[168px] max-w-full origin-center">
                <Before p={p} />
              </div>
            </div>
            <div data-after className="absolute inset-0 opacity-0">
              <After p={p} />
            </div>
          </article>
        ))}

        {/* panel 16 rides along as a normal panel, then dissolves */}
        <article
          data-panel
          data-frame
          data-id={16}
          className="relative z-10 origin-center"
          style={{ gridArea: '4 / 3 / 5 / 5' }}
        >
          <div data-before className="absolute inset-0 grid place-items-center">
            <div className="w-[168px] max-w-full origin-center">
              <Before p={PANELS[15]} />
            </div>
          </div>
        </article>
      </div>

      <div className="shell relative z-10 pb-24 pt-10 text-center md:pb-32">
        <p className="t-mono text-ink-3">Sixteen problems. One screen.</p>
      </div>
    </section>
  )
}
