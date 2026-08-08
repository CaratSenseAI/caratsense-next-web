# A-13 — Text & Typography in Generated Assets

**Read this before generating anything with writing on it.**

> **Decision:** the 14 paper images in `generated/` are **shipping as-is.** Not being reworked.
> This document therefore applies to everything *still to be made* — `A-06` UI mockups, `A-08`
> case study heroes, and any future paper artefact. Keep the diagnosis below; it explains a
> failure mode that will recur on every one of them.

The 14 images share one flaw and it is not fixable by better prompting.

---

## The diagnosis

Every handwritten mark across all 14 images is **the same handwriting**. Look at
`slip-01`, `sticky-02`, `challan-01`, `envelope_sums` side by side — identical letterforms,
identical uniform stroke width, identical slant, no pressure variation, no baseline drift.

That is because GPT Image Gen is not *writing*. It is drawing its single internal handwriting
font — a Bradley Hand / Segoe Print hybrid it reaches for every time. Ten different prompts
will produce ten instances of the same hand. There is no prompt that fixes this, because the
model has one hand and it does not know how to have two.

It also produced, in 14 images:

| Failure | Where |
|---|---|
| `blaclc forest` | `slip-01` |
| `Dobit` (should be Debit) | `ledger-01` |
| `confim price` | `sticky-03` |
| `Recetved`, `Reccipts`, `BAĽANCE` | `challan-02` |
| Rubber stamp = pure gibberish | `challan-01`, `challan-02` |
| Handwriting rows illegible mush | `challan-02` |
| Arithmetic doesn't add up | `bill-02` (1,340 + 160.80 ≠ 1,500.80 as laid out), `envelope_sums` |

Six typos and two broken sums out of twelve text-bearing images. On a site whose entire
argument is *"we bring precision to businesses that run on approximation."*

---

## The fix: generate the substrate, never the content

Stop asking for paper **with writing on it.** Ask for **blank paper**, and set the text
yourself in DOM or SVG on top.

```
   ①  GENERATE      blank ruled paper · blank challan form · blank sticky note
                    photoreal, textured, worn, correctly lit — no text at all
                              │
   ②  OVERLAY       real text, real fonts, in HTML/SVG, positioned over it
                              │
   ③  RESULT        zero typos · correct Devanagari · correct maths
                    six different hands · editable · legible at 400px
```

### What this buys you

| | Generated text | Overlaid text |
|---|---|---|
| Typos | 6 in 12 images | impossible |
| Devanagari | garbled or luck | correct, always |
| Arithmetic | wrong twice | you control it |
| Handwriting variety | one hand | as many as you want |
| Change a price later | regenerate | edit a string |
| Legible at 400px | inconsistent | guaranteed |
| Hindi/English switch | regenerate | swap a JSON key |

This is strictly better in every dimension, and it is *less* work than fighting the model.

---

## The handwriting font set

Six hands, so no two artefacts look like the same person wrote them. All free, all on Google
Fonts, all self-hostable via `next/font/google`.

| Font | Character | Use on |
|---|---|---|
| **Caveat** | fluid ballpoint, natural slant | order slips, quick notes |
| **Kalam** | ★ **supports Devanagari + Latin** | anything Hindi, mixed Hinglish |
| **Reenie Beanie** | thin, hurried scrawl | margin notes, phone numbers |
| **Rock Salt** | thick marker, all-caps energy | sticky notes, `STOCK CHECK???` |
| **Shadows Into Light** | neat, careful, feminine | ledger entries, formal columns |
| **Homemade Apple** | looping cursive, slow | signatures |

**Kalam is the one that matters.** It is a handwriting typeface designed with full Devanagari
support, which means `कल का ऑर्डर confirm है?` renders correctly instead of as the nonsense
GPT Image produced. That single font eliminates your entire garbled-Hindi risk.

```tsx
import { Caveat, Kalam, Reenie_Beanie, Rock_Salt, Shadows_Into_Light } from 'next/font/google'

export const caveat = Caveat({ subsets: ['latin'], weight: ['400','600'], variable: '--hand-1' })
export const kalam  = Kalam({ subsets: ['latin','devanagari'], weight: ['300','400','700'], variable: '--hand-2' })
export const reenie = Reenie_Beanie({ subsets: ['latin'], weight: '400', variable: '--hand-3' })
export const rock   = Rock_Salt({ subsets: ['latin'], weight: '400', variable: '--hand-4' })
export const shadows= Shadows_Into_Light({ subsets: ['latin'], weight: '400', variable: '--hand-5' })
```

### Printed forms

Indian carbon-copy forms are letterpress or cheap offset, not modern type. Use:

| Font | Use |
|---|---|
| **Libre Baskerville** | pre-printed form labels (`Description of Goods`, `Party:`) |
| **Oswald** / **Archivo Narrow** | condensed form headers (`VENDOR BILL`, `DELIVERY CHALLAN`) |
| **Courier Prime** | thermal receipts, dot-matrix — the correct texture for `bill-02` |
| **Tiro Devanagari Hindi** | printed Devanagari form labels |

---

## Making overlaid handwriting look real

Uniform text on paper reads as a mockup. Three cheap tricks fix it:

```css
.hand {
  font-family: var(--hand-1);
  color: #1F3A8A;                    /* ballpoint blue, never pure black */
  mix-blend-mode: multiply;          /* ★ ink sinks INTO the paper texture */
  opacity: .88;
}
```

**`mix-blend-mode: multiply` is the single most important line here.** It makes the ink
interact with the paper's fibre and creases instead of floating on top. Without it, overlaid
text always looks pasted on.

Then per-character jitter, so no two letters sit perfectly:

```tsx
// split to chars, give each a tiny random-but-stable rotation and offset
<span className="hand">
  {[...text].map((c, i) => (
    <span key={i} style={{
      display: 'inline-block',
      transform: `rotate(${jitter(i, 2.2)}deg) translateY(${jitter(i + 99, 1.4)}px)`,
    }}>{c === ' ' ? ' ' : c}</span>
  ))}
</span>
```

```ts
// deterministic pseudo-random — same output every render, no hydration mismatch
const jitter = (seed: number, amp: number) =>
  ((Math.sin(seed * 12.9898) * 43758.5453) % 1) * amp
```

Note: `Math.random()` here would break SSR hydration. The sine-hash is stable.

And a slight overall rotation on the whole text block — real writing drifts off-square:

```css
.hand-block { rotate: -0.8deg; }
```

### Ink colours

```
#1F3A8A   ballpoint blue        the default — most Indian business writing
#111827   near-black ballpoint  formal entries
#7F1D1D   red pen               corrections, credit entries, "URGENT"
#3F3F46   pencil                provisional figures, add opacity: .7
#4C1D95   violet stamp ink      rubber stamps
```

Never pure `#000` — no pen writes pure black on paper.

---

## The rubber stamp problem

Both challans produced gibberish inside the stamp. Stamps are dense circular type at small
size, which is the hardest thing for an image model and also the easiest thing to do properly.

**Generate the paper without a stamp. Add the stamp as an SVG overlay** — a `<circle>`, a
`textPath` for the curved text, straight text in the middle, at `opacity: .55` with
`mix-blend-mode: multiply` and a slight rotation:

```svg
<g transform="rotate(-7)" opacity=".55" style="mix-blend-mode:multiply">
  <circle r="86" fill="none" stroke="#4C1D95" stroke-width="4"/>
  <circle r="74" fill="none" stroke="#4C1D95" stroke-width="2"/>
  <path id="arc" d="M -62,0 A 62,62 0 0 1 62,0" fill="none"/>
  <text font-size="13" letter-spacing="2" fill="#4C1D95">
    <textPath href="#arc" startOffset="50%" text-anchor="middle">CAKE O CLOCK · MUMBAI</textPath>
  </text>
  <text y="8" font-size="22" font-weight="700" text-anchor="middle" fill="#4C1D95">RECEIVED</text>
</g>
```

Sharp, correct, and reusable across every paper artefact with the client name swapped.

---

## Get the numbers right

Your own copy is full of specific figures. They must reconcile, because an operator will
check them — that is exactly the kind of person you are selling to.

Canonical order used across §1, §2, §3 and §5. **Use these exact values everywhere:**

```
Order            ORD-4471
Customer         Anjali M.
Item             Black Forest · 1.5 kg
Rate             ₹ 1,660.00
CGST 6%          ₹    99.60
SGST 6%          ₹    99.60
─────────────────────────────
Total            ₹ 1,859.20  →  rounded ₹ 1,860
Slot             Sat 14:00
```

`1,660 + 99.60 + 99.60 = 1,859.20`. That rounds to the `₹1,860` already in your case study
copy, and unlike `bill-02` it actually adds up.

Indian grouping everywhere: `₹ 4,21,900`, never `₹ 421,900`. `Intl.NumberFormat('en-IN')`.

---

## The second bug: the glow halo

Ten of the twelve rework images have a bright halo around the object — a white, pink, or
orange bloom bleeding into a grey gradient background.

**Cause:** my `A-02` wrapper said *"transparent background — isolate the object completely."*
GPT Image Gen cannot output alpha, so it simulates isolation by painting a glow and a grey
studio ground. Asking harder makes it worse.

**Proof it's the prompt, not the model:** the two approved images —
`approved/paper/ledger-02_book-corner.png` and `approved/paper/notebook_sale-exp.png` — sit on
**pure black with no halo whatsoever.** Those two got a black background instruction instead
of a transparency instruction.

**Fix:** never ask for transparency. Ask for pure black, then key it out — which is free,
because `#000000` is already the site's ground colour.

```
Background: PURE BLACK #000000, absolutely flat and even, edge to edge.
No glow, no halo, no rim light, no bloom, no vignette, no grey, no gradient,
no studio backdrop, no drop shadow, no surface beneath the object.
The object sits in total void.
```

And in negatives: `glow, halo, rim light, bloom, vignette, grey background, gradient background, studio backdrop, drop shadow`

Then strip to alpha:

```bash
# black → transparent, with a soft threshold so edges don't crunch
magick in.png -alpha off \
  \( +clone -colorspace Gray -level 4%,26% \) \
  -compose CopyOpacity -composite \
  -trim +repage out.png

# verify: should report a transparent corner
magick out.png -format "%[pixel:p{2,2}]" info:
```

If ImageMagick isn't installed: `sudo pacman -S imagemagick`.

---

## Revised acceptance criteria for text-bearing assets

- [ ] **Generated image contains no text at all** — blank substrate only
- [ ] Background pure `#000000`, no halo, no glow, no gradient
- [ ] All text is DOM/SVG overlay
- [ ] Every string spell-checked by a human
- [ ] Devanagari set in **Kalam** or **Tiro Devanagari Hindi**, verified by a Hindi reader
- [ ] All arithmetic reconciles against the canonical order above
- [ ] At least four different handwriting fonts used across the set
- [ ] Every handwriting layer has `mix-blend-mode: multiply`
- [ ] No ink is pure `#000000`
- [ ] Legible at 400px wide

---

## What this changes upstream

`A-02` is rewritten around this — 20 bespoke substrate prompts, no text in any of them.

It also simplifies `A-06` (UI mockups): generate the **empty dashboard chrome**, set every
label, number and status pill in DOM. Which you wanted anyway, because §3's counters animate.

And it makes the §5 Thread trivially correct — those bubbles were always going to be real DOM
for `Flip` to morph them. Now the paper artefacts work the same way. One text system, one
source of truth, nine languages if you ever want them.
