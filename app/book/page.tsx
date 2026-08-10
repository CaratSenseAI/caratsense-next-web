import type { Metadata } from 'next'
import { Footer } from '@/components/sections/Footer'
import { Eyebrow } from '@/components/ui'
import { CAL, CONTACT } from '@/lib/contact'
import { BookEmbed } from './BookEmbed'

export const metadata: Metadata = {
  title: 'Book a call',
  description:
    'Thirty minutes with CaratSense AI. Tell us where your operations are breaking down and we will tell you whether we can help.',
  openGraph: {
    title: 'Book a call — CaratSense AI',
    description: 'Thirty minutes. Tell us where it breaks.',
  },
}

export default function BookPage() {
  return (
    <main>
      <div className="shell pb-20 pt-36 md:pt-44">
        <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Eyebrow className="mb-6">Book a call</Eyebrow>
            <h1 className="t-d1 max-w-[16ch]">Thirty minutes. Tell us where it breaks.</h1>
            <p className="t-lead mt-8 text-ink-2">
              Come with the thing that goes wrong every week — the order that gets missed, the
              number nobody trusts, the report somebody rebuilds by hand. That is enough for us
              to tell you whether we can help.
            </p>
          </div>

          <dl className="grid shrink-0 gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:text-right">
            {[
              ['Length', '30 minutes'],
              ['Where', 'Cal Video'],
              ['Timezone', 'Asia/Kolkata'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="t-micro mb-1.5 text-ink-3/70">{k}</dt>
                <dd className="text-[0.9375rem] text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <BookEmbed />

        <p className="t-micro mt-8 text-ink-3">
          Prefer not to book?{' '}
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="text-ink-2 transition-colors hover:text-ink"
          >
            WhatsApp us
          </a>{' '}
          ·{' '}
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-ink-2 transition-colors hover:text-ink"
          >
            {CONTACT.email}
          </a>{' '}
          ·{' '}
          <a href={CONTACT.phoneHref} className="text-ink-2 transition-colors hover:text-ink nums">
            {CONTACT.phoneDisplay}
          </a>
        </p>
        <p className="t-micro mt-3 text-ink-3/60">
          {CONTACT.responseNote} ·{' '}
          <a
            href={CAL.hostedUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-ink-2"
          >
            open on cal.com
          </a>
        </p>
      </div>

      <Footer />
    </main>
  )
}
