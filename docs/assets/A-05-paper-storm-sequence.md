# A-05 — Paper Storm Sequence

**Used in:** §2, `400–700vh`, scroll-scrubbed · **Priority: P1** · **✅ BUILT**
**Pipeline:** ① `A-04_desk-top` → ③ Kling / Veo 3 → ④ 72 WebP frames
**Deliver:** `public/seq/A-05_paper-storm/0001–0072.webp`

Gravity leaves the desk. Every piece of paper lifts and hangs suspended. This is the
emotional centre of the site — the moment the mess becomes *visible* rather than normal.

---

# INPUTS — exactly which file goes where

| Clip | Upload this file | Size | Status |
|---|---|---|---|
| **A-05a** | `A-04_desk-top.png` (the approved plate) | 1672×941 | ✅ **rendered** → `a05-clips/A-05a_lift_raw.mp4` |
| **A-05b** | `a05-inputs/A-05b_init.png` | 1920×1080 | ✅ **rendered** → `a05-clips/A-05b_drift_raw.mp4` |
| **A-05c** | `a05-inputs/A-05c_init.png` | 1920×1080 | ✅ **ready to upload** |

```
/code/caratsense/caratsense-next-web/docs/assets/generated/a05-inputs/A-05b_init.png
```

### ⚠ Strip the watermark before every hand-off

Kling stamps a 4-pointed star at **exactly `(1739, 899)`** — verified identical on A-03a,
A-03c and A-05a, so treat it as a constant. If you feed a raw final frame into the next
generation it bakes that star into the plate *and* the tool adds a fresh one on top.

```bash
cd docs/assets/generated
ffmpeg -y -sseof -0.05 -i a05-clips/A-05a_lift_raw.mp4 -an \
  -vf "delogo=x=1702:y=862:w=76:h=76" -update 1 -q:v 1 a05-inputs/A-05b_init.png

# confirm 1920x1080 and eyeball the corner
magick identify -format "%wx%h\n" a05-inputs/A-05b_init.png
magick a05-inputs/A-05b_init.png -crop 300x300+1590+750 +repage -resize 170% /tmp/wm.png
```

`delogo` rather than a black box — the star sits on lit wood grain, where a box would be
obvious.

### A-05a result

10s, 1920×1080, 24fps. Papers rise progressively off the A-04 desk plate; the camera stays
locked top-down; the solid objects (calculator, phone, chai glass, rubber stamp, ledger) stay
on the desk as instructed. Accepted.

---

## Shot breakdown

| Clip | Scroll | Frames | Move |
|---|---|---|---|
| `A-05a` | `0–35%` | 0001–0025 | Paper lifts off the desk. Slow, weightless. |
| `A-05b` | `35–75%` | 0026–0054 | Full suspension. Slow drift. Camera holds. |
| `A-05c` | `75–100%` | 0055–0072 | Everything rotates flat and faces camera. |

`A-05c` is the **seam clip** — its final frame is where the canvas hands off to DOM (see
`scroll-concepts/10-THE-BUILD.md` §2). Every object must end perfectly flat, camera-facing,
and evenly lit, or the DOM swap will be visible.

---

## Clip A-05a — the lift

**Tool:** Kling 2.x, image-to-video, 5s
**Input:** `A-04_desk-top.webp`

```
Gravity slowly disappears. Every piece of paper on the desk — order slips,
carbon-copy challans, sticky notes, bills, ledger pages, receipts — begins to
lift straight up off the wooden surface, rising slowly and weightlessly into the
air above the desk.

The papers rise at slightly different rates and drift apart as they go, each one
rotating gently and independently, like objects released in zero gravity.

Solid objects — the calculator, the chai glass, the spike file — stay on the
desk and do not move.

The camera stays locked, straight down, completely still. Only the paper moves.

Lighting stays constant and warm. As the papers rise toward the light they catch
slightly brighter highlights on their upper faces.
```

**Negative prompt:** `wind, blowing, scattering, explosion, fast motion, camera movement, camera shake, papers flying off frame, tornado, chaos, people, hands`

> The word to avoid is *scatter*. Video models interpret it as an explosion. Use **rise**,
> **lift**, **float**, **weightless**.

---

## Clip A-05b — suspension

**Tool:** Kling 2.x, 5s
**Input:** final frame of `A-05a`

```
Hundreds of pieces of paper hang suspended in the air at many different depths,
drifting extremely slowly. Each sheet rotates gently on its own axis. Some are
close to the camera and slightly out of focus; others recede into darkness far
below.

The wooden desk surface is now barely visible far beneath them, dark and
out of focus.

The overall movement is almost imperceptible — a slow, silent, weightless drift.
The mood is suspended and unresolved.

Camera: completely locked. No movement whatsoever.

Lighting: single warm source from above-left. The background falls away into
near-darkness. Papers closest to the light are brightest.
```

**Negative prompt:** `fast movement, wind, swirling, vortex, camera movement, zoom, cuts, people, text overlays, sparkles, particles`

---

## Clip A-05c — the flatten

**Tool:** Kling 2.x, 5s
**Input:** final frame of `A-05b`

```
All the suspended papers simultaneously rotate to face the camera directly,
becoming perfectly flat and parallel to the frame, like cards being turned face
up in mid-air.

As they turn, they also drift slightly toward an even distribution across the
frame — spacing out, no longer overlapping heavily.

The rotation is smooth, synchronised, and decisive. By the end of the shot every
sheet is perfectly flat, face-on, evenly lit, with no perspective distortion and
no motion blur.

The final frame is completely still — a grid-like field of flat, face-on paper
against darkness.

Camera: locked. No movement.
```

**Negative prompt:** `perspective, tilting, angled papers, motion blur at the end, continued movement, camera movement, overlapping stacks`

The final frame is the most important single frame in the sequence. If the papers are not
genuinely flat and face-on, the DOM handoff fails and §2→§3 breaks.

---

## Extract

```bash
printf "file 'A-05a.mp4'\nfile 'A-05b.mp4'\nfile 'A-05c.mp4'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy A-05_master.mp4

ffmpeg -i A-05_master.mp4 \
  -vf "fps=18,scale=1920:-2:flags=lanczos" \
  -c:v libwebp -lossless 0 -q:v 74 -compression_level 6 \
  seq/A-05_paper-storm/%04d.webp

ffmpeg -i A-05_master.mp4 \
  -vf "fps=12,scale=960:-2:flags=lanczos" \
  -c:v libwebp -q:v 68 seq/A-05_paper-storm/mobile/%04d.webp
```

Budget: **≤ 2.0MB desktop, ≤ 750KB mobile.**

---

## Headline safe zone

Frames `0018–0054` carry the site's most important sentence:

```
Every business below was running on
memory, spreadsheets, or WhatsApp
before we got there.
```

Three lines, centred, large. The centre of frame must stay readable across all 36 of those
frames. If the paper drifts into the centre and makes the type unreadable, regenerate `A-05b`
with `keep the centre of the frame relatively clear of paper` appended.

---

## Acceptance criteria

- [ ] The lift reads as **weightlessness**, not wind or explosion
- [ ] Camera is genuinely locked across all three clips — any drift breaks the pin
- [ ] Solid objects (calculator, glass) stay on the desk in `A-05a`
- [ ] Final frame: every sheet flat, face-on, evenly lit, zero motion blur
- [ ] Headline legible across frames 18–54
- [ ] No branding, no faces, no legible garbled text
- [ ] ≤ 2.0MB

---

## Cheaper alternative

This sequence can be built entirely in **DOM + GSAP** with no video at all: take the 34 sprites
from `A-02`, instance them ~200 times over the static `A-04_desk-top.webp` plate, and animate
`y`, `rotate`, `scale` and `blur` on scroll.

You lose the photoreal lighting on the rising paper. You gain: a fraction of the weight,
perfect sharpness, no generation risk, and the artefacts are already real DOM nodes — which
means **the §2→§3 seam disappears entirely** because there was never a canvas to hand off from.

That is a genuinely strong argument. If `A-03` has already consumed the sequence budget, build
`A-05` this way and spend nothing.
