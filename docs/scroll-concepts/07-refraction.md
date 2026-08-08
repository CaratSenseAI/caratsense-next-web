# 07 — Refraction

> The connective tissue. Light bends as you pass between sections,
> so the page reads as one continuous descent instead of a stack of blocks.

**Build:** Easy–Medium · **Needs:** nothing · **Role:** transitions everywhere

---

## The problem it solves

Motion law #1 from `00-INDEX`: *one continuous space, never cut.* But every concept in this
folder is a discrete section. Something has to carry the eye between them or the page becomes
exactly what those sites are not — a sequence of impressive but unrelated set pieces.

Poly solves it with camera continuity. Terminal solves it with a persistent pinned panel. You
solve it with **light**, because your logo says *See Beyond* and refraction is what a cut stone
does to light.

This is the cheapest concept here and possibly the highest-value, because it is what makes
five separate animations feel like one website.

---

## The core wipe

Between any two sections, a **prism edge** passes across the viewport — a thin bright line at
a consistent angle (use `20°`, matching the logo's stroke angle). As it crosses:

- Content **behind** it is the outgoing section, slightly scaled up and desaturating.
- Content **ahead** of it is the incoming section, slightly scaled down and saturating.
- **At** the edge, a narrow band of chromatic separation — the RGB channels offset by 2–6px
  perpendicular to the line, so the boundary splits into a spectrum for the width of about
  40px.

It reads as though the whole page is being viewed through a moving facet.

```
   outgoing            edge            incoming
   ▓▓▓▓▓▓▓▓▓▓▓ ░░ │ ▒▓█ │ ░░ ░░░░░░░░░░░
   desaturating      RGB      saturating
                    split
```

---

## Implementation

Two viable routes. Start with the cheap one.

### Route A — CSS + clip-path (recommended)

No WebGL. The wipe is a fixed overlay with a `clip-path` polygon animated on scroll, plus a
gradient bar for the spectrum.

```css
.refract {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 40;
  --p: 0;                      /* 0 → 1, driven by ScrollTrigger */
}

.refract__edge {
  position: absolute;
  inset: -20%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(124, 34, 212, .0) 46%,
    rgba(196, 34, 145, .55) 49%,
    rgba(212, 175, 55, .85) 50%,
    rgba(124, 34, 212, .55) 51%,
    transparent 54%
  );
  transform: rotate(20deg) translateX(calc((var(--p) * 260%) - 130%));
  mix-blend-mode: screen;
  filter: blur(0.5px);
}
```

```tsx
gsap.to(edgeRef.current, {
  '--p': 1,
  ease: 'none',
  scrollTrigger: { trigger: seam, start: 'top 90%', end: 'top 10%', scrub: 0.6 },
})
```

Register the custom property so it animates smoothly rather than stepping:

```css
@property --p {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}
```

The chromatic split on the outgoing content is a separate cheap trick — two offset copies
under `mix-blend-mode: screen`, tinted magenta and gold, with the offset tweened from 0 to 4px
and back as the edge passes.

### Route B — WebGL displacement

A fullscreen shader that samples the page (rendered to texture) and applies per-channel UV
offset along the edge normal. Genuinely beautiful, genuinely correct dispersion.

It also means compositing your entire DOM into a texture, which breaks text selection, breaks
accessibility, and costs a full-screen draw every frame. **Do not do this** unless the site is
already fully WebGL. Route A gets 85% of the look for 2% of the cost and none of the downside.

---

## The four seams

If you run the `00-INDEX` skeleton, there are exactly four transitions, and each should have a
distinct character so they read as progression rather than repetition:

| Seam | From → To | Character |
|---|---|---|
| 1 | CARAT → CUT | Fast, hard-edged. A cutting plane. Gold-dominant. |
| 2 | CUT → CLARITY | Slow, wide spectrum band. The full dispersion. The big one. |
| 3 | CLARITY → COLOUR | Soft, low-contrast. Purple only, barely there. |
| 4 | COLOUR → CTA | Reverse direction, right-to-left. Signals the close. |

Seam 2 is the hero transition — it lands exactly where the page's argument resolves, so give
it twice the duration and the full spectrum. The others should be restrained enough that seam
2 feels like an event.

---

## Supporting effects in the same family

**Facet-edge section dividers.** Instead of a horizontal rule, a thin `20°` line with a small
gold node where it meets the viewport edge. One `<hr>` replacement, used everywhere.

**Caustic light on dark sections.** A very slow, very subtle animated caustic pattern —
the light that passes through a gem onto a surface. As a `background-image` of a looping
tiled SVG turbulence at 3% opacity, it costs nothing and stops large dark areas from feeling
flat. Do not let it be perceptible as motion; if a viewer notices it, it is too strong.

**Chromatic hover on links.** On hover, a link's text gets a 1px magenta shadow left and a 1px
gold shadow right, tweened in over 150ms. Barely visible, entirely on-theme, and it makes
every link on the site feel considered.

**The logo as the prism.** Your mark is already a set of angled strokes. On scroll, let the
strokes separate very slightly and pick up chromatic fringing, then reconverge. It is a
three-line tween and it ties the whole visual language back to the brand mark.

---

## Pitfalls

**`mix-blend-mode` forces compositing.** A fixed full-screen blended layer can cost real
frames on integrated graphics. Only mount the overlay while its seam is in range — add and
remove it with `ScrollTrigger`'s `onToggle`, never leave four of them in the DOM.

**Keep chromatic aberration under 6px.** Past that it stops reading as an optical effect and
starts reading as a broken display. 2–4px is the range where it feels expensive.

**Never put a seam over text the user is reading.** Seams belong at genuine section
boundaries where the viewport is between blocks of copy. A wipe passing over a paragraph
mid-sentence is actively hostile.

**`prefers-reduced-motion`: replace with a 200ms cross-fade.** The seams are pure decoration
and should be the first thing to go. See `09` §5.

**Do not use this on every section.** Four seams on a long page is right. Ten is a strobe.
