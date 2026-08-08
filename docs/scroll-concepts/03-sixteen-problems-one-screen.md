# 03 — Sixteen Problems, One Screen ⭐

> Sixteen scattered panels converge into a single dashboard.
> No 3D. No video. Pure DOM. The best impact-to-risk ratio in this folder.

**Build:** Medium · **Needs:** nothing you don't have · **Role:** centrepiece — *build this first*

---

## It is already your headline

Case study #03 is titled **"Sixteen Problems, One Screen."** You wrote that. It is a complete
animation brief sitting in your content, and it is the single clearest statement of what your
company does.

Sixteen things that were separate are now one thing. That is the product.

---

## The move

A viewport-pinned stage. Sixteen small panels are scattered across it at irregular positions
and rotations, each one a fragment of a business running badly:

```
    ┌─────────┐         ┌──────────┐
    │ WhatsApp│    ┌────│ Excel    │      ┌──────┐
    │  47 ▲   │    │    │ Sheet3   │      │ ₹ ?  │
    └─────────┘    │    └──────────┘      └──────┘
         ┌─────────┴┐        ┌──────────────┐
         │ Missed   │        │ handwritten  │
         │ call ×3  │        │ order slip   │
         └──────────┘        └──────────────┘
              ┌────────┐   ┌──────────┐
              │ stock? │   │ where is │
              │        │   │ order 41 │
              └────────┘   └──────────┘
```

As you scroll, **every panel travels to its final position inside a single dashboard layout.**
They do not fade out and get replaced. The same sixteen elements re-arrange, re-scale, and
un-rotate into the sidebar, the header, the KPI row, the order table, the map, the activity
feed.

The WhatsApp panel becomes the orders inbox. The Excel fragment becomes the stock table. The
"₹ ?" becomes a revenue figure with an actual number in it. The panic becomes a row.

By the end there is one screen. It was always the same sixteen objects.

---

## Why it is the right first build

- **Zero asset dependency.** No modelling, no photography, no video. It is divs.
- **It degrades honestly.** Turn off JS or `prefers-reduced-motion` and you get sixteen cards
  above a dashboard screenshot. Still communicates.
- **It is the argument.** Not a mood, not a vibe — a demonstration of the value proposition.
- **`Flip` does the hard part.** You do not calculate a single coordinate.
- **It is fast.** Transform and opacity only. 60fps on a mid-range phone.

If you build one thing from this folder, build this.

---

## Implementation

`Flip` works by recording the state of elements, changing the DOM/CSS however you like, and
then animating from the recorded state to the new one. You never compute positions — you
declare two layouts and let it interpolate.

```tsx
'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(Flip, ScrollTrigger)

export function SixteenToOne() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>('[data-panel]')

    // 1. Record the scattered state — panels start with .is-scattered
    const scattered = Flip.getState(panels)

    // 2. Move to the resolved state. Each panel has a CSS grid-area
    //    that places it inside the dashboard.
    panels.forEach(p => p.classList.remove('is-scattered'))

    // 3. Flip builds the tween from scattered → resolved.
    //    Paused, then scrubbed by ScrollTrigger.
    const converge = Flip.from(scattered, {
      duration: 1,
      ease: 'power2.inOut',
      stagger: { amount: 0.4, from: 'random' },
      absolute: true,
      paused: true,
    })

    ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: 1,
      animation: converge,
    })
  }, { scope: root })

  return (
    <section ref={root} className="dash-stage">
      {PANELS.map(p => (
        <article
          key={p.id}
          data-panel
          className="is-scattered"
          style={{ gridArea: p.area }}   // resolved position
        >
          {p.content}
        </article>
      ))}
    </section>
  )
}
```

The scattered positions live entirely in CSS:

```css
.dash-stage {
  display: grid;
  grid-template-areas:
    "nav  head head head"
    "nav  kpi  kpi  kpi "
    "nav  ord  ord  map "
    "nav  ord  ord  feed";
  gap: 12px;
  height: 100svh;
}

/* Scattered: absolute, irregular, rotated. Authored by eye, not by formula —
   a random scatter looks like a bug. Hand-place all sixteen. */
.is-scattered { position: absolute; }
.is-scattered:nth-child(1)  { top:  8%; left:  6%; rotate: -7deg;  scale: .82; }
.is-scattered:nth-child(2)  { top: 22%; left: 71%; rotate:  5deg;  scale: .74; }
.is-scattered:nth-child(3)  { top: 61%; left: 14%; rotate: 11deg;  scale: .9;  }
/* … 13 more, placed deliberately */
```

That is the entire mechanism. `Flip.from()` measures both states and interpolates every
element's position, size and rotation for you.

---

## The details that make it feel expensive

**Stagger from `'random'`, amount `0.4`.** If all sixteen move in lockstep it reads mechanical.
If they are fully random it reads chaotic. A 0.4s spread over a 1s tween is the sweet spot —
they arrive as a flock, not a formation.

**Rotate to exactly zero.** The scattered panels are rotated; every resolved panel must be at
`rotate: 0`. That snap-to-straight is most of the satisfaction. Do not leave a "playful" tilt
on the final state — the point is that it is now *aligned*.

**Change the content mid-flight, at 60%.** Swap the panel's inner text from the problem to
the answer while it is still moving, under a 120ms crossfade. `₹ ?` becomes `₹ 4,21,900`.
`where is order 41` becomes `ORD-0041 · out for delivery · 14:20`. Because the panel is in
motion, the swap is invisible — you just notice afterwards that the question became an answer.

**Desaturate the scattered state.** Start every panel at `filter: grayscale(1)` with a thin
`#5B3F8A` border. Tween to full colour as they converge, and let `--accent-gold` arrive
*only* on the final KPI row, at the very last frame. Gold is the payoff colour; spend it once.

**A counter in the corner.** `16 systems` counting down to `1 system` as panels land. Small,
monospace, `--text-muted`. It tells the audience what they are watching without a headline
having to.

**Let the dashboard live for a moment after.** Once assembled, unpin and let a few things
tick — a number increments, a row highlights, a dot pulses. A frozen dashboard reads as a
screenshot; three seconds of life reads as software.

---

## The sixteen panels

Pulled from real friction in your own case studies:

| # | Scattered | Resolved |
|---|---|---|
| 1 | WhatsApp · 47 unread | Orders inbox |
| 2 | Excel `Sheet3` | Stock table |
| 3 | Missed call ×3 | Customer record |
| 4 | Handwritten slip | Order row |
| 5 | `₹ ?` | Revenue KPI |
| 6 | "where is order 41" | Live delivery status |
| 7 | Stock count on paper | Inventory level |
| 8 | Price quote, manual | Instant quote engine |
| 9 | Delivery slot clash | Dispatch calendar |
| 10 | Batch number, unknown | Batch traceability |
| 11 | Vendor bill, spiked | Payables |
| 12 | "which plant made this" | Plant filter |
| 13 | Reorder guess | Reorder alert |
| 14 | Customer name, misspelt ×3 | Single customer profile |
| 15 | Photo of a ledger page | Ledger view |
| 16 | Founder's memory | *Nothing. It becomes the whole screen.* |

Panel 16 is the one worth being careful with. It starts as a small grey card reading
`the founder remembers everything` and it does not become a widget — it expands to become
the **dashboard container itself**, the frame that holds the other fifteen. The thing that
was in one person's head is now the system.

That is the entire company in one transition.

---

## Pitfalls

**Hand-place the scatter.** Procedural randomness always looks like a mistake. Sixteen
positions is twenty minutes of work and it is the difference between "designed" and "broken."

**`absolute: true` is not optional.** Without it, `Flip` reflows siblings during the tween and
the whole thing judders. It lifts elements out of flow for the duration.

**Watch the pin length.** `+=250%` is a good starting point. Under 200% feels rushed; over
350% has dead scroll in the middle where nothing is happening. Tune with
`ScrollTrigger.create({ markers: true })` and actually scroll it on a trackpad *and* a mouse
wheel — they feel very different.

**Mobile needs a different layout, not a smaller one.** Sixteen panels do not scatter legibly
on a 390px viewport. Drop to eight panels and a single-column resolved layout, with the same
`Flip` mechanism. Do not just scale the desktop version down.

**`will-change` sparingly.** Sixteen elements with `will-change: transform` permanently is
sixteen composited layers. Let `Flip` handle it, or set it on `onStart` and clear it on
`onComplete`.
