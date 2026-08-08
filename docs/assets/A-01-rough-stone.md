# A-01 — The Rough Uncut Stone

**Used in:** §1 hero (static base + input to `A-03`) · **Priority: P0**
**Pipeline:** ① GPT Image Gen → ② Whisk variations → feeds ③ Kling/Veo in `A-03`
**Deliver:** `public/render/A-01_rough-stone.webp` — 2048×2048, plus 3 approved variants

---

## What it has to do

This is the first thing anyone sees. It must read as **geological, not jewellery.** A sparkly
diamond kills the whole positioning — it says luxury retail. A rough, matte, fractured mineral
says *raw material that has not been worked yet*, which is the entire premise.

Think: a specimen on a geology bench. Not a ring.

---

## Prompt 1 — the base render `v2`

> Paste into GPT Image Gen. Aspect **1:1**, highest quality.
> **v1 failed — see §Generation log. Use this version.**

```
A single rough, uncut mineral specimen floating in absolute darkness, centred,
photographed like a geological sample on a laboratory bench.

The stone is NEUTRAL GREY — desaturated, almost colourless, like raw quartz
rough or unpolished corundum. It has NO purple or violet colour of its own.
Matte and cloudy. NOT polished, NOT sparkling, NOT faceted, NOT gem-quality.

Surface: irregular and geological — conchoidal fracture surfaces, frosted
patches, sharp natural cleavage planes, small chips and abrasions. It looks
mined, not bought.

Interior: deep internal fractures visible just beneath the surface, catching
light faintly, like flaws suspended in dirty ice. Roughly 60% opaque — light
enters and mostly dies inside it.

Lighting: the ONLY colour in the frame comes from a single tight violet rim
light (#A855F7) grazing the right edge and upper planes. A very dim cool key
from upper left at low intensity. No fill light.

Background: PURE BLACK #000000, absolutely flat and even, edge to edge. No
gradient, no vignette, no grey, no glow, no backdrop, no floor, no shadow,
no reflection. The stone floats in total void.

Composition: stone occupies 55% of frame height, dead centre, with large empty
black space above and below for headline text.

Rendering: photorealistic macro, 100mm lens, f/8, deep focus, entire stone
sharp. Fine film grain. High contrast, true blacks.

Absolutely no: purple or violet body colour, amethyst, sparkle, glitter, lens
flare, bokeh, rainbow, jewellery, crystal cluster, geode, healing crystal
aesthetic, grey background, gradient background, studio backdrop.
```

---

## Prompt 2 — the interior (for the dive at 40–70% scroll)

The camera passes *through* the surface. This is the frame it arrives at.

```
Extreme macro photograph from INSIDE a fractured mineral crystal, looking through
its internal flaw network.

Sheets and planes of internal fracture recede into darkness, layered like frozen
glass shattered in slow motion. Each fracture plane catches a faint violet
(#A855F7) or cold white edge-light. Between the planes: deep, near-black
cloudiness — inclusions, trapped material, opacity.

The feeling is claustrophobic and unresolved. This is what "the business is
opaque" looks like from the inside.

Lighting: fractures self-illuminate faintly at their edges only. No external
light source visible. 90% of the frame is near-black.

Composition: the fracture planes radiate from the centre outward toward the
frame edges, creating a tunnel/vortex reading — the camera is travelling INTO
this space.

Rendering: photorealistic, shallow depth of field on the nearest fracture plane
with the rest falling off into darkness. Heavy fine grain. Cinematic, cold,
violet-shifted shadows.

No: sparkle, rainbows, crystals with clean geometry, sci-fi glow, particles,
lens flare.
```

---

## Prompt 3 — style-lock variants (Google Whisk)

Once **Prompt 1** produces a keeper, use Whisk to generate the intermediate cut states for the
six-facet sequence in `scroll-concepts/01`.

| Whisk slot | Input |
|---|---|
| **Style** | your approved A-01 output |
| **Subject** | a reference image of a partially-cut gem rough (search "gemstone rough preform") |
| **Scene** | leave empty — you want the black void from the style image |

Prompt field:

```
Same stone, same lighting, same black void — but with N flat polished facets cut
into the surface. The cut facets are smooth and catch light cleanly; the rest of
the stone remains rough and matte. The contrast between cut and uncut surface is
the subject.
```

Run at `N = 1, 2, 3, 4, 5, 6`. Six outputs. These become the morph states.

---

## Generation log

### Round 1 — 8 Aug 2026, GPT Image Gen

**Prompt 2 (interior) — ✅ APPROVED, first attempt.**
Radiating fracture planes from a dark centre, violet edge-light only where geometry catches
it, true blacks, good grain. The dark centre gives `A-03c`'s camera somewhere to travel into,
which is exactly the vortex read that clip needs. Shipped as `A-01_interior.webp`.

**Prompt 1 v1 (rough stone) — ❌ REJECTED.**

| Criterion | Result |
|---|---|
| Pure black background | **Fail** — charcoal grey with a visible gradient/vignette |
| Desaturated, cool grey-violet | **Fail** — saturated amethyst purple |
| Geological, not precious | **Fail** — read as a crystal-shop specimen |
| Internal fractures visible | Fail — fully opaque |
| Matte, unfaceted, no sparkle | ✅ Pass — surface texture was genuinely good |

**Root cause: the stone was purple.** That violates `design-language.md` §6 — *purple is in
the technology, never in the material.* The rough stone represents the client's business
before you touch it: unworked, neutral, grey. Violet must arrive **only as rim light**,
because violet is what CaratSense brings. A stone that is already purple is already yours
before you have cut anything, and the entire six-facet sequence loses its argument.

**Fixes applied in v2:**
- `NEUTRAL GREY … like raw quartz rough or unpolished corundum` — kills the amethyst
  association, which is what "grey-violet mineral" in v1 was quietly inviting
- `It has NO purple or violet colour of its own` — stated as an explicit prohibition
- `PURE BLACK #000000, absolutely flat` plus an explicit no-gradient/no-vignette list —
  image models drift to grey unless you insist three separate ways
- `looks mined, not bought` — the single most useful phrase in the prompt
- Added `amethyst`, `crystal cluster`, `geode`, `healing crystal aesthetic` to negatives

---

## Acceptance criteria

Reject the output and regenerate if **any** of these are true:

- [ ] It sparkles, glitters, or throws rainbow dispersion → it reads as jewellery
- [ ] It has clean geometric faceting → it is already cut, defeating the whole point
- [ ] The background is not pure black, or has a visible gradient / vignette / floor
- [ ] There is a reflection or shadow beneath it
- [ ] The centre 40% is visually busy → headline has nowhere to sit
- [ ] It is warm-toned → must be cool grey-violet
- [ ] It looks CGI-smooth → needs surface irregularity and grain

---

## Output spec

```
A-01_rough-stone.webp          2048 × 2048   base, for §1 static tier
A-01_rough-stone@2x.webp       4096 × 4096   master, source for A-03
A-01_interior.webp             2048 × 2048   prompt 2 output
A-01_cut-01.webp … cut-06.webp 2048 × 2048   the six Whisk states
```

All with a sidecar `.txt` recording prompt + tool + seed.

---

## Fallback if this fails

If after ~20 attempts nothing reads as *geological rather than precious*, abandon photoreal and
switch to the **SVG facet-plan** variant described at the end of
`scroll-concepts/01-the-cut.md`. It is a flat technical drawing of a round-brilliant facet
layout, it weighs 40KB, it is razor sharp on every display, and it carries the identical
argument. That is a legitimate outcome, not a defeat — and honestly it may suit the "we remove
unnecessary complexity" positioning better.
