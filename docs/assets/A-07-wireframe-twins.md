# A-07 — Photoreal → Wireframe Digital Twins

**Used in:** §4 facet wall panel, §6 case study heroes · **Priority: P1**
**Pipeline:** ① GPT Image Gen (photoreal) → ① again (wireframe pass) → **composited in CSS**
**Deliver:** `public/twin/*.webp` — two stills per scene, no video

> **No After Effects needed.** This asset is two generated images and ten lines of CSS. See
> Step 3.

**This is the Terminal Industries signature shot** — the one where a photoreal truck becomes a
glowing point-cloud wireframe while the headline sits over it. It compresses their entire value
proposition into a single image. Yours does the same, applied to your clients' worlds.

---

## The technique

Terminal does not generate this in one pass. It is two renders of the **identical scene**,
composited:

```
   Layer 1   photoreal render, warm, dimmed to ~35%
   Layer 2   wireframe / point-cloud render of the same geometry, glowing
   Mask      an animated gradient wipe between them
```

You cannot prompt an AI for "photoreal that becomes wireframe" and get a usable result. You
generate **two matched images** and animate the mask yourself. The matching is the whole craft.

---

## Step 1 — the photoreal base

The nine photoreal scenes are owned by [`A-08-case-study-heroes.md`](A-08-case-study-heroes.md),
which carries nine fully standalone prompts — bakery kitchen, diamond bench, mill floor,
housing lobby, supply counter, site office and three more. Generate and approve those first.

If you need a tenth generic scene for §4's facet-wall panel, here is a standalone prompt:

```
A photorealistic wide interior photograph of a small distribution warehouse at
night, lit only by warm practical lights inside the space.

Steel pallet racking receding into darkness, stacked cardboard cartons on
pallets, a hand pallet trolley parked at an angle, a roll cage half loaded, and a
single high-bay lamp switched on above the nearest aisle.

That high-bay lamp is the only strong light source. The racking further back falls
into deep shadow and near-black.

Camera: elevated three-quarter angle, roughly 30 degrees above eye level, wide
lens, looking down the length of the aisle. Deep focus.

Composition: the lit nearest pallet sits in the lower-right third of the frame.
The upper-left and upper-centre are dark and visually quiet — headline text will
sit there. Roughly 40% of the frame is near-black negative space.

Rendering: photorealistic, cinematic, high contrast. Fine film grain. Warm
tungsten practicals against cool near-black shadows. Desaturated by about 10%.
Shadows lifted very slightly toward violet.

Do not include: people, faces, hands, brand logos, courier or logistics company
branding, any legible text or signage, forklifts in motion, lens flare, god rays,
sparkles, dust beams, daylight, bright even exposure, vast modern fulfilment
centre scale, watermark.
```

---

## Step 2 — the wireframe twin

**Attach the approved photoreal image** and use this prompt exactly as written. It works for
every scene — bakery, mill, warehouse, sorting bench — because it describes a *conversion*
rather than a subject.

```
Using the attached photograph as an exact reference, convert this scene into a
glowing technical wireframe visualisation. Keep the camera angle, framing, object
positions, proportions and perspective absolutely IDENTICAL to the reference — the
two images must align perfectly if overlaid.

Every object in the scene is now rendered as a luminous wireframe: thin bright
edge lines tracing its geometry, plus a scattered point cloud of small glowing
dots defining its surfaces. The objects are fully transparent — you can see the
wireframe of distant objects through the ones in front.

Line colour: cold white and violet #A855F7, with occasional cyan accents. The
lines are thin, precise and technical — like CAD geometry or a LiDAR point-cloud
scan. Not neon, not sci-fi, not glowing tubes.

The overall wireframe density is sparse and elegant rather than a solid mesh. It
should read as measurement and structure, not as decoration.

Background: pure flat black #000000, completely empty. No environment, no walls,
no floor, no ambient light — only the wireframe geometry floating in void.

Rendering: crisp, high contrast, thin clean lines, fine film grain. The glow is
subtle — edges are bright but there is no heavy bloom washing them out.

Do not include: neon tube aesthetics, heavy bloom, lens flare, rainbow or
multicoloured lines, solid opaque surfaces, photographic textures, photoreal
materials, people, faces, hands, any text, numbers or labels, sci-fi HUD
elements, targeting reticles, grid floors, watermark.
```

**The geometric match is the whole requirement.** If the wireframe sits even slightly off from
the photoreal, the crossfade is worthless. Overlay the two at 50% opacity and check before
accepting. Expect several attempts — this is the hardest single thing in the asset set.

---

## Step 3 — composite in CSS

Two images, one masked layer, one scrubbed variable. No compositing software, no video, no
frame sequence. The wipe is live in the browser, which means it is sharp at every resolution
and weighs two images instead of forty frames.

```html
<div class="twin">
  <img class="twin__real" src="/twin/bakery-real.webp" alt="">
  <img class="twin__wire" src="/twin/bakery-wire.webp" alt="">
</div>
```

```css
.twin { position: relative; --p: 0; }
.twin__wire {
  position: absolute; inset: 0;
  mix-blend-mode: screen;
  mask-image: linear-gradient(110deg,
    #000 calc(var(--p) * 140% - 20%),
    transparent calc(var(--p) * 140%));
}
```

Then scrub `--p` from 0 to 1 with ScrollTrigger:

```tsx
gsap.to(el, {
  '--p': 1,
  ease: 'none',
  scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 30%', scrub: 0.8 },
})
```

Register the property so it interpolates rather than stepping:

```css
@property --p { syntax: '<number>'; inherits: false; initial-value: 0; }
```

For a **static** use (a case study card at rest), just set `--p: 0.55` — the moment both
registers are visible at once is the most legible single image.

---

## Telemetry chips

Terminal's `ASSET ON SITE`, `CHECK IN: 2:34 PM`, `44C TM3L`. Add two or three per image as DOM
overlays (never baked in — they need to be crisp and localisable):

| Scene | Chips |
|---|---|
| `bakery` | `BATCH 4471 · IN OVEN` · `READY 14:20` · `RACK 3` |
| `diamond` | `PARCEL 88-C` · `MATCHED · 41 PCS` · `2.14 CT` |
| `mill` | `PLANT 2 · LOOM 14` · `BATCH TM-3L` · `YIELD 94%` |
| `housing` | `UNIT 204 · OCCUPIED` · `RENT DUE 3D` |
| `supply` | `QUOTE · 0.4s` · `SKU 44C-TM3L` |
| `property` | `TOWER B · 12 HELD` · `SITE VISIT 16:00` |

Mono, uppercase, `0.08em` tracking, `--gold-hot` on a blurred dark chip. These do more for
perceived sophistication than anything else in this document — and because they are DOM, you
can stagger them in with GSAP as the wipe reaches each one:

```tsx
gsap.from('.chip', {
  opacity: 0, y: 4, stagger: 0.12,
  scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 40%', scrub: true },
})
```

---

## Acceptance criteria

- [ ] **Geometry matches between the two layers.** Overlay them at 50% and check.
- [ ] Wireframe reads as CAD/LiDAR, not neon or sci-fi
- [ ] No bloom heavy enough to lose line definition
- [ ] Upper-left / centre stays quiet for headline copy
- [ ] Photoreal layer has no visible brand logos
- [ ] No people, no faces
- [ ] Both layers share the same grain and grade
