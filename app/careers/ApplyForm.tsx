'use client'

import { useActionState, useId, useState } from 'react'
import { cn } from '@/lib/cn'
import { CONTACT } from '@/lib/contact'
import { submitApplication, type ApplyState } from './actions'

const initial: ApplyState = { ok: false, message: '' }

function Field({
  label,
  name,
  error,
  hint,
  children,
  required,
}: {
  label: string
  name: string
  error?: string
  hint?: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="t-micro mb-2.5 flex items-baseline gap-2 text-ink-3">
        {label}
        {required && <span className="text-gold">*</span>}
        {hint && <span className="normal-case tracking-normal text-ink-3/60">{hint}</span>}
      </span>
      {children}
      {error && (
        <span id={`${name}-error`} className="mt-2 block text-[0.8125rem] text-[#f5b5bc]">
          {error}
        </span>
      )}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-line bg-void/60 px-4 py-3 text-[0.9375rem] text-ink ' +
  'placeholder:text-ink-3/50 transition-colors duration-200 ' +
  'focus:border-violet/60 focus:outline-none focus:ring-0'

export function ApplyForm({ roleId, roleTitle }: { roleId: string; roleTitle: string }) {
  const [state, action, pending] = useActionState(submitApplication, initial)
  const [fileName, setFileName] = useState<string | null>(null)
  const id = useId()

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-surface-2/40 p-8 text-center md:p-12">
        <span aria-hidden className="mx-auto mb-6 grid size-11 place-items-center rounded-full border border-gold/40">
          <svg viewBox="0 0 16 16" className="size-4 text-gold" aria-hidden>
            <path
              d="M2.5 8.5 6 12l7.5-8"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="t-d2 mb-4 text-ink">Received.</p>
        <p className="mx-auto max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-2">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-7" noValidate>
      <input type="hidden" name="role" value={roleId} />
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] size-px opacity-0"
      />

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.errors?.name} required>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            className={inputCls}
            aria-invalid={!!state.errors?.name}
          />
        </Field>

        <Field label="Email" name="email" error={state.errors?.email} required>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputCls}
            aria-invalid={!!state.errors?.email}
          />
        </Field>

        <Field label="Phone" name="phone" hint="optional">
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 …"
            className={cn(inputCls, 'nums')}
          />
        </Field>

        <Field label="Availability" name="availability" hint="optional">
          <input
            name="availability"
            placeholder="e.g. from 1 Sept, 6 months"
            className={inputCls}
          />
        </Field>

        <Field label="GitHub" name="github" error={state.errors?.github} required>
          <input
            name="github"
            placeholder="github.com/you"
            className={inputCls}
            aria-invalid={!!state.errors?.github}
          />
        </Field>

        <Field label="Portfolio" name="portfolio" error={state.errors?.portfolio} hint="optional">
          <input name="portfolio" placeholder="your site, or a project link" className={inputCls} />
        </Field>
      </div>

      <Field
        label="What have you built?"
        name="note"
        error={state.errors?.note}
        hint="a couple of sentences"
        required
      >
        <textarea
          name="note"
          rows={5}
          placeholder="Tell us about something you shipped — what it does, what you built, and what broke."
          className={cn(inputCls, 'resize-y leading-relaxed')}
          aria-invalid={!!state.errors?.note}
        />
      </Field>

      <Field label="Resume" name="resume" error={state.errors?.resume} hint="PDF, under 4MB — optional">
        <div className="flex items-center gap-4">
          <label
            className={cn(
              'cursor-pointer rounded-lg border border-line px-4 py-2.5 text-[0.875rem] text-ink-2',
              'transition-colors duration-200 hover:border-violet/50 hover:text-ink',
            )}
          >
            Choose file
            <input
              name="resume"
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
          <span className="truncate text-[0.8125rem] text-ink-3">
            {fileName ?? 'No file selected'}
          </span>
        </div>
      </Field>

      {state.message && !state.ok && (
        <p role="alert" className="rounded-lg border border-[#e5484d]/30 bg-alert-bg/60 px-4 py-3 text-[0.875rem] text-[#f5b5bc]">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5 pt-1">
        <button
          type="submit"
          disabled={pending}
          className={cn(
            'group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5',
            'text-[0.9375rem] font-medium text-white transition-colors duration-200',
            pending ? 'cursor-wait bg-violet-deep/60' : 'bg-violet-deep hover:bg-violet',
          )}
        >
          {pending ? 'Sending…' : `Apply for ${roleTitle}`}
          {!pending && (
            <svg viewBox="0 0 12 12" className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden>
              <path
                d="M1 6h9M6.5 2 10.5 6l-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <p className="t-micro text-ink-3">
          or email{' '}
          <a href={`mailto:${CONTACT.careersEmail}`} className="text-ink-2 hover:text-ink">
            {CONTACT.careersEmail}
          </a>
        </p>
      </div>
    </form>
  )
}
