import Link from 'next/link'
import { FacetRule, Mark } from '@/components/ui'

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Build', href: '#build' },
  { label: 'Proof', href: '#proof' },
  { label: 'Contact', href: '#contact' },
]

const ELSEWHERE = [
  { label: "The Operator's Brief", href: 'https://medium.com/@caratsenseAI' },
  { label: 'Instagram', href: 'https://instagram.com/caratsense' },
  { label: 'hello@caratsense.in', href: 'mailto:hello@caratsense.in' },
]

export function Footer() {
  return (
    <footer className="relative">
      <FacetRule />
      <div className="shell py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-2.5">
              <Mark className="h-6" />
              <span className="text-base font-medium tracking-tight">
                CaratSense<span className="text-violet"> AI</span>
              </span>
            </Link>
            <p className="t-micro text-ink-3">See beyond.</p>
          </div>

          <div className="flex gap-16">
            <nav>
              <p className="t-micro mb-4 text-ink-3/70">Site</p>
              <ul className="space-y-2.5">
                {NAV.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="link-chroma text-sm text-ink-2 hover:text-ink">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav>
              <p className="t-micro mb-4 text-ink-3/70">Elsewhere</p>
              <ul className="space-y-2.5">
                {ELSEWHERE.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="link-chroma text-sm text-ink-2 hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="t-micro text-ink-3/60">© {new Date().getFullYear()} CaratSense AI</p>
          <p className="t-micro text-ink-3/60">Mumbai, India</p>
        </div>
      </div>
    </footer>
  )
}
