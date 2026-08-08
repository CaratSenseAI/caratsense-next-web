'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { CLIENTS } from '@/lib/site'
import { Eyebrow } from '@/components/ui'
import { Reveal } from '@/components/motion/Type'

/**
 * §7 — the clients. Not a marquee: a thin-grid wall with + marks at the
 * intersections, lifted from Terminal's logo section.
 *
 * The detail that makes it feel designed is the sibling dimming — hovering one
 * logo drops every other to 18%.
 */
export function Clients() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const t = gsap.from('[data-logo]', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: { amount: 0.6, from: 'random' },
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 78%' },
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
    <section ref={root} className="sect relative overflow-hidden">
      <div aria-hidden className="grid-cross pointer-events-none absolute inset-0 opacity-60" />

      <div className="shell relative">
        <div className="mb-14 md:mb-20">
          <Eyebrow index="07" className="mb-5">
            Clientele
          </Eyebrow>
          <Reveal as="h2" className="t-d2 max-w-[26ch]">
            Thirteen businesses that stopped running on memory.
          </Reveal>
        </div>

        <ul className="group/wall grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map((c) => {
            const inner = (
              <>
                <Image
                  src={c.src}
                  alt={c.name}
                  width={200}
                  height={80}
                  className="h-8 w-auto max-w-[70%] object-contain md:h-10"
                  style={{ filter: 'grayscale(1) brightness(2.4)' }}
                />
                {c.study && (
                  <span className="t-micro absolute bottom-3 right-3 flex items-center gap-1.5 text-gold opacity-0 transition-opacity duration-200 group-hover/cell:opacity-100">
                    Case
                    <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
                      <path
                        d="M1 6h9M6.5 2 10.5 6l-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                )}
              </>
            )

            const cellCls = cn(
              'group/cell relative flex aspect-[16/9] items-center justify-center',
              'border-b border-r border-line px-4',
              'opacity-45 transition-[opacity,scale,filter] duration-250',
              'group-hover/wall:opacity-[0.18]',
              'hover:!opacity-100 hover:scale-[1.04] hover:![filter:none]',
            )

            return (
              <li key={c.name} data-logo>
                {c.study ? (
                  <Link href={`/case-studies/${c.study}`} className={cellCls} aria-label={`${c.name} case study`}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cellCls} title={c.name}>
                    {inner}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
