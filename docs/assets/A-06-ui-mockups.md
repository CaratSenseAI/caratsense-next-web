# A-06 — UI Plates

**Status: ❌ MOSTLY CANCELLED — moved to HTML.**

---

## What happened

This file originally asked for four generated UI plates: a dark dashboard, a "spreadsheet hell"
screen, six metric tiles, and an OG base image.

**Three of the four are interface** — rectangles, text, numbers and colour. Image models cannot
draw interface. Round 1 proved it on simpler assets than these:

| Attempt | Result |
|---|---|
| `wa-02` chat bubble | transparent canvas, bubble missing entirely |
| `slip-01` | `blaclc forest` |
| `ledger-01` | `Dobit` instead of Debit |
| `bill-02` | arithmetic did not reconcile |
| `challan-01/02` rubber stamps | pure gibberish |

A dashboard has ~40 strings and 6 numbers that must add up. It would fail harder than any of
those, and it has to animate — §3's counters tick, one row highlights, a status dot pulses.
A PNG cannot do that.

→ **Build them: [`../HTML-COMPONENTS.md`](../HTML-COMPONENTS.md) §2, §6**

| Was | Now |
|---|---|
| `A-06_dashboard-dark.webp` | `<Dashboard>` + `<MetricTile>` + `<Sparkline>` — §6 |
| `A-06_spreadsheet-before.webp` | `<SheetFragment variant="colour">` — §2 |
| `A-06_tile-01…06.webp` | `<MetricTile>` ×6, one gold — §6 |

That is ~40KB of components replacing ~8MB of PNGs, and every number becomes animatable and
correctly grouped for Indian digits.

---

## The one thing still generated

The OG base image — a background plate with **no text on it**, because `next/og` composites the
title per page at request time. Baking copy into a share image means regenerating it every time
a headline changes.

### `A-06_og-base` — social share background

**Aspect: 1200×630 (or generate 16:9 and crop)**

```
A minimal dark social share card background, with no text anywhere on it.

Background: near-black #050309, with a very faint violet square grid visible
across it at about 4% opacity, fading softly to nothing toward all four edges.

In the upper-left third of the frame sits a small rough, uncut mineral crystal —
neutral grey, matte, geological, with irregular conchoidal fracture surfaces. It
is NOT polished, NOT sparkling, NOT faceted. It has no purple or violet colour of
its own. It occupies only about 22% of the frame height.

The only colour in the frame comes from a single tight violet rim light (#A855F7)
grazing the crystal's right edge. A very dim cool key from the upper left picks
out its surface texture. Everything else falls to near-black.

The entire right two-thirds and the lower half of the frame are deliberately
empty, flat near-black — this space is reserved for text that will be added
separately.

Rendering: photorealistic macro, deep focus, fine film grain, high contrast with
true blacks. Cinematic and restrained.

Do not include: any text, letters, numbers, words, logos, watermarks, taglines,
sparkle, glitter, rainbow dispersion, lens flare, bloom, jewellery, crystal
cluster, geode, healing crystal aesthetic, gradient background, studio backdrop,
drop shadow, reflection, people, hands.
```

Then composite text in code:

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }

export default async function OG() {
  return new ImageResponse(
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      width: '100%', height: '100%', padding: 64,
      backgroundImage: 'url(https://caratsense.in/render/A-06_og-base.webp)',
      backgroundSize: 'cover',
    }}>
      <div style={{ fontSize: 64, color: '#F4F1FA', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
        Turn your business chaos<br />into operational clarity
      </div>
      <div style={{ fontSize: 24, color: '#D4AF37', marginTop: 24, letterSpacing: '.08em' }}>
        CARATSENSE AI — SEE BEYOND
      </div>
    </div>,
    size,
  )
}
```

---

## Acceptance criteria

- [ ] **Zero text in the generated image** — every character is composited by `next/og`
- [ ] Right two-thirds and lower half genuinely empty and flat
- [ ] Crystal is neutral grey with violet appearing only as rim light
- [ ] Background near-black with the grid barely perceptible
- [ ] No sparkle, no dispersion — it must not read as jewellery
- [ ] ≤ 180KB WebP

---

## Delivery

```
public/render/A-06_og-base.webp     1200 × 630
```

One file. The other seven this document used to request are components now.
