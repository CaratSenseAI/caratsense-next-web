'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'

/**
 * Not a spinner — a cut counter, so the wait is part of the metaphor.
 *
 * Never fakes progress. It tracks document readiness and font loading, and if
 * those resolve in 200ms it exits in 200ms. A loader that lingers for effect is
 * the most transparently dishonest thing a site can do.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null)
  const [facets, setFacets] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let n = 0
    let alive = true

    const tick = () => {
      if (!alive) return
      n = Math.min(n + 1, 6)
      setFacets(n)
    }

    // real signals, not a timer pretending to be one
    const signals: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) =>
        document.readyState === 'complete' ? r(null) : window.addEventListener('load', () => r(null), { once: true }),
      ),
    ]

    const id = setInterval(tick, 90)
    Promise.all(signals).then(() => {
      if (!alive) return
      clearInterval(id)
      setFacets(6)
      setDone(true)
    })

    // hard cap so a hung asset never traps the page
    const cap = setTimeout(() => {
      if (!alive) return
      clearInterval(id)
      setFacets(6)
      setDone(true)
    }, 2500)

    return () => {
      alive = false
      clearInterval(id)
      clearTimeout(cap)
    }
  }, [])

  useGSAP(
    () => {
      if (!done) return
      gsap.to(root.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'expo.inOut',
        delay: 0.1,
        onComplete: () => {
          if (root.current) root.current.style.display = 'none'
          document.documentElement.dataset.loaded = 'true'
        },
      })
    },
    { dependencies: [done], scope: root },
  )

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
      aria-hidden={done}
    >
      {/* A-12 — the mark as cut crystal. Only place it appears; the nav and
          footer use the flat official mark. */}
      <Image
        src="/render/A-12_crystal-mark.webp"
        alt=""
        width={1024}
        height={708}
        priority
        className="mb-9 h-24 w-auto"
      />
      <div className="flex items-baseline gap-6">
        <span className="t-micro text-ink-3">CaratSense</span>
        <span className="t-micro text-ink nums">{facets} / 6 facets</span>
      </div>
      <div className="mt-4 h-px w-[240px] overflow-hidden bg-line">
        <div
          className="h-full bg-gold transition-[width] duration-300 ease-out"
          style={{ width: `${(facets / 6) * 100}%` }}
        />
      </div>
    </div>
  )
}
