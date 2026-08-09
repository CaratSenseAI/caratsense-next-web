'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { Eyebrow, TelemetryChip } from '@/components/ui'
import { fixHeading, splitParagraph, type CaseStudy } from '@/lib/caseStudies'
import type { SectionItem } from '@/data/caseStudiesFullData'

/* ============================================================
   Hero — A-08's photoreal plate becomes its own wireframe as you
   scroll into the piece. Same two-image + CSS mask trick as §4.
   ============================================================ */

export function CsHero({ study }: { study: CaseStudy }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText('[data-cs-title]', { type: 'lines' })
        const tl = gsap.timeline({ delay: 0.15 })
        tl.from(split.lines, { yPercent: 118, duration: 0.95, stagger: 0.08, ease: 'expo.out' })
          .from('[data-cs-meta]', { opacity: 0, y: 14, duration: 0.6 }, '-=0.55')
          .from('[data-cs-problem]', { opacity: 0, y: 14, duration: 0.6 }, '-=0.4')

        // photoreal → wireframe as the hero leaves
        const wipe = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) =>
            root.current?.querySelector<HTMLElement>('[data-twin]')?.style.setProperty(
              '--p',
              String(self.progress),
            ),
        })

        const park = gsap.to('[data-cs-plate]', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })

        return () => {
          tl.kill()
          split.revert()
          wipe.kill()
          park.scrollTrigger?.kill()
          park.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <header ref={root} className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      <div data-cs-plate className="absolute inset-x-0 top-0 -z-10 h-[86vh]">
        <div data-twin className="twin size-full">
          <Image
            src={`/case-studies/hero-${study.id}.webp`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/case-studies/hero-${study.id}-wire.webp`}
            alt=""
            aria-hidden
            className="twin__wire size-full object-cover"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/80 to-void"
        />
      </div>

      <div className="shell">
        <Link
          href="/#work"
          className="t-micro mb-12 inline-flex items-center gap-2 text-ink-3 transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 12 12" className="size-3 rotate-180" aria-hidden>
            <path
              d="M1 6h9M6.5 2 10.5 6l-4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          All work
        </Link>

        <div data-cs-meta className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Eyebrow index={study.id}>{study.industry}</Eyebrow>
          {study.client && <TelemetryChip>{study.client}</TelemetryChip>}
        </div>

        <h1 data-cs-title className="t-d1 max-w-[26ch]">
          {study.title}
        </h1>

        <div data-cs-problem className="mt-10 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <p className="t-micro mb-3 text-ink-3">The situation</p>
            <p className="text-[clamp(1rem,1.3vw,1.1875rem)] leading-relaxed text-ink-2">
              {study.problem}
            </p>
          </div>
          <div>
            <p className="t-micro mb-3 text-gold">What changed</p>
            <p className="text-[clamp(1rem,1.3vw,1.1875rem)] leading-relaxed text-ink">
              {study.solution}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ============================================================
   Rail — a sticky chapter index that tracks reading position.
   ============================================================ */

export function CsRail({ chapters }: { chapters: { id: string; text: string }[] }) {
  const [active, setActive] = useState(0)
  const rail = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return

    const triggers = els.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: ({ isActive }) => isActive && setActive(i),
      }),
    )

    // `position: sticky` does not work inside ScrollSmoother — the content
    // wrapper is transformed, so there is no viewport-relative box to stick to.
    // ScrollTrigger's pin does the same job and is transform-aware.
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const pin = ScrollTrigger.create({
        trigger: rail.current,
        start: 'top 120px',
        endTrigger: '#cs-body',
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
      })
      return () => pin.kill()
    })

    return () => {
      triggers.forEach((t) => t.kill())
      mm.revert()
    }
  }, [chapters])

  return (
    <nav ref={rail} aria-label="Sections" className="hidden lg:block">
      <p className="t-micro mb-5 text-ink-3/70">Contents</p>
      <ul className="space-y-3.5">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={cn(
                'group flex gap-3 text-[0.8125rem] leading-snug transition-colors',
                i === active ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'mt-[0.4rem] h-px w-4 shrink-0 transition-all',
                  i === active ? 'w-7 bg-gold' : 'bg-line-strong',
                )}
              />
              <span className="capitalize">{c.text.toLowerCase()}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ============================================================
   Prose — renders their narrative. Headings get an index and a
   scroll reveal; paragraphs get the Terminal word-fill; images
   land in notched panels.
   ============================================================ */

export function CsProse({ sections }: { sections: SectionItem[] }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const kills: (() => void)[] = []

        gsap.utils.toArray<HTMLElement>('[data-cs-h]', root.current).forEach((el) => {
          const t = gsap.from(el, {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          })
          kills.push(() => {
            t.scrollTrigger?.kill()
            t.kill()
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-cs-p]', root.current).forEach((el) => {
          const split = new SplitText(el, { type: 'words' })
          const t = gsap.fromTo(
            split.words,
            { opacity: 0.28 },
            {
              opacity: 1,
              stagger: 0.035,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 60%', scrub: true },
            },
          )
          kills.push(() => {
            t.scrollTrigger?.kill()
            t.kill()
            split.revert()
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-cs-img]', root.current).forEach((el) => {
          const t = gsap.from(el, {
            opacity: 0,
            y: 30,
            scale: 0.985,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          })
          kills.push(() => {
            t.scrollTrigger?.kill()
            t.kill()
          })
        })

        return () => kills.forEach((k) => k())
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  let hIndex = -1

  return (
    <div ref={root} className="space-y-8">
      {sections.map((s, i) => {
        if (s.type === 'heading' && s.text) {
          hIndex += 1
          return (
            <h2
              key={i}
              id={`ch-${hIndex}`}
              data-cs-h
              className="t-d2 max-w-[24ch] scroll-mt-32 pt-12 first:pt-0"
            >
              <span className="t-mono mb-4 block text-gold">
                {String(hIndex + 1).padStart(2, '0')}
              </span>
              <span className="capitalize">{fixHeading(s.text).toLowerCase()}</span>
            </h2>
          )
        }

        if (s.type === 'paragraph' && s.text) {
          return (
            <div key={i} className="space-y-5">
              {splitParagraph(s.text).map((para, k) => (
                <p
                  key={k}
                  data-cs-p
                  className="max-w-[64ch] text-[clamp(1.0625rem,1.35vw,1.25rem)] leading-[1.62] text-ink-2"
                >
                  {para}
                </p>
              ))}
            </div>
          )
        }

        if (s.type === 'quote' && s.text) {
          return (
            <blockquote key={i} data-cs-h className="my-14 max-w-[52ch] border-l-2 border-gold pl-6">
              <p className="t-d2 text-ink">{s.text}</p>
            </blockquote>
          )
        }

        if (s.type === 'image' && s.src) {
          return (
            <figure key={i} data-cs-img className="my-14">
              {/* object-contain, not cover: these are product screenshots and
                  cropping them throws away the thing being shown */}
              <div className="panel relative aspect-[16/10] overflow-hidden bg-void/60 p-2 md:p-3">
                <Image
                  src={s.src}
                  alt={s.caption || ''}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-contain"
                />
              </div>
              {s.caption && (
                <figcaption className="mt-4 max-w-[54ch] text-[0.875rem] leading-relaxed text-ink-3">
                  {s.caption.replace(/^["“]|["”]$/g, '')}
                </figcaption>
              )}
            </figure>
          )
        }

        return null
      })}
    </div>
  )
}

/* ============================================================
   NextStudy — keeps people moving through the work.
   ============================================================ */

export function CsNext({
  study,
  label = 'Next',
}: {
  study: { id: string; title: string; industry: string }
  label?: string
}) {
  return (
    <Link
      href={`/case-studies/${study.id}`}
      className="group relative block overflow-hidden border-t border-line py-14"
    >
      <div className="shell flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="t-micro mb-4 text-ink-3">{label}</p>
          <h3 className="t-d2 max-w-[22ch] text-ink transition-colors group-hover:text-violet">
            {study.title}
          </h3>
          <p className="t-mono mt-4 text-ink-3">{study.industry}</p>
        </div>
        <span className="t-micro flex items-center gap-2 text-ink-3 transition-colors group-hover:text-gold">
          Read
          <svg
            viewBox="0 0 12 12"
            className="size-3 transition-transform group-hover:translate-x-1.5"
            aria-hidden
          >
            <path
              d="M1 6h9M6.5 2 10.5 6l-4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  )
}
