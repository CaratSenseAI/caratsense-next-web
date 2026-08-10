import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Footer } from '@/components/sections/Footer'
import { Eyebrow, FacetRule } from '@/components/ui'
import { CONTACT } from '@/lib/contact'

/**
 * Privacy / Terms / Brand.
 *
 * These were modals on the previous site and the copy was, honestly, a
 * placeholder — "Full Privacy Policy document coming soon". That text is
 * reproduced verbatim rather than replaced with invented legal language, which
 * is not something to generate on a company's behalf.
 */
const PAGES = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect only the information necessary to respond to your inquiry. Your data is never sold, shared with third parties, or used for advertising.',
      'We take confidentiality seriously — this is one of our core commitments to every client.',
    ],
    note: 'Full Privacy Policy document coming soon.',
    cta: { label: 'Contact legal', href: `mailto:${CONTACT.legalEmail}` },
  },
  terms: {
    title: 'Terms',
    body: [
      "By using this website, you agree to CaratSense's standard terms of engagement. All work is covered under individual client agreements, which include IP ownership, confidentiality, and delivery terms.",
    ],
    note: 'Full Terms of Service coming soon.',
    cta: { label: 'Contact legal', href: `mailto:${CONTACT.legalEmail}` },
  },
  brand: {
    title: 'Brand Guidelines',
    body: [
      'CaratSense brand assets, logo files, colour palettes, and visual identity documentation are available on request for press, partners, and collaborators.',
    ],
    note: 'Full brand kit document coming soon.',
    cta: { label: 'Request brand kit', href: `mailto:${CONTACT.brandEmail}` },
  },
} as const

type Slug = keyof typeof PAGES

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = PAGES[slug as Slug]
  return page ? { title: page.title } : {}
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = PAGES[slug as Slug]
  if (!page) notFound()

  return (
    <main>
      <div className="shell pb-24 pt-36 md:pt-44">
        <Eyebrow className="mb-7">Legal</Eyebrow>
        <h1 className="t-d1 max-w-[18ch]">{page.title}</h1>

        <div className="mt-12 max-w-[58ch] space-y-6">
          {page.body.map((p) => (
            <p key={p} className="text-[clamp(1rem,1.3vw,1.1875rem)] leading-relaxed text-ink-2">
              {p}
            </p>
          ))}
        </div>

        <p className="t-micro mt-12 text-ink-3">{page.note}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={page.cta.href}
            className="rounded-full bg-violet-deep px-6 py-3.5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet"
          >
            {page.cta.label}
          </a>
          <Link
            href="/"
            className="rounded-full border border-line px-6 py-3.5 text-[0.9375rem] text-ink transition-colors hover:border-violet/50"
          >
            Back to site
          </Link>
        </div>
      </div>

      <FacetRule />
      <Footer />
    </main>
  )
}
