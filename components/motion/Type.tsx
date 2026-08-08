'use client'

import { useRef, type ElementType } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'

/**
 * Terminal Industries' signature: body copy fills word-by-word from 22% to
 * 100% opacity as the paragraph crosses the viewport, scrubbed.
 *
 * Rules — opacity not colour (GPU, background-agnostic). Body copy only,
 * never headings or nav. Bottoms out at 0.22, never 0 — invisible text is a
 * reading tax. Use once per section at most; its power is its scarcity.
 */
export function TextFill({
  children,
  className,
  as: Tag = 'p',
}: {
  children: React.ReactNode
  className?: string
  as?: ElementType
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText(el, { type: 'words' })
        const tween = gsap.fromTo(
          split.words,
          { opacity: 0.22 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 78%',
              end: 'bottom 55%',
              scrub: true,
            },
          },
        )
        // revert() or React strands the word wrappers on unmount
        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          split.revert()
        }
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={cn('t-lead text-ink', className)}>
      {children}
    </Tag>
  )
}

/**
 * Per-line mask reveal. Triggered, not scrubbed — headings should feel
 * decisive, not draggable.
 *
 * yPercent 118 rather than 100 so descenders clear the mask.
 * expo.out is the most important easing choice on the site.
 */
export function Reveal({
  children,
  className,
  as: Tag = 'h2',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  as?: ElementType
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText(el, {
          type: 'lines',
          linesClass: 'overflow-hidden [&>*]:inline-block',
        })
        // wrap each line so the mask has something to clip against
        const inner = new SplitText(split.lines, { type: 'lines' })

        const tween = gsap.from(inner.lines, {
          yPercent: 118,
          duration: 0.9,
          stagger: 0.08,
          delay,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          inner.revert()
          split.revert()
        }
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/**
 * Counts on scroll-into-view, once. Indian digit grouping — 4,21,900 not
 * 421,900. Your audience will notice.
 */
export function Counter({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: {
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  const fmt = (n: number) =>
    prefix +
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n) +
    suffix

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        el.textContent = fmt(to)
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const state = { v: 0 }
        const tween = gsap.to(state, {
          v: to,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = fmt(state.v)
          },
        })
        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: ref, dependencies: [to] },
  )

  return (
    <span ref={ref} className={cn('nums', className)}>
      {fmt(0)}
    </span>
  )
}
