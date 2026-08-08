# 04 — The Facet Wall

> The Terminal Industries move, cut for CaratSense.
> A pinned technical panel on one side, scrolling chapters on the other,
> and a system that assembles itself while you read about it.

**Build:** Medium · **Needs:** SVG design work · **Role:** the services / "what we build" section

---

## The Terminal mechanic, precisely

From your first screenshots, Terminal's second section works like this:

- **Left column scrolls.** A chapter number in small monospace (`02`), a bold heading, and a
  paragraph in large type where the words fill from light grey to solid black as they enter —
  `SplitText` by word, staggered on `scrub`.
- **Right panel is pinned.** A large rounded-corner container holding a dark technical
  drawing — a wireframe CAD view of a yard with numbered bays, dimension lines, and a small
  floating label (`ASSIGN TO SPOT 11`) that animates.
- The panel **does not change between sections.** It changes *state* — same drawing, different
  annotations lit up, as the left column advances.

That last point is the one people miss. It is not a slideshow of images. It is one diagram
being progressively revealed. That is why it reads as a system rather than a gallery.

---

## Your version: the lattice

The pinned panel holds a **facet lattice** — a technical line drawing of your architecture,
rendered like a gemstone's facet plan crossed with a system diagram. Thin `#7C22D4` strokes
on `#07030e`, dimension lines, node labels in monospace, the whole thing sitting in a rounded
container with a 1px border.

It starts almost empty: a faint outline and a single node.

As the reader moves through six chapters, the lattice **draws itself**. Each chapter adds its
nodes and the edges connecting them to what already exists. By chapter six it is a complete,
dense, interconnected system — and crucially, you *watched it get built*, so you understand it.

```
ch.01                ch.03                     ch.06
                          ◇                  ◇───◇───◇
  ◇          →        ◇───┼───◇       →      │╲ ╱│╲ ╱│
                          ◇                  ◇─╳─◇─╳─◇
                                             │╱ ╲│╱ ╲│
                                             ◇───◇───◇
```

The final state is the brilliant-cut facet plan from concept `01` — which quietly ties this
section back to the page's skeleton without anyone having to notice.

---

## The six chapters

Straight from your existing orbit section, in the order a real engagement happens:

| # | Heading | The lattice adds |
|---|---------|------------------|
| `01` | We start where it hurts | One node. The bottleneck. Pulsing magenta. |
| `02` | Your data, in one place | Three nodes + edges. The first structure. |
| `03` | The workflows that run themselves | Automation edges animate with travelling dots. |
| `04` | Models that actually know your business | An AI/ML cluster attaches, denser than the rest. |
| `05` | One screen for the people who run it | The dashboard node — larger, gold-stroked. |
| `06` | It grows when you do | Ghost nodes appear at the edges, dashed. Room to extend. |

Chapter 06's ghost nodes are worth the extra effort. Terminal's copy makes the same promise —
*"Start with the applications you need most and then expand as your needs grow"* — and showing
unbuilt capacity as dashed outlines says it better than a sentence can.

---

## Implementation

**The lattice is SVG.** Not 3D, not canvas. SVG gives you `DrawSVG` on every edge, crisp
strokes at any DPI, real text nodes for the labels, and a total weight under 30KB.

```tsx
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText)

useGSAP(() => {
  // Pin the panel for the full length of the chapter column
  ScrollTrigger.create({
    trigger: '#facet-section',
    start: 'top top',
    end: 'bottom bottom',
    pin: '#facet-panel',
    pinSpacing: false,
  })

  // Each chapter drives its own slice of the lattice
  CHAPTERS.forEach((ch, i) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#chapter-${i}`,
        start: 'top 70%',
        end: 'bottom 40%',
        scrub: 1,
      },
    })

    tl.from(`[data-lattice="${i}"] .edge`, {
        drawSVG: '0%', stagger: 0.06, ease: 'none',
      })
      .from(`[data-lattice="${i}"] .node`, {
        scale: 0, opacity: 0, stagger: 0.04, ease: 'back.out(2)',
      }, '<0.2')
      .from(`[data-lattice="${i}"] .label`, {
        opacity: 0, x: -6, stagger: 0.04,
      }, '<0.3')
  })

  // The Terminal text fill
  document.querySelectorAll<HTMLElement>('.chapter-body').forEach(el => {
    const split = new SplitText(el, { type: 'words' })
    gsap.fromTo(split.words,
      { opacity: 0.22 },
      {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 55%', scrub: true },
      })
  })
})
```

`opacity` on words rather than `color` — it composites on the GPU and works on any background.

---

## Details worth the time

**The floating annotation.** Terminal's `ASSIGN TO SPOT 11` chip is the detail that sells the
whole panel — it implies the diagram is *live*, not drawn. Give yours one too, and change its
text per chapter: `BOTTLENECK: ORDER INTAKE` → `SYNCING 3 PLANTS` → `QUOTE GENERATED · 0.4s`.
Small, monospace, `--accent-gold` text on a translucent dark chip, with a soft blur backdrop.
Animate it in with a 200ms fade and a 4px rise on chapter change.

**Travelling dots on the automation edges.** In chapter 03, put small dots moving along the
edge paths using `MotionPath` on a repeating timeline (not scrubbed — this one should loop
independently). It is the cheapest possible way to make a static diagram feel like a running
system.

**Dimension lines.** Thin lines with tick ends and a monospace measurement, exactly like a
CAD drawing. They are pure decoration and they do more for the "engineering credibility" of
the panel than anything else on it. `847 orders/day`, `3 plants`, `11 s → 0.4 s`.

**Grid background.** A 1px `rgba(124,34,212,0.08)` grid inside the panel, with a subtle
radial mask so it fades at the edges. Terminal does this. It costs one CSS rule.

**The panel corners.** Terminal uses an asymmetric rounded rect with one notched corner —
it reads as a machined part rather than a card. Worth stealing; it is a `clip-path` polygon.

---

## Pitfalls

**Do not pin on mobile.** Below `1024px`, unpin entirely: the lattice becomes a single static
SVG that draws once on entry, and the chapters stack beneath it as normal text. Side-by-side
pinned layouts are a desktop pattern and forcing them onto a phone produces the worst version
of both.

**Keep the lattice abstract.** The temptation is to label it with real product names and turn
it into an architecture diagram. Resist — the moment it becomes literal, it invites scrutiny
about whether that architecture is correct. It should read as *structure*, not as a spec.

**`pinSpacing: false` needs the section to have explicit height.** If the chapter column is
shorter than the pinned panel, the layout collapses. Set a `min-height` on the section equal
to roughly `chapters × 100vh`.

**Six chapters is the ceiling.** Terminal uses about five. Past six the reader is scrolling a
pinned section for too long and starts to feel trapped. If you have more to say, say it after
the pin releases.

---

## Where it goes

This is your **CUT** movement if you are running the `00-INDEX` skeleton — the section between
the hero and the case studies where you explain what you actually build. It is also the
section a prospect will screenshot and send to their business partner, so it should be the
most information-dense thing on the page.
