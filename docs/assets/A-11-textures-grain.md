# A-11 — Textures, Grain & Surface

**Used in:** globally · **Priority: P1**
**Pipeline:** ① GPT Image Gen for paper · **everything else is CSS/SVG, generate nothing**
**Deliver:** `public/tex/*` — total budget **under 300KB**

The layer nobody notices and everybody feels. A site without grain reads as a template; a site
with it reads as photographed.

---

## 1. Film grain — generate nothing, use SVG

The single highest-impact texture on the site, and it costs 0 bytes of image.

```css
body::after {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 100;
  opacity: .035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

`opacity: .035` on dark. Above `.05` it reads as a dirty screen; below `.02` it does nothing.
Tune by eye on a good display, then check on a cheap one.

**Do not animate it.** Animated grain is a per-frame repaint of the entire viewport and it will
cost you the scroll budget on every device that matters.

---

## 2. Technical grid — CSS, generate nothing

Terminal's panels and the logo wall both sit on a faint grid.

```css
.grid-bg {
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 78%);
}
```

The radial mask is what stops it looking like graph paper. Without it the grid fights
everything on top of it.

### Grid intersection crosses

From your Terminal logo-wall screenshot — small `+` marks where hairlines meet:

```css
.grid-bg::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 48px 48px;
  /* clip each line to a 7px stub around intersections */
  mask-image:
    repeating-linear-gradient(0deg,   #000 0 7px, transparent 7px 48px),
    repeating-linear-gradient(90deg,  #000 0 7px, transparent 7px 48px);
  mask-composite: intersect;
}
```

---

## 3. Paper — the one thing worth generating

Used in the ledger sections, case study detail pages, and behind `A-02`'s artefacts.

### Prompt — ruled ledger paper

Aspect **1:1**, tileable if possible.

```
A flat overhead scan of a page from an Indian hardbound accounting ledger.

The paper is aged cream-white with visible fibre texture, slight foxing at one
edge, and a soft crease running through it. It is ruled with hand-drawn vertical
column lines in faded red and horizontal lines in faded blue — the lines are
very slightly uneven, clearly drawn by hand with a ruler rather than printed.

The page is completely blank of writing — ruled lines only.

Lighting: even, flat, diffuse, like a document scanner. No shadows, no
vignette, no perspective. The page fills the entire frame edge to edge.

Rendering: high-resolution flat scan. Sharp. Neutral colour, very slightly warm.

No: handwriting, text, numbers, stains that read as damage, curled edges,
drop shadow, background surface, perspective, book spine.
```

### Prompt — plain worn paper

```
A flat overhead scan of a plain sheet of aged off-white paper. Visible fibre
texture, a faint horizontal fold crease across the middle, one softly foxed
corner, and a very faint brown ring stain in the lower right.

Completely blank — no writing, no lines, no marks other than the wear described.

Even flat diffuse lighting, no shadows, no vignette. Fills the frame edge to
edge. High-resolution scan quality.

No: text, handwriting, drop shadow, perspective, background, torn edges.
```

**Ship at 1024×1024 WebP, ≤ 90KB each,** and tile with `background-repeat`. Larger is wasted —
these sit under content at low opacity.

---

## 4. Caustics — CSS, generate nothing

The rippling light a gemstone throws on a surface. Use a slow-moving SVG turbulence rather than
a generated video.

```css
.caustic {
  position: absolute; inset: 0;
  opacity: .04;
  mix-blend-mode: screen;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.008 .014' numOctaves='2' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 .66 0 0 0 0 .33 0 0 0 0 .97 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='600' height='600' filter='url(%23c)'/%3E%3C/svg%3E");
  background-size: 140% 140%;
  animation: caustic 48s linear infinite alternate;
}
@keyframes caustic {
  from { background-position: 0% 0%; }
  to   { background-position: 100% 100%; }
}
```

At `.04` opacity this is genuinely subliminal — it just stops large dark areas from feeling
dead flat. **If you can consciously see it moving, it is wrong.**

---

## 5. Vignette — CSS

```css
.vignette::after {
  content: '';
  position: absolute; inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 42%, rgba(5,3,9,.55) 100%);
}
```

Use on full-bleed renders only, never on text sections.

---

## Delivery

```
public/tex/
  A-11_ledger.webp        1024 × 1024   ≤ 90KB
  A-11_paper.webp         1024 × 1024   ≤ 90KB
```

That is the entire generated texture budget — **two files.** Grain, grid, crosses, caustics and
vignette are all CSS/SVG and add nothing to the network.

---

## Rules

- **Never stack more than two texture layers** on the same element. Grain is global; anything
  else is one per section, maximum.
- **Grain goes on top of everything**, including images and video. That is what unifies
  generated assets that came from different tools — it is the single most effective trick for
  making a mixed-source asset set look like one shoot.
- **Nothing here animates on scroll.** These are ambient, on their own slow clocks, independent
  of the scrubbed timelines.
- All of it drops on `prefers-reduced-motion: reduce` except static grain, which stays.
