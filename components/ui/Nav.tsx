'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { Mark } from './index'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Build', href: '#build' },
  { label: 'Proof', href: '#proof' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const nav = useRef<HTMLElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useGSAP(
    () => {
      const el = nav.current!
      let hidden = false

      // compress after 80px; hide on scroll down, reveal on scroll up.
      // reveal must be faster than the hide — 400 out, 250 in.
      const obs = Observer.create({
        target: window,
        type: 'scroll',
        onChangeY: (self) => {
          const y = self.scrollY()
          el.dataset.scrolled = y > 80 ? 'true' : 'false'

          // never hide within 200px of the top
          const shouldHide = self.deltaY > 0 && y > 200
          if (shouldHide !== hidden) {
            hidden = shouldHide
            gsap.to(el, {
              yPercent: hidden ? -160 : 0,
              duration: hidden ? 0.4 : 0.25,
              ease: hidden ? 'power2.in' : 'expo.out',
            })
          }
        },
      })
      return () => obs.kill()
    },
    { scope: nav },
  )

  /** The active indicator slides between items rather than appearing on them. */
  function movePill(target: HTMLElement | null) {
    const p = pill.current
    if (!p) return
    if (!target) {
      gsap.to(p, { opacity: 0, duration: 0.2 })
      return
    }
    const state = Flip.getState(p)
    const r = target.getBoundingClientRect()
    const parent = list.current!.getBoundingClientRect()
    gsap.set(p, {
      opacity: 1,
      x: r.left - parent.left,
      width: r.width,
    })
    Flip.from(state, { duration: 0.4, ease: 'expo.out' })
  }

  return (
    <header
      ref={nav}
      data-scrolled="false"
      className={cn(
        'fixed left-1/2 top-4 z-50 -translate-x-1/2',
        'flex items-center gap-2 rounded-full border border-line',
        'bg-surface/60 py-2.5 pl-4 pr-2.5 backdrop-blur-2xl backdrop-saturate-150',
        'transition-[padding] duration-400 data-[scrolled=true]:py-1.5',
      )}
      style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
    >
      <Link href="/" className="flex items-center gap-2.5 pr-2" aria-label="CaratSense AI home">
        <Mark className="h-5" />
        <span className="hidden text-[0.9375rem] font-medium tracking-tight sm:block">
          CaratSense<span className="text-violet"> AI</span>
        </span>
      </Link>

      <ul
        ref={list}
        className="relative hidden items-center md:flex"
        onMouseLeave={() => movePill(null)}
      >
        <span
          ref={pill}
          aria-hidden
          className="absolute inset-y-0 left-0 -z-10 rounded-full bg-surface-2 opacity-0"
        />
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onMouseEnter={(e) => movePill(e.currentTarget)}
              onFocus={(e) => movePill(e.currentTarget)}
              onClick={() => setActive(l.href)}
              className={cn(
                't-micro block px-3.5 py-2 transition-colors',
                active === l.href ? 'text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className={cn(
          'group flex items-center gap-2 rounded-full bg-violet-deep px-4 py-2',
          't-micro text-white transition-colors hover:bg-violet',
        )}
      >
        Connect
        <svg viewBox="0 0 12 12" className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden>
          <path d="M1 6h9M6.5 2 10.5 6l-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </header>
  )
}
