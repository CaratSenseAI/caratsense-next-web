# A-10 — Ambient Light Ribbons

**Used in:** section seams, §8 background, CTA block · **Priority: P2**
**Pipeline:** ① GPT Image Gen → ③ Kling → looping video *or* still + CSS
**Deliver:** `public/amb/A-10_ribbons.webp` + optional 6s loop

Terminal's *"into one connected, automated system"* section is pure abstraction — soft pale
ribbons of light curling through near-black, slightly out of focus, drifting. It gives the eye
somewhere to rest between two dense sections without introducing new information.

This is the lowest-priority asset here and the easiest to overdo.

---

## Prompt — the ribbon field

Aspect **16:9**.

```
An abstract photograph of soft, pale ribbons of light curling slowly through
near-total darkness.

The ribbons are smooth and organic — like silk caught in slow motion, or smoke
lit from one side, or the soft edge of a wave. They have gentle tapering points
and broad soft midsections. Three or four ribbons cross the frame at different
depths.

Colour: mostly desaturated pale grey-white, with a faint cool violet tint in the
midtones and a barely-there magenta in the deepest folds. Almost monochrome.

Background: near-black #050309. The ribbons emerge from and dissolve back into
darkness at the frame edges.

Focus: the nearest ribbon is soft and slightly out of focus; the mid-depth
ribbon is sharpest; the far ribbons dissolve into darkness. Shallow depth of
field throughout.

There is a very faint square grid visible in the darkness behind everything, at
about 4% opacity, like a technical drawing showing through.

Composition: the ribbons occupy the upper and lower thirds, leaving the centre
horizontal band relatively empty for headline text.

Rendering: photorealistic, cinematic, extremely high contrast — 85% of the frame
is near-black. Fine grain. Calm, quiet, restrained.

No: neon, saturated colour, rainbow, sparkles, particles, stars, nebula, fire,
liquid metal, chrome, sci-fi, lens flare, bloom, text.
```

---

## Motion — two options

### Option A: CSS only (recommended)

Generate **three** stills from the prompt above. Layer them, and drift each at a different very
slow rate with a long-period transform. No video, no frames, ~180KB total.

```css
.amb { position: absolute; inset: -10%; opacity: .5; }
.amb--1 { animation: drift 64s ease-in-out infinite alternate; }
.amb--2 { animation: drift 91s ease-in-out infinite alternate-reverse; opacity: .32; }
.amb--3 { animation: drift 127s ease-in-out infinite alternate; opacity: .2; }

@keyframes drift {
  from { transform: translate3d(-2%, 1%, 0) scale(1.04) rotate(-.4deg); }
  to   { transform: translate3d( 2%,-1%, 0) scale(1.08) rotate( .4deg); }
}
```

Periods are deliberately coprime (64/91/127) so the composite never visibly repeats.

**The motion must be imperceptible.** If a viewer notices it moving, it is too fast. Halve it.

### Option B: looping video

**Tool:** Kling 2.x, image-to-video, 5s, from the approved still.

```
The ribbons of light drift and curl extremely slowly, like silk suspended in
still water. The movement is almost imperceptible — a slow, continuous, organic
undulation.

No ribbon leaves the frame. No new elements appear. The lighting and colour stay
completely constant.

Camera: completely locked. No movement.
```

**Negative prompt:** `fast movement, wind, turbulence, camera movement, zoom, colour change, particles appearing, sparkles, morphing into objects`

Loop it seamlessly:

```bash
# reverse and concat for a ping-pong loop — hides the seam entirely
ffmpeg -i A-10.mp4 -vf reverse A-10_rev.mp4
printf "file 'A-10.mp4'\nfile 'A-10_rev.mp4'\n" > l.txt
ffmpeg -f concat -safe 0 -i l.txt -c copy A-10_loop.mp4

# ship as a small muted autoplaying video
ffmpeg -i A-10_loop.mp4 -vf "scale=1600:-2" -c:v libvpx-vp9 -crf 40 -b:v 0 -an A-10_loop.webm
```

`-an` strips audio. Ship with `muted playsinline loop autoplay` and `preload="none"` — and
**skip it entirely on the `lite` and `static` device tiers.**

---

## Where it goes

| Location | Treatment |
|---|---|
| §8 background | behind the gem, `opacity: .35`, heavily darkened |
| Seam 2 (`CUT → CLARITY`) | brief full-bleed moment during the refraction wipe |
| CTA block | subtle, behind the `Connect With Us` panel |
| Footer | optional, `opacity: .15` |

**Do not put this on the hero.** §1 already has the stone. Two ambient systems competing is
noise.

---

## Acceptance criteria

- [ ] At least 85% of the frame is near-black
- [ ] Reads as *quiet*, not as a screensaver
- [ ] No saturated colour anywhere
- [ ] No recognisable shapes — the moment a ribbon looks like a face or a hand, regenerate
- [ ] Centre horizontal band clear for type
- [ ] Option A total ≤ 200KB; Option B `.webm` ≤ 900KB

---

## Honest note

This is the most cuttable asset in the folder. Terminal earns their abstract section because
it sits between two very dense ones and the page needs the breath.

If your build runs long, **cut `A-10` entirely** and use flat `--void` with the faint grid from
`A-11`. Nobody will miss it, and an empty dark section with one good sentence in it is a
perfectly respectable design decision.
