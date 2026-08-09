'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * Drag-to-compare between the photoreal plate and its wireframe twin.
 *
 * Genuinely interactive rather than decorative: the same A-08 pair the hero
 * wipes automatically is here under the reader's control, which is the point —
 * "here is your workspace, here is the system underneath it."
 *
 * Keyboard accessible via a real range input; pointer drag is layered on top.
 */
export function BeforeAfter({
  id,
  labelA = 'The workspace',
  labelB = 'The system',
}: {
  id: string
  labelA?: string
  labelB?: string
}) {
  const [p, setP] = useState(52)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const fromPointer = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setP(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }, [])

  return (
    <figure className="my-16">
      <div
        ref={box}
        className="panel relative aspect-[16/10] cursor-ew-resize select-none overflow-hidden"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          fromPointer(e.clientX)
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <Image
          src={`/case-studies/hero-${id}.webp`}
          alt={labelA}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />

        {/* the wireframe side, revealed left-to-right */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${p}%)` }}
          aria-hidden
        >
          <Image
            src={`/case-studies/hero-${id}-wire.webp`}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-void/25" />
        </div>

        {/* handle */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-gold/80"
          style={{ left: `${p}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/50 bg-void/80 backdrop-blur-sm">
            <svg viewBox="0 0 16 16" className="size-3.5 text-gold" aria-hidden>
              <path
                d="M6 3 2 8l4 5M10 3l4 5-4 5"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <span
          className={cn(
            't-micro absolute bottom-5 left-5 rounded border border-line bg-void/70 px-2.5 py-1.5 backdrop-blur-md',
            p > 18 ? 'text-ink-2' : 'text-ink-3/40',
          )}
        >
          {labelA}
        </span>
        <span
          className={cn(
            't-micro absolute bottom-5 right-5 rounded border border-line bg-void/70 px-2.5 py-1.5 backdrop-blur-md',
            p < 82 ? 'text-gold' : 'text-ink-3/40',
          )}
        >
          {labelB}
        </span>
      </div>

      <label className="mt-5 flex items-center gap-4">
        <span className="t-micro shrink-0 text-ink-3">Drag to compare</span>
        <input
          type="range"
          min={0}
          max={100}
          value={p}
          onChange={(e) => setP(Number(e.target.value))}
          aria-label={`Reveal ${labelB}`}
          className="h-1 w-full max-w-xs cursor-ew-resize appearance-none rounded bg-line-strong accent-[var(--color-gold)]"
        />
      </label>
    </figure>
  )
}
