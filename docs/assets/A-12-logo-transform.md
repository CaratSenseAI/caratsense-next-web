# A-12 — Logo Transform

**Used in:** loader, nav mark, favicon, OG, §8 close · **Priority: P1**
**Pipeline:** ① GPT Image Gen (edit mode, from your logo) → ③ Kling → ④ 40 frames
**Deliver:** `public/seq/A-12_logo/0001–0040.webp` + SVG variants

Your mark is three ascending diagonal strokes. Read them as **rough → cut → clear** — three
states of the same material — and the logo stops being decoration and becomes the thesis.

---

## Required input

```
logo-mark.png     the three purple strokes ONLY
                  no wordmark, no circle badge, no "SEE BEYOND"
                  transparent background, ≥ 2048 × 2048
```

Your `public/logo-symbol.png` may work. `backgroundless-logo.jpeg` will not — JPEG has no
alpha. If you have vector source, export PNG at 2048 from that.

**This is the one file that blocks everything in this document.** Please provide it first.

---

## Concept 1 — the strokes separate and refract *(recommended)*

The cheapest and most on-brand. The three strokes drift apart, pick up chromatic fringing at
their edges as if seen through a prism, then snap back into perfect alignment.

**This does not need generation at all.** Your mark is three shapes — do it in SVG.

```css
.mark path { transition: none; }
.mark path:nth-child(1) { --off: -1; }
.mark path:nth-child(2) { --off:  0; }
.mark path:nth-child(3) { --off:  1; }
```

```tsx
gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=60%', scrub: 1 } })
  .to('.mark path', {
    x: (i) => (i - 1) * 14,
    y: (i) => (i - 1) * -6,
    duration: 1,
    ease: 'power2.inOut',
  })
  .to('.mark', { filter: 'url(#chroma)', duration: .2 }, '<')
  .to('.mark path', { x: 0, y: 0, duration: 1, ease: 'expo.out' })
```

With a small chromatic-aberration SVG filter:

```svg
<filter id="chroma">
  <feOffset in="SourceGraphic" dx="-2" dy="0" result="r"/>
  <feOffset in="SourceGraphic" dx="2"  dy="0" result="b"/>
  <feColorMatrix in="r" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 0" result="rc"/>
  <feColorMatrix in="b" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 .6 0" result="bc"/>
  <feBlend in="rc" in2="bc" mode="screen" result="m"/>
  <feBlend in="SourceGraphic" in2="m" mode="screen"/>
</filter>
```

Zero assets, perfectly sharp, works everywhere. Use this in the nav on scroll and in the loader.

---

## Concept 2 — logo becomes the stone

For the loader and OG image. Generated, 40 frames.

### Prompt — GPT Image Gen, edit mode, with `logo-mark.png` attached

```
Using the attached logo mark as the exact shape reference:

Render these three ascending diagonal strokes as three-dimensional objects made
of polished violet crystal, floating in absolute darkness.

Each stroke is a solid, faceted, gemstone-like slab with clean flat surfaces and
sharp bevelled edges — cut and polished, catching light along the edges. They
retain the exact angle, spacing, proportion and ascending arrangement of the
original mark.

Colour: deep violet #7C22D4 in the body, brighter #A855F7 on lit edges, near-
white on the sharpest highlights. Semi-transparent — you can see faintly through
each slab to the one behind it.

Lighting: one soft key from the upper left, one tight violet rim light from the
lower right. Everything unlit falls to pure black.

Background: pure black #050309, empty. No floor, no shadow, no reflection.

Composition: the mark occupies about 45% of the frame, centred, in the exact
arrangement of the reference.

Rendering: photorealistic 3D product render, sharp, deep focus, fine grain,
high contrast.

No: text, wordmark, circle badge, letters, glow, bloom, sparkle, rainbow,
floor, shadow, reflection, gradient background.
```

### Prompt — Kling, image-to-video, 5s

```
The three crystal slabs rotate slowly and together as a single unit, no more
than 25 degrees across the shot, catching the light differently as they turn.

They drift very slightly apart from each other and then converge back into
perfect alignment by the final frame.

The rotation decelerates to a complete stop. The final frame is perfectly still
with the mark in its exact original arrangement, facing forward.

Camera: completely locked. Background stays pure black.
```

**Negative prompt:** `fast rotation, spinning, camera movement, shattering, particles, sparkle, text, letters, logo type, glow, bloom, background appearing`

Extract 40 frames, budget **≤ 700KB.**

---

## Concept 3 — the loader

Not a spinner. From `scroll-concepts/08` §8 — a cut counter that makes the wait part of the
metaphor:

```
      ╱╱╱                          ← the mark, static SVG

      CARATSENSE        2 / 6 facets
      ────────────                  ← 1px gold rule, grows to 240px
```

The counter tracks **real** asset progress. Exit by unrolling upward, `expo.inOut`, 800ms.

**Never fake progress.** If assets resolve in 200ms, exit in 200ms.

---

## Favicon & app icons

Generate nothing — export from the SVG mark.

```
public/
  favicon.ico          32×32 · 16×16
  icon.svg             the mark, currentColor
  icon-192.png         maskable, violet mark on #050309
  icon-512.png         maskable
  apple-icon.png       180×180, violet mark on #050309
```

Your repo already has `app/icon.svg`, `app/icon.png`, `app/apple-icon.png` — regenerate them
from the clean mark on the new `#050309` ground so they match the dark site.

Note from the commit log: `11fcd62 fix: restore authentic logo-symbol.png favicon`. Check what
that restored before overwriting, so you don't undo a deliberate fix.

---

## Acceptance criteria

- [ ] The mark stays **geometrically true** — same angles, spacing, stroke ratio. A logo that
      drifts out of proportion in an animation is worse than no animation.
- [ ] No wordmark, no "SEE BEYOND", no circle badge in any generated frame
- [ ] No letters or text anywhere — image models love to hallucinate type into logos
- [ ] Final frame matches the static mark exactly, so the video→SVG handoff is invisible
- [ ] Violet matches `#7C22D4` / `#A855F7`, not a generic purple
- [ ] ≤ 700KB for 40 frames

---

## What I would actually ship

**Concept 1 only.** It is pure SVG, it is sharp at every size, it costs nothing, it works in
the nav and the loader and on scroll, and the "three strokes separating into a spectrum and
reconverging" reads as *See Beyond* more directly than a crystal render does.

Generate Concept 2 only if you want a richer OG/social image. For the site itself, the SVG
version is better — and given the tools you have, it is also the only one you can iterate on
quickly.
