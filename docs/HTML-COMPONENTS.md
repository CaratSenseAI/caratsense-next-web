# HTML Components — everything we are *not* generating

Every item here was previously an image-generation prompt. It is now a component, because it is
made of rectangles, text and colour — and image models cannot draw interface.

Evidence: `wa-02` came back as a transparent checkerboard with the bubble missing. `slip-01`
said `blaclc forest`. `ledger-01` said `Dobit`. `bill-02`'s arithmetic did not add up. All twelve
text-bearing images shared one handwriting.

These components are sharper, animatable, translatable, correct, and about **40KB total**
against ~900KB of PNGs.

---

## Shared tokens

```css
/* app/globals.css — dark theme */
:root {
  --void:      #050309;
  --surface:   #0C0716;
  --surface-2: #150C24;
  --line:      rgb(168 85 247 / .14);

  --ink:       #F4F1FA;
  --ink-2:     #A797C4;
  --ink-3:     #6B5B87;

  --violet:    #A855F7;
  --magenta:   #E879B8;
  --gold:      #D4AF37;
  --gold-hot:  #F2CE5B;

  --chat-in:   #1F1A2E;
  --chat-out:  #2C1F4A;
  --alert:     #E5484D;
  --alert-bg:  #2A1215;
  --paper:     #F7F7F5;
}
```

---

## 1. `<ChatBubble>` — replaces `wa-01` … `wa-06`

Used in §1 (orbiting), §2 (suspended), §3 (panel 1), §5 (the thread that crystallises).
This is the component that made generation pointless — §5 needs these as real DOM so `Flip`
can morph them into table rows.

```tsx
// components/artefacts/ChatBubble.tsx
type Props = {
  text: string
  time: string
  out?: boolean          // outbound = right-aligned
  ticks?: 0 | 1 | 2
  hand?: boolean         // set in Kalam for Hinglish
}

export function ChatBubble({ text, time, out = true, ticks = 2, hand }: Props) {
  return (
    <div
      data-msg
      data-out={out || undefined}
      className={[
        'relative w-fit max-w-[68%] px-3.5 py-2.5 rounded-[18px]',
        'text-[15px] leading-snug text-[#E8E2F5]',
        out ? 'ml-auto bg-[var(--chat-out)]' : 'bg-[var(--chat-in)]',
        hand ? 'font-[var(--hand-2)]' : '',
      ].join(' ')}
    >
      {text}
      <span className="ml-2 inline-flex items-baseline gap-1 text-[11px] text-[#8A7BA8] tabular-nums">
        {time}
        {ticks > 0 && <Ticks n={ticks} />}
      </span>
      {/* the tail — scales to 0 during the §5 Flip */}
      <span
        aria-hidden
        data-tail
        className={[
          'absolute bottom-0 size-3 rotate-45 origin-center',
          out ? '-right-1 bg-[var(--chat-out)]' : '-left-1 bg-[var(--chat-in)]',
        ].join(' ')}
      />
    </div>
  )
}
```

### Content

```ts
export const THREAD = [
  { text: 'Hi need a cake for saturday',      time: '14:02', out: true  },
  { text: 'ok! what flavour?',                 time: '14:09', out: false },
  { text: 'black forest 1kg',                  time: '14:11', out: true  },
  { text: '₹1660 ok?',                         time: '14:31', out: false },
  { text: 'ok. and delivery?',                 time: '15:47', out: true  },
  { text: 'actually make it 1.5kg sorry',      time: '16:20', out: true  },
  { text: 'kal ka order confirm hai?',         time: '08:12', out: true, hand: true },
  { text: 'stock hai kya?',                    time: '11:03', out: true  },
  { text: 'did u get my last msg?',            time: '21:44', out: true, ticks: 2 },
  { text: 'hello?',                            time: '23:16', out: true, ticks: 1 },
]
```

**No WhatsApp branding.** No green, no logo, no exact bubble geometry. Grammar only —
alignment, radius, timestamp, ticks. That reads as "a chat" and stays clear of trade dress.

**`hand: true`** sets that bubble in **Kalam**, the Google handwriting font with full Devanagari
support, so `कल का ऑर्डर confirm है?` renders correctly if you ever switch to script. See
`assets/A-13-text-in-assets.md` for the font set.

---

## 2. `<SheetFragment>` — replaces `xl-01`, `xl-02`

A rectangle cut out of a spreadsheet. Deliberately ugly.

```tsx
export function SheetFragment({
  rows, cols, cells, tab, variant = 'error',
}: {
  rows: number; cols: number
  cells: Record<string, { v: string; fill?: 'y' | 'r' | 'g'; err?: boolean }>
  tab?: string
  variant?: 'error' | 'colour'
}) {
  const COLS = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, cols)
  return (
    <div className="bg-[var(--paper)] font-mono text-[11px] text-[#1A1A1A] rounded-[3px] overflow-hidden">
      <div className="grid" style={{ gridTemplateColumns: `28px repeat(${cols}, 1fr)` }}>
        <div className="bg-[#E8E8E6] border-b border-r border-[#C9C9C6]" />
        {COLS.map(c => (
          <div key={c} className="bg-[#E8E8E6] border-b border-r border-[#C9C9C6] text-center py-1 text-[#666]">{c}</div>
        ))}
        {Array.from({ length: rows }, (_, r) => (
          <Fragment key={r}>
            <div className="bg-[#E8E8E6] border-b border-r border-[#C9C9C6] text-center py-1 text-[#666]">{r + 1}</div>
            {COLS.map(c => {
              const cell = cells[`${c}${r + 1}`]
              return (
                <div key={c} className={[
                  'border-b border-r border-[#DDDDDA] px-1.5 py-1 text-right tabular-nums',
                  cell?.fill === 'y' && 'bg-[#FFE94D]',
                  cell?.fill === 'r' && 'bg-[#E5484D] text-white',
                  cell?.fill === 'g' && 'bg-[#4DD07A]',
                  cell?.err && 'text-[#C0271F] font-bold text-left',
                ].filter(Boolean).join(' ')}>
                  {cell?.v ?? ''}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
      {tab && (
        <div className="flex bg-[#E8E8E6] border-t border-[#C9C9C6]">
          <span className="px-2.5 py-1 bg-white border-r border-[#C9C9C6] text-[10px]">{tab}</span>
        </div>
      )}
    </div>
  )
}
```

Presets:

```ts
export const XL_01 = { rows: 6, cols: 4, tab: 'Sheet3', cells: {
  A1:{v:'24/04'}, B1:{v:'1,660'}, C1:{v:'#REF!', err:true}, D1:{v:'1'},
  A2:{v:'24/04'}, B2:{v:'680'},   C2:{v:'680'},  D2:{v:'1'},
  A3:{v:'25/04'}, B3:{v:'3,100'}, C3:{v:'3,100'},D3:{v:'2'},
  A4:{v:'25/04'}, B4:{v:'420'},   C4:{v:'420'},  D4:{v:'1'},
  A5:{v:'26/04'}, B5:{v:'1,240'}, C5:{v:'#REF!', err:true}, D5:{v:'1'},
}}

export const XL_02 = { rows: 10, cols: 2, cells: {
  A1:{v:'16/04'}, B1:{v:'18,100', fill:'y'},
  A2:{v:'18/04'}, B2:{v:'20,800'},
  A3:{v:'21/04'}, B3:{v:'610',    fill:'r'},
  A4:{v:'24/04'}, B4:{v:'22,020', fill:'y'},
  A5:{v:'25/04'}, B5:{v:'19,400'},
  A6:{v:'26/04'}, B6:{v:'21,150', fill:'g'},
  A7:{v:'27/04'}, B7:{v:'17,880'},
  A8:{v:'28/04'}, B8:{v:'23,400', fill:'y'},
}}
```

The inconsistent fills are the point — an improvised status system nobody documented.

---

## 3. `<FileChip>` — replaces `xl-03`

The one that would have needed `Sales_Report_v2_FINAL_final.xlsx` rendered with every
underscore intact. Trivial here, near-impossible for the model.

```tsx
export function FileChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 bg-[#EDEDED] rounded px-2 py-1.5 max-w-full">
      <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden>
        <rect width="16" height="16" rx="2" fill="#1D6F42" />
        <path d="M4 5h8M4 8h8M4 11h8" stroke="#fff" strokeWidth="1.2" />
      </svg>
      <span className="font-mono text-[11px] text-[#333] truncate">{name}</span>
    </span>
  )
}
```

```tsx
<FileChip name="Sales_Report_v2_FINAL_final.xlsx" />
<FileChip name="Copy of Stock — updated (2).xlsx" />
```

---

## 4. `<AlertRow>` and `<Badge>` — replaces `call-01`, `wa-05`

```tsx
export function AlertRow({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 bg-[var(--alert-bg)] rounded-[10px] px-3.5 py-3">
      <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden>
        <path d="M4 3c0 7 6 13 13 13v-3l-4-1-2 2a14 14 0 0 1-5-5l2-2-1-4H4z" fill="var(--alert)" />
        <path d="M15 3v5m0 0 2-2m-2 2-2-2" stroke="var(--alert)" strokeWidth="1.4" fill="none" />
      </svg>
      <span className="text-[14px] text-[#F5B5BC]">
        {label}
        {sub && <span className="block text-[11px] text-[#8A7BA8] tabular-nums">{sub}</span>}
      </span>
    </div>
  )
}

export function Badge({ n }: { n: number }) {
  return (
    <span className="grid place-items-center size-8 rounded-full bg-[var(--alert)]
                     text-white text-[13px] font-semibold tabular-nums">
      {n}
    </span>
  )
}
```

```tsx
<AlertRow label="3 missed calls" sub="09:41" />
<Badge n={47} />
```

---

## 5. `<Plate>` — replaces `q-mark`

```tsx
export function Plate({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'gold' }) {
  return (
    <div className={[
      'grid place-items-center aspect-square rounded-xl px-6',
      'bg-[var(--surface)] border border-[var(--line)]',
      tone === 'gold' && 'border-[var(--gold)]/40',
    ].filter(Boolean).join(' ')}>
      <span className={[
        'text-[44px] leading-none tabular-nums',
        tone === 'gold' ? 'text-[var(--gold)]' : 'text-[var(--ink)]',
      ].join(' ')}>{children}</span>
    </div>
  )
}
```

```tsx
<Plate>₹ ?</Plate>                        {/* scattered state */}
<Plate tone="gold">₹ 4,21,900</Plate>     {/* resolved state */}
```

That pair is the §3 content swap in two lines. Generating it would have meant two images and
no way to animate between them.

---

## 6. `<Dashboard>` — replaces all of `A-06`

The §3 resolved state. Sixteen panels land into this grid.

```css
.dash {
  display: grid;
  grid-template-areas:
    "nav head head head"
    "nav kpi  kpi  kpi "
    "nav ord  ord  map "
    "nav ord  ord  feed";
  grid-template-columns: 200px repeat(3, 1fr);
  grid-template-rows: 56px 96px 1fr 1fr;
  gap: 12px;
  height: 100svh;
  padding: 16px;
  background: var(--void);
}
```

```tsx
export function MetricTile({ label, value, spark, gold }: {
  label: string; value: string; spark?: number[]; gold?: boolean
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--line)]
                    bg-[var(--surface)] p-3.5">
      <span className="font-mono text-[11px] uppercase tracking-[.08em] text-[var(--ink-3)]">
        {label}
      </span>
      <div className="flex items-end justify-between gap-2">
        <span className={`text-[26px] leading-none tabular-nums ${gold ? 'text-[var(--gold)]' : 'text-[var(--ink)]'}`}>
          {value}
        </span>
        {spark && <Sparkline data={spark} stroke={gold ? 'var(--gold)' : 'var(--violet)'} />}
      </div>
    </div>
  )
}
```

### The six tiles

```ts
export const TILES = [
  { label: 'Revenue today',    value: '₹ 4,21,900', gold: true },
  { label: 'Orders open',      value: '47' },
  { label: 'Stock value',      value: '₹ 18,40,200' },
  { label: 'Quote time',       value: '0.4s' },
  { label: 'On-time delivery', value: '94%' },
  { label: 'Batches tracked',  value: '1,284' },
]
```

Exactly one gold tile. Counters animate on scroll-in with
`Intl.NumberFormat('en-IN')` — `4,21,900`, never `421,900`.

`<Sparkline>` is a 40×16 inline SVG `<polyline>`. Six points is plenty.

---

## 7. `<FacetLattice>` — §4's pinned panel

Hand-authored SVG, drawn in with `DrawSVG` as the six chapters scroll. No CAD software needed —
this is 60 lines of `<line>` and `<circle>`.

```tsx
<svg viewBox="0 0 600 600" className="size-full">
  <g id="lattice-0">
    <circle className="node" cx="300" cy="300" r="7" fill="var(--magenta)" />
  </g>
  <g id="lattice-1">
    <line className="edge" x1="300" y1="300" x2="180" y2="200" />
    <line className="edge" x1="300" y1="300" x2="420" y2="200" />
    <line className="edge" x1="300" y1="300" x2="300" y2="440" />
    <circle className="node" cx="180" cy="200" r="5" />
    <circle className="node" cx="420" cy="200" r="5" />
    <circle className="node" cx="300" cy="440" r="5" />
  </g>
  {/* groups 2–5 add progressively; group 5 uses stroke-dasharray for unbuilt capacity */}
</svg>
```

```css
.edge { stroke: var(--violet); stroke-width: 1.25; fill: none; opacity: .55; }
.node { fill: var(--violet); }
#lattice-5 .edge { stroke-dasharray: 4 5; opacity: .3; }   /* ghost nodes, ch.06 */
```

Final state is the round-brilliant facet plan, tying §4 back to the page's skeleton.

---

## 8. `<TelemetryChip>` and `<DimensionLine>`

The single highest ratio of perceived-sophistication to effort on the whole site. Terminal's
`ASSET ON SITE` / `CHECK IN: 2:34 PM` chips.

```tsx
export function TelemetryChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-md border border-[var(--line)]
                     bg-[rgb(5_3_9/.72)] px-3 py-2 backdrop-blur-md
                     font-mono text-[12px] uppercase tracking-[.08em] text-[var(--gold-hot)]">
      {children}
    </span>
  )
}

export function DimensionLine({ label, w = 200 }: { label: string; w?: number }) {
  return (
    <div className="inline-flex flex-col items-center gap-1" style={{ width: w }}>
      <svg viewBox={`0 0 ${w} 8`} width={w} height={8} aria-hidden>
        <line x1="1" y1="4" x2={w - 1} y2="4" stroke="var(--line)" />
        <line x1="1" y1="0" x2="1" y2="8" stroke="var(--line)" />
        <line x1={w - 1} y1="0" x2={w - 1} y2="8" stroke="var(--line)" />
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-[.1em] text-[var(--ink-3)]">
        {label}
      </span>
    </div>
  )
}
```

Chip content per §4 chapter:

```ts
['BOTTLENECK: ORDER INTAKE', 'SYNCING · 3 SOURCES', '14 WORKFLOWS ACTIVE',
 'MODEL v4 · TRAINED ON 41,882 ORDERS', 'QUOTE GENERATED · 0.4s', '+6 NODES AVAILABLE']
```

Dimension lines: `847 ORDERS / DAY` · `3 PLANTS` · `11s → 0.4s` · `16 → 1`

---

## 9. `<Spectrum>` — §8, replaces the generated spectrum

Five labelled bands exiting the gem. Real `<text>` nodes — selectable, translatable, legible.

```tsx
const BANDS = [
  { y: 250, c: '#C9A6FF', label: 'orders, tracked' },
  { y: 280, c: '#A855F7', label: 'stock, live' },
  { y: 310, c: '#E879B8', label: 'quotes, instant' },
  { y: 340, c: '#F2CE5B', label: 'delivery, visible' },
  { y: 370, c: '#D4AF37', label: 'margin, known' },
]
```

```tsx
<svg viewBox="0 0 1200 620">
  <line id="beam" x1="0" y1="310" x2="520" y2="310" stroke="#fff" strokeWidth="2" />
  <g id="bands">
    {BANDS.map(b => (
      <Fragment key={b.label}>
        <path className="band" d={`M 680 310 L 820 ${b.y} L 1040 ${b.y}`} stroke={b.c} strokeWidth="2" fill="none" />
        <text className="band-label" x="1056" y={b.y + 4}
              fill={b.c} fontSize="15" letterSpacing=".02em">{b.label}</text>
      </Fragment>
    ))}
  </g>
</svg>
```

`DrawSVG` the beam, then the bands, then fade the labels in — spec in `assets/A-09`.

---

## 10. Ambient — `<Grain>`, `<Grid>`, `<Caustic>`, `<Vignette>`

All CSS/SVG, zero image weight. Full source in `assets/A-11-textures-grain.md` §1, §2, §4, §5.

- **Grain** — inline SVG `feTurbulence`, fixed overlay, `opacity: .035`. Never animate it.
- **Grid** — two `linear-gradient`s at `48px`, with a radial mask so it fades at the edges.
- **Caustic** — slow `feTurbulence` drift at `opacity: .04`. If you can see it move, it's wrong.
- **Vignette** — one `radial-gradient`. Full-bleed renders only, never over text.

The only two textures still generated are `A-11_ledger.webp` and `A-11_paper.webp`.

---

## 11. `<Mark>` — the logo, §0 and nav

Concept 1 from `assets/A-12`. Three SVG paths, separated and reconverged on scroll with a
chromatic-aberration filter. Sharp at every size, no generation, works in the loader and the nav.

```tsx
gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=60%', scrub: 1 } })
  .to('.mark path', { x: i => (i - 1) * 14, y: i => (i - 1) * -6, ease: 'power2.inOut' })
  .to('.mark', { filter: 'url(#chroma)' }, '<')
  .to('.mark path', { x: 0, y: 0, ease: 'expo.out' })
```

Filter source in `assets/A-12` Concept 1.

---

## 12. Sprite wrapper — how these float in §1 and §2

Every component above becomes an artefact sprite by wrapping it. Same nodes then `Flip` into
§3's dashboard — which is the whole reason they are DOM.

```tsx
export function Sprite({ i, children }: { i: number; children: ReactNode }) {
  const j = (s: number, a: number) => ((Math.sin(s * 12.9898) * 43758.5453) % 1) * a
  return (
    <div
      data-panel
      className="absolute origin-center [transform-style:preserve-3d]"
      style={{
        rotate: `${j(i, 14)}deg`,
        scale: 0.6 + Math.abs(j(i + 7, 0.5)),
        filter: 'grayscale(1) brightness(.85)',
      }}
    >
      {children}
    </div>
  )
}
```

Deterministic jitter — `Math.random()` would break SSR hydration.

§2 needs ~200 of these: instance the ~20 components at varied scale, rotation and depth. Nobody
counts, and swapping the text gives free variation.
