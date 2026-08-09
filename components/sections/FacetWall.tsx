'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'
import { CHAPTERS } from '@/lib/site'
import { Panel, TelemetryChip, DimensionLine, Eyebrow } from '@/components/ui'
import { TextFill, Reveal } from '@/components/motion/Type'

gsap.registerPlugin(DrawSVGPlugin)

/**
 * The lattice — hand-authored SVG, not CAD. Each group is one chapter's worth
 * of nodes and edges, drawn in as its chapter scrolls. By chapter six it is the
 * round-brilliant facet plan, which ties this section back to the page skeleton
 * without anyone needing to notice.
 */
const LATTICE: { edges: [number, number, number, number][]; nodes: [number, number][] }[] = [
  // 01 — one node. the bottleneck.
  { edges: [], nodes: [[300, 300]] },
  // 02 — first structure
  {
    edges: [[300, 300, 176, 208], [300, 300, 424, 208], [300, 300, 300, 444]],
    nodes: [[176, 208], [424, 208], [300, 444]],
  },
  // 03 — automation edges (these get travelling dots)
  {
    edges: [[176, 208, 424, 208], [176, 208, 300, 444], [424, 208, 300, 444]],
    nodes: [],
  },
  // 04 — the model cluster. visibly denser than the rest.
  {
    edges: [
      [424, 208, 508, 132], [508, 132, 560, 232], [560, 232, 470, 300],
      [470, 300, 424, 208], [508, 132, 470, 300], [560, 232, 424, 208],
    ],
    nodes: [[508, 132], [560, 232], [470, 300]],
  },
  // 05 — the dashboard node
  {
    edges: [[300, 444, 300, 540], [176, 208, 300, 540], [470, 300, 300, 540]],
    nodes: [[300, 540]],
  },
  // 06 — ghost nodes. unbuilt capacity, dashed.
  {
    edges: [[176, 208, 84, 140], [560, 232, 640, 160], [300, 540, 420, 590]],
    nodes: [[84, 140], [640, 160], [420, 590]],
  },
]

export function FacetWall() {
  const root = useRef<HTMLDivElement>(null)
  const [chip, setChip] = useState(CHAPTERS[0].chip)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Below 1024 the pin is dropped entirely — side-by-side pinned layouts
      // are a desktop pattern and forcing them onto a phone gives the worst
      // version of both.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const pin = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: '[data-lattice-panel]',
          pinSpacing: false,
        })
        return () => pin.kill()
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const triggers: ScrollTrigger[] = []

        // the twin wipes from photoreal to wireframe across the whole section
        const twin = ScrollTrigger.create({
          trigger: root.current,
          start: 'top 70%',
          end: 'bottom bottom',
          onUpdate: (self) =>
            document
              .querySelector<HTMLElement>('[data-twin]')
              ?.style.setProperty('--p', String(self.progress)),
        })
        triggers.push(twin)

        CHAPTERS.forEach((ch, i) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: `#chapter-${i}`,
              start: 'top 72%',
              end: 'bottom 45%',
              scrub: 1,
              onEnter: () => setChip(ch.chip),
              onEnterBack: () => setChip(ch.chip),
            },
          })
          tl.from(`#lat-${i} .edge`, { drawSVG: '0%', stagger: 0.06, ease: 'none' })
            .from(`#lat-${i} .node`, { scale: 0, opacity: 0, stagger: 0.04, ease: 'back.out(2)' }, '<0.2')
          if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
        })

        // travelling dots along chapter 03's automation edges — the only
        // non-scrubbed motion here. Cheapest possible way to make a static
        // diagram feel like a running system.
        const FLOW: [number, number, number, number][] = [
          [176, 208, 424, 208],
          [176, 208, 300, 444],
          [424, 208, 300, 444],
        ]
        const dots = FLOW.map(([x1, y1, x2, y2], i) =>
          gsap.fromTo(
            `#flow-${i}`,
            { attr: { cx: x1, cy: y1 }, opacity: 0 },
            {
              attr: { cx: x2, cy: y2 },
              opacity: 1,
              duration: 2.4,
              delay: i * 0.8,
              repeat: -1,
              repeatDelay: 0.6,
              ease: 'none',
              yoyo: false,
            },
          ),
        )

        return () => {
          triggers.forEach((t) => t.kill())
          dots.forEach((d) => d.kill())
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="build" ref={root} className="relative">
      <div className="shell">
        <div className="grid gap-x-[6%] lg:grid-cols-[42%_52%]">
          {/* left: chapters scroll */}
          <div className="order-2 lg:order-1">
            <div className="pb-16 pt-24 lg:pt-32">
              <Eyebrow index="04" className="mb-5">
                What we build
              </Eyebrow>
              <Reveal as="h2" className="t-d1 max-w-[22ch]">
                Six cuts. One system.
              </Reveal>
            </div>

            {CHAPTERS.map((ch, i) => (
              <div key={ch.n} id={`chapter-${i}`} className="border-t border-line py-14 lg:py-24">
                <p className="t-mono mb-4 text-gold">{ch.n}</p>
                <h3 className="t-d2 mb-5 max-w-[20ch] text-ink">{ch.title}</h3>
                <TextFill className="text-ink-2">{ch.body}</TextFill>
              </div>
            ))}
          </div>

          {/* right: the panel pins */}
          <div className="order-1 lg:order-2">
            <div
              data-lattice-panel
              className="flex h-[52vh] items-center justify-center lg:h-svh"
            >
              <Panel grid className="relative aspect-square w-full max-w-[34rem]">
                {/* A-07 digital twin — the photoreal warehouse becomes its own
                    wireframe as the chapters advance. Terminal's signature shot. */}
                <div data-twin className="twin absolute inset-0 opacity-[0.38]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/twin/A-07_warehouse-real.webp" alt="" className="size-full object-cover" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/twin/A-07_warehouse-wire.webp"
                    alt=""
                    aria-hidden
                    className="twin__wire size-full object-cover"
                  />
                </div>
                <div aria-hidden className="absolute inset-0 bg-void/45" />
                <svg viewBox="0 0 720 700" className="absolute inset-0 size-full p-6">
                  {LATTICE.map((g, i) => (
                    <g id={`lat-${i}`} key={i} className={i === 5 ? 'ghost' : undefined}>
                      {g.edges.map(([x1, y1, x2, y2], k) => (
                        <line
                          key={k}
                          className="edge"
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="var(--color-violet)"
                          strokeWidth="1.25"
                          opacity={i === 5 ? 0.3 : 0.55}
                          strokeDasharray={i === 5 ? '4 5' : undefined}
                        />
                      ))}
                      {g.nodes.map(([cx, cy], k) => (
                        <circle
                          key={k}
                          className="node"
                          cx={cx}
                          cy={cy}
                          r={i === 0 ? 7 : i === 4 ? 8 : 5}
                          fill={i === 0 ? 'var(--color-magenta)' : i === 4 ? 'var(--color-gold)' : 'var(--color-violet)'}
                          opacity={i === 5 ? 0.35 : 1}
                        />
                      ))}
                    </g>
                  ))}
                  {[0, 1, 2].map((i) => (
                    <circle key={i} id={`flow-${i}`} cx="176" cy="208" r="2.5" fill="var(--color-magenta)" opacity="0" />
                  ))}
                </svg>

                <div className="absolute left-6 top-16">
                  <TelemetryChip>{chip}</TelemetryChip>
                </div>

                <div className="absolute inset-x-6 bottom-6 flex flex-wrap items-end justify-between gap-4">
                  <DimensionLine label="847 orders / day" className="w-32" />
                  <DimensionLine label="11s → 0.4s" className="w-24" />
                  <DimensionLine label="16 → 1" className="w-20" />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
