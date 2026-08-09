import { Hero } from '@/components/sections/Hero'
import { TheMess } from '@/components/sections/TheMess'
import { SixteenToOne } from '@/components/sections/SixteenToOne'
import { FacetWall } from '@/components/sections/FacetWall'
import { Thread } from '@/components/sections/Thread'
import { Work } from '@/components/sections/Work'
import { Clients } from '@/components/sections/Clients'
import { SeeBeyond } from '@/components/sections/SeeBeyond'
import { Footer } from '@/components/sections/Footer'

/**
 * The page is one continuous descent, not a stack of sections.
 *
 * CARAT   — §1 hero, the rough stone
 *         — §2 the mess, suspension
 * CUT     — §3 sixteen → one          ★ the centrepiece
 *         — §4 what we build, the facet wall
 * CLARITY — §5 the thread, the proof
 *         — §6 the work, nine case studies
 * COLOUR  — §7 the clients
 *         — §8 see beyond
 *
 * The refraction seams from scroll-concepts/07 were built and removed: as a
 * fixed full-screen blended overlay they read as arbitrary diagonal stripes
 * across the content rather than as a wipe between movements. The sections now
 * butt directly against each other, which the frame sequences already carry.
 *
 * Full spec in docs/scroll-concepts/10-THE-BUILD.md
 */
export default function Home() {
  return (
    <main>
      <Hero />

      <TheMess />
      <SixteenToOne />

      <FacetWall />
      <Thread />

      <Work />
      <Clients />

      <SeeBeyond />
      <Footer />
    </main>
  )
}
