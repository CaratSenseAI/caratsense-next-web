# A-03 — Hero Dive Sequence

**Used in:** §1, `0–450vh`, scroll-scrubbed · **Priority: P0** · **✅ BUILT**
**Pipeline:** ① stills → ③ Kling + one other → ④ ffmpeg → 146 WebP frames
**Deliver:** `public/seq/A-03_hero-dive/0001–0146.webp` (26MB) + `mobile/` (94 frames, 5.9MB)

The camera pushes into the rough stone, passes through its surface, and emerges into the
fracture interior — without a cut. Three clips, stitched.

---

---

# ✅ BUILT — 8 Aug 2026

Shipped at `public/seq/A-03_hero-dive/` — **146 frames at 1920px / q88 (26MB)** plus
`mobile/` (94 frames at 1280px / q78, 5.9MB). Wired into `components/sections/Hero.tsx` at
`scrollLength="450%"` → one frame per ~3vh.

**Deliberately unoptimised.** An earlier pass squeezed this to 60 frames / 2.9MB to hit the
budget below, and it looked it — visibly soft, and the dive strobed. Direction is that the hero
should look expensive, so quality wins. The size table further down is kept because it is an
accurate map of the tradeoff if that decision is ever revisited.

## What the three source clips actually were

| File | Tool | Native | Used | Notes |
|---|---|---|---|---|
| `A-03a_approach_raw.mp4` | Kling | 1920×1080, 10s | **0 → 2.6s** | Stone clean on black at 0s. Confetti storm arrives ~2s and gets busy fast, so only the calm opening is used. Cyan fragments regraded to violet. ★ star watermark. |
| `A-03b_dive_raw.mp4` | (other) | 1280×720, 8s | **1.4 → 5.0s** | The acceleration and surface entry. No watermark. Upscaled to 1080p. |
| `A-03c_interior_raw.mp4` | Kling | 1920×1080, 10s | **0 → 5.2s** | The fracture tunnel. Excellent as-is. ★ star watermark. |

**The lucky break:** clip A at 0s and clip B at 0s are near-identical framings of the same
stone on black, so they intercut without a visible jump. Clip A's stone size at 2.6s matches
clip B's at ~1.4s, which is why those are the trim points.

## Two problems found in the sources

**★ star watermark**, fixed position `(1739, 899)`, ~63px, on clips **a** and **c** only.
Removed with `delogo` rather than a black box, because it sits over bright textured content:

```
delogo=x=1702:y=862:w=76:h=76
```

**Cyan fragments** in clip a were off-palette (`design-language.md` §6: purple lives in the
technology, never the environment). Shifted toward violet with `selectivecolor` rather than a
global hue rotate, which would have swung the violet rim light to red:

```
selectivecolor=cyans=-0.65 0.55 0 0:blues=-0.3 0.35 0 0
```

## Assembly — reproduces the shipped master exactly

```bash
cd docs/assets/generated/a03-clips
ffmpeg -y \
 -i A-03a_approach_raw.mp4 -i A-03b_dive_raw.mp4 -i A-03c_interior_raw.mp4 \
 -filter_complex "\
[0:v]trim=0:2.6,setpts=PTS-STARTPTS,delogo=x=1702:y=862:w=76:h=76,scale=1920:1080,\
selectivecolor=cyans=-0.65 0.55 0 0:blues=-0.3 0.35 0 0,eq=saturation=0.9[a];\
[1:v]trim=1.4:5.0,setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,eq=saturation=0.9[c];\
[2:v]trim=0:5.2,setpts=PTS-STARTPTS,delogo=x=1702:y=862:w=76:h=76,scale=1920:1080,\
eq=saturation=0.9[b];\
[a][c]xfade=transition=fade:duration=0.4:offset=2.2[ac];\
[ac][b]xfade=transition=fade:duration=0.6:offset=5.2[v]" \
 -map "[v]" -an -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p A-03_master.mp4
```

Result: **10.42s, 1920×1080**. The two `xfade`s do real work — they hide the framing jump at
a→c and the large luminance step at c→b (bright violet surface into dark tunnel).

## Frame extraction — and why the budget moved

```bash
P=public/seq/A-03_hero-dive
ffmpeg -y -i A-03_master.mp4 -vf "fps=5.8,scale=1440:-2:flags=lanczos" \
  -c:v libwebp -lossless 0 -q:v 48 -compression_level 6 "$P/%04d.webp"
ffmpeg -y -i A-03_master.mp4 -vf "fps=3.9,scale=900:-2:flags=lanczos" \
  -c:v libwebp -lossless 0 -q:v 44 -compression_level 6 "$P/mobile/%04d.webp"
cp "$P/0001.webp" public/render/A-01_rough-stone.webp   # poster == frame 1
```

**This file's original budget said 90 frames at 1920px ≤ 2.5MB. That was wrong for this
footage.** The spec assumed a clean stone on black; what came back is dense high-frequency
detail — confetti, radial speed lines, fracture webs — which compresses far worse. Measured:

| Setting | Frames | Size |
|---|---|---|
| 1920 / q72 / 11.5fps *(original spec)* | 120 | **12 MB** |
| 1600 / q60 | 100 | 6.2 MB |
| 1440 / q50 | 90 | 4.4 MB |
| 1280 / q40 | 90 | 3.4 MB |
| 1440 / q48 / 5.8fps *(rejected — too soft)* | 60 | 2.9 MB |
| **1920 / q88 / 14fps** ← **shipped** | **146** | **26 MB** |

Quality is the wrong lever here — going q50→q38 at 1440 only saved 0.6MB. **Frame count and
width are the levers.** AVIF was also tested (`avifenc -q 45`, 2.6MB) and is not worth the
fallback burden for a ~10% saving.

Frame count and scroll length track each other: keep roughly one frame per 3vh or the dive
strobes. 146 frames → `450%`.

## Two component fixes this forced

**The hero copy must fade out before the dive fills the frame.** Left alone it stays pinned,
unreadable, over the fracture tunnel for the remaining 200vh. `[data-hero-copy]` now fades and
blurs out between `top -8%` and `top -34%`, and the scroll cue goes with it.

**`object-cover`, not `object-contain`.** With clean stone-on-black, letterbox bars were
invisible. With the tunnel filling the frame they read as bars.

## Acceptance — verified

- [x] All three segments 1920×1080 in the master
- [x] No visible seam at either stitch point (scrubbed both ways)
- [x] Stone never shatters
- [x] Star watermark gone; `delogo` patch imperceptible on this texture
- [x] No cyan; fragments read violet/silver
- [x] Headline legible over frames 1–12, gone by frame ~20
- [x] 26MB desktop / 5.9MB mobile — accepted; quality over weight
- [ ] Not yet checked on a real mid-range Android

---

# INPUTS — exactly which file goes where (original plan)

Everything lives in **`docs/assets/generated/a03-inputs/`**.

| Clip | Upload this file | Size | Status |
|---|---|---|---|
| **A-03a** | `A-03a_init_stone-16x9.png` | 1920×1080 | ✅ **rendered — `a03-clips/A-03a.mp4`** |
| **A-03b** | `A-03b_init.png` | 1920×1080 | ✅ **extracted from A-03a — ready to upload** |
| **A-03c** | `A-03c_init_interior-16x9.png` | 1920×1080 | ✅ ready — not yet rendered |

Full paths, copy-paste:

```
/code/caratsense/caratsense-next-web/docs/assets/generated/a03-inputs/A-03a_init_stone-16x9.png
/code/caratsense/caratsense-next-web/docs/assets/generated/a03-inputs/A-03b_init.png
/code/caratsense/caratsense-next-web/docs/assets/generated/a03-inputs/A-03c_init_interior-16x9.png
```

### Where they came from

| Input | Derived from | Transform |
|---|---|---|
| `A-03a_init_stone-16x9.png` | `generated/approved/hero/A-01_rough-stone.png` | scaled to 870px height, black-padded to 16:9, nudged 195px down → stone sits at ~48% frame height, upper third clear for the headline |
| `A-03c_init_interior-16x9.png` | `generated/approved/hero/A-01_interior.png` | scaled to 1920 wide, centre-cropped to 1080 |
| `A-03b_init.png` | last frame of your rendered `A-03a.mp4` | see command below |

### ⚠ Kling ignores your input aspect — normalise every clip after rendering

Observed on A-03a, 8 Aug: fed a 1920×1080 init image, Kling 3.0 returned **960×960 square**,
cropping the side padding away. It also stamps a **"KlingAI 3.0" watermark** bottom-right on
every frame.

Both are fixable losslessly, because the background is pure black. **Run this on every clip
before stitching** — `ffmpeg concat` refuses clips of differing dimensions.

```bash
cd /code/caratsense/caratsense-next-web/docs/assets/generated/a03-clips

# Kling 960×960 → watermark boxed out, normalised to 1920×1080 with headroom
ffmpeg -y -i <clip>_raw.mp4 \
  -vf "drawbox=x=730:y=878:w=230:h=82:color=black@1:t=fill,\
scale=-2:824:flags=lanczos,pad=1920:1080:(ow-iw)/2:218:black" \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -an <clip>.mp4
```

What each part does:

| Filter | Why |
|---|---|
| `drawbox …color=black` | Covers the watermark. Verified pure `srgb(0,0,0)` all around it, so the box is invisible. |
| `scale=-2:824` | Shrinks the frame so the stone lands at ~48% of frame height rather than ~63%. |
| `pad=…:218:black` | Pads to 16:9 and pushes the image 218px down, clearing the upper third for the headline. |

**The `scale`/`pad` numbers matter.** At native 1080 height the stone fills ~63% of frame and
the headline's second line lands on top of it — verified by overlaying the real copy. The 824/218
values put the stone at ~48% with clean separation. If Kling returns a different size for
A-03c, re-derive rather than reusing these.

Verify after every clip:

```bash
for f in A-03*.mp4; do printf "%-30s " "$f"; \
  ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0 "$f"; done
# every line must read 1920,1080
```

### Save your rendered clips here

```
docs/assets/generated/a03-clips/A-03a.mp4
docs/assets/generated/a03-clips/A-03b.mp4
docs/assets/generated/a03-clips/A-03c.mp4
```

```bash
mkdir -p /code/caratsense/caratsense-next-web/docs/assets/generated/a03-clips
```

---

## Shot breakdown

| Clip | Scroll | Frames | Move |
|---|---|---|---|
| `A-03a` | `0–25%` | 0001–0022 | Slow push-in. Stone rotates ~15°. Artefacts drift. |
| `A-03b` | `25–65%` | 0023–0058 | Accelerating dive to the surface. Motion blur builds. |
| `A-03c` | `65–100%` | 0059–0090 | Through the surface, into the fracture interior. |

Order matters: **render A-03a first**, because A-03b's input is extracted from it.

---

## Clip A-03a — the approach

**Tool:** Kling 2.x · image-to-video · 5s · output 1920×1080 (16:9)

> **INPUT IMAGE:** `a03-inputs/A-03a_init_stone-16x9.png`

**Prompt:**

```
Camera slowly dollies forward toward the stone. Extremely slow, steady, cinematic
push-in — the kind of move a motion-control rig makes. The stone rotates very
slowly on its vertical axis, roughly 15 degrees over the whole shot, revealing
new fracture planes as it turns.

Small flat paper fragments and glowing screen fragments drift slowly in the
darkness around the stone, orbiting close to its surface at different depths,
some passing in front, some behind. They move slowly and weightlessly, as if in
zero gravity.

The violet rim light stays locked to the stone's right edge as it rotates.
Background remains pure black and completely empty.

Camera: dolly in, no pan, no tilt, no roll, no shake. Constant slow speed.
Locked horizon.
```

**Negative prompt:**

```
fast motion, camera shake, handheld, zoom, cuts, transitions, people, text, sparkle, lens flare, colour shift, background appearing
```

**Save as:** `a03-clips/A-03a.mp4`

---

## → Create A-03b's input

Run this **after** `A-03a.mp4` exists. It grabs the final frame so clip B starts exactly where
clip A ended — this is what makes the stitch invisible.

```bash
cd /code/caratsense/caratsense-next-web/docs/assets/generated

ffmpeg -sseof -0.1 -i a03-clips/A-03a.mp4 -update 1 -q:v 1 \
  a03-inputs/A-03b_init.png

# confirm it is 1920x1080
magick identify -format "%wx%h\n" a03-inputs/A-03b_init.png
```

If Kling delivered a different size, normalise it before uploading:

```bash
magick a03-inputs/A-03b_init.png -resize 1920x1080^ -gravity center \
  -extent 1920x1080 a03-inputs/A-03b_init.png
```

---

## Clip A-03b — the dive

**Tool:** Veo 3 · image-to-video · 8s · output 1920×1080 (16:9)
Use Veo here rather than Kling — this is the clip where fidelity matters most.

> **INPUT IMAGE:** `a03-inputs/A-03b_init.png` ← the frame you just extracted

**Prompt:**

```
The camera accelerates rapidly toward the stone's surface, closing the distance
until the stone fills the entire frame and beyond. Strong directional motion blur
builds as speed increases — the blur streaks radially outward from the centre of
frame.

The paper and screen fragments rush past the camera on both sides, stretching
into long horizontal light streaks as they pass, disappearing behind the camera.

As the surface fills the frame, the stone's texture becomes enormous — fracture
planes and frosted surface resolve into landscape scale. The violet rim light
smears across the frame.

The stone remains completely intact and solid throughout.

The shot ends the instant before the camera contacts the surface.

Camera: rapid forward dolly, accelerating. No rotation, no shake. Dead straight
into the centre of the stone.
```

**Negative prompt:**

```
slow motion, camera shake, rotation, spinning, cuts, text overlay, particles as sparkles, explosion, shattering, glass breaking, cracking, fragmenting
```

> Video models love to break things. `The stone remains completely intact and solid throughout`
> is now in the positive prompt for exactly that reason — it is the most likely failure on the
> hardest clip. If Veo still shatters it, repeat that line at the end of the prompt too.

**Save as:** `a03-clips/A-03b.mp4`

---

## Clip A-03c — the interior

**Tool:** Kling 2.x · image-to-video · 5s · output 1920×1080 (16:9)

> **INPUT IMAGE:** `a03-inputs/A-03c_init_interior-16x9.png`

**Note:** this clip does *not* start from A-03b's last frame. A-03b ends mid-blur at the stone's
surface; A-03c starts inside the fracture network. The motion blur at the boundary covers the
jump — that is why the dive clip is the one that must be blurred.

If the join reads as a cut when you scrub it, extract A-03b's last frame and generate a short
2s bridge clip from it using A-03c's prompt, then insert it between them.

**Prompt:**

```
The camera continues travelling forward through a vast interior fracture network
inside a crystal. Layered sheets of internal fracture pass by on all sides,
receding into darkness ahead — a tunnel made of frozen shattered planes.

Each fracture plane catches a faint violet or cold white edge highlight as the
camera passes it. Between the planes, deep near-black cloudiness.

The motion gradually decelerates over the shot, coming almost to rest as the
frame resolves into a flat, dark, empty plane viewed from above.

Camera: steady forward travel, decelerating. No roll, no shake.
```

**Negative prompt:**

```
sparkle, rainbow, prismatic dispersion, sci-fi tunnel, hyperspace, warp speed, particles, glowing orbs, neon, shattering
```

**Save as:** `a03-clips/A-03c.mp4`

---

## Stitch and extract frames

```bash
cd /code/caratsense/caratsense-next-web/docs/assets/generated/a03-clips

# 0. All three must report 1920x1080
for f in A-03*.mp4; do printf "%-14s " "$f"; \
  ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0 "$f"; done

# 1. Concatenate
printf "file 'A-03a.mp4'\nfile 'A-03b.mp4'\nfile 'A-03c.mp4'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy A-03_master.mp4

# 2. 90 frames — desktop
mkdir -p /code/caratsense/caratsense-next-web/public/seq/A-03_hero-dive/mobile
ffmpeg -i A-03_master.mp4 \
  -vf "fps=18,scale=1920:-2:flags=lanczos,eq=saturation=0.9" \
  -c:v libwebp -lossless 0 -q:v 76 -compression_level 6 \
  /code/caratsense/caratsense-next-web/public/seq/A-03_hero-dive/%04d.webp

# 3. Mobile tier
ffmpeg -i A-03_master.mp4 \
  -vf "fps=12,scale=960:-2:flags=lanczos,eq=saturation=0.9" \
  -c:v libwebp -q:v 70 \
  /code/caratsense/caratsense-next-web/public/seq/A-03_hero-dive/mobile/%04d.webp

# 4. Budget check — must be ≤ 2.5MB
du -sh /code/caratsense/caratsense-next-web/public/seq/A-03_hero-dive/
```

If `-c copy` fails on step 1 (differing codecs between Kling and Veo output), re-encode instead:

```bash
ffmpeg -f concat -safe 0 -i list.txt -c:v libx264 -crf 16 -pix_fmt yuv420p A-03_master.mp4
```

If the total exceeds 2.5MB, drop to `fps=15` before you drop `-q:v`. Frame count is cheaper to
lose than sharpness.

---

## Headline safe zone

Copy sits over frames `0001–0030`:

```
Turn your business chaos
into operational clarity
```

`A-03a_init_stone-16x9.png` was built for this — the stone sits low with the upper third clear.
Check the first 30 frames with the headline overlaid before approving; if the push-in brings the
stone up into the type, shorten the dolly in A-03a rather than moving the headline.

---

## Acceptance criteria

- [ ] All three clips are exactly 1920×1080
- [ ] Zero visible seam at the two stitch points — scrub back and forth across each
- [ ] The stone never shatters, cracks apart, or explodes
- [ ] No text, watermark, or UI artefact anywhere in 90 frames
- [ ] Motion is monotonic — never reverses or stutters (scrub backwards to check)
- [ ] Background stays pure black; no environment or horizon ever appears
- [ ] Headline legible over frames 1–30
- [ ] ≤ 2.5MB desktop, ≤ 900KB mobile
