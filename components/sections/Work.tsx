'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { CASE_STUDIES } from '@/lib/site'
import { Eyebrow, TelemetryChip } from '@/components/ui'
import { Reveal } from '@/components/motion/Type'

/**
 * §6 — the work. After 2000vh of animation, motion stops. This section is
 * editorial: large type, generous leading, real reading. The writing is good
 * and does not need help.
 *
 * The photoreal/wireframe hero pair (A-08) drops into `.twin` when generated —
 * the CSS mask wipe is already wired to --p.
 */
export function Work() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const t = gsap.from('[data-card]', {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
        return () => {
          t.scrollTrigger?.kill()
          t.kill()
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="work" ref={root} className="sect relative">
      <div className="shell">
        <div className="mb-16 md:mb-24">
          <Eyebrow index="06" className="mb-5">
            The work
          </Eyebrow>
          <Reveal as="h2" className="t-d1 max-w-[24ch]">
            Real businesses. Real systems.
          </Reveal>
        </div>

        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
          {CASE_STUDIES.map((cs, i) => (
            <Link
              key={cs.id}
              href={`/case-studies/${cs.id}`}
              data-card
              className={cn(
                'group relative block',
                // stagger the columns so it reads editorial, not gridded
                i % 2 === 1 && 'md:mt-16',
              )}
            >
              <div className="panel twin relative aspect-[16/10] overflow-hidden">
                <div aria-hidden className="grid-tech absolute inset-0" />

                {/* A-08 hero + wireframe twin land here */}
                <div className="absolute inset-0 grid place-items-center">
                  <span className="t-micro text-ink-3/60">{cs.industry}</span>
                </div>

                <div className="absolute left-6 top-16">
                  <TelemetryChip>{cs.metric}</TelemetryChip>
                </div>

                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent opacity-80"
                />
              </div>

              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <p className="t-mono mb-2.5 flex items-center gap-3 text-ink-3">
                    <span className="text-gold">{cs.id}</span>
                    {cs.client ? (
                      <span className="text-ink-2">{cs.client}</span>
                    ) : (
                      <span className="text-ink-3/60">{cs.industry}</span>
                    )}
                  </p>
                  <h3 className="t-d2 max-w-[22ch] text-ink transition-colors group-hover:text-violet">
                    {cs.title}
                  </h3>
                </div>
                <span className="t-micro mt-1 flex shrink-0 items-center gap-2 text-ink-3 transition-colors group-hover:text-gold">
                  Read
                  <svg
                    viewBox="0 0 12 12"
                    className="size-3 transition-transform group-hover:translate-x-1"
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
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
