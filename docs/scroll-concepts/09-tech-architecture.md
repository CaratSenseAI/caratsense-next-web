# 09 — Technical Architecture

> How any of the above actually ships on Next 15 + React 19 without falling over.

---

## 1. What is already installed

Verified against `node_modules` — nothing here needs to be added:

```
gsap 3.15.0        ScrollTrigger · Flip · SplitText · ScrollSmoother
                   MorphSVG · DrawSVG · Observer          all free since 3.13
three 0.185.1      @react-three/fiber 9.6 · @react-three/drei 10.7
framer-motion 12.42
matter-js 0.20     detect-gpu
next 15.5.21 (turbopack) · react 19.1 · tailwind 4
```

**One thing to add:** `@gsap/react` for the `useGSAP()` hook. It handles cleanup correctly
under React 19 Strict Mode, which manual `useLayoutEffect` + `gsap.context()` does not do
reliably.

```bash
npm i @gsap/react
```

---

## 2. Where the animation lives

Everything animated is a client component. Everything else stays a server component. The
discipline that matters: **keep the animation wrappers thin and push content down as
children**, so case study text stays server-rendered and indexable.

```
app/
  page.tsx                     server — composes sections, no 'use client'
components/
  motion/
    Providers.tsx              'use client' — ScrollSmoother + matchMedia root
    useScrollScene.ts          shared ScrollTrigger factory
    SixteenToOne.tsx           concept 03
    FacetWall.tsx              concept 04
    Thread.tsx                 concept 05  (takes JSON, reusable ×9)
    LedgerTrack.tsx            concept 06
    RefractSeam.tsx            concept 07
  scene/
    StoneScene.tsx             concept 01 — dynamic(), ssr: false
    DeskScene.tsx              concept 02 — dynamic(), ssr: false
```

Every R3F scene must be `dynamic(..., { ssr: false })`. three.js touches `window` at import
time and will break the build otherwise.

---

## 3. The one ordering bug you will hit

`ScrollSmoother` and `ScrollTrigger` must be registered and created **before** any
ScrollTrigger that pins. Get this wrong and pins land at the wrong scroll positions, usually
only in production, usually only after images load.

```tsx
// components/motion/Providers.tsx
'use client'
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip, SplitText, DrawSVGPlugin, useGSAP)

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useGSAP(() => {
    ScrollSmoother.create({ smooth: 1.2, effects: true, normalizeScroll: true })
  }, [])

  return <div id="smooth-wrapper"><div id="smooth-content">{children}</div></div>
}
```

Then, after any content that changes layout height (fonts, images, case study data):

```tsx
useEffect(() => {
  const t = setTimeout(() => ScrollTrigger.refresh(), 0)
  document.fonts.ready.then(() => ScrollTrigger.refresh())
  return () => clearTimeout(t)
}, [])
```

Font loading shifting layout after ScrollTrigger has measured is the single most common cause
of "the pin is off by 200px" and it is entirely fixed by that `document.fonts.ready` call.

---

## 4. Device tiering

`detect-gpu` is already installed. Use it — this is the difference between a site that
impresses on a MacBook Pro and a site that works for your actual market, which is Indian SMB
owners on mid-range Android.

```tsx
import { getGPUTier } from 'detect-gpu'

const tier = await getGPUTier()          // 0–3
const mode =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'static'
  : tier.tier >= 2 && window.innerWidth >= 1024                 ? 'full'
  : tier.tier >= 1                                              ? 'lite'
  :                                                               'static'
```

| Mode | Sequences (01 / 02 / 08) | 03 / 05 / 06 | 07 seams | Smoother |
|---|---|---|---|---|
| `full` | 90 frames @ 1920px | full Flip | full | on |
| `lite` | 48 frames @ 960px | full Flip | simplified, no blend | off |
| `static` | single still, no scrub | instant, no scrub | cross-fade | off |

Since every tier now runs the same *technique* and differs only in frame count and width, the
tiering is much simpler than it would have been with live 3D — one code path, three asset sets.
Generation specs for both tiers are in `assets/00-ASSET-INDEX.md` §Frame extraction.

```tsx
// the one playback path, used by every sequence at every tier
const frame = { i: 0 }
gsap.to(frame, {
  i: FRAMES - 1,
  ease: 'none',
  snap: 'i',
  scrollTrigger: { trigger: sec, start: 'top top', end: '+=400%', pin: true, scrub: 0.6 },
  onUpdate: () => { ctx.drawImage(images[frame.i], 0, 0) },
})
```

Preload all frames before enabling the trigger, or it will stutter on first pass.

---

## 5. Performance budget

Hold these or the site stops being premium regardless of how good the animation is:

| Metric | Target |
|---|---|
| LCP | < 2.0s on 4G |
| CLS | < 0.05 — pins are the main risk; always reserve height |
| INP | < 200ms |
| JS (initial, gzipped) | < 200KB — GSAP core+ScrollTrigger+Flip is ~55KB |
| 3D scene | < 3MB, Draco-compressed, KTX2 textures |
| Frame time during scrub | < 8ms |

**Rules that keep you inside it:**

- Animate `transform` and `opacity` only. Any tween touching `width`, `height`, `top`, `left`,
  `margin` or `filter: blur()` on a large element will cost you the frame budget. (`Flip`
  looks like it animates layout — it does not; it converts to transforms internally.)
- `gsap.ticker.lagSmoothing(500, 33)` so a single long frame does not desync every scrub.
- Never more than **two pinned sections in the viewport at once.**
- Kill offscreen work: `ScrollTrigger.create({ onToggle: ({isActive}) => setRender(isActive) })`
  around R3F canvases, and `frameloop="demand"` on `<Canvas>` with explicit `invalidate()`.
- Case study images through `next/image` with explicit `sizes`. You have ~40 images in
  `public/case-studies/` and they are currently unoptimised PNG/JPG pairs — that alone is
  probably your biggest LCP risk today.

---

## 6. There is no 3D. Decided.

You have no Blender, no After Effects, no CAD — so the site ships with **zero runtime 3D and
zero locally-authored 3D.** Everything that would have been a live R3F scene is instead an
AI-generated, scroll-scrubbed image sequence.

This is not a downgrade. It is what Apple actually ships, and it is strictly better here:

| | Live R3F | Generated sequence |
|---|---|---|
| Lighting quality | limited by realtime budget | fully rendered, no limit |
| Frame cost | 8–16ms/frame | one `drawImage`, ~1ms |
| Mid-range Android | 12–25fps | 60fps |
| Build risk | high | low — it is `<canvas>` + `drawImage` |
| Interactivity | real | none — **and none of these designs used it** |

Every scroll animation in `10-THE-BUILD.md` is scrubbed, meaning the user drags a fixed
timeline. A fixed timeline is a video. There was never a reason for it to be live.

**Practical consequence:** `three`, `@react-three/fiber`, `@react-three/drei` and
`detect-gpu` can all be removed from `package.json` unless something else needs them —
roughly 600KB off the bundle. Keep `detect-gpu` only if you implement the tiering in §4;
a `matchMedia` width + `prefers-reduced-motion` check is honestly sufficient.

The R3F components already in the repo (`GemstoneCanvas.tsx`, `HeroOrganicNetwork.tsx`,
`ZoomParallax.tsx`, `PhysicsOverlay.tsx`, `AuroraBackground.tsx`, `ElegantShapes.tsx`) are all
retired by this direction.

---

## 7. Build order

1. **`08` micro-motion + `07` route-A seams.** Two days. Instantly raises the floor of the
   existing site and is independent of every concept decision.
2. **`03` Sixteen-to-One.** The centrepiece, pure DOM, proves the motion language.
3. **`05` Thread**, built as a reusable component, then run across all nine case studies.
4. **`04` Facet Wall** for the services section.
5. **`06` or `02`**, depending on whether the asset budget materialised.
6. **`01`** last, and only if 1–5 are genuinely finished.

Steps 1–3 alone give you a site that stands next to By-Kin or Noomo. Everything after that is
upside.

---

## 8. Testing

- **Trackpad and wheel both.** Scrubbed animations feel completely different between them.
  A `scrub: 1` that is silky on a Mac trackpad can feel notchy on a cheap mouse wheel.
- **Throttle to 4× CPU** in DevTools and scroll the whole page. If any pin judders, that is
  what a mid-range Android will do.
- **Reload mid-page.** Scroll restoration plus pinned sections is a classic breakage; verify
  every pin resolves correctly on a hard refresh at 60% scroll depth.
- **Resize while pinned.** `invalidateOnRefresh: true` on anything measuring `scrollWidth`.
- **Real device.** Borrow the cheapest Android in the office. That is your client's phone.
