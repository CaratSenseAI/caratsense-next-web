# Generated Assets — Manifest

**26 approved.** Nothing rejected. Last updated 8 Aug 2026.

---

## `approved/hero/` — 2

| File | Source | Notes |
|---|---|---|
| `A-01_rough-stone.png` | `A-01` prompt 1 v2 | 1254×1254. Neutral grey body, violet confined to right rim, true black ground. Higher translucency than spec — kept, it reveals the internal flaw network. |
| `A-01_interior.png` | `A-01` prompt 2 | 1536×1024. Radiating fracture planes, dark centre. First attempt. |

## `approved/desk/` — 2

| File | Source | Notes |
|---|---|---|
| `A-04_desk-wide.png` | `A-04` prompt 1 | 1672×941. Wide establishing shot — ledger, spike file, calculator, phone, chai glass with ring on a challan, rubber stamp, capless pen, laptop with spreadsheet, sticky notes, wall calendar. Warm tungsten. Reads **competent, not comic**, which was the main risk on this asset. Optimised at `public/render/A-04_desk-wide.webp` (148KB). **Not yet placed** — natural home is a case-study hero or an about section. |
| `A-04_desk-top.png` | `A-04` prompt 2 | 1672×941. Overhead flat-lay of the same desk, with a clear patch of bare wood centre-left. **Live in §2** as the surface the paper lifts off: `public/render/A-04_desk-top.webp` (340KB), fading 55% → 10% opacity as the artefacts rise. Needed a radial scrim and the text-fill floor raised 0.18 → 0.35 to keep the headline legible over warm, busy content. |

`A-04` prompt 3 (the "after" desk — same surface, cleared, laptop running the system) has not
been generated. It is the second half of the before/after pair for case study pages.

---

## `approved/paper/` — 12

| File | Source |
|---|---|
| `slip-01_order-anjali.png` | handwritten order slip |
| `challan-01_delivery-pink.png` | pink carbon-copy delivery challan |
| `challan-02_invoice-yellow.png` | yellow carbon-copy invoice layer |
| `bill-01_vendor-spiked.png` | vendor bill, spike hole punched |
| `bill-02_thermal-receipt.png` | thermal receipt, curled |
| `ledger-01_page-ruled.png` | hand-ruled ledger page |
| `ledger-02_book-corner.png` | red cloth-bound ledger corner ★ clean black ground |
| `notebook_sale-exp.png` | open pocket notebook, sale/exp columns ★ clean black ground |
| `sticky-01_stock-check.png` | note, "STOCK CHECK???" |
| `sticky-02_priya-pink.png` | pink note |
| `sticky-03_priya-peach.png` | peach note |
| `envelope_sums.png` | brown envelope, sums worked out on the back |

Ten of these carry a glow halo on a grey ground (`ledger-02` and `notebook` do not). Shipping
as-is by decision. The halo can be reduced at cut-out time — see §Cut-out below.

## `approved/object/` — 9

| File | Source | Notes |
|---|---|---|
| `spike_file-stack.png` | `spike` | Blank sheets throughout, tarnished spike, cast-iron base |
| `stamp_wooden-violet.png` | `stamp` | Violet ink face illegible as intended; ink smudge on handle |
| `clip_bulldog-wad.png` | `clip` | Chipped enamel, raking light across paper edges |
| `chai_glass-backlit.png` | `chai` | Backlight working — amber glow, limescale, mould seams, bubbles |
| `chai-ring_stain-paper.png` | `chai-ring` | **White ground, not black** — key the white or use as a `multiply` layer |
| `pen_ballpoint-macro.png` | `pen` | Ink column with air gap, tooth marks, single hard specular |
| `tape_roll-torn.png` | `tape` | Torn end, layered spiral edge, stray hair |
| `rubber-band_tangle.png` | `rubber-band` | Age variation reading clearly — glossy vs chalky vs perished |
| `calc-01_lcd-421900.png` | `calc-01` | Shows `4,21,900` with correct Indian grouping. Rightmost digit clipped at the frame edge — crop tighter or accept. |

## `approved/screen/` — 1

| File | Notes |
|---|---|
| `wa-01_last-msg.png` | Generated before screens moved to HTML — and it came out clean. Correct text, `21:44`, two ticks, tail, true black ground. **Usable as a §1/§2 floating sprite.** §3 and §5 still need `<ChatBubble>` DOM, because `Flip` has to morph those into table rows. |

---

## `a03-inputs/` — ready for Kling / Veo

Both normalised to **1920×1080** so `ffmpeg concat` will accept the stitched clips.

| File | From | Transform |
|---|---|---|
| `A-03a_init_stone-16x9.png` | `A-01_rough-stone.png` | scaled to 870px height, padded to 16:9 with pure black, nudged 195px down so the stone sits at ~48% frame height with the upper third clear for the headline |
| `A-03c_init_interior-16x9.png` | `A-01_interior.png` | scaled to 1920 wide, centre-cropped to 1080 |

```bash
# reproduce
magick approved/hero/A-01_rough-stone.png -resize x870 \
  -background black -gravity north -extent 1920x1080+0-195 \
  a03-inputs/A-03a_init_stone-16x9.png

magick approved/hero/A-01_interior.png -resize 1920x \
  -gravity center -extent 1920x1080 \
  a03-inputs/A-03c_init_interior-16x9.png
```

These three stills seeded the **first** Kling attempt. That clip was superseded — the three
final source clips came back separately and are assembled directly. Kept for provenance.

## `a03-clips/` — the shipped sequence ✅

Raw mp4s are **gitignored** (74MB). Originals live in `~/Downloads/caratsense`.

| File | Role |
|---|---|
| `A-03a_approach_raw.mp4` | Kling, 1920×1080, 10s. Used 0 → 2.6s |
| `A-03b_dive_raw.mp4` | 1280×720, 8s. Used 1.4 → 5.0s |
| `A-03c_interior_raw.mp4` | Kling, 1920×1080, 10s. Used 0 → 5.2s |
| `A-03_master.mp4` | Assembled, delogo'd, regraded. 10.42s, 1920×1080 |

**Shipped:** `public/seq/A-03_hero-dive/` — 146 frames @ 1920px/q88 (26MB) + `mobile/`
(94 frames @ 1280px/q78, 5.9MB). Poster is frame 0001.

Two fixes baked into the master: a 4-pointed star watermark at `(1739,899)` removed from clips
a and c with `delogo`, and cyan fragments regraded to violet with `selectivecolor`. Full recipe
and the size/quality measurements: [`../A-03-hero-dive-sequence.md`](../A-03-hero-dive-sequence.md).

---

## Cut-out

Everything on a black ground:

```bash
mkdir -p cut
for f in approved/object/*.png approved/paper/*.png approved/screen/*.png; do
  magick "$f" -alpha off \
    \( +clone -colorspace Gray -level 6%,28% \) \
    -compose CopyOpacity -composite -trim +repage \
    "cut/$(basename "$f")"
done
```

Raise the lower `-level` bound toward `10%` on the ten paper images with the halo — it eats the
bloom along with the grey. Check each one against a dark background afterwards.

`chai-ring_stain-paper.png` is the exception — white ground. Either invert the key, or leave it
opaque and composite with `mix-blend-mode: multiply` over the paper artefacts, which is what it
is actually for.

---

## Still to generate

| ID | Asset |
|---|---|
| ~~`A-03`~~ | ~~Hero dive~~ — ✅ **shipped**, 146 frames |
| `A-04` | ✅ wide + top-down done. **Prompt 3 (the "after" desk) still to generate** |
| `A-05` | Paper storm — 3 clips → 72 frames *(or build in DOM, see `A-05` §Cheaper)* |
| `A-06` | OG background plate |
| `A-07` | Warehouse scene + wireframe twins |
| ~~`A-08`~~ | ~~9 case study heroes + 9 wire twins~~ — ✅ **shipped** (`public/case-studies/hero-01.webp`…`09.webp`, `card-01.webp`…`09.webp`) |
| `A-09` | Brilliant-cut gem + rotation clip |
| `A-10` | Light ribbons ×3 *(cuttable)* |
| ~~`A-11`~~ | ~~Ledger paper, plain paper textures~~ — ✅ **shipped** (`public/tex/A-11_ledger.webp` 82KB, `public/tex/A-11_paper.webp` 83KB, CSS SVG grain/grid/caustics/vignette) |
| `A-12` | Logo crystal *(OG only — the site uses the SVG mark)* |
