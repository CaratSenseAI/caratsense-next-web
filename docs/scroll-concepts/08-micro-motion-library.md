# 08 — Micro-Motion Library

> The small stuff. None of it is a concept; all of it is why a site reads as expensive.
> Terminal and Poly both win on this layer more than on their hero animations.

**Build:** Easy · **Needs:** nothing · **Role:** everywhere

---

## The honest truth about award sites

Strip the hero animation off Terminal Industries and it is still obviously a premium site.
Strip it off a mediocre agency site and there is nothing left. The difference lives entirely
in this document: the nav, the type, the hovers, the easing, the loading state.

If you build only `03` from this folder plus everything here, you will have a better site
than if you build all seven concepts and skip this.

---

## 1. The text fill (Terminal's signature)

Words fill from 22% to 100% opacity as the paragraph crosses the viewport, scrubbed.

```tsx
const split = new SplitText(el, { type: 'words', wordsClass: 'w' })
gsap.fromTo(split.words,
  { opacity: 0.22 },
  {
    opacity: 1,
    stagger: 0.05,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 55%', scrub: true },
  })
```

**Rules:** opacity not colour (GPU, background-agnostic). Body copy only — never headings,
never nav. Bottom out at 0.22, not 0; fully invisible text is a reading tax and an
accessibility problem. And always `split.revert()` on unmount or React will strand the
wrappers.

Use it on **one paragraph per section, maximum.** Terminal uses it about four times on the
whole page. Its power is entirely in its scarcity.

---

## 2. Headline reveal

Per-line mask reveal, triggered not scrubbed — headings should feel decisive, not draggable.

```tsx
const split = new SplitText(h, { type: 'lines', linesClass: 'line' })
// wrap each line in an overflow:hidden parent
gsap.from(split.lines, {
  yPercent: 118,
  duration: 0.9,
  stagger: 0.08,
  ease: 'expo.out',
  scrollTrigger: { trigger: h, start: 'top 82%' },
})
```

`yPercent: 118` rather than 100 so descenders clear the mask. `expo.out` is the single most
important easing choice on the site — it is what "premium motion" sounds like. Never
`ease: 'power2.out'` on a headline; it reads as a template.

---

## 3. The floating nav

Both your references use it. Blur-backed pill, centred or left, that responds to scroll.

```css
.nav {
  position: fixed;
  top: 20px;
  backdrop-filter: blur(20px) saturate(180%);
  background: rgba(10, 5, 21, 0.55);
  border: 1px solid rgba(124, 34, 212, 0.22);
  border-radius: 999px;
  transition: transform .4s cubic-bezier(.16,1,.3,1), padding .4s;
}
.nav[data-scrolled='true'] { padding-block: 8px; }   /* compresses */
.nav[data-hidden='true']   { transform: translateY(-140%); }
```

**Behaviour:** compress after 80px. Hide on scroll down, reveal instantly on scroll up
(use `Observer` for direction). Never hide within 200px of the top. The reveal must be
faster than the hide — 250ms out, 400ms in feels wrong; do 400ms out, 250ms in.

**The detail worth stealing from Terminal:** an active-section indicator that *slides* between
nav items rather than appearing on them. One absolutely-positioned pill behind the labels,
tweened to the active item's rect with `Flip`.

---

## 4. Counters

Every number on the site should count. Not on load — on scroll into view, once.

```tsx
gsap.from(el, {
  textContent: 0,
  duration: 1.6,
  ease: 'power2.out',
  snap: { textContent: 1 },
  scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  onUpdate() {
    el.textContent = Number(el.textContent).toLocaleString('en-IN')
  },
})
```

Note `'en-IN'` — Indian digit grouping (`4,21,900` not `421,900`). Your audience will notice
and it is a one-word change. Set `font-variant-numeric: tabular-nums` or the layout will
jitter as digits change width.

---

## 5. Client logo wall

You have 13 logos in `public/assets/`. Currently a marquee. Better:

- Default state: `grayscale(1) opacity(.45)`.
- On hover: full colour, `scale(1.04)`, 250ms — **and every other logo drops to `opacity(.2)`**.
  The dimming of the others is what makes it feel designed rather than merely interactive.
- On scroll-in: stagger from `y: 20, opacity: 0` with `stagger: { amount: .6, from: 'random' }`.
- If you name your case studies, each logo links to `/case-studies/[id]` and gets a small gold
  arrow on hover. A logo wall that goes nowhere is decoration; one that goes somewhere is proof.

---

## 6. Cursor

**A custom cursor is a trap.** It is the most common way a good site becomes annoying — lag,
broken hover states, useless on touch, hostile to accessibility.

Do this instead: keep the native cursor, and add a small `mix-blend-mode: difference` circle
that only appears over specific interactive zones (case study cards, the logo wall, video
triggers), showing a label — `VIEW`, `PLAY`, `OPEN`. Lerp it at `0.15` toward the pointer.

```tsx
// lerp, never direct assignment — direct feels robotic
pos.x += (target.x - pos.x) * 0.15
```

Scoped, purposeful, removable. Hide it entirely on `(pointer: coarse)`.

---

## 7. Page transitions

Next.js App Router + `framer-motion` (already installed). Keep it to 400ms and make it
directional — a refraction wipe from `07` at 20°, not a fade.

Critical: the case study route `/case-studies/[id]` should transition **from the card the user
clicked.** Shared-element transition via `Flip` — record the card's rect, navigate, and flip
the hero image of the detail page out of it. It is the single most impressive interaction you
can build, and it is maybe 40 lines.

---

## 8. Loading

Poly has an animated loader; Terminal preloads its video. You need one because the 3D and
image weight is real.

Not a spinner. A **cut counter**: `0 / 6 facets` ticking up as assets resolve, in the same
monospace as the rest of the site. It takes the wait and makes it part of the metaphor. Exit
by unrolling the loader upward with `expo.inOut` over 800ms.

Never fake progress. If assets load in 200ms, exit in 200ms. A loader that lingers for effect
is the most transparently dishonest thing a site can do.

---

## 9. Easing vocabulary

Pick these and use nothing else. Inconsistent easing is the most common tell of an amateur
build, and it is invisible until you fix it.

| Use | Ease | Duration |
|---|---|---|
| Headline / hero reveal | `expo.out` | 0.9s |
| UI in (nav, modal, card) | `power3.out` | 0.5s |
| UI out | `power2.in` | 0.3s |
| Layout morph (`Flip`) | `power2.inOut` | 1.0s |
| Scroll-scrubbed anything | `none` | — |
| Emphasis / arrival pop | `back.out(1.7)` | 0.6s |

**`ease: 'none'` on every scrubbed tween.** An eased scrub fights the user's finger and is the
number one reason scroll animations feel "sticky." This single rule fixes more bad scroll
motion than anything else on this page.

---

## 10. Reduced motion

```tsx
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  /* everything above */
})

mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set('[data-panel], .line, .w', { clearProps: 'all', opacity: 1 })
  // no pins, no scrubs, no wipes. Content is simply present.
})
```

`gsap.matchMedia()` auto-reverts on teardown, which is why it is the right tool here rather
than a manual `if`. Every pinned section must have a non-pinned equivalent — not a degraded
one, a *correct* one. Someone with vestibular sensitivity should get a good website, not a
broken version of a good website.
