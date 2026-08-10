import type { Metadata } from 'next'
import { Footer } from '@/components/sections/Footer'
import { Eyebrow, FacetRule, Panel, TelemetryChip } from '@/components/ui'
import { CONTACT, PURPOSE, ROLES } from '@/lib/contact'
import { RoleReveal } from './RoleReveal'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Open roles at CaratSense AI. We build custom operational software for real businesses in Mumbai — the things we ship run somebody’s business the next morning.',
  openGraph: {
    title: 'Careers — CaratSense AI',
    description: 'Software Developer Intern, Mumbai. Paid, 3–6 months, PPO on performance.',
  },
}

export default function CareersPage() {
  return (
    <main>
      <RoleReveal>
        <header className="shell pb-16 pt-36 md:pb-24 md:pt-44">
          <Eyebrow className="mb-6">Careers</Eyebrow>
          <h1 data-reveal className="t-d1 max-w-[20ch]">
            Build things that run someone’s business tomorrow morning.
          </h1>
          <p data-reveal className="t-lead mt-9 text-ink-2">
            We are a consultative AI and software studio in Mumbai. The systems we ship replace
            the spreadsheets and WhatsApp threads that real businesses are being held together
            with — so the bar is not that it demos well. It is that it works on Monday.
          </p>
        </header>

        <FacetRule />

        <section className="shell py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-2">
            {[
              ['Vision', PURPOSE.vision],
              ['Mission', PURPOSE.mission],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="t-micro mb-4 text-gold">{k}</p>
                <p data-reveal className="max-w-[46ch] text-[clamp(1rem,1.25vw,1.125rem)] leading-relaxed text-ink-2">
                  {v}
                </p>
              </div>
            ))}
          </div>
          <p data-reveal className="mt-14 max-w-[62ch] text-[clamp(1rem,1.25vw,1.125rem)] leading-relaxed text-ink-3">
            {PURPOSE.team}
          </p>
        </section>

        <FacetRule />

        <section className="shell py-20 md:py-28">
          <Eyebrow index="01" className="mb-10">
            Open roles
          </Eyebrow>

          {ROLES.map((role) => (
            <Panel key={role.id} grid className="p-7 md:p-12">
              <div className="relative">
                <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <h2 data-reveal className="t-d2 max-w-[18ch]">
                      {role.title}
                    </h2>
                    <p className="t-mono mt-4 text-ink-3">{role.location}</p>
                  </div>
                  <TelemetryChip>{role.type}</TelemetryChip>
                </div>

                <dl className="mb-12 grid gap-6 border-y border-line py-7 sm:grid-cols-3">
                  {[
                    ['Duration', role.duration],
                    ['Schedule', role.schedule],
                    ['Stipend', role.stipend],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="t-micro mb-2 text-ink-3/70">{k}</dt>
                      <dd className="text-[0.9375rem] leading-snug text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                <p data-reveal className="mb-14 max-w-[58ch] text-[clamp(1rem,1.3vw,1.1875rem)] leading-relaxed text-ink-2">
                  {role.intro}
                </p>

                <div className="grid gap-12 md:grid-cols-2">
                  <div>
                    <p className="t-micro mb-6 text-gold">What you will do</p>
                    <ul className="space-y-3.5">
                      {role.responsibilities.map((r) => (
                        <li key={r} data-reveal className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
                          <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-violet" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="t-micro mb-6 text-gold">What we are looking for</p>
                    <ul className="space-y-3.5">
                      {role.requirements.map((r) => (
                        <li key={r} data-reveal className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
                          <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-violet" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-14 border-t border-line pt-10">
                  <p className="t-micro mb-6 text-gold">What you get</p>
                  <ul className="flex flex-wrap gap-3">
                    {role.offer.map((o) => (
                      <li
                        key={o}
                        className="rounded-full border border-line px-4 py-2 text-[0.875rem] text-ink-2"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* how to apply */}
                <div className="mt-14 rounded-2xl border border-gold/25 bg-surface-2/50 p-7 md:p-9">
                  <p className="t-micro mb-5 text-gold">How to apply</p>
                  <p className="mb-7 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">
                    Send your {role.applyWith.join(', ').replace(/, ([^,]*)$/, ' and $1').toLowerCase()} to
                    both addresses below, with the subject line{' '}
                    <span className="font-mono text-ink">{role.applySubject}</span>.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {role.applyTo.map((to) => (
                      <a
                        key={to}
                        href={`mailto:${to}?subject=${encodeURIComponent(role.applySubject)}`}
                        className="group flex items-center gap-2.5 rounded-full bg-violet-deep px-5 py-3 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet"
                      >
                        {to}
                        <svg
                          viewBox="0 0 12 12"
                          className="size-3 transition-transform group-hover:translate-x-1"
                          aria-hidden
                        >
                          <path
                            d="M1 6h9M6.5 2 10.5 6l-4 4"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          ))}
        </section>

        <FacetRule />

        {/* speculative applications */}
        <section className="shell py-20 text-center md:py-28">
          <h2 data-reveal className="t-d2 mx-auto max-w-[24ch]">
            No role that fits? Write anyway.
          </h2>
          <p className="t-lead mx-auto mt-7 text-ink-2">
            If you have built something real and can show it to us, that is the whole application.
          </p>
          <div className="mt-10 flex flex-col items-center gap-5">
            <a
              href={`mailto:${CONTACT.careersEmail}`}
              className="group flex items-center gap-3 rounded-full border border-line px-7 py-4 text-[0.9375rem] text-ink transition-colors hover:border-violet/50"
            >
              {CONTACT.careersEmail}
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
                />
              </svg>
            </a>
            <p className="t-micro text-ink-3">{CONTACT.location}</p>
          </div>
        </section>
      </RoleReveal>

      <Footer />
    </main>
  )
}
