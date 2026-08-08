# A-09 — Brilliant-Cut Gem & Refraction

**Used in:** §8 `See Beyond`, `2900–3250vh` · **Priority: P1**
**Pipeline:** ① GPT Image Gen → ③ Kling → ④ 80 frames · **spectrum drawn in SVG**
**Deliver:** `public/seq/A-09_gem/0001–0080.webp` + `A-09_spectrum.svg`

The payoff. The stone from §1 returns fully cut. One beam of white light enters, and a labelled
spectrum exits. One input, every answer.

---

## Split the work

The gem is generated. **The spectrum is not.**

Trying to get an AI to render five labelled, correctly-spelled spectrum bands is a fight you
will lose. Generate the gem with the beam entering and a *suggestion* of dispersion, then draw
the labelled spectrum as an SVG overlay in the browser. It will be sharper, editable, and
accessible.

```
   ┌─ generated ──────────┐  ┌─ SVG overlay ────────────┐
   │  gem + entering beam │  │  spectrum bands + labels │
   └──────────────────────┘  └──────────────────────────┘
```

---

## Prompt 1 — the cut stone

Aspect **1:1**.

```
A single brilliant-cut gemstone, perfectly still, centred in absolute darkness.

The stone is now fully cut and polished — clean flat facets meeting at precise
edges, geometric and symmetrical, the classic round brilliant facet arrangement.
It is transparent and clear: light passes cleanly through it. All the cloudiness
and internal fracture is gone.

Colour: near-colourless with a faint cool violet cast. Highly transparent.

Lighting: a single narrow beam of white light enters from the left edge of the
frame, strikes the stone, and passes through it. The beam is visible as a thin
clean shaft — not a wide glow, not volumetric fog. Where it exits the right side
of the stone it begins to separate very slightly into colour.

Background: pure black #050309, completely empty. No floor, no shadow, no
reflection.

Composition: the stone sits dead centre, occupying about 35% of the frame height.
Very generous empty space left and right — a light beam enters from the left and
a spectrum will be added on the right in post.

Rendering: photorealistic macro, deep focus, the whole stone sharp. Very fine
grain. High contrast, clean blacks.

No: heavy rainbow explosion, sparkle bursts, lens flare, glitter, jewellery
setting, metal, prongs, hands, text, background gradient, fog.
```

> Ask for *"begins to separate very slightly"* — if you ask for a rainbow you will get a
> Pink Floyd album cover.

---

## Prompt 2 — the rotation clip

**Tool:** Kling 2.x, image-to-video, 5s
**Input:** the approved Prompt 1 output

```
The gemstone rotates extremely slowly on its vertical axis — no more than 20
degrees across the entire shot. As it turns, its facets catch the entering light
beam at changing angles and the light passing through shifts subtly.

The entering beam stays fixed in position on the left. The stone is the only
thing that moves.

The rotation decelerates and comes to a complete stop by the final frame, with
the stone perfectly still and facing forward.

Camera: completely locked. No dolly, no pan, no zoom, no shake.

Background stays pure black and empty throughout.
```

**Negative prompt:** `fast rotation, spinning, camera movement, zoom, sparkle bursts, rainbow explosion, shattering, particles, glitter, bloom, fog, text`

Extract to 80 frames per `00-ASSET-INDEX` §Frame extraction. Budget ≤ 2.2MB.

---

## The SVG spectrum overlay

Hand-authored, drawn on scroll with `DrawSVG`. This is a design task, not a generation task.

```
   beam in                    gem                spectrum out
   ────────────────────────►   ◈   ──────┬──── orders, tracked
                                          ├──── stock, live
                                          ├──── quotes, instant
                                          ├──── delivery, visible
                                          └──── margin, known
```

Band colours, top to bottom — a violet→gold ramp rather than a literal rainbow, so it stays on
brand:

```
#C9A6FF   orders, tracked
#A855F7   stock, live
#E879B8   quotes, instant
#F2CE5B   delivery, visible
#D4AF37   margin, known
```

Animation:

```tsx
const tl = gsap.timeline({
  scrollTrigger: { trigger: sec, start: 'top top', end: '+=350%', pin: true, scrub: 1 },
})

tl.from('#beam',  { drawSVG: '0%', ease: 'none' })              // beam enters
  .from('#bands', { drawSVG: '0%', stagger: 0.08, ease: 'none' }, '>-0.1')
  .from('.band-label', { opacity: 0, x: -8, stagger: 0.08 }, '<0.2')
  .from('#see-beyond', { opacity: 0, y: 20, duration: 0.6 })    // the headline
```

Labels are real `<text>` nodes — selectable, translatable, and screen-reader legible. That is
the whole reason not to generate them.

---

## Copy

```
See beyond.
```

`clamp(56px, 9vw, 140px)`, `--gold`. The only appearance of the tagline on the page, and the
last gold on the site.

---

## Acceptance criteria

- [ ] The stone is **clearly cut** — geometric facets, obviously different from `A-01`
- [ ] It is transparent, not cloudy — the visual argument is that clarity was achieved
- [ ] No rainbow explosion. Restraint here is the difference between premium and clip-art.
- [ ] Rotation ≤ 20° and ends completely still
- [ ] Background pure black throughout all 80 frames
- [ ] Left and right thirds stay empty for the beam and spectrum
- [ ] ≤ 2.2MB

---

## Fallback: skip the video entirely

A single still gem + the SVG animation is genuinely enough here. The section's motion is
carried by the beam drawing in and the spectrum labels landing — the gem barely moves anyway.

If `A-03` and `A-05` have used the frame budget, ship `A-09` as **one image plus SVG.** Nobody
will notice, and you save 2.2MB on the heaviest page on the site.
