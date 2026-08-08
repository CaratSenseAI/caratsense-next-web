'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'

/**
 * The Apple technique — a rendered camera move shipped as WebP frames and
 * scrubbed by scroll. One drawImage per frame, ~1ms, 60fps on hardware where
 * live 3D would crawl. See docs/scroll-concepts/09 §6.
 *
 * Renders nothing but the poster until the frames exist, so sections can be
 * built and reviewed before the sequence comes back from Kling.
 */
export function FrameSequence({
  dir,
  count,
  mobileCount,
  poster,
  scrollLength = '400%',
  className,
  children,
}: {
  /** e.g. "/seq/A-03_hero-dive" — files are 0001.webp … */
  dir: string
  count: number
  /** frames in <dir>/mobile — usually fewer, at half width */
  mobileCount?: number
  poster?: string
  scrollLength?: string
  className?: string
  /** overlay content — headline, chips. Pinned along with the canvas. */
  children?: React.ReactNode
}) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const frames = useRef<HTMLImageElement[]>([])
  const [ready, setReady] = useState(false)
  const [missing, setMissing] = useState(false)

  /** Preload everything before enabling the trigger, or the first pass stutters. */
  useEffect(() => {
    let cancelled = false
    const mobile = window.matchMedia('(max-width: 768px)').matches
    const base = mobile ? `${dir}/mobile` : dir
    const n = mobile ? (mobileCount ?? Math.ceil(count * 0.55)) : count

    const load = (i: number) =>
      new Promise<HTMLImageElement | null>((res) => {
        const img = new Image()
        img.src = `${base}/${String(i + 1).padStart(4, '0')}.webp`
        img.onload = () => res(img)
        img.onerror = () => res(null)
      })

    Promise.all(Array.from({ length: n }, (_, i) => load(i))).then((imgs) => {
      if (cancelled) return
      const ok = imgs.filter(Boolean) as HTMLImageElement[]
      if (ok.length < n * 0.9) {
        setMissing(true)
        return
      }
      frames.current = ok
      setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [dir, count, mobileCount])

  useGSAP(
    () => {
      if (!ready) return
      const c = canvas.current!
      const ctx = c.getContext('2d')!
      const imgs = frames.current
      const first = imgs[0]

      const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        c.width = first.naturalWidth * dpr
        c.height = first.naturalHeight * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      size()
      ctx.drawImage(first, 0, 0, first.naturalWidth, first.naturalHeight)

      const draw = (i: number) => {
        const img = imgs[Math.max(0, Math.min(imgs.length - 1, Math.round(i)))]
        if (img) ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
      }

      // ScrollTrigger progress drives the frame index directly. Tweening a
      // plain object with a scrollTrigger attached throws inside
      // ScrollTrigger.refresh, so there is no tween here at all.
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: `+=${scrollLength}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => draw(self.progress * (imgs.length - 1)),
      })

      return () => st.kill()
    },
    { dependencies: [ready], scope: root },
  )

  return (
    <div ref={root} className={cn('relative h-svh w-full overflow-hidden', className)}>
      {ready ? (
        <canvas ref={canvas} className="absolute inset-0 size-full object-cover" aria-hidden />
      ) : (
        <div className="absolute inset-0">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="size-full object-cover" />
          ) : (
            <div className="size-full bg-void" />
          )}
          {missing && process.env.NODE_ENV === 'development' && (
            <span className="t-micro absolute bottom-4 left-4 rounded border border-line bg-void/80 px-2 py-1 text-ink-3">
              seq pending · {dir}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
