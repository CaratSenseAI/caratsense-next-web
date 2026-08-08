import { Fragment } from 'react'
import { cn } from '@/lib/cn'

/* ============================================================
   ChatBubble — replaces generated wa-01…wa-06
   §5 needs these as real DOM so Flip can morph them into table rows.
   Grammar of a chat only: alignment, radius, timestamp, ticks.
   No green, no logo, no exact bubble geometry.
   ============================================================ */

export function Ticks({ n = 2, read = false }: { n?: 1 | 2; read?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 12"
      className={cn('inline-block h-3 w-5 shrink-0', read ? 'text-violet' : 'text-ink-3')}
      aria-hidden
    >
      <path
        d="M1 6.5 4.5 10 11 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {n === 2 && (
        <path
          d="M8 6.5 11.5 10 18 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export function ChatBubble({
  text,
  time,
  out = true,
  ticks = 2,
  read = false,
  hand = false,
  className,
}: {
  text: string
  time: string
  out?: boolean
  ticks?: 1 | 2
  read?: boolean
  hand?: boolean
  className?: string
}) {
  return (
    <div
      data-artefact="chat"
      data-out={out || undefined}
      className={cn(
        'relative w-fit max-w-[min(30ch,68%)] rounded-[18px] px-3.5 py-2.5',
        'text-[0.9375rem] leading-snug text-[#e8e2f5]',
        out ? 'ml-auto bg-chat-out' : 'bg-chat-in',
        hand && 'font-[family-name:var(--font-hand)] text-[1.0625rem]',
        className,
      )}
    >
      <span>{text}</span>
      <span className="ml-2 inline-flex items-center gap-1 align-baseline text-[0.6875rem] text-ink-3 nums">
        {time}
        <Ticks n={ticks} read={read} />
      </span>
      {/* the tail. scaling this to 0 is the moment §5 stops being a chat. */}
      <span
        aria-hidden
        data-tail
        className={cn(
          'absolute bottom-0 size-3 origin-center rotate-45',
          out ? '-right-1 bg-chat-out' : '-left-1 bg-chat-in',
        )}
      />
    </div>
  )
}

/* ============================================================
   SheetFragment — replaces xl-01, xl-02
   A rectangle cut out of a spreadsheet. Deliberately ugly.
   ============================================================ */

type Cell = { v: string; fill?: 'y' | 'r' | 'g'; err?: boolean }

export function SheetFragment({
  rows,
  cols,
  cells,
  tab,
  className,
}: {
  rows: number
  cols: number
  cells: Record<string, Cell>
  tab?: string
  className?: string
}) {
  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, cols)

  return (
    <div
      data-artefact="sheet"
      className={cn('overflow-hidden rounded-[3px] bg-paper font-mono text-[0.6875rem] text-[#1a1a1a]', className)}
    >
      <div className="grid" style={{ gridTemplateColumns: `26px repeat(${cols}, minmax(0,1fr))` }}>
        <div className="border-b border-r border-[#c9c9c6] bg-[#e8e8e6]" />
        {LETTERS.map((c) => (
          <div
            key={c}
            className="border-b border-r border-[#c9c9c6] bg-[#e8e8e6] py-1 text-center text-[#666]"
          >
            {c}
          </div>
        ))}
        {Array.from({ length: rows }, (_, r) => (
          <Fragment key={r}>
            <div className="border-b border-r border-[#c9c9c6] bg-[#e8e8e6] py-1 text-center text-[#666]">
              {r + 1}
            </div>
            {LETTERS.map((c) => {
              const cell = cells[`${c}${r + 1}`]
              return (
                <div
                  key={c}
                  className={cn(
                    'truncate border-b border-r border-[#dddddA] px-1.5 py-1 text-right nums',
                    cell?.fill === 'y' && 'bg-[#ffe94d]',
                    cell?.fill === 'r' && 'bg-[#e5484d] text-white',
                    cell?.fill === 'g' && 'bg-[#4dd07a]',
                    cell?.err && 'text-left font-bold text-[#c0271f]',
                  )}
                >
                  {cell?.v ?? ''}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
      {tab && (
        <div className="flex border-t border-[#c9c9c6] bg-[#e8e8e6]">
          <span className="border-r border-[#c9c9c6] bg-white px-2.5 py-1 text-[0.625rem]">{tab}</span>
        </div>
      )}
    </div>
  )
}

/* ============================================================
   FileChip — replaces xl-03. The one that needed
   Sales_Report_v2_FINAL_final.xlsx rendered with every underscore intact.
   ============================================================ */

export function FileChip({ name, className }: { name: string; className?: string }) {
  return (
    <span
      data-artefact="file"
      className={cn('inline-flex max-w-full items-center gap-2 rounded bg-[#ededed] px-2 py-1.5', className)}
    >
      <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden>
        <rect width="16" height="16" rx="2" fill="#1d6f42" />
        <path d="M4 5h8M4 8h8M4 11h6" stroke="#fff" strokeWidth="1.2" />
      </svg>
      <span className="truncate font-mono text-[0.6875rem] text-[#333]">{name}</span>
    </span>
  )
}

/* ============================================================
   AlertRow + Badge — replaces call-01, wa-05
   ============================================================ */

export function AlertRow({
  label,
  sub,
  className,
}: {
  label: string
  sub?: string
  className?: string
}) {
  return (
    <div
      data-artefact="alert"
      className={cn('flex items-center gap-3 rounded-[10px] bg-alert-bg px-3.5 py-3', className)}
    >
      <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden>
        <path
          d="M4 3c0 7 6 13 13 13v-3l-4-1-2 2a14 14 0 0 1-5-5l2-2-1-4H4z"
          fill="var(--color-alert)"
        />
        <path d="M15.5 2.5v5m0 0 2.2-2.2m-2.2 2.2-2.2-2.2" stroke="var(--color-alert)" strokeWidth="1.4" fill="none" />
      </svg>
      <span className="text-sm text-[#f5b5bc]">
        {label}
        {sub && <span className="block text-[0.6875rem] text-ink-3 nums">{sub}</span>}
      </span>
    </div>
  )
}

export function Badge({ n, className }: { n: number; className?: string }) {
  return (
    <span
      data-artefact="badge"
      className={cn(
        'grid size-9 place-items-center rounded-full bg-alert text-[0.8125rem] font-semibold text-white nums',
        className,
      )}
    >
      {n}
    </span>
  )
}

/* ============================================================
   Plate — replaces q-mark. The §3 content swap is <Plate>₹ ?</Plate>
   becoming <Plate tone="gold">₹ 4,21,900</Plate>.
   ============================================================ */

export function Plate({
  children,
  tone = 'default',
  label,
  className,
}: {
  children: React.ReactNode
  tone?: 'default' | 'gold' | 'muted'
  label?: string
  className?: string
}) {
  return (
    <div
      data-artefact="plate"
      className={cn(
        'flex flex-col justify-between gap-2 rounded-xl border bg-surface p-3.5',
        tone === 'gold' ? 'border-gold/40' : 'border-line',
        className,
      )}
    >
      {label && <span className="t-micro text-ink-3">{label}</span>}
      <span
        className={cn(
          'text-[clamp(1.25rem,2.2vw,1.75rem)] leading-none nums',
          tone === 'gold' ? 'text-gold' : tone === 'muted' ? 'text-ink-3' : 'text-ink',
        )}
      >
        {children}
      </span>
    </div>
  )
}

/* ============================================================
   Sticky / Slip — paper artefacts. Substrate images land here later;
   until then these are pure CSS and already read correctly.
   ============================================================ */

export function StickyNote({
  children,
  tone = 'yellow',
  className,
}: {
  children: React.ReactNode
  tone?: 'yellow' | 'pink' | 'orange'
  className?: string
}) {
  const TONE = {
    yellow: 'bg-[#f5e07a] text-[#3a3410]',
    pink: 'bg-[#f0b8cc] text-[#3f1024]',
    orange: 'bg-[#f2c288] text-[#3f2410]',
  }
  return (
    <div
      data-artefact="sticky"
      className={cn(
        'grid aspect-square w-full place-items-center p-3 text-center',
        'font-[family-name:var(--font-hand)] text-[0.9375rem] leading-tight',
        TONE[tone],
        className,
      )}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)' }}
    >
      {children}
    </div>
  )
}
