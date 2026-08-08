# 06 — The Ledger Unroll

> Vertical scroll becomes horizontal travel.
> A hand-ruled paper ledger unrolls sideways and turns into a live timeline.

**Build:** Medium · **Needs:** one good paper texture · **Role:** case-study index, or the "how we work" section

---

## The Poly move it borrows

In your screenshots, Poly takes a single photograph and **stretches it into a 35mm filmstrip**
that unrolls horizontally across the viewport, with an audio waveform scrubber beneath it. One
object becomes a strip, and the strip becomes a timeline you can scrub.

That is a genuinely clever piece of design thinking: it converts *browsing* into *travelling*.
The filmstrip is not a carousel — it is a ruler.

Your equivalent object is not film. It is the **ledger**.

---

## Why the ledger

Every business in your nine case studies kept one. The red-cloth hardbound register, columns
ruled by hand, a page per day, entries in two colours of pen. It is the original system of
record for Indian small business, and it is genuinely good — legible, durable, trusted, and
completely unqueryable.

You do not replace the ledger because it was bad. You replace it because it cannot be *asked
a question*. That is a far more respectful — and more accurate — story than "paper bad,
software good," and it is the story this animation tells.

---

## The move

The section pins. A closed ledger sits centre-frame. Then vertical scroll is remapped to
horizontal motion and the ledger **unrolls to the right**, page after page, like a scroll
being unwound.

```
   scroll ↓  ═══════════════════════════════════════►  travel →

   ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
   │ Apr  ││ May  ││ Jun  ││ Jul  ││ Aug  ││ Sep  ││ Oct  │
   │ ╱╱╱╱ ││ ╱╱╱╱ ││ ╱╱╱╱ ││ ▓▓▓▓ ││ ▓▓▓▓ ││ ████ ││ ████ │
   │ hand ││ hand ││ hand ││ half ││ half ││ live ││ live │
   └──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘
     paper   paper   paper   ░ transition ░   system  system
```

As it travels, the pages **change medium**. The first pages are photographed paper — ruled
columns, ink, thumbprints, a tea stain. Around the midpoint the paper starts to lose its
texture: the ruled lines straighten into a CSS grid, the handwriting resolves into typeset
text, the columns gain sort arrows. By the end you are looking at a live table with a
blinking cursor and a row updating in real time.

The ledger never stops being a ledger. It becomes a *queryable* one.

---

## Implementation

Horizontal scroll driven by vertical, via a pinned container and an `x` tween:

```tsx
useGSAP(() => {
  const track = trackRef.current!
  const distance = track.scrollWidth - window.innerWidth

  gsap.to(track, {
    x: -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${distance}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  })
})
```

`invalidateOnRefresh: true` is not optional — without it, the distance is wrong after any
resize and the section either ends early or leaves dead space.

The medium change is a per-page tween keyed off horizontal progress. Each page has both
layers stacked; you cross-fade between them and remove the paper filter:

```tsx
gsap.utils.toArray<HTMLElement>('[data-page]').forEach((page, i) => {
  gsap.timeline({
    scrollTrigger: {
      trigger: page,
      containerAnimation: horizontalTween,   // ← the key
      start: 'left center',
      end: 'right center',
      scrub: true,
    },
  })
  .to(page.querySelector('.paper'),  { opacity: 0, filter: 'blur(3px)' })
  .to(page.querySelector('.digital'), { opacity: 1 }, '<')
  .to(page.querySelector('.rules'),   { attr: { d: STRAIGHT_PATH } }, '<')
})
```

**`containerAnimation` is the piece people miss.** It lets a ScrollTrigger fire based on an
element's position within a horizontally-tweened track rather than in the document. Without
it, per-page triggers on a horizontal scroller simply do not work.

---

## Details

**Ruled lines that straighten.** The paper's hand-ruled columns should be an SVG path with
slight waver — genuinely hand-drawn, digitised. `MorphSVG` them to perfectly straight paths as
the page digitises. It is a tiny detail and it is the single most satisfying moment in the
section.

**Handwriting → type.** Do not cross-fade a handwriting image into a text block; it looks like
a dissolve. Instead, `DrawSVG` the handwriting *out* (un-writing it, right to left) while the
typeset text fades in beneath. Un-writing reads as translation. Dissolving reads as a slide
transition.

**A date ruler under the strip.** Poly puts a waveform scrubber under the filmstrip; you put a
timeline. Thin, monospace, with tick marks and a moving playhead tied to scroll progress. It
tells the reader the horizontal move is *time*, which is what makes the whole conceit legible
in the first two seconds.

**One page stays paper.** Somewhere near the end, leave a single page as paper — a note in
pen, kept deliberately. Label it small: `some things stay on paper.` It is honest, it is
charming, and it defuses any sense that you are contemptuous of how these businesses work.

**Nine pages, nine case studies.** If you use this as the case study index, each page is one
study and clicking it routes to `/case-studies/[id]`. You already have that route.

---

## Pitfalls

**Horizontal scroll hijacking is genuinely risky.** It breaks scroll position restoration,
confuses trackpad users who swipe horizontally, and can trap keyboard users. Mitigations, all
required:

- Keep the total travel short — under `250vh` of vertical scroll.
- Never capture horizontal wheel/trackpad input. Vertical drives it, full stop.
- Give every page a real `tabindex` and scroll it into view on focus.
- Provide a visible progress indicator so the user knows the section is finite.

**Bail out under `1024px`.** On mobile, drop the horizontal mechanic entirely and stack the
nine pages vertically with the same paper→digital transition firing on normal vertical entry.
The transition is the good part; the horizontality is just staging.

**The paper texture is the whole aesthetic.** A generic beige noise texture will look like a
2012 WordPress theme. It needs to be a real scan — actual ruled paper, actual ink, actual
wear, shot flat and cleanly. One good scan carries the entire section.

**Do not use a page-curl effect.** Skeuomorphic page turns have not read as premium since
about 2013. The unroll should be flat, planar sliding — the ledger as a *strip*, not as a book
someone is thumbing.
