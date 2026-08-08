# CaratSense AI — Design Language & Brand

The complete visual system. Everything in `docs/scroll-concepts/` and `docs/assets/` resolves
to the rules in this file.

---

## 1. The decision that changes everything: go dark

Your current site is light — white background, purple `#7C22D4`, yellow `#FFC93C`. It is clean
and it is fine. It is also indistinguishable from four hundred other AI consultancies.

Terminal Industries is near-black. Anduril is near-black. Poly is a dark warm interior. Every
site you have pointed at is dark, and that is not a coincidence — **dark is what lets a
technical render become the hero.** A photoreal wireframe truck glowing on white looks like a
diagram. On black it looks like proprietary technology.

You also cannot run the gemstone concept on white. A stone needs a void to sit in.

> **CaratSense goes dark-first.** Near-black canvas, high-contrast type, renders as the light
> source. Light mode stays available via your existing toggle, but dark is the design and
> light is the accommodation — not the other way around.

Your `globals.css` dark theme already has the right instinct: `--accent-primary: #A855F7`.
That brighter purple is correct for dark. `#7C22D4` is a light-mode colour and dies on black.

---

## 2. Brand foundation

**Name:** CaratSense AI
**Mark:** three diagonal parallel strokes, purple, ascending left-to-right
**Locked tagline:** See Beyond
**Positioning line (Instagram):** Your strategic partner for the AI-driven era
**Homepage promise:** Turn your business chaos into operational clarity

### The meaning stack

| Layer | Content |
|---|---|
| Literal | A carat is the unit that grades a gemstone |
| Structural | Gems are graded on four Cs — Carat, **Cut**, Colour, **Clarity** |
| Strategic | You already sell "clarity." You already sell "cut" (removing, not adding) |
| Proof | Éclat Diamonds is your client. *Éclat* = brilliance |

The mark's three strokes read as: **rough → cut → clear.** Three states of the same material.
Use that reading everywhere — it turns a decorative logo into a diagram.

### Voice

Your Medium writing under *The Operator's Brief* is the voice. Dry, specific, operator-first,
no vendor language. Sentences like *"Every business below was running on memory, spreadsheets,
or WhatsApp before we got there."*

**Never write:** revolutionise, cutting-edge, seamless, leverage, unlock, empower, game-changing,
transform your business, best-in-class, end-to-end solution.

**Do write:** what broke, what it cost, what we removed, what it does now. Numbers with units.
Times with seconds.

---

## 3. Colour

### Core palette (dark)

```
--void          #050309   page ground. Deeper than your current #07030e
--surface       #0C0716   panels, cards
--surface-2     #150C24   raised, hover
--line          rgba(168,85,247,.14)   hairlines, grid, borders

--ink           #F4F1FA   primary text
--ink-2         #A797C4   secondary
--ink-3         #6B5B87   muted, mono labels

--violet        #A855F7   ★ primary. Structure, systems, the built thing
--violet-deep   #7C22D4   light-mode primary, dark-mode pressed states
--magenta       #E879B8   energy, live signals, the moving thing
--gold          #D4AF37   ★ resolution. Clarity. The payoff
--gold-hot      #F2CE5B   gold on dark needs a brighter step for small text
```

### The semantic rule — memorise this

> **Violet builds. Magenta moves. Gold resolves.**

- **Violet** = structure that exists. Borders, grids, wireframes, nodes, chrome.
- **Magenta** = something happening now. Live dots, travelling particles, the bottleneck pulse.
- **Gold** = a thing that got solved. Never decorative. Never a background. Never a large fill.

### Gold discipline

Gold appears **six times on the homepage.** Listed exactly in `scroll-concepts/10-THE-BUILD.md`
§Gold discipline. If a seventh appears, cut it. Terminal's lime works because it is on maybe
2% of pixels; the moment an accent is everywhere it stops meaning anything.

### Light mode

Keep your existing tokens. One change: retire `#FFC93C` yellow entirely and use `#D4AF37`
gold in both modes, so "resolution" is the same colour in both themes.

---

## 4. Typography

Terminal's face is a tight neo-grotesque with a large x-height, near-vertical terminals, and a
single-storey `g`. That plus an all-caps mono for labels is 90% of the look.

### Recommended — free, and genuinely excellent

```
Display / UI   Geist            Vercel. Variable. Free. Closest free face to Terminal's.
Mono           Geist Mono       Labels, numbers, chapter indices, telemetry.
```

Geist and Geist Mono are metric-designed as a pair, ship as variable fonts, and are already
in the Next.js ecosystem. `next/font/local` them, subset to latin, `display: swap`.

### If there is a type budget

```
Display   ABC Diatype  ·  Söhne (Klim)  ·  Aeonik
Mono      Berkeley Mono  ·  ABC Diatype Mono
```

Söhne is the closest to Terminal. Berkeley Mono is the single highest-leverage paid font for
this aesthetic — it makes every telemetry label look like instrumentation.

### Scale

Fluid, `clamp()`, based on a 1.28 ratio at desktop.

| Token | Size | Use |
|---|---|---|
| `hero` | `clamp(52px, 8vw, 132px)` / `0.94` / `-0.03em` | §1 and §8 only |
| `d1` | `clamp(38px, 5.2vw, 84px)` / `1.02` / `-0.025em` | Section headlines |
| `d2` | `clamp(28px, 3.4vw, 54px)` / `1.08` / `-0.02em` | Chapter headings |
| `lead` | `clamp(19px, 1.6vw, 26px)` / `1.45` / `-0.01em` | The Terminal text-fill paragraphs |
| `body` | `clamp(16px, 1.1vw, 18px)` / `1.6` | Case study prose |
| `mono` | `13px` / `1.2` / `0.08em` / uppercase | Labels, indices, telemetry |
| `micro` | `11px` / `0.1em` / uppercase | Nav, eyebrows, captions |

### Rules

- **Headlines are always tight.** `-0.02em` to `-0.03em`. Untracked display type is the single
  most common tell of an amateur build.
- **Mono is always uppercase with `0.08em` tracking.** Never sentence case.
- **Never centre body copy.** Headlines may centre; paragraphs never.
- **Max measure 68ch** on prose, `46ch` on lead paragraphs.
- **`font-variant-numeric: tabular-nums`** on every number that can change.
- One weight for display (Medium 500), one for body (Regular 400), one for mono (Regular 400).
  Terminal uses essentially two weights on the entire site. Restraint reads as confidence.

---

## 5. The component kit (lifted from Terminal, cut for you)

### 5.1 The notched panel — your signature container

Terminal's technical panels have one corner cut away. It reads as a machined part rather than
a card, and it is the most recognisable element on their site.

```css
.panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  clip-path: polygon(
    0 44px, 44px 0,           /* the notch, top-left */
    100% 0, 100% 100%, 0 100%
  );
  position: relative;
  overflow: hidden;
}

/* internal technical grid */
.panel::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 78%);
  pointer-events: none;
}
```

Use it on: the facet wall panel (§4), the ROI/dashboard mock (§3), the CTA block, case study
hero frames. **Always notch the same corner** — top-left. Consistency is what makes it read as
a system rather than an effect.

### 5.2 Telemetry chip

Terminal's `ASSET ON SITE`, `CHECK IN: 2:34 PM`, `44C TM3L`. Small floating labels that make a
static render feel live.

```css
.chip {
  font: 400 12px/1 var(--mono);
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--gold-hot);
  background: rgba(5,3,9,.72);
  backdrop-filter: blur(12px);
  border: 1px solid var(--line);
  padding: 8px 12px;
  border-radius: 6px;
}
```

Put two or three on every render. They cost nothing and they do more for perceived
sophistication than anything else in this document.

### 5.3 Dimension line

CAD annotation. Thin line, tick ends, mono measurement. Pure decoration, entirely worth it.

```
 ├──────────────────────┤
      847 ORDERS / DAY
```

### 5.4 Floating nav

Your current nav is already close — pill, blur, icon+label. Cut for dark:

```css
.nav {
  position: fixed; top: 20px; left: 50%; translate: -50% 0;
  background: rgba(12,7,22,.62);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 10px 10px 10px 20px;
}
```

Behaviour: compress after 80px · hide on scroll-down, reveal on scroll-up (400ms out, 250ms in)
· never hide within 200px of top · active-item pill **slides** between items via `Flip`.

Keep `HOME · BUILD · TOOLS · CONTACT` and the `Connect With Us →` pill. Drop the icons — at
11px mono, labels alone are cleaner and more Terminal.

### 5.5 Thin-grid logo wall

From your screenshot of Terminal's client wall: logos in a grid divided by 1px hairlines, with
small `+` crosses at the intersections. On dark, logos go white/mono.

```css
.logo-grid { display: grid; grid-template-columns: repeat(5, 1fr); }
.logo-cell {
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  aspect-ratio: 16/9;
  display: grid; place-items: center;
  filter: grayscale(1) brightness(1.8);
  opacity: .45;
  transition: opacity .25s, filter .25s, scale .25s;
}
.logo-grid:hover .logo-cell { opacity: .18; }        /* dim siblings */
.logo-cell:hover { opacity: 1; filter: none; scale: 1.04; }
```

The sibling-dimming is the detail that makes it feel designed.

### 5.6 Card

Terminal's `01 FAST START` cards: mono eyebrow, heading, body, image. On dark:

```
┌─────────────────────────────┐
│ 01  FAST START              │  ← mono, --ink-3
│                             │
│ We start where it hurts     │  ← d2
│                             │
│ Not with a platform. With   │  ← body, --ink-2
│ the one thing that breaks…  │
│                             │
│ ┌─────────────────────────┐ │
│ │   render / photo        │ │  ← 16:10, notched
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 6. Art direction for every generated asset

This section governs `docs/assets/*`. Every prompt in that folder inherits these rules.

### The two visual registers

**Register A — Photoreal warm.** Real desks, real workshops, real Indian businesses. Warm
tungsten and late-afternoon light, `3200K`, shallow depth of field, honest wear on objects.
This is the "before." It should feel **respected**, never pitied.

**Register B — Technical dark.** Near-black ground, glowing wireframes and point clouds in
violet/cyan, mono telemetry, dimension lines, precise geometry. This is the "after."

**The signature move is the transition between them** — Terminal does exactly this when the
photoreal truck becomes a glowing wireframe while the headline sits over it. That single shot
is their entire value proposition compressed. Yours is the same shot, applied to a bakery
kitchen, a fabric mill, a diamond sorting table.

### Universal render rules

- **Light source is the subject.** Never a lit environment with a dark subject.
- **Negative space is mandatory.** Headlines sit over these renders — keep the centre 40%
  compositionally quiet.
- **No lens flare, no bokeh balls, no volumetric god-rays.** Terminal has none. It is the
  fastest way to look like stock.
- **No people's faces.** Hands are fine and often better — hands on a ledger, hands on a
  keyboard. Faces date a site and complicate rights.
- **Grain, always.** A very fine film grain over everything, `2–3%`. Clean digital renders read
  as cheap; grain reads as photographed.
- **Purple is in the technology, never in the environment.** A purple-lit room is a nightclub.
  A purple wireframe over a warm room is a system.

### Colour grade (apply to every generated image)

```
Shadows   lifted slightly, pushed violet   #1A0F2E at 8%
Midtones  neutral, warm in Register A
Highs     clean white, gold-warm on resolve moments
Contrast  high but not crushed — keep detail in the blacks
Sat       −10% overall, then +selective on the accent
```

---

## 7. Motion

Full spec in `scroll-concepts/08-micro-motion-library.md`. The non-negotiables:

| Use | Ease | Duration |
|---|---|---|
| Hero / headline reveal | `expo.out` | 0.9s |
| UI in | `power3.out` | 0.5s |
| UI out | `power2.in` | 0.3s |
| Layout morph (`Flip`) | `power2.inOut` | 1.0s |
| **Anything scrubbed** | **`none`** | — |
| Emphasis pop | `back.out(1.7)` | 0.6s |

**`ease: 'none'` on every scrub.** An eased scrub fights the user's finger. This one rule
fixes more bad scroll motion than everything else combined.

**Smooth scroll:** `ScrollSmoother` at `smooth: 1.2`, `normalizeScroll: true`. Terminal's
weight is roughly this. Above 1.6 it starts feeling laggy rather than premium.

---

## 8. Layout

- **12-column grid**, `1440px` max content, `88px` gutters desktop / `20px` mobile.
- **Vertical rhythm on an 8px base.** Section padding `160px` desktop, `88px` mobile.
- **Full-bleed renders** break the grid deliberately — that contrast is the point.
- **Asymmetry over symmetry.** Terminal's split is `42% / 52%` with a `6%` gap, not 50/50.
  Off-centre reads as designed; dead-centre reads as default.

---

## 9. What this system is not

To keep the build honest, the things we are explicitly **not** doing:

- No glassmorphism cards, no neon gradient blobs, no aurora backgrounds. *(Your repo has
  `AuroraBackground.tsx` and `ElegantShapes.tsx` — both get retired.)*
- No orbiting-planets diagram. It is charming and it is the most generic AI-agency visual
  there is. Replaced by the facet lattice in `scroll-concepts/04`.
- No custom cursor that follows everywhere. Scoped labels only.
- No autoplaying audio, ever.
- No stock photography of diverse teams pointing at whiteboards.
- No emoji in UI. The 🔍 works on Instagram; it does not work on the site.

---

## 10. The five-second test

If a stranger looks at any screen of this site for five seconds, they should be able to say:

1. This is a serious engineering company, not a marketing agency.
2. They work with real, unglamorous businesses.
3. Something here is precise and measured.
4. The purple thing is theirs.

If a screen fails any of those, it is wrong regardless of how good it looks.
