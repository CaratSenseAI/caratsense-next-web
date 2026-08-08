import { cn } from '@/lib/cn'

/* ============================================================
   Panel — the notched container. Always notch the SAME corner
   (top-left). Consistency is what makes it read as a system.
   ============================================================ */

export function Panel({
  children,
  className,
  grid = false,
}: {
  children?: React.ReactNode
  className?: string
  grid?: boolean
}) {
  return (
    <div className={cn('panel', className)}>
      {grid && <div aria-hidden className="grid-tech pointer-events-none absolute inset-0" />}
      {children}
    </div>
  )
}

/* ============================================================
   TelemetryChip — Terminal's ASSET ON SITE / CHECK IN: 2:34 PM.
   Highest ratio of perceived sophistication to effort on the site.
   ============================================================ */

export function TelemetryChip({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-block rounded-md border border-line bg-void/70 px-3 py-2 backdrop-blur-md',
        't-mono text-gold-hot',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ============================================================
   DimensionLine — CAD annotation. Pure decoration, entirely worth it.
   ============================================================ */

export function DimensionLine({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div className={cn('inline-flex flex-col items-center gap-1', className)}>
      <svg viewBox="0 0 200 8" className="h-2 w-full" preserveAspectRatio="none" aria-hidden>
        <line x1="1" y1="4" x2="199" y2="4" stroke="var(--color-line-strong)" />
        <line x1="1" y1="0" x2="1" y2="8" stroke="var(--color-line-strong)" />
        <line x1="199" y1="0" x2="199" y2="8" stroke="var(--color-line-strong)" />
      </svg>
      <span className="t-micro whitespace-nowrap text-ink-3">{label}</span>
    </div>
  )
}

/* ============================================================
   Eyebrow — mono section label with an index
   ============================================================ */

export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn('t-mono flex items-center gap-3 text-ink-3', className)}>
      {index && <span className="text-gold">{index}</span>}
      <span>{children}</span>
    </p>
  )
}

/* ============================================================
   Mark — the logo. Three ascending strokes: rough → cut → clear.
   Three states of the same material, which is the whole thesis.
   ============================================================ */

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={cn('mark h-6 w-auto', className)} aria-label="CaratSense AI">
      <defs>
        <filter id="chroma" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset in="SourceGraphic" dx="-2" dy="0" result="r" />
          <feOffset in="SourceGraphic" dx="2" dy="0" result="b" />
          <feColorMatrix
            in="r"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 0"
            result="rc"
          />
          <feColorMatrix
            in="b"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 .6 0"
            result="bc"
          />
          <feBlend in="rc" in2="bc" mode="screen" result="m" />
          <feBlend in="SourceGraphic" in2="m" mode="screen" />
        </filter>
      </defs>
      {/* three parallel ascending strokes */}
      <path d="M2 26 Q10 26 14 18 T26 10" stroke="var(--color-violet-deep)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M11 26 Q19 26 23 18 T35 10" stroke="var(--color-violet)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M20 26 Q28 26 32 18 T44 10" stroke="#c9a6ff" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* ============================================================
   Ambient — grain is global; caustic is per-section and must be
   imperceptible. If you can see it move, it is too strong.
   ============================================================ */

export function Caustic({ className }: { className?: string }) {
  return <div aria-hidden className={cn('caustic', className)} />
}

export function FacetRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn('facet-rule', className)} />
}
