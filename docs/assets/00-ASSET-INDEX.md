# Asset Production — Master Index

Everything that has to be generated, in what order, with what tool, from what input.
Each `A-xx` file contains the **exact prompts**, copy-paste ready.

---

## The pipeline

Four generation stages. Most assets pass through 2–4 of them.

```
  ①  TEXT → IMAGE            GPT Image Gen (ChatGPT / gpt-image-1)
        │                    Best at: precise composition, text in image,
        │                    following long structured prompts.
        ▼
  ②  IMAGE → IMAGE           Google Whisk  ·  GPT Image edit
        │                    Best at: style-locking a series, variations,
        │                    "same look, different subject" across 9 case studies.
        ▼
  ③  IMAGE → VIDEO           Kling 2.x  ·  Veo 3  ·  Runway
        │                    Kling: best camera control + physical motion.
        │                    Veo 3: best fidelity + prompt adherence, 8s.
        ▼
  ④  VIDEO → FRAME SEQUENCE  ffmpeg  →  scroll-scrubbed canvas
                             The Apple technique. See §Frame extraction.
```

**Rule: never generate video from text.** Always generate a still first, approve it, then
animate it. Text-to-video gives you no control over composition, and composition is where
headlines have to sit. Image-to-video means you have already approved the frame.

---

## Tool assignment

| Tool | Use it for | Do not use it for |
|---|---|---|
| **GPT Image Gen** | Every hero still. UI mockups. Anything with legible text or numbers. Precise layouts. | Long video. Photoreal human faces. |
| **Google Whisk** | Locking one style across a series — feed it your approved frame as *style*, a new subject as *subject*. This is how the 9 case study heroes stay consistent. | Fine control. It is a remixer, not a director. |
| **Kling 2.x** | Camera moves — dolly, orbit, push-in. Physical motion of objects. Paper, dust, debris. | Text that must stay legible. It will warp. |
| **Veo 3** | The two hero sequences where fidelity matters most (`A-03`, `A-05`). Native 4K. | Anything you need 20 variations of — it is slow. |
| **ffmpeg** | Every video → frame conversion. The only local tool required. | — |
| **CSS / SVG / Canvas + GSAP** | Every composite, wipe, mask, lattice, and overlay. | — |

### No 3D or compositing software is required

You have no After Effects, Blender, or CAD, and **nothing in this plan needs them.** The whole
pipeline is: *generate stills → generate video from stills → ffmpeg to frames → composite in
the browser.* Concretely, what that replaces:

| Would normally need | We do instead |
|---|---|
| Blender morph targets for the six gem cuts | Six Whisk-generated stills, cross-faded on scroll (`A-01`) |
| Blender camera rig for the hero dive | Kling/Veo image-to-video, three matched clips (`A-03`) |
| After Effects wipe for the wireframe twins | Two stills + a CSS `mask-image` scrubbed by GSAP (`A-07`) |
| CAD software for the facet lattice | Hand-authored SVG + `DrawSVG` (`scroll-concepts/04`) |
| Particle sim for the paper storm | 34 PNG sprites instanced in DOM + GSAP (`A-05` alternative) |
| 3D gemstone in three.js | Scrubbed image sequence, or the flat SVG facet plan |

**This is not a compromise.** Frame sequences are what Apple actually ships, they run at 60fps
on hardware where live 3D would crawl, and they carry no runtime cost. The one thing you give
up is real-time interactivity with the 3D — which none of the scroll-scrubbed designs use.

The R3F/three.js dependencies already in `package.json` become optional. If nothing else needs
them, drop them and save ~600KB.

---

## Frame extraction — the Apple technique

Every scroll-scrubbed sequence goes through this. Numbers below are the shipping spec.

```bash
# 1. Extract at the target frame count.
#    A 5s Kling clip → 90 frames is plenty for a 400vh scroll section.
ffmpeg -i A-03_master.mp4 \
  -vf "fps=18,scale=1920:-2:flags=lanczos" \
  -q:v 2 frames/A-03_%04d.jpg

# 2. Convert to WebP — roughly 40% the size of JPEG at the same quality.
ffmpeg -i A-03_master.mp4 \
  -vf "fps=18,scale=1920:-2:flags=lanczos" \
  -c:v libwebp -lossless 0 -q:v 76 -compression_level 6 \
  frames/A-03_%04d.webp

# 3. Mobile tier — half width, fewer frames.
ffmpeg -i A-03_master.mp4 \
  -vf "fps=12,scale=960:-2:flags=lanczos" \
  -c:v libwebp -q:v 70 frames/mobile/A-03_%04d.webp

# 4. Check the budget. Target under 2.5MB per sequence, desktop.
du -sh frames/
```

### Frame budget

| Section | Scroll | Frames @18fps | Target size |
|---|---|---|---|
| `A-03` hero dive | 400vh | 90 | ≤ 2.5MB |
| `A-05` paper storm | 300vh | 72 | ≤ 2.0MB |
| `A-09` gem refraction | 350vh | 80 | ≤ 2.2MB |
| `A-12` logo transform | loader | 40 | ≤ 700KB |

**Above 100 frames you are wasting bytes** — at scroll speed nobody perceives the difference
between 18fps and 30fps, but they absolutely perceive a 6MB download.

### Playback

```tsx
// Preload every frame BEFORE enabling the trigger, or the first pass stutters.
const images = await Promise.all(
  Array.from({ length: FRAMES }, (_, i) =>
    new Promise<HTMLImageElement>(res => {
      const img = new Image()
      img.src = `/seq/A-03_${String(i + 1).padStart(4, '0')}.webp`
      img.onload = () => res(img)
    })
  )
)

const state = { frame: 0 }
gsap.to(state, {
  frame: FRAMES - 1,
  ease: 'none',                    // ← always
  snap: 'frame',
  scrollTrigger: {
    trigger: section, start: 'top top', end: '+=400%',
    pin: true, scrub: 0.6,
  },
  onUpdate: () => {
    ctx.drawImage(images[state.frame], 0, 0, canvas.width, canvas.height)
  },
})
```

---

## Two failure modes that will recur

Learned from `A-01` round 1. These apply to **every** dark asset in this folder — `A-01`,
`A-03`, `A-09`, `A-10`, `A-12`.

**1. "Pure black" comes out charcoal.** Image models bias toward a mid-grey studio ground
even when told not to. State it three ways or it will drift:

```
Background: PURE BLACK #000000, absolutely flat and even, edge to edge.
No gradient, no vignette, no grey, no glow, no backdrop, no floor.
[…and in negatives:] grey background, gradient background, studio backdrop
```

**2. The accent colour bleeds into the subject.** Ask for a violet rim light on a grey object
and you will frequently get a violet object. The fix is an explicit prohibition on the
material, separate from the lighting instruction:

```
The stone is NEUTRAL GREY … It has NO purple or violet colour of its own.
Lighting: the ONLY colour in the frame comes from a single tight violet rim light.
```

This matters beyond aesthetics — `design-language.md` §6 says **purple lives in the
technology, never in the environment.** If the raw material is already brand-coloured, the
before/after argument collapses.

---

## Naming and delivery

```
public/
  seq/
    A-03_hero-dive/        0001.webp … 0090.webp
    A-03_hero-dive/mobile/ 0001.webp … 0048.webp
  render/
    A-01_rough-stone.webp
    A-04_desk.webp
  tex/
    A-11_grain.png
    A-11_paper.webp
```

**Every generated file gets a sidecar `.txt`** containing the exact prompt, tool, seed, and
date. Six weeks from now when you need one more variation, that file is the difference between
five minutes and half a day.

---

## Master asset list

| ID | Asset | Used in | Pipeline | Priority |
|---|---|---|---|---|
| [A-01](A-01-rough-stone.md) | The rough uncut stone | §1 hero | ① → ② | **P0** |
| [A-02](A-02-artefact-sprites.md) | 34 chaos artefacts, transparent | §1, §2, §3 | ① ×34 | **P0** |
| [A-03](A-03-hero-dive-sequence.md) | Hero camera dive into the stone | §1 | ① → ③ → ④ | **P0** |
| [A-04](A-04-operators-desk.md) | The Indian SMB operator's desk | §2 | ① → ② | **P0** |
| [A-05](A-05-paper-storm-sequence.md) | Paper lifting off the desk | §2 | ① → ③ → ④ | P1 |
| [A-06](A-06-ui-mockups.md) | Dashboard + chat UI plates | §3, §5 | ① | **P0** |
| [A-07](A-07-wireframe-twins.md) | Photoreal → wireframe digital twins | §4, §6 | ① → AE | P1 |
| [A-08](A-08-case-study-heroes.md) | 9 case study heroes, named clients | §6 | ① → ② ×9 | **P0** |
| [A-09](A-09-gem-refraction.md) | Brilliant-cut gem + spectrum | §8 | ① → ③ → ④ | P1 |
| [A-10](A-10-light-ribbons.md) | Ambient dark flowing ribbons | seams, §8 | ① → ③ | P2 |
| [A-11](A-11-textures-grain.md) | Grain, paper, caustics, grid | global | ① | P1 |
| [A-12](A-12-logo-transform.md) | Logo → gemstone morph | loader, OG | ① → ③ → ④ | P1 |
| [A-13](A-13-text-in-assets.md) | **Text & typography in assets** | **all of the above** | — | **P0 — read first** |

> **`A-13` is mandatory reading before generating anything with writing on it.** Round 1
> produced six typos, two broken sums, garbled rubber stamps, and the *same handwriting* in
> all twelve text-bearing images. The fix is architectural: **generate blank substrates, set
> all text in DOM/SVG.** `A-13` has the six handwriting fonts, the Devanagari solution, and
> the alpha-stripping pipeline.

**P0 = build cannot start without it.** Do those six first.

---

## The one input you must provide first

Everything downstream depends on a clean logo file.

**Give me / the tools:** `logo-mark.png` — the three purple strokes **only**, no wordmark, no
circle badge, transparent background, minimum 2048×2048.

Your current `public/logo-symbol.png` and `backgroundless-logo.jpeg` may work; the JPEG will
not (no alpha). If a clean vector exists, export PNG at 2048 from that. Every prompt in `A-12`
and several in `A-01` reference this file as an input image.

---

## Client → case study pairing

You have confirmed clients will be **fully named**. This is my inference from the case study
prose and the logo set — **please confirm or correct before `A-08` is generated**, because
each hero image is industry-specific.

| # | Case study | Proposed client | Confidence |
|---|---|---|---|
| 01 | Running a Home Bakery Like a Logistics Company | **Cake O Clock** | High |
| 02 | Turning Dead Stock into Matched Demand | **Éclat Diamonds** | High |
| 03 | Sixteen Problems, One Screen | ? | — |
| 04 | Student Housing, Off WhatsApp | **The Commun** | High |
| 05 | Selling Everywhere, Remembering Nothing | ? | — |
| 06 | Multiple Plants, Thousands of Batches | **TDM Fabrics** | High |
| 07 | The Quote That Used to Require an Expert | **Suntek Group** | Medium |
| 08 | Now Selling Trust, Not Just Flats | **Samruddhi Developers** or **Babey Infratech** | Medium |
| 09 | The Manager Who Knows | ? | — |

Unassigned logos: **BFC · Blup · Ivory Rose · KCC · Landspeaks · Wild Over Words**
(and whichever of Samruddhi/Babey is not #08).

Six clients have no case study, and three case studies have no client. Fill the gaps or the
§6/§7 link-through breaks.

---

## Production order

```
week 1   A-01, A-02, A-06        → unblocks §1 and §3, the two sections we build first
week 1   A-04                    → unblocks §2
week 2   A-08 ×9                 → unblocks §6 (needs the pairing table confirmed)
week 2   A-03, A-05              → the two big sequences, once stills are approved
week 3   A-07, A-09, A-12
week 3   A-10, A-11              → ambient, last
```
