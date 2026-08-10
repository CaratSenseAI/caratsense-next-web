import Link from 'next/link'
import { Mark } from '@/components/ui'
import { BookCall } from '@/components/ui/BookCall'
import { BRAND, CONTACT, FOOTER_NAV, SOCIAL } from '@/lib/contact'

function Icon({ name }: { name: string }) {
  const common = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'currentColor' } as const
  switch (name) {
    case 'LinkedIn':
      return (
        <svg {...common} aria-hidden>
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    case 'Instagram':
      return (
        <svg {...common} aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    case 'WhatsApp':
      return (
        <svg {...common} aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    default:
      return (
        <svg {...common} aria-hidden>
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
      )
  }
}

/**
 * A footer link. No chromatic text-shadow — that treatment reads as a blurry
 * smear at this size rather than as refraction. A gold tick that slides in from
 * the left does the same job and belongs to the same visual language as the
 * reading rail and the facet dividers.
 */
function FootLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-0 text-sm text-ink-2 transition-colors duration-200 hover:text-ink"
    >
      <span
        aria-hidden
        className="h-px w-0 bg-gold transition-all duration-250 group-hover:mr-2.5 group-hover:w-3.5"
      />
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      {/* same hairline grid as the logo wall, so the footer belongs to the page */}
      <div aria-hidden className="grid-cross pointer-events-none absolute inset-0 opacity-50" />

      <div className="shell relative">
        {/* closing statement — the tagline gets one last, quiet appearance */}
        <div className="flex flex-col gap-8 border-b border-line py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <p className="t-micro mb-5 text-ink-3">Ready when you are</p>
            <p className="t-d2 max-w-[16ch] text-ink">
              Let’s find where it
              <span className="text-gold"> breaks</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BookCall />
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-6 py-3.5 text-[0.9375rem] text-ink transition-colors duration-200 hover:border-violet/50"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* columns */}
        <div className="grid gap-x-8 gap-y-14 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1fr_1.1fr]">
          <div>
            <Link href="/" className="mb-6 flex items-center gap-2.5">
              <Mark className="h-6" />
              <span className="text-base font-medium tracking-tight">
                CaratSense<span className="text-violet"> AI</span>
              </span>
            </Link>
            <p className="max-w-[34ch] text-[0.875rem] leading-relaxed text-ink-3">
              {BRAND.description}
            </p>
            <p className="t-micro mt-6 text-gold">{BRAND.tagline}</p>
          </div>

          {Object.entries(FOOTER_NAV).map(([title, links]) => (
            <nav key={title}>
              <p className="t-micro mb-6 text-ink-3/60">{title}</p>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <FootLink href={l.href}>{l.label}</FootLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="t-micro mb-6 text-ink-3/60">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-ink-2 transition-colors duration-200 hover:text-ink"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="text-ink-2 transition-colors duration-200 hover:text-ink nums"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsappShort}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-2 transition-colors duration-200 hover:text-ink"
                >
                  WhatsApp Chat
                </a>
              </li>
            </ul>

            <p className="t-micro mt-7 flex items-center gap-2 text-ink-3">
              <span aria-hidden className="size-1 rotate-45 bg-gold" />
              {CONTACT.location}
            </p>

            <ul className="mt-7 flex gap-2">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-9 place-items-center rounded-full border border-line text-ink-3 transition-colors duration-200 hover:border-gold/40 hover:text-gold"
                  >
                    <Icon name={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <p className="t-micro text-ink-3/50">{BRAND.copyright}</p>
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {[
              { label: 'Privacy Policy', href: '/legal/privacy' },
              { label: 'Terms', href: '/legal/terms' },
              { label: 'Brand Guidelines', href: '/legal/brand' },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="t-micro text-ink-3/50 transition-colors duration-200 hover:text-ink-2"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
