'use server'

import { CONTACT, ROLES } from '@/lib/contact'

export type ApplyState = {
  ok: boolean
  message: string
  /** field name -> error, for inline validation */
  errors?: Record<string, string>
}

const MAX_RESUME_BYTES = 4 * 1024 * 1024 // 4MB
const ALLOWED = ['application/pdf']

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

function isUrl(v: string) {
  try {
    const u = new URL(v.startsWith('http') ? v : `https://${v}`)
    return !!u.hostname.includes('.')
  } catch {
    return false
  }
}

/**
 * Handles an application submission.
 *
 * Mail is sent with Resend when RESEND_API_KEY is set. Without it the action
 * deliberately reports failure rather than pretending to succeed — a form that
 * silently drops applications is worse than no form, and someone's job
 * application is not the place to fake a success state.
 */
export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  // honeypot — bots fill hidden fields, humans do not
  if (formData.get('company')) return { ok: true, message: 'Thanks — we’ll be in touch.' }

  const roleId = String(formData.get('role') ?? ROLES[0].id)
  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0]

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const github = String(formData.get('github') ?? '').trim()
  const portfolio = String(formData.get('portfolio') ?? '').trim()
  const availability = String(formData.get('availability') ?? '').trim()
  const note = String(formData.get('note') ?? '').trim()
  const resume = formData.get('resume')

  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = 'Please tell us your name.'
  if (!isEmail(email)) errors.email = 'That does not look like an email address.'
  if (!github) errors.github = 'A GitHub profile is required for this role.'
  else if (!isUrl(github)) errors.github = 'Please give a full link.'
  if (portfolio && !isUrl(portfolio)) errors.portfolio = 'Please give a full link.'
  if (note.length < 40) errors.note = 'A couple of sentences, please — 40 characters minimum.'

  let resumeFile: File | null = null
  if (resume instanceof File && resume.size > 0) {
    if (!ALLOWED.includes(resume.type)) errors.resume = 'PDF only.'
    else if (resume.size > MAX_RESUME_BYTES) errors.resume = 'Keep it under 4MB.'
    else resumeFile = resume
  }

  if (Object.keys(errors).length) {
    return { ok: false, message: 'Please fix the highlighted fields.', errors }
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[careers] RESEND_API_KEY is not set — application not delivered', {
      name,
      email,
      role: role.title,
    })
    return {
      ok: false,
      message: `Our form is not accepting submissions right now. Please email ${CONTACT.careersEmail} directly — sorry about that.`,
    }
  }

  const lines = [
    `Role: ${role.title}`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    `GitHub: ${github}`,
    portfolio && `Portfolio: ${portfolio}`,
    availability && `Availability: ${availability}`,
    '',
    note,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const attachments = resumeFile
      ? [
          {
            filename: resumeFile.name || 'resume.pdf',
            content: Buffer.from(await resumeFile.arrayBuffer()).toString('base64'),
          },
        ]
      : undefined

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CAREERS_FROM ?? 'CaratSense Careers <careers@caratsense.in>',
        to: [...role.applyTo],
        reply_to: email,
        subject: `${role.title} - ${name}`,
        text: lines,
        attachments,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('[careers] resend rejected the send', res.status, detail)
      return {
        ok: false,
        message: `We could not send that. Please email ${CONTACT.careersEmail} directly.`,
      }
    }

    return {
      ok: true,
      message: 'Application received. If it is a fit you will hear from us directly.',
    }
  } catch (err) {
    console.error('[careers] send failed', err)
    return {
      ok: false,
      message: `Something broke on our side. Please email ${CONTACT.careersEmail} directly.`,
    }
  }
}
