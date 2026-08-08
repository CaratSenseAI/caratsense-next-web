import Image from 'next/image'
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
   Mark — the official CaratSense logo. Two interlocking capsule
   forms, violet→magenta gradient.

   Shipped as PNG because the only source available is a raster
   export and there is no vectoriser on this machine. Redrawing an
   official mark by eye is not worth the risk of getting it subtly
   wrong. Replace with the brand's own SVG when it surfaces — that
   also unlocks the chromatic-aberration treatment in assets/A-12.
   ============================================================ */

export function Mark({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      width={1024}
      height={780}
      priority={priority}
      className={cn('mark h-6 w-auto select-none', className)}
    />
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
