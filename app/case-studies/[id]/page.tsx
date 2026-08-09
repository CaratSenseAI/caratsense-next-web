import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CASE_STUDY_IDS, getCaseStudy, getAllCaseStudies } from '@/lib/caseStudies'
import { CsHero, CsRail, CsProse, CsNext } from '@/components/case-study'
import { BeforeAfter } from '@/components/case-study/BeforeAfter'
import { Footer } from '@/components/sections/Footer'
import { FacetRule } from '@/components/ui'

export function generateStaticParams() {
  return CASE_STUDY_IDS.map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const study = getCaseStudy(id)
  if (!study) return {}
  return {
    title: study.title,
    description: study.problem,
    openGraph: {
      title: `${study.title} — CaratSense AI`,
      description: study.problem,
      type: 'article',
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const study = getCaseStudy(id)
  if (!study) notFound()

  const all = getAllCaseStudies()
  const next = all.find((s) => s.id === study.next)!
  const prev = all.find((s) => s.id === study.prev)!

  return (
    <main>
      <CsHero study={study} />

      <div className="shell">
        <div id="cs-body" className="grid gap-x-[8%] pb-24 lg:grid-cols-[1fr_22%]">
          {/* narrative */}
          <article className="order-2 lg:order-1">
            <CsProse sections={study.sections} />

            {/* the interactive beat: their workspace, and the system under it */}
            <BeforeAfter id={study.id} />
          </article>

          {/* reading rail */}
          <aside className="order-1 mb-14 lg:order-2 lg:mb-0">
            <CsRail chapters={study.chapters} />
          </aside>
        </div>
      </div>

      <FacetRule />

      <section aria-label="More work">
        <CsNext study={next} label="Next case study" />
        <CsNext study={prev} label="Previous" />
      </section>

      <Footer />
    </main>
  )
}
