'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { Eyebrow } from '@/components/ui'
import { Ticks } from '@/components/artefacts'

/**
 * §5 — The Thread. The most literal animation on the site, and the most
 * persuasive: the prospect is running their business in a thread right now.
 *
 * Nine messages collapse into the three orders they actually were. Each bubble
 * travels to its order's row and dissolves; the record fades up in its place.
 *
 * Transform-and-opacity only, measured against the chat layout already in the
 * DOM — no second layout to measure, and nothing for a pin transform to throw
 * off. (An earlier Flip version landed cells hundreds of pixels out; see the
 * note at the top of SixteenToOne.)
 */

type Msg = {
  text: string
  time: string
  out: boolean
  ticks: 1 | 2
  hand?: boolean
  /** which of the three orders this message belongs to */
  order: 0 | 1 | 2
}

const MSGS: Msg[] = [
  { text: 'Hi need a cake for saturday', time: '14:02', out: true, ticks: 2, order: 0 },
  { text: 'ok! what flavour?', time: '14:09', out: false, ticks: 2, order: 0 },
  { text: 'black forest 1kg', time: '14:11', out: true, ticks: 2, order: 0 },
  { text: '₹1660 ok?', time: '14:31', out: false, ticks: 2, order: 0 },
  { text: 'actually make it 1.5kg sorry', time: '16:20', out: true, ticks: 2, order: 0 },
  { text: 'kal ka order confirm hai?', time: '08:12', out: true, ticks: 1, hand: true, order: 1 },
  { text: 'stock hai kya?', time: '11:03', out: true, ticks: 2, order: 1 },
  { text: 'did u get my last msg?', time: '21:44', out: true, ticks: 2, order: 2 },
  { text: 'hello?', time: '23:16', out: true, ticks: 1, order: 2 },
]

/** The gold columns were never in the conversation. */
const ROWS = [
  { id: 'ORD-4471', who: 'Anjali M.', what: 'Black Forest · 1.5kg', amt: '₹ 1,860', slot: 'Sat 14:00', status: 'Confirmed' },
  { id: 'ORD-4472', who: 'Rehan S.', what: 'Red Velvet · 500g', amt: '₹ 680', slot: 'Sat 11:00', status: 'In oven' },
  { id: 'ORD-4473', who: 'Priya K.', what: 'Custom · 2 tier', amt: '₹ 3,100', slot: 'Sun 16:00', status: 'Quoted' },
]

export function Thread() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-msg]', { opacity: 0 })
        gsap.set('[data-row]', { opacity: 1, y: 0 })
        gsap.set('[data-gold]', { opacity: 1 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scope = root.current!
        const msgs = gsap.utils.toArray<HTMLElement>('[data-msg]', scope)
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]', scope)

        gsap.set(rows, { opacity: 0, y: 14 })
        gsap.set('[data-gold]', { opacity: 0 })

        const tl = gsap.timeline({ paused: true })

        msgs.forEach((el, i) => {
          const order = Number(el.dataset.order)
          const target = rows[order]
          if (!target) return

          // each bubble travels to the row it became
          const dy = target.getBoundingClientRect().top - el.getBoundingClientRect().top

          tl.to(
            el,
            {
              y: dy,
              scale: 0.92,
              opacity: 0,
              borderRadius: 2,
              duration: 1,
              ease: 'power3.inOut',
            },
            i * 0.03,
          )
          // the tail disappearing is the moment it stops being a chat
          tl.to(
            el.querySelector('[data-tail]'),
            { scale: 0, duration: 0.3, ease: 'power2.in' },
            i * 0.03,
          )
        })

        tl.to(rows, { opacity: 1, y: 0, duration: 0.3, stagger: 0.08, ease: 'power3.out' }, 0.62)
        // last: the columns that were never in the thread
        tl.to('[data-gold]', { opacity: 1, duration: 0.3, stagger: 0.06 }, 0.95)

        const st = ScrollTrigger.create({
          trigger: scope,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 2.2,
          pin: true,
          scrub: 1,
          animation: tl,
        })

        return () => {
          st.kill()
          tl.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative flex h-svh flex-col justify-center overflow-hidden">
      <div className="shell w-full">
        <Eyebrow index="05" className="mb-10">
          The whole product
        </Eyebrow>

        <div className="relative mx-auto w-full max-w-[52rem]">
          {/* chat — the layout that is actually in the DOM */}
          <div className="mx-auto w-full max-w-[26rem] space-y-2">
            {MSGS.map((m, i) => (
              <div
                key={i}
                data-msg
                data-order={m.order}
                className={cn(
                  'relative w-fit max-w-[86%] rounded-[18px] px-3.5 py-2.5',
                  'text-[0.9375rem] leading-snug text-[#e8e2f5]',
                  m.out ? 'ml-auto bg-chat-out' : 'bg-chat-in',
                  m.hand && 'font-[family-name:var(--font-hand)] text-[1.0625rem]',
                )}
              >
                {m.text}
                <span className="ml-2 inline-flex items-center gap-1 text-[0.6875rem] text-ink-3 nums">
                  {m.time}
                  <Ticks n={m.ticks} />
                </span>
                <span
                  aria-hidden
                  data-tail
                  className={cn(
                    'absolute bottom-0 size-3 origin-center rotate-45',
                    m.out ? '-right-1 bg-chat-out' : '-left-1 bg-chat-in',
                  )}
                />
              </div>
            ))}
          </div>

          {/* records — overlaid, revealed as the bubbles arrive */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            {ROWS.map((r) => (
              <div
                key={r.id}
                data-row
                className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-line py-4 sm:grid-cols-[auto_1fr_auto_auto]"
              >
                <span className="font-mono text-[0.8125rem] text-ink-2 nums">{r.id}</span>
                <span className="truncate text-[0.9375rem] text-ink">
                  {r.what}
                  <span className="ml-2 text-ink-3">{r.who}</span>
                </span>
                <span className="text-[0.9375rem] text-ink nums">{r.amt}</span>
                <span
                  data-gold
                  className="hidden items-center gap-3 whitespace-nowrap pl-4 text-[0.8125rem] sm:flex"
                >
                  <span className="text-ink-3 nums">{r.slot}</span>
                  <span className="flex items-center gap-1.5 text-gold">
                    <span className="size-1.5 rounded-full bg-gold" />
                    {r.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="t-mono mt-14 text-center text-ink-3">
          Same information. Now it can be asked a question.
        </p>
      </div>
    </section>
  )
}
