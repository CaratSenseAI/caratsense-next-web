'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'
import { cn } from '@/lib/cn'
import { CAL } from '@/lib/contact'

/**
 * Cal.com booking popup, themed to the site.
 *
 * The embed script is only fetched once the component mounts, so it costs
 * nothing on pages that do not use it.
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
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: CAL.namespace })

      // Theme only — the modal chrome and backdrop are themed from
      // globals.css, because <cal-modal-box> lives in the light DOM and reads
      // its --cal-* vars off the host. Setting them here as well made Cal warn
      // "Existing embed CSS Vars are being reset" for no benefit.
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [])

  return (
    <button
      type="button"
      data-cal-namespace={CAL.namespace}
      data-cal-link={CAL.link}
      data-cal-config={`{"layout":"month_view","theme":"dark"}`}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-full transition-colors',
        variant === 'solid' && 'bg-violet-deep px-6 py-3.5 text-[0.9375rem] font-medium text-white hover:bg-violet',
        variant === 'outline' && 'border border-line px-6 py-3.5 text-[0.9375rem] text-ink hover:border-violet/50',
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
    </button>
  )
}
