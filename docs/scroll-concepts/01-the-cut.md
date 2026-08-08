# 01 — The Cut ⭐

> A rough stone enters. A brilliant-cut gem leaves.
> The entire homepage is one uninterrupted cutting process.

**Build:** Hard · **Needs:** original 3D · **Role:** whole-page skeleton

---

## Why this and nothing else

Every other agency site can run a "chaos → order" animation. Only you can run *this* one,
because the metaphor is welded to your name. A carat is how you weigh a gemstone. The four
grading Cs are Carat, Cut, Colour and **Clarity** — and "operational clarity" is already the
promise on your homepage. Éclat Diamonds is already your client.

The gemstone is not a mascot or a logo animation. It is a **model of what you sell**:

- The raw stone is the client's business — valuable already, but opaque and unreadable.
- You do not add anything to a stone. **You remove.** You cut away material until light can
  pass through it. That is exactly what your case studies describe: you did not give the
  bakery *more* tools, you removed WhatsApp, the manual quoting, the mental tracking.
- Every facet is a flat, deliberate plane cut at a precise angle. Facets are your modules —
  CRM, inventory, quoting, dispatch. Each one is a decision.
- Clarity is not decoration. A gem with inclusions is *worth less*. Opacity has a price.

The gem never sparkles gratuitously. It resolves.

---

## The four movements

The page is one continuous cut. Section boundaries are cutting stages, not page sections.

### CARAT — the rough stone `0–20% scroll`

Near-black `#07030e`. A single rough, uncut stone, dead centre, slowly rotating. Matte,
cloudy, internally fractured. It does not sparkle — light goes in and dies.

Around it in the dark, barely legible, drift the artefacts of a business run on memory: a
WhatsApp bubble, a spreadsheet row, a handwritten order slip, a missed-call notification.
They orbit close to the stone's surface like inclusions trapped inside it.

> **Turn your business chaos**
> *(and on scroll, the second line resolves)*
> **into operational clarity**

As you scroll, the camera pushes in until the stone fills the frame and you can see the
fractures are made *of* those artefacts — the mess is not around the business, it is
suspended inside it.

**Technique:** R3F. One mesh, high-roughness physical material, `transmission: 0.2`. Orbiting
artefacts are billboarded planes. Camera dolly on `scrub`.

---

### CUT — the facets `20–55% scroll`

The defining sequence. Six times, a cutting plane sweeps through frame — a thin gold line at
a precise angle. Each pass:

1. The plane sweeps across the stone. Brief bloom on contact.
2. A wedge of rough material detaches and falls away into the dark.
3. A flat facet is left behind, and *light passes through it for the first time.*
4. A label sets itself beside the new facet, monospace, small:
   `01 / CRM` `02 / INVENTORY` `03 / QUOTING` `04 / DISPATCH` `05 / AI & ML` `06 / DASHBOARD`
5. The stone's internal fracture count visibly drops. A counter tracks it.

The stone gets **smaller and brighter** with every cut. That is the whole argument of your
business in one visual: you removed things, and it became more valuable.

Pull the six labels straight from your existing orbit section — AI & ML Models, Workflow
Automation, Inventory Manager, ERP, CRM, Custom Dashboards.

**Technique — no 3D software required.** Generate the six cut states as stills via Google
Whisk (`assets/A-01` prompt 3), then cross-fade between them on a scrubbed timeline. The
cutting plane is a CSS gradient bar rotated to the cut angle; the labels and dimension lines
are DOM. Debris is optional and can be omitted entirely.

```tsx
// six stacked <img>, opacity cross-faded on scroll
STATES.forEach((_, i) => {
  tl.to(`#cut-${i}`, { opacity: 1, duration: 1, ease: 'none' }, i)
    .to(`#cut-${i - 1}`, { opacity: 0, duration: 1, ease: 'none' }, i)
})
```

---

### CLARITY — light passes through `55–80% scroll`

The stone is now fully cut and stops rotating. Dead still, dead centre.

A single beam of white light enters from screen left. It refracts through the stone and
exits right as a **spectrum** — and the spectrum bands are labelled with your outcomes:

```
white light in  →  ◈  →  ┌─ orders, tracked
                          ├─ stock, live
                          ├─ quotes, instant
                          ├─ delivery, visible
                          └─ margin, known
```

One input, many legible outputs. That is what a system does. That is also literally what a
gemstone does.

> **See beyond.**

**Technique:** This can be a 2D SVG overlay composited on the 3D — cheaper and sharper than
real caustics. `DrawSVG` the beam in, then stagger the spectrum bands with `SplitText` on
the labels. Real transmission/dispersion in three.js is beautiful but expensive; see `09` §6.

---

### COLOUR — the work `80–100% scroll`

The stone recedes and its facets flatten into the plane of the screen — each facet becoming
a card. Your 13 client logos land one per facet. The gem becomes the grid.

This is a `Flip` handoff from 3D to DOM: at the final frame, read each facet's projected
screen rect, hide the canvas, and `Flip.from()` real DOM cards out of those exact
coordinates. Done right, nobody can tell where the 3D ended.

The nine case studies follow as normal editorial content. Motion stops. Let the writing work —
it is genuinely good and it does not need help.

---

## Scroll map

```
 0%   ████                          rough stone, artefacts orbiting
10%   ████████                      camera push-in, inclusions legible
20%   ████████████    ◄ CUT 01      first plane sweep · CRM
27%   ██████████████  ◄ CUT 02      INVENTORY
34%   ████████████████ ◄ CUT 03     QUOTING
41%   ██████████████████ ◄ CUT 04   DISPATCH
48%   ████████████████████ ◄ CUT 05 AI & ML
55%   ██████████████████████ ◄ 06   DASHBOARD · stone complete
65%   ████████████████████████      beam enters, refraction begins
75%   ██████████████████████████    spectrum labelled, "See beyond"
85%   ████████████████████████████  facets flatten → Flip to DOM cards
95%   ██████████████████████████████ client grid, case studies
```

Total pinned height ≈ `600vh`. That is long. Budget roughly 6–8 seconds of continuous
scrolling — which is fine *only* if every moment of it is changing. Dead scroll is the
fastest way to lose someone.

---

## Copy

| Beat | Line |
|---|---|
| Open | Turn your business chaos into **operational clarity** |
| Cut 01 | We do not add tools. We remove reasons to need them. |
| Cut 03 | Every facet is a decision about where to stop cutting. |
| Cut 06 | Six cuts. One system. |
| Clarity | One input. Every answer. |
| Close | **See beyond.** |

Keep it this sparse. The stone is doing the arguing.

---

## Pitfalls

**Live CSG will kill you.** Real boolean geometry per frame is not viable at 60fps in a
browser. Bake morph targets. If someone suggests `three-bvh-csg` at scroll rate, the answer
is no.

**A stock gem model will cheapen the entire site.** This concept lives or dies on the asset.
A generic sparkly diamond reads as a jewellery ad and undermines the "serious infrastructure"
positioning. It needs to look *lithic* — rough, matte, geological — before it looks precious.
Budget for original modelling or do not run this concept.

**Do not let it sparkle during CUT.** The temptation is enormous. Resist it. Brilliance is
earned in the CLARITY movement and nowhere earlier. If the stone sparkles at 20% scroll, the
payoff at 70% is worth nothing.

**Diamonds carry ethical baggage.** You are using the metaphor structurally — cutting,
clarity, facets — not selling stones, and you have a diamond client, so this is defensible.
But avoid luxury-advertising language ("flawless", "precious", "forever"). Stay geological
and technical. That also keeps it consistent with your writing voice.

**Mobile.** 600vh of pinned 3D on a mid-range Android is not happening. See `09` §4 — the
mobile version is a scrubbed image sequence of the same six stages, which is honestly 80% as
good and 5% of the cost.

---

## Cheaper version, same idea

If the 3D budget is not there, run this entirely in **SVG**. A flat, geometric, top-down
gemstone diagram — the classic round-brilliant facet plan, which is already a beautiful piece
of technical drawing. `DrawSVG` strokes each facet edge in on scroll, `MorphSVG` transitions
the outline from irregular rough to symmetrical brilliant, and facets fill with `--accent-gold`
as their label sets.

You lose the volumetric drama. You keep the entire argument, it weighs about 40KB, it is
razor-sharp on every display, and it runs on a ₹8,000 phone. For a company that sells
*removing unnecessary complexity*, there is something quietly correct about the SVG version.
