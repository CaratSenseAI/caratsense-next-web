'use client'

import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { CAL } from '@/lib/contact'

/**
 * Cal.com **inline** embed.
 *
 * Replaces the modal popup. The popup renders <cal-modal-box> in the light DOM
 * with its own shadow root, and its backdrop stayed white on some machines no
 * matter how the --cal-* vars were set — the chrome is Cal's, not ours. Inline
 * has no chrome and no backdrop: it is just an iframe in a container we own,
 * so the page background is ours and there is nothing left to glitch.
 */
export function BookEmbed() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: CAL.namespace })
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
      setReady(true)
    })()
  }, [])

  return (
    // Capped to the booker's own width. Cal's iframe paints its body white
    // even in dark theme, so any container wider than the booker shows white
    // bands down the sides — this is the only way to hide them from outside a
    // cross-origin frame.
    <div className="relative mx-auto min-h-[38rem] w-full max-w-[65rem] overflow-hidden rounded-2xl border border-line bg-surface">
      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="t-micro animate-pulse text-ink-3">Loading availability…</span>
        </div>
      )}
      <Cal
        namespace={CAL.namespace}
        calLink={CAL.link}
        style={{ width: '100%', height: '100%', minHeight: '38rem', overflow: 'scroll' }}
        // theme goes in the CONFIG, not only in cal('ui'). The ui call races
        // the iframe's own init, so on a machine whose OS is set to light the
        // booker rendered light against our dark page. In config it becomes a
        // URL parameter on the embed and is applied before first paint.
        config={{ layout: 'month_view', theme: 'dark', useSlotsViewOnSmallScreen: 'true' }}
      />
    </div>
  )
}
