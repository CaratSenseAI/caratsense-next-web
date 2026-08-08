# 10 — THE BUILD

> The exact site. Every section, every scroll beat, every line of copy, every animation.
> Read `00-INDEX` for why. This file is what.

**Total page height: `4,850vh` of scroll** across 9 sections, of which `2,750vh` is pinned.
Roughly 55–70 seconds of continuous scrolling at a natural pace. Nothing is ever static for
more than 400ms of that.

Copy marked ✎ is new and needs your sign-off. Everything else is from your existing site,
your case studies, or your Medium pieces.

---

## Page map

```
scroll        section                          pinned    concept
─────────────────────────────────────────────────────────────────────
    0vh   §0  Loader                              —        08 §8
    0vh   §1  HERO — the rough stone            400vh      01 · 02
  400vh   §2  THE MESS — suspension             300vh      02
  700vh   §3  SIXTEEN → ONE                     250vh      03  ★
  950vh   §4  WHAT WE BUILD — facet wall        700vh      04
 1650vh   §5  THE THREAD — proof                350vh      05
 2000vh   §6  THE WORK — 9 case studies          —         06
 2600vh   §7  THE CLIENTS — 13 logos             —         08 §5
 2900vh   §8  SEE BEYOND — CTA                  350vh      01
 3250vh   §9  Footer                             —          —
```

Seams from concept `07` sit at §1→§2, §3→§4, §5→§6, §8→§9.

---

## §0 · Loader

**Duration:** as long as assets take, capped at 2.5s. Never faked.

Black `#07030e`. Centred, 13px monospace, `--text-muted`:

```
CARATSENSE                    0 / 6 facets
```

The counter ticks 0→6 against real asset progress. Below it, a 1px gold line grows left to
right, `240px` wide at completion.

**Exit:** the whole loader translates up and out, `expo.inOut`, 800ms, revealing §1 already
in its first frame. No fade.

---

## §1 · HERO — the rough stone
`0–400vh` · pinned from `100vh` · scrub 1

### What you see

Full-bleed `#07030e`. Dead centre, a **rough uncut stone** — matte, grey-violet, internally
fractured, no sparkle. It rotates at 0.06 rad/s, slowly enough to read as breathing rather
than spinning.

Suspended around it in the dark, at varying depths and drifting slowly, are **34 artefacts**
of a business running on memory. Each is a flat plane, slightly translucent, catching a little
purple rim-light:

```
WhatsApp bubble ×6      handwritten order slip ×5      Excel cell fragment ×4
missed-call badge ×3    carbon-copy challan ×3         sticky note ×4
spike-file bill ×3      calculator display ×2          ledger page corner ×2
"₹ ?" ×2
```

They orbit close — within 1.5× the stone's radius — so they read as **inclusions trapped
inside it**, not decoration around it.

### The copy

Set in your display face, `clamp(48px, 7vw, 116px)`, `line-height: 0.95`, centred.

```
Turn your business chaos
into operational clarity
```

Line 1 in `--text-light`. Line 2 starts at `--text-muted` and resolves to
`--accent-gold` between 25% and 40% of the section. That colour resolve is the only gold in
the first 700vh.

Below, `clamp(16px,1.3vw,20px)`, `--text-secondary`, max-width `620px`:

> We uncover the bottlenecks slowing your business down and build custom AI & ML, automation,
> and software systems that eliminate them.

### The animation, beat by beat

| Scroll | What happens |
|---|---|
| `0–8%` | Nothing moves but the stone's rotation and the artefact drift. Headline reveals by line, `expo.out`, 0.9s, `stagger 0.08`. Let it breathe — the first beat of a premium site is stillness. |
| `8–25%` | Camera dollies in. Stone scales from `1.0` to `1.7`. Artefacts push outward past the camera and blur. Sub-copy fades out at 15%. |
| `25–40%` | Headline line 2 resolves to gold. Camera continues in until the stone fills 80% of frame height. Surface detail becomes legible — the fractures are made *of* the artefacts. |
| `40–70%` | Camera continues *through* the stone's surface. Heavy motion blur. We are now inside the fracture network — dark, cloudy, artefacts streaming past as streaks. Headline is gone. |
| `70–100%` | The interior resolves into a top-down view of a dark plane. We have arrived at §2. The stone is no longer in frame. **No cut occurred.** |

### Technique

R3F, `dynamic(ssr:false)`, `frameloop="demand"`. One camera on a CatmullRom spline, `t` driven
by a single scrubbed ScrollTrigger. Artefacts are instanced planes with per-instance noise
offsets — not physics.

Post-processing motion blur is **required** from 40% onward; without it the camera move reads
as a glitch rather than a dive.

**`lite` tier:** 48-frame scrubbed WebP sequence of exactly this move, ~700KB.
**`static` tier:** the frame at 0%, headline present, no motion.

---

## §2 · THE MESS — suspension
`400–700vh` · pinned · scrub 1

### What you see

Top-down. A dark plane. **200 paper artefacts** hang in slow three-dimensional drift above it,
lit from a single warm source off-frame left. Real document types, rendered with sincerity —
these are the tools of a competent business, not a joke.

The drift is slow enough to be uncomfortable. This is the only section on the site where the
intended feeling is *unease*.

### The copy

Centred, `clamp(32px,4.5vw,68px)`, `--text-light`, held for the full section:

```
Every business below was running on
memory, spreadsheets, or WhatsApp
before we got there.
```

Word-by-word fill, `opacity 0.22 → 1`, `stagger 0.05`, scrubbed across `10–55%` of the section.
This is one of only four places on the site that uses the Terminal text-fill. It is the most
important sentence you have written and it earns the treatment.

### The animation

| Scroll | What happens |
|---|---|
| `0–10%` | Arrival from §1. Drift settles. |
| `10–55%` | Copy fills. Camera holds absolutely still. Artefacts drift. Nothing resolves. **Hold the discomfort.** |
| `55–75%` | Every artefact rotates flat to camera. They are now visually 2D — this is the seam. Canvas hands off to DOM at identical screen rects. |
| `75–100%` | The 200 collapse into the 16 of §3, `Flip`, `stagger from:'random'`, `amount 0.6`. |

### The seam (the technical crux of the whole site)

At `55%`, every artefact is flat and camera-facing, so a rendered plane and a DOM `<div>` are
indistinguishable. Project each artefact's world position to screen space, spawn DOM nodes at
those exact rects, unmount the canvas on the same frame.

```tsx
const rects = artefacts.map(a => {
  const v = a.position.clone().project(camera)
  return {
    x: (v.x * 0.5 + 0.5) * innerWidth,
    y: (-v.y * 0.5 + 0.5) * innerHeight,
    w: a.userData.w * (1 / -v.z), h: a.userData.h * (1 / -v.z),
    r: a.userData.rotation,
  }
})
setMode('dom')                      // canvas unmounts
Flip.fit(domNodes, rects)           // DOM lands exactly where 3D was
```

Build and prove this seam in isolation before modelling anything. Two days of spike work that
de-risks four weeks of build. If it is off by more than 2px the illusion dies.

---

## §3 · SIXTEEN → ONE ★
`700–950vh` · pinned · scrub 1 · **pure DOM, no 3D**

The centrepiece. Named after your own case study.

### What you see

16 panels scattered across the viewport at hand-placed positions and rotations, greyscale,
thin `#5B3F8A` borders. Then they converge into a single dashboard.

Top-right corner, 13px monospace, `--text-muted`: `16 systems` → counts down → `1 system`.

### The sixteen — exact content

| # | Scattered state | Resolved state | Grid area |
|---|---|---|---|
| 1 | `WhatsApp · 47 unread` | Orders inbox | `ord` |
| 2 | `Sheet3.xlsx` fragment | Stock table | `ord` |
| 3 | `Missed call ×3` | Customer record | `feed` |
| 4 | handwritten slip | `ORD-4471` row | `ord` |
| 5 | `₹ ?` | `₹ 4,21,900` revenue KPI | `kpi` |
| 6 | `where is order 41` | `ORD-0041 · out for delivery · 14:20` | `map` |
| 7 | stock count on paper | `Inventory · 1,284 units` | `kpi` |
| 8 | quote, computed by hand | `Quote · 0.4s` | `kpi` |
| 9 | delivery slot clash | Dispatch calendar | `map` |
| 10 | `batch no.?` | Batch traceability | `ord` |
| 11 | vendor bill, spiked | Payables | `feed` |
| 12 | `which plant made this` | Plant filter | `nav` |
| 13 | reorder guess | Reorder alert | `feed` |
| 14 | customer name, misspelt ×3 | Single customer profile | `ord` |
| 15 | photo of a ledger page | Ledger view | `nav` |
| 16 | `the founder remembers everything` | **becomes the dashboard frame itself** | `stage` |

Panel 16 is the point of the whole section. It does not become a widget — it expands to become
the container holding the other fifteen. What lived in one person's head is now the system.

### Resolved layout

```css
grid-template-areas:
  "nav  head head head"
  "nav  kpi  kpi  kpi "
  "nav  ord  ord  map "
  "nav  ord  ord  feed";
```

### The animation

| Scroll | What happens |
|---|---|
| `0–15%` | Scattered, greyscale, drifting ±2px. Counter reads `16 systems`. |
| `15–70%` | `Flip.from()` converges all 16. `power2.inOut`, `stagger {amount:0.4, from:'random'}`, `absolute:true`. Every panel rotates to exactly `0deg`. Greyscale lifts to full colour across the move. |
| `40–55%` | **Content swaps mid-flight**, 120ms crossfade, while panels are still moving. `₹ ?` → `₹ 4,21,900`. Invisible during motion; you only notice afterwards that the question became an answer. |
| `70–80%` | Panel 16 expands to become the dashboard chrome. Counter hits `1 system`. |
| `80–90%` | `--accent-gold` arrives on the KPI row only. First gold since §1. |
| `90–100%` | Unpin. Dashboard stays live: revenue counter increments, one row highlights, a status dot pulses. Three seconds of life so it reads as software, not a screenshot. |

### Copy

None during the convergence. Deliberate — it is the best moment on the site and words would
get in front of it. After unpin, one line, small, centred:

> ✎ Sixteen problems. One screen.

---

## §4 · WHAT WE BUILD — the facet wall
`950–1650vh` · right panel pinned · left column scrolls

Terminal's split, cut for you. Left: six chapters. Right: an SVG lattice that draws itself.

### Layout

`>1024px`: left column `42%`, right panel `52%`, gap `6%`. Panel is `72vh`, rounded `20px`
with one notched corner via `clip-path`, `1px rgba(124,34,212,.22)` border, internal 1px grid
at 8% opacity with a radial fade mask.

`<1024px`: **unpinned.** Lattice renders once above the chapters as a static SVG that draws on
entry. Chapters stack as normal text.

### The six chapters — exact copy

Each: chapter number in 13px monospace `--accent-gold`, heading at `clamp(28px,3.2vw,52px)`,
body at `clamp(17px,1.4vw,22px)` with Terminal word-fill.

**`01` We start where it hurts**
> ✎ Not with a platform. With the one thing that breaks every week. We sit with the people
> doing the work and find the step where the business stops being able to answer its own
> questions.
> *Lattice: one node, pulsing `--accent-teal`. Label:* `BOTTLENECK`

**`02` Your data, in one place**
> ✎ Orders, stock, customers, costs. Usually these live in four places and agree with each
> other never. First we make one version true.
> *Lattice: +3 nodes, +4 edges drawn with `DrawSVG`.*

**`03` The workflows that run themselves**
> ✎ The follow-up that always gets forgotten. The reorder nobody flagged. The status update
> that needed a phone call. These stop being someone's job.
> *Lattice: automation edges gain travelling dots on an independent loop — the only
> non-scrubbed motion in the section.*

**`04` Models that actually know your business**
> ✎ Generic AI knows language. Yours needs to know that a 1.5kg black forest takes four hours
> and that Plant 2 runs slow on Fridays. We build on your data, not the internet's.
> *Lattice: a denser cluster attaches, visibly higher edge-count than the rest.*

**`05` One screen for the people who run it**
> ✎ The owner should not need to ask three people to know how the business is doing. One
> screen, current, honest.
> *Lattice: dashboard node, larger, gold-stroked.*

**`06` It grows when you do**
> ✎ Start with what hurts most. Add the rest when it starts to matter — not before.
> *Lattice: ghost nodes at the edges, dashed, unbuilt capacity.*

### The floating annotation

Terminal's `ASSIGN TO SPOT 11` chip. Yours changes per chapter — 12px monospace,
`--accent-gold`, on a blurred dark chip, 200ms fade + 4px rise on change:

```
01  BOTTLENECK: ORDER INTAKE
02  SYNCING · 3 SOURCES
03  14 WORKFLOWS ACTIVE
04  MODEL v4 · TRAINED ON 41,882 ORDERS
05  QUOTE GENERATED · 0.4s
06  +6 NODES AVAILABLE
```

### Dimension lines

CAD-style, thin with tick ends, monospace measurements. Pure decoration and worth every pixel
for engineering credibility: `847 orders/day` · `3 plants` · `11s → 0.4s` · `16 → 1`.

---

## §5 · THE THREAD — proof
`1650–2000vh` · pinned · scrub 1 · pure DOM

A WhatsApp-grammar thread crystallises into a table. The most literal, most persuasive
animation on the site — your prospect is running their business in a thread right now.

### The thread — exact content

Phone-shaped frame, `380×720`, `#120E1C`. Dark purple-tinted bubbles — **not WhatsApp green,
not their logo, not their exact geometry.** Grammar, not trade dress.

```
                          Hi need a cake for saturday   14:02
  ok! what flavour?                                     14:09
                                     black forest 1kg   14:11
  ₹1240 ok?                                             14:31
                                      ok. and delivery? 15:47
                    actually make it 1.5kg sorry 🙏      16:20
  ok                                                    19:02
                             did u get my last msg?     21:44
                                     hello?             23:16
```

Boring and true. The tedium of `did u get my last msg?` is what makes it land. Invent nothing
dramatic.

### Resolved table

```
ORD-4471   Anjali M.   Black Forest · 1.5kg   ₹1,860   Sat 14:00   ● Confirmed
ORD-4472   Rehan S.    Red Velvet · 500g      ₹680     Sat 11:00   ● In oven
ORD-4473   Priya K.    Custom · 2 tier        ₹3,100   Sun 16:00   ● Quoted
```

### The animation

| Scroll | What happens |
|---|---|
| `0–30%` | Thread scrolls upward at reading speed. Messages arrive with a 6px rise. |
| `30–75%` | `Flip.from()` with `props:'borderRadius,backgroundColor,color'`. Bubbles square their corners, lose their tails (`::after` scales to 0 over the first 30%), drop to `background: transparent`, align to a baseline grid. Outbound messages travel furthest — the long diagonal from `margin-left:auto` to column 1 is the most dramatic path. |
| `75–90%` | `font-variant-numeric: tabular-nums` engages; the currency column snaps into alignment. |
| `90–100%` | Cells that were **never in the thread** fade in last, in `--accent-gold`: order IDs, statuses, delivery slots. The system does not just organise what you had — it knows things you did not. |

### Copy

Above: ✎ **This is the whole product.**
Below, after resolve: ✎ Same information. Now it can be asked a question.

### Reuse

One `<Thread>` component, nine JSON files — one per case study. Nine bespoke-feeling
animations for the cost of one, giving every case study page a signature moment.

---

## §6 · THE WORK — nine case studies
`2000–2600vh` · normal scroll · **motion stops**

After 2000vh of animation, stop. Let the writing work — it is genuinely good and it does not
need help. This section is editorial: large type, generous leading, real reading.

Nine cards, alternating left/right, each: index in monospace, title, industry label, two-line
pull quote, `→ Read`. Route to `/case-studies/[id]` — already built.

| # | Title | Industry label |
|---|---|---|
| 01 | Running a Home Bakery Like a Logistics Company | Home bakery · Mumbai |
| 02 | Turning Dead Stock into Matched Demand | Diamonds & jewellery |
| 03 | Sixteen Problems, One Screen | Multi-vertical group |
| 04 | Student Housing, Off WhatsApp | Student housing |
| 05 | Selling Everywhere, Remembering Nothing | Omnichannel retail |
| 06 | Multiple Plants, Thousands of Batches, No Single View | Textile manufacturing |
| 07 | The Quote That Used to Require an Expert | Industrial supply |
| 08 | Now Selling Trust, Not Just Flats | Real estate |
| 09 | The Manager Who Knows | Operations management |

**Open decision:** your case studies are currently anonymised — I verified that zero client
names appear in `full_case_studies_complete.json`. The industry labels above are my reading of
each study's content, and the pairing to specific clients (Cake O Clock → 01, TDM Fabrics →
06, The Commun → 04, Éclat Diamonds → 02, Samruddhi/Babey → 08) is inference, **not
confirmed.** If you name them, this section gets materially stronger and the logo wall in §7
becomes clickable. That is your call and it needs client sign-off.

**Motion:** cards rise 24px with `power3.out` on entry, `stagger 0.06`. Card hover: image
scales `1.03`, gold arrow slides 6px. Clicking runs the shared-element `Flip` transition from
`08 §7` — the card's rect becomes the detail page's hero. That transition is the single most
impressive interaction on the site and it is ~40 lines.

---

## §7 · THE CLIENTS
`2600–2900vh` · normal scroll

13 logos from `public/assets/`: Babey Infratech, BFC, Blup, Cake O Clock, Éclat Diamonds,
Ivory Rose, KCC, Landspeaks, Samruddhi Developers, Suntek Group, TDM Fabrics, The Commun,
Wild Over Words.

Not a marquee. A **static grid**, 4 columns desktop / 2 mobile.

- Default `grayscale(1) opacity(.45)`
- Entry: `y:20, opacity:0`, `stagger {amount:.6, from:'random'}`
- Hover: full colour, `scale(1.04)`, 250ms — **and every other logo drops to `opacity(.2)`.**
  The dimming of the others is what makes it read as designed rather than merely interactive.

Heading: ✎ **Thirteen businesses that stopped running on memory.**

---

## §8 · SEE BEYOND — the close
`2900–3250vh` · pinned · scrub 1

The stone returns, now fully cut. Dead centre, dead still, no rotation.

A single beam of white light enters from screen left, refracts through it, and exits right as
a labelled spectrum:

```
white light in  →  ◈  →  ┌─ orders, tracked
                          ├─ stock, live
                          ├─ quotes, instant
                          ├─ delivery, visible
                          └─ margin, known
```

One input, every answer. Literally what a gemstone does; literally what a system does.

**Technique:** SVG overlay composited on the 3D — cheaper and far sharper than real caustics.
`DrawSVG` the beam, then stagger the five spectrum labels with `SplitText`.

**Copy:**

```
See beyond.
```

`clamp(56px,9vw,140px)`, `--accent-gold`. The only time the tagline appears on the page, and
the last gold on the site.

Below: **Connect With Us** — your existing CTA, purple pill, arrow.

---

## §9 · Footer

Standard. Nav (HOME · BUILD · TOOLS · CONTACT), Medium link (`@caratsenseAI` — *The Operator's
Brief*), email, LinkedIn. One thin `20°` facet line above it with a gold node at the viewport
edge.

---

## Gold discipline

Gold `#D4AF37` appears exactly **six times** on the entire page:

1. §1 headline line 2 resolving
2. §3 KPI row on arrival
3. §4 chapter numbers + the annotation chip
4. §5 the cells that were never in the thread
5. §8 the spectrum labels
6. §8 "See beyond."

That is the discipline. Gold is the payoff colour — it marks *resolution*. If it appears in a
seventh place, cut it. Purple builds, magenta moves, gold resolves.

---

## What blocks the build

1. **Client naming** (§6/§7) — changes content architecture. Needs your decision + sign-off.
2. **3D budget** (§1/§2/§8) — if it is not there, §1 and §2 collapse into the SVG variant from
   `01`'s last section and §8 becomes pure SVG. The site still works; read `09 §6`.
3. **✎ copy sign-off** — roughly 20 new lines, all marked.

Nothing else is blocked. §3, §4, §5, §7 can start today with what is in the repo.

**Build order:** `08` micro-motion → §3 → §5 → §4 → §7 → §6 → §1/§2/§8 last.
Sections 3, 4, 5, 7 alone make a site that stands next to By-Kin or Noomo. The 3D is upside.
