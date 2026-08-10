import { cn } from '@/lib/cn'
import type { ChartDef } from '@/lib/site'

/**
 * Panel micro-charts for §3's resolved dashboard.
 *
 * Lines and tracks are stretched SVGs on a 0–100 viewBox with
 * `preserveAspectRatio="none"`, so one component fills a 1-column tile and a
 * 5-column tile equally without per-panel sizing; strokes carry
 * `vector-effect: non-scaling-stroke` so they stay 1px however far the box
 * stretches. Bars are DOM instead — see `Bars`.
 *
 * The classes (`ch-line`, `ch-bar`, `ch-ring`, `ch-track`, `ch-dot`) are the
 * animation contract — SixteenToOne drives them from the same scrubbed
 * timeline that converges the panels, so the charts draw as the dashboard
 * assembles and reverse cleanly on scroll-back.
 */

const STROKE = { vectorEffect: 'non-scaling-stroke' } as const

/** values → "M x,y L x,y …" across the full 0–100 box, 6% padded vertically. */
function toPath(data: number[]): string {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  const step = 100 / (data.length - 1 || 1)
  return data
    .map((v, i) => {
      const x = i * step
      const y = 94 - ((v - min) / span) * 88
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

function Spark({ data, gold }: { data: number[]; gold?: boolean }) {
  const line = toPath(data)
  const stroke = gold ? 'var(--color-gold)' : 'var(--color-violet)'
  const last = data[data.length - 1]
  const max = Math.max(...data)
  const min = Math.min(...data)
  const tipY = 94 - ((last - min) / (max - min || 1)) * 88

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full overflow-visible">
      {/* fill under the curve — closed back along the baseline */}
      <path className="ch-area" d={`${line} L100,100 L0,100 Z`} fill={stroke} opacity="0.12" />
      <path
        className="ch-line"
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={STROKE}
      />
      {/* live tip — the one thing that keeps moving once everything has landed */}
      <circle className="ch-dot" cx="100" cy={tipY} r="2" fill={stroke} />
    </svg>
  )
}

/**
 * Bars are DOM, not a stretched SVG.
 *
 * A 3-value series in a 750px-wide tile gave three 230px-wide rectangles —
 * blocks, not a chart. Bar *thickness* has to be constant regardless of how
 * wide the tile is, which a `preserveAspectRatio="none"` viewBox cannot do.
 * Fixed-width flex children, left-aligned, height as a percentage.
 */
function Bars({ data, gold }: { data: number[]; gold?: boolean }) {
  const max = Math.max(...data) || 1
  const fill = gold ? 'var(--color-gold)' : 'var(--color-violet)'

  return (
    <div className="flex h-full items-end gap-[3px]">
      {data.map((v, i) => (
        <span
          key={i}
          className="ch-bar block w-1.5 origin-bottom rounded-[1.5px]"
          style={{
            height: `${Math.max(8, (v / max) * 100)}%`,
            background: fill,
            /* tallest bar reads as "now" and stays lit */
            opacity: v === max ? 0.92 : 0.45,
          }}
        />
      ))}
    </div>
  )
}

function Ring({ pct, gold }: { pct: number; gold?: boolean }) {
  const stroke = gold ? 'var(--color-gold)' : 'var(--color-violet)'
  const r = 32
  const c = 2 * Math.PI * r

  return (
    <svg viewBox="0 0 100 100" className="size-full">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-line)" strokeWidth="7" />
      <circle
        className="ch-ring"
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform="rotate(-90 50 50)"
      />
    </svg>
  )
}

function Track({ pct, segments = 0, gold }: { pct: number; segments?: number; gold?: boolean }) {
  const fill = gold ? 'var(--color-gold)' : 'var(--color-violet)'

  // segmented: discrete slots (dispatch bays, SKUs) rather than a continuous bar
  if (segments) {
    const lit = Math.round((pct / 100) * segments)
    const gap = 2.5
    const w = (100 - gap * (segments - 1)) / segments
    return (
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-1.5 w-full">
        {Array.from({ length: segments }, (_, i) => (
          <rect
            key={i}
            className="ch-track"
            x={i * (w + gap)}
            y="0"
            width={w}
            height="10"
            rx="2"
            fill={i < lit ? fill : 'var(--color-line)'}
            opacity={i < lit ? 0.9 : 1}
            style={{ transformBox: 'fill-box', transformOrigin: 'left' }}
          />
        ))}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-1.5 w-full">
      <rect x="0" y="3" width="100" height="4" rx="2" fill="var(--color-line)" />
      <rect
        className="ch-track"
        x="0"
        y="3"
        width={pct}
        height="4"
        rx="2"
        fill={fill}
        style={{ transformBox: 'fill-box', transformOrigin: 'left' }}
      />
    </svg>
  )
}

/**
 * Fixed chart height, not flex-1 — letting the chart absorb the tile's slack
 * looked right on a 1-row tile and absurd on a 2-row one. A KPI tile reads as
 * a chart *because* the chart is small; the slack belongs to a spacer.
 *
 * A ring gets more room than a line does: a 44px circle in a two-row tile
 * looks lost where a 44px sparkline looks right. Both stay shrinkable, so on
 * the 66/88px header rows they squeeze instead of colliding with the label.
 */
const CHART_H: Record<ChartDef['type'], string> = {
  spark: 'h-[clamp(18px,3.4vh,44px)]',
  bars: 'h-[clamp(18px,3.4vh,44px)]',
  track: 'h-[clamp(18px,3.4vh,44px)]',
  ring: 'h-[clamp(18px,6.5vh,76px)]',
}

export function PanelChart({
  chart,
  gold,
  className,
}: {
  chart: ChartDef
  gold?: boolean
  className?: string
}) {
  return (
    <div aria-hidden className={cn('w-full min-h-0 shrink', CHART_H[chart.type], className)}>
      {chart.type === 'spark' && <Spark data={chart.data} gold={gold} />}
      {chart.type === 'bars' && <Bars data={chart.data} gold={gold} />}
      {/* square: aspect-ratio off h-full, so it can never become an oval */}
      {chart.type === 'ring' && (
        <div className="flex h-full items-end">
          <div className="aspect-square h-full">
            <Ring pct={chart.pct} gold={gold} />
          </div>
        </div>
      )}
      {chart.type === 'track' && (
        <div className="flex size-full items-end pb-0.5">
          <Track pct={chart.pct} segments={chart.segments} gold={gold} />
        </div>
      )}
    </div>
  )
}
