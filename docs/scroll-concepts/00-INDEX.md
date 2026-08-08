# CaratSense AI — Scroll Motion Concepts

Ten documents. Seven are distinct scroll concepts, three are the connective tissue that makes
any of them shippable. Read this file first — it contains the one idea the rest are built on.

---

## The unlock

Your name is **Carat**. Your logo says **See Beyond**. Your homepage already says:

> Turn your business **chaos** into **Operational clarity**

A carat is the unit used to grade gemstones. Gemstones are graded on **four Cs**:

| C | Gemology | CaratSense |
|---|---|---|
| **Carat** | the weight of the raw stone | the size of the mess — order volume, SKUs, plants, units |
| **Cut** | the work the cutter does | what you actually build — the system, the workflow, the model |
| **Clarity** | absence of inclusions | *your own word.* The operator can finally see |
| **Colour** | the character that remains | the business is still itself, just legible |

You did not choose this metaphor. It was already sitting in your name, your logo mark,
your tagline, and your client list (Éclat Diamonds — *éclat*, French for brilliance).

**A rough stone becomes a brilliant-cut gem. Business chaos becomes operational clarity.**
Same transformation. That is the site.

This matters because it is not decoration you could bolt onto any agency. Nobody else can
run this concept — it is load-bearing on your name. That is the difference between a site
that wins an award and a site that wins a client.

---

## The three motion laws

Every concept here obeys these. They are what Poly and Terminal Industries actually share,
underneath the surface differences.

**1. One continuous space. Never cut.**
Poly's whole homepage is a single camera flying through one 3D room: it dives past the
laptop, files stream out of the screen, and it lands on the desk surface. You never see a
transition because there isn't one. If your section B needs different content than section A,
*move the camera* or *rearrange the objects* — do not fade out and fade in.

**2. Scroll is a timeline scrubber, not a trigger.**
`scrub: 1` everywhere. The user drags the animation. Scroll up and it plays backwards,
exactly. Nothing "fires." This is why these sites feel expensive: the motion is *yours*,
not the page's.

**3. Morph the same object. Do not swap objects.**
Poly's grid does not fade into a new grid — the same DOM nodes get re-laid-out and GSAP
`Flip` animates each one from its old rect to its new one. The audience reads it as
transformation rather than replacement. This is the single most important technique in this
folder and it is why `Flip` appears in nearly every concept.

---

## Your stack is already loaded

Verified in `node_modules`, nothing to install:

```
gsap 3.15.0
  ├── ScrollTrigger ✓   scroll → timeline
  ├── Flip ✓            layout morphing        ← the workhorse
  ├── SplitText ✓       per-word / per-char reveals
  ├── ScrollSmoother ✓  inertial scroll
  ├── MorphSVG ✓        shape-to-shape
  ├── DrawSVG ✓         line drawing
  └── Observer ✓        unified input
three 0.185 + @react-three/fiber 9 + drei 10
framer-motion 12   ·   matter-js   ·   detect-gpu
```

All GSAP premium plugins are free as of 3.13. `detect-gpu` is already there, which is
exactly what you need for the tiering strategy in `09`.

---

## Brand tokens (from `app/globals.css`)

```
--accent-primary  #7C22D4   purple      structure, systems, the built thing
--accent-teal     #C42291   magenta     energy, the live signal
--accent-gold     #D4AF37   gold        clarity, the resolved state, the facet
--bg-dark         #07030e   near-black  the void the stone sits in
--text-primary    #1A0A2E   ink
```

Suggested semantic rule, used consistently across all concepts:
**purple builds, magenta moves, gold resolves.** Gold should be rare — it is the payoff
colour. If everything is gold, nothing is.

---

## The concepts

| # | Concept | The move | Brand tie | Build |
|---|---------|----------|-----------|-------|
| **01** | [The Cut](01-the-cut.md) ⭐ | Rough stone → brilliant-cut gem across the whole page | The four Cs. Load-bearing on your name | Hard |
| **02** | [The Operator's Desk](02-the-operators-desk.md) ⭐ | Continuous camera dive through a real Indian SMB desk | "Running on memory, spreadsheets, or WhatsApp" | Hard |
| **03** | [Sixteen Problems, One Screen](03-sixteen-problems-one-screen.md) ⭐ | 16 scattered panels FLIP into one dashboard | Literally your case study #03's title | Medium |
| **04** | [The Facet Wall](04-the-facet-wall.md) | Terminal-style pinned panel; system builds itself | Cut geometry as technical diagram | Medium |
| **05** | [The Thread](05-the-thread.md) | WhatsApp bubbles crystallise into database rows | The exact before/after you sell | Medium |
| **06** | [The Ledger Unroll](06-the-ledger-unroll.md) | Horizontal scroll: paper ledger → live timeline | Every client had a paper ledger | Medium |
| **07** | [Refraction](07-refraction.md) | Light splitting as section-to-section transition | "See Beyond." Prism = the lens | Easy–Med |
| **08** | [Micro-Motion Library](08-micro-motion-library.md) | Nav, text, cursor, counters, hovers | Craft floor for everything above | Easy |
| **09** | [Technical Architecture](09-tech-architecture.md) | Perf budget, device tiers, mobile, a11y | Makes it actually ship | — |
| **10** | [**THE BUILD**](10-THE-BUILD.md) ⭐⭐ | **The exact site — every section, scroll beat, and line of copy** | — | — |

⭐ = my recommended build.

**If you only read one file, read `10`.** Documents 01–09 are the idea space and the reasoning
behind it. Document 10 is the decision: the actual page, 4,850vh of it, specified beat by
beat with exact copy. This index explains *why*; `10` specifies *what*.

---

## What I would actually build

**`01` as the skeleton, `03` as the centrepiece, `02` for the hero, `07` as the glue.**

Concretely, the homepage becomes:

```
┌─ CARAT ──── hero. The rough stone. Concept 02's desk dive
│             ends by revealing the uncut stone.
│
├─ CUT ────── what you build. Concept 04's pinned facet wall,
│             numbered 01–06, one per service.
│
├─ CLARITY ── the proof. Concept 03's sixteen-to-one FLIP,
│             then the 9 case studies. This is the money shot.
│
├─ COLOUR ─── who you did it for. The 13 client logos, alive.
│
└─ CTA ────── the finished stone, rotating slowly. "See Beyond."
```

`07`'s refraction wipes carry you between the four movements so the whole page reads as one
continuous descent, per motion law #1.

**Do not build all seven.** Each concept here is strong enough to carry a section, and a page
running five signature animations at once reads as a showreel, not a business. Pick the
skeleton, pick one hero move, and spend the remaining budget on making those two perfect.

Start with `03` regardless of what else you choose — it is the highest ratio of impact to
risk in the folder, it is pure DOM so it degrades gracefully, and it proves the motion
language before you commit to any 3D.

---

## An honest warning

Poly's hero is a rendered 3D scene with real depth of field, and Terminal's panels are
bespoke CAD animations. Both had budget for original 3D and photography. The concepts here
that lean on that (`01`, `02`) will feel thin if the assets are thin — a stock gemstone model
and a generic desk render will actively cheapen the site.

`03`, `05`, `06` and `07` are pure DOM/SVG/CSS. They cost design thinking, not asset budget,
and they are the ones I would bet on if the asset pipeline is uncertain. Decide which
situation you are in before picking, and read `09` §6 before committing to anything 3D.
