import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * Routes to /book, which carries the Cal.com **inline** embed.
 *
 * This used to open Cal's modal popup. That popup renders <cal-modal-box> in
 * the light DOM with its own shadow root, and on some machines its backdrop
 * stayed white over the dark page no matter how the --cal-* variables were set
 * — that chrome belongs to Cal, not to us. The inline embed has no chrome and
 * no backdrop, so the page background is ours and there is nothing left to
 * glitch.
 *
 * Now a plain link: it works without JS, and booking gets a real shareable URL.
 * If the inline embed ever misbehaves too, swapping href to
 * https://cal.com/caratsense/30min?overlayCalendar=true is a one-line change.
 */
export function BookCall({
  children = 'Book a call',
  variant = 'solid',
  className,
}: {
  children?: React.ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  className?: string
}) {
  return (
    <Link
      href="/book"
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-full transition-colors duration-200',
        variant === 'solid' &&
          'bg-violet-deep px-6 py-3.5 text-[0.9375rem] font-medium text-white hover:bg-violet',
        variant === 'outline' &&
          'border border-line px-6 py-3.5 text-[0.9375rem] text-ink hover:border-violet/50',
        variant === 'ghost' && 't-micro px-4 py-2 text-white',
        className,
      )}
    >
      {children}
      <svg
        viewBox="0 0 12 12"
        className="size-3.5 transition-transform group-hover:translate-x-1"
        aria-hidden
      >
        <path
          d="M1 6h9M6.5 2 10.5 6l-4 4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
