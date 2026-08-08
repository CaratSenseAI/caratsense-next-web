# CaratSense AI — Build Plan

**The single source of truth.** What we are building, in what order, with which assets, and
where each one comes from.

| Doc | Purpose |
|---|---|
| **`BUILD-PLAN.md`** ← you are here | What goes where. Asset manifest. Build order. |
| [`design-language.md`](design-language.md) | Colour, type, components, art direction |
| [`scroll-concepts/10-THE-BUILD.md`](scroll-concepts/10-THE-BUILD.md) | Section-by-section scroll spec with exact copy |
| [`scroll-concepts/`](scroll-concepts/) `01–09` | The concept space and reasoning behind it |
| [`assets/`](assets/) `A-01 … A-13` | Generation prompts for things that must be generated |

---

## 1. The one rule that decides everything

> **If it is made of rectangles, text, and colour — it is HTML.**
> **If it is made of light, material, or a camera — it is generated.**

Everything we tried to generate that broke — the chat bubbles, the spreadsheet fragments, the
dashboard, the filename chip — broke because it was **interface**, and image models cannot draw
interface. They garble strings, refuse alpha, invent glows, and cannot do arithmetic.

`wa-02` came back as a transparent checkerboard with the bubble missing entirely. That is not a
prompt problem. It is the wrong tool.

Meanwhile everything that *is* photographic — the stone, the interior, the ledger, the notebook
— came back excellent on the first or second attempt.

### The split, applied

| Generate | Build in HTML/CSS/SVG |
|---|---|
| Stone, gem, fracture interior | Every chat bubble |
| Paper, ledgers, challans, sticky notes | Every spreadsheet fragment |
| Physical objects — spike, chai, pen, clip | The whole dashboard |
| The operator's desk | All metric tiles and counters |
| Workshop / factory / kitchen interiors | The facet lattice |
| Wireframe digital twins | The refraction spectrum |
| Camera moves (as frame sequences) | Grain, grid, caustics, vignette |
| Paper textures | The logo animation |
| Calculator LCD *(it is a photograph of a material)* | Telemetry chips, dimension lines |

**Practical consequence:** 12 of the 34 artefact sprites and all of `A-06` move out of the
generation queue. That is roughly a third of the asset workload deleted, and the results get
*better* — sharp at every DPI, correct text, animatable, translatable, and about 40KB instead
of 900KB.

---

## 2. What the site is

A dark, scroll-driven site for a Mumbai software studio that replaces WhatsApp-and-spreadsheet
operations at SMBs with one custom system.

**The concept:** your name is *Carat*. Gemstones are graded on four Cs — Carat, **Cut**,
Colour, **Clarity** — and your homepage already promises "operational clarity." A rough stone
becomes a brilliant-cut gem; business chaos becomes operational clarity. Same transformation.
You do not add to a stone — you *remove* until light passes through it, which is exactly what
your case studies describe.

**Total scroll:** ~4,850vh across 9 sections, ~2,750vh of it pinned.

**Clients are named.** Confirmed decision. See §6 for the pairing table that still needs
filling in.

---

## 3. Section map

| § | Section | Scroll | Pinned | Generated assets | HTML |
|---|---|---|---|---|---|
| 0 | Loader | — | — | — | cut counter, SVG mark |
| 1 | **HERO** — the rough stone | `0–400vh` | ✓ | `A-01` stone + interior, `A-03` dive seq | headline, artefact overlays |
| 2 | **THE MESS** — suspension | `400–700vh` | ✓ | `A-04` desk, `A-05` paper seq | text fill, artefact sprites |
| 3 | **SIXTEEN → ONE** ★ | `700–950vh` | ✓ | **none** | all 16 panels + dashboard |
| 4 | **WHAT WE BUILD** — facet wall | `950–1650vh` | ✓ panel | `A-07` twins (optional) | SVG lattice, chapters, chips |
| 5 | **THE THREAD** — proof | `1650–2000vh` | ✓ | **none** | chat → table, all DOM |
| 6 | **THE WORK** — 9 case studies | `2000–2600vh` | — | `A-08` 9 heroes + 9 wires | cards, type, transitions |
| 7 | **THE CLIENTS** — 13 logos | `2600–2900vh` | — | existing logo files | thin-grid wall |
| 8 | **SEE BEYOND** — CTA | `2900–3250vh` | ✓ | `A-09` gem | SVG spectrum, headline |
| 9 | Footer | — | — | — | all |

★ = build first. Exact copy for every section is in `scroll-concepts/10-THE-BUILD.md`.

**Note that §3 and §5 — the two most persuasive sections on the site — need zero generated
assets.** Start there.

---

## 4. Asset manifest

### Generated — still to do

| ID | Asset | Count | Status |
|---|---|---|---|
| `A-01` | Rough stone, fracture interior | 2 | ✅ **done** |
| `A-02` paper | Slips, challans, bills, ledgers, stickies, envelope | 14 | ✅ **done** |
| `A-02` object | spike · stamp · clip · chai · chai-ring · pen · tape · rubber-band | 8 | prompts ready |
| `A-02` calc | `calc-01` calculator LCD macro | 1 | prompt ready |
| `A-03` | Hero dive — 3 clips → 90 frames | 1 seq | needs `A-01` padded to 16:9 |
| `A-04` | Operator's desk — wide, top-down, after | 3 | prompts ready |
| `A-05` | Paper storm — 3 clips → 72 frames | 1 seq | needs `A-04` top-down |
| `A-07` | Wireframe twins — photoreal + wire pairs | 7×2 | prompts ready |
| `A-08` | Case study heroes + wire twins | 9×2 | **blocked on pairing** |
| `A-09` | Brilliant-cut gem + rotation | 1 + 1 seq | prompts ready |
| `A-10` | Light ribbons | 3 | optional — cut first if short |
| `A-11` | Ledger paper, plain paper textures | 2 | prompts ready |
| `A-12` | Logo crystal *(OG image only)* | 1 | optional |

### HTML — deleted from the generation queue

Everything here was previously an asset prompt. It is now a component.

| Component | Replaces | Where |
|---|---|---|
| `<ChatBubble>` | `wa-01`…`wa-06` | §1, §2, §3, §5 |
| `<SheetFragment>` | `xl-01`, `xl-02` | §1, §2, §3 |
| `<FileChip>` | `xl-03` | §1, §2, §3 |
| `<AlertRow>` | `call-01`, `wa-05` | §1, §2, §3 |
| `<Plate>` | `q-mark` | §1, §2, §3 |
| `<Dashboard>` | `A-06` dashboard | §3 |
| `<SheetHell>` | `A-06` spreadsheet-before | §3, case studies |
| `<MetricTile>` | `A-06` tiles | §3 |
| `<FacetLattice>` | — | §4 |
| `<Spectrum>` | `A-09` spectrum | §8 |
| `<TelemetryChip>` | — | §4, §6, §7 |
| `<DimensionLine>` | — | §4 |
| `<Grain>` `<Grid>` `<Caustic>` | `A-11` grain/grid/caustics | global |
| `<Mark>` | `A-12` concept 1 | nav, loader |

Specs for all of these are in `HTML-COMPONENTS.md`.

---

## 5. Build order

### Phase 1 — foundation `no assets needed`
1. Dark theme tokens into `globals.css` per `design-language.md` §3
2. Geist + Geist Mono via `next/font`
3. `npm i @gsap/react`; `MotionProvider` with ScrollSmoother
4. Micro-motion layer — `scroll-concepts/08`: text fill, headline reveal, nav, counters, easing
5. `<Grain>`, `<Grid>`, section seams
6. **Retire:** `AuroraBackground`, `ElegantShapes`, `GemstoneCanvas`, `HeroOrganicNetwork`,
   `PhysicsOverlay`, `ZoomParallax`. Drop `three`, `@react-three/*` (~600KB).

### Phase 2 — the centrepiece `no assets needed`
7. **§3 Sixteen → One.** All 16 panels as HTML, `Flip` convergence.
8. **§5 The Thread.** `<ChatBubble>` → table crystallisation, `Flip` with `props`.
9. §7 client wall — logo files already exist.

*Stop here and you have a site that stands next to By-Kin or Noomo.*

### Phase 3 — assets arrive
10. §1 hero — pad `A-01` to 16:9, generate `A-03`, wire the frame-sequence player
11. §2 the mess — `A-04` desk, then `A-05` *(or the DOM-sprite version, see `A-05` §Cheaper)*
12. §4 facet wall — SVG lattice + optional `A-07` twin
13. §6 case studies — needs `A-08`, needs the pairing confirmed
14. §8 see beyond — `A-09` + SVG spectrum

### Phase 4 — polish
15. `A-10` ribbons if budget allows, page transitions, shared-element card→detail `Flip`,
    device tiering, reduced-motion pass, perf audit against `scroll-concepts/09` §5

---

## 6. Open blockers

**1. Client ↔ case study pairing.** Three studies have no client, six clients have no study.
`A-08` cannot start until this is filled in.

| # | Case study | Client | Confidence |
|---|---|---|---|
| 01 | Running a Home Bakery Like a Logistics Company | Cake O Clock | high |
| 02 | Turning Dead Stock into Matched Demand | Éclat Diamonds | high |
| 03 | Sixteen Problems, One Screen | **?** | — |
| 04 | Student Housing, Off WhatsApp | The Commun | high |
| 05 | Selling Everywhere, Remembering Nothing | **?** | — |
| 06 | Multiple Plants, Thousands of Batches | TDM Fabrics | high |
| 07 | The Quote That Used to Require an Expert | Suntek Group | medium |
| 08 | Now Selling Trust, Not Just Flats | Samruddhi *or* Babey | medium |
| 09 | The Manager Who Knows | **?** | — |

Unassigned: BFC · Blup · Ivory Rose · KCC · Landspeaks · Wild Over Words

**2. Written client sign-off** for naming — especially Éclat (dead stock is competitively
revealing) and the real-estate clients.

**3. `logo-mark.png`** — three strokes only, no wordmark, no badge, transparent, ≥2048px.
Blocks `A-12`, the loader, and the nav mark. `backgroundless-logo.jpeg` will not work (no alpha).

**4. ~20 lines of new copy** marked ✎ in `scroll-concepts/10-THE-BUILD.md`.

---

## 7. Canonical data

Every artefact, panel and table on the site uses these exact values. They reconcile.

```
Order          ORD-4471
Customer       Anjali M.
Item           Black Forest · 1.5 kg
Rate           ₹ 1,660.00
CGST 6%        ₹    99.60
SGST 6%        ₹    99.60
──────────────────────────
Total          ₹ 1,859.20   → rounded ₹ 1,860
Slot           Sat 14:00
Status         Confirmed
```

Dashboard figures: `₹ 4,21,900` revenue · `47` open orders · `1,284` units · `0.4s` quote ·
`94%` on-time · `3` plants.

Indian digit grouping everywhere — `Intl.NumberFormat('en-IN')`. Never `421,900`.

---

## 8. Tech

```
next 15.5 (turbopack) · react 19.1 · tailwind 4 · typescript 5
gsap 3.15  →  ScrollTrigger · Flip · SplitText · ScrollSmoother · MorphSVG · DrawSVG · Observer
@gsap/react (to add)
framer-motion 12  (page transitions only)
ffmpeg + ImageMagick 7.1.2  (local, both present)
```

**No 3D at runtime.** No Blender, no After Effects, no CAD — none needed. Camera moves ship as
scroll-scrubbed WebP sequences, which is what Apple does and which runs at 60fps on hardware
where live 3D would crawl. Full reasoning in `scroll-concepts/09` §6.

### Perf budget

| Metric | Target |
|---|---|
| LCP | < 2.0s on 4G |
| CLS | < 0.05 |
| Initial JS gzipped | < 200KB |
| Per frame sequence | ≤ 2.5MB desktop, ≤ 900KB mobile |
| Frame time during scrub | < 8ms |

Animate `transform` and `opacity` only. `ease: 'none'` on every scrub. Never more than two
pinned sections in the viewport at once.

---

## 9. Generation lessons learned

Carry these into every remaining prompt. All three were paid for in round 1.

**Never ask for a transparent background.** GPT Image Gen cannot output alpha. It fakes
isolation with a glow on a grey ground — or, as `wa-02` showed, returns a transparent canvas
with the subject missing. Ask for `PURE BLACK #000000, absolutely flat`, then key it out:

```bash
magick in.png -alpha off \
  \( +clone -colorspace Gray -level 4%,26% \) \
  -compose CopyOpacity -composite -trim +repage out.png
```

**Never let the accent colour touch the subject.** Ask for a violet rim light on a grey stone
and you get a violet stone. State the material colour as a prohibition, separately from the
lighting: *"It has NO purple or violet colour of its own."*

**Never generate text you care about.** Six typos and two broken sums out of twelve text-bearing
images, plus the same single handwriting in all of them. Generate blank substrates; set text in
DOM. Full detail and the six handwriting fonts in `assets/A-13-text-in-assets.md`.

---

## 10. Definition of done

- [ ] All 9 sections built, copy signed off
- [ ] Every pinned section has a working unpinned `prefers-reduced-motion` equivalent
- [ ] All 9 case studies named, linked, and live at `/case-studies/[id]`
- [ ] Logo wall clickable through to case studies
- [ ] Gold appears exactly 6 times on the homepage
- [ ] Perf budget met on a real mid-range Android
- [ ] Tested: trackpad + wheel, 4× CPU throttle, mid-page reload, resize while pinned
- [ ] Every generated file has its prompt in a sidecar `.txt`
