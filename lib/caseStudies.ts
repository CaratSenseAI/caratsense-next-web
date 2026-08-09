import { CASE_STUDIES_FULL_DATA, type SectionItem } from '@/data/caseStudiesFullData'

/**
 * Case study metadata — single source of truth for both §6 on the homepage and
 * the /case-studies/[id] pages.
 *
 * `industry`, `problem` and `solution` are the client's own words, lifted from
 * the meta block that shipped with the original site. They replace an earlier
 * inferred set of mine that was wrong on several counts (02 is textile, not
 * diamonds; 06 is specialty chemicals; 09 is construction).
 *
 * NOTE ON METRICS: the narrative content contains no hard numbers — that is a
 * deliberate editorial choice in The Operator's Brief. So there is no `metric`
 * field here. An earlier version of lib/site.ts carried figures like
 * "11s → 0.4s per quote" and "41 parcels matched" which I had invented; they
 * are not in the source and must not appear on real client work.
 *
 * NOTE ON CLIENTS: `client` is left null everywhere pending confirmation. The
 * logo wall names thirteen clients and there are nine studies; the mapping has
 * not been verified and naming a client on the wrong study is worse than not
 * naming them at all.
 */

export type CaseStudyMeta = {
  id: string
  title: string
  industry: string
  problem: string
  solution: string
  client: string | null
  accent: string
}

export const CASE_STUDY_META: Record<string, Omit<CaseStudyMeta, 'id' | 'title'>> = {
  '01': {
    industry: 'Food & Beverage',
    problem: 'Orders on WhatsApp. Kitchen tracking from memory. No system.',
    solution: '4x the order volume, same team.',
    client: null,
    accent: '#fb923c',
  },
  '02': {
    industry: 'Textile',
    problem: 'Odd lots ageing in the warehouse, with no record of who wanted what.',
    solution: 'Right fabric, right buyer, within hours.',
    client: null,
    accent: '#f472b6',
  },
  '03': {
    industry: 'Jewellery',
    problem: 'Sixteen tools, sixteen problems, all held together by hand.',
    solution: 'One screen. Sixteen problems solved.',
    client: null,
    accent: '#d4af37',
  },
  '04': {
    industry: 'PropTech',
    problem: 'Enquiries dying in DMs. Same flat promised twice.',
    solution: 'No more lead leakage, no more double-bookings.',
    client: null,
    accent: '#60a5fa',
  },
  '05': {
    industry: 'D2C Fashion',
    problem: 'Selling everywhere, remembering no one. Every buyer a stranger.',
    solution: 'Now every repeat buyer is recognised across every channel.',
    client: null,
    accent: '#a78bfa',
  },
  '06': {
    industry: 'Specialty Chemicals',
    problem: 'Off-spec batch ships Monday. Customer flags it Friday.',
    solution: "Now it's caught at the plant, not at the customer.",
    client: null,
    accent: '#34d399',
  },
  '07': {
    industry: 'Jewellery Pricing',
    problem: 'A photo comes in. Ten minutes to reply, and two people quote it differently.',
    solution: 'Seconds instead of hours, with the same logic every time.',
    client: null,
    accent: '#fbbf24',
  },
  '08': {
    industry: 'Real Estate',
    problem: 'Buyers calling constantly. Payment milestones slipping.',
    solution: 'Updates go out automatically, and trust gets sold alongside the flat.',
    client: null,
    accent: '#f87171',
  },
  '09': {
    industry: 'Construction',
    problem: 'Decisions waiting on phone calls. No single view of cash or progress.',
    solution: 'One ERP, and a manager who always knows where things stand.',
    client: null,
    accent: '#94a3b8',
  },
}

export const CASE_STUDY_IDS = Object.keys(CASE_STUDY_META).sort()

/** Their source headings carry a few typos. Corrected on render, not in the data. */
const HEADING_FIXES: Record<string, string> = {
  'WHAT FRAGMENTATION ACTUALLY COSTS A OWNER': 'WHAT FRAGMENTATION ACTUALLY COSTS AN OWNER',
  'WHAT CHANEGS WHEN EXPERTISE MOVES INTO A SYSTEM':
    'WHAT CHANGES WHEN EXPERTISE MOVES INTO A SYSTEM',
  'WHAT REGISTERS CANT TELL YOU': "WHAT REGISTERS CAN'T TELL YOU",
  'PAYMENTS THAT DONT SLIP THROUGH': "PAYMENTS THAT DON'T SLIP THROUGH",
  'WHAT FRAGMENTED REALITY ACTUALLY COSTS LIKE': 'WHAT FRAGMENTED REALITY ACTUALLY COSTS',
  'PAPER,PHONES AND A WAREHOUSE FULL OF GUESSWORK':
    'PAPER, PHONES AND A WAREHOUSE FULL OF GUESSWORK',
  'THREE SYSTEM’S THAT DIDN’T TALK': 'THREE SYSTEMS THAT DIDN’T TALK',
}

export function fixHeading(text: string) {
  const key = text.trim().toUpperCase()
  return HEADING_FIXES[key] ?? text
}

/**
 * Their paragraphs frequently run two sentences together where a full stop was
 * dropped ("…not gradually suddenly.", "…the cake. Orders came in…"). Split on
 * the obvious cases so the prose sets properly instead of running on.
 */
export function splitParagraph(text: string): string[] {
  return text
    .replace(/([a-z])\.([A-Z])/g, '$1.\n$2')
    .replace(/([a-z])(This works when)/g, '$1.\n$2')
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean)
}

export type CaseStudy = CaseStudyMeta & {
  sections: SectionItem[]
  /** chapter headings, for the reading rail */
  chapters: { id: string; text: string }[]
  prev: string
  next: string
}

export function getCaseStudy(id: string): CaseStudy | null {
  const story = CASE_STUDIES_FULL_DATA[id]
  const meta = CASE_STUDY_META[id]
  if (!story || !meta) return null

  const i = CASE_STUDY_IDS.indexOf(id)
  const chapters = story.sections
    .filter((s) => s.type === 'heading' && s.text)
    .map((s, n) => ({ id: `ch-${n}`, text: fixHeading(s.text!) }))

  return {
    id,
    title: story.title.replace(/\.$/, ''),
    ...meta,
    sections: story.sections,
    chapters,
    prev: CASE_STUDY_IDS[(i - 1 + CASE_STUDY_IDS.length) % CASE_STUDY_IDS.length],
    next: CASE_STUDY_IDS[(i + 1) % CASE_STUDY_IDS.length],
  }
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  return CASE_STUDY_IDS.map((id) => ({
    id,
    title: CASE_STUDIES_FULL_DATA[id].title.replace(/\.$/, ''),
    ...CASE_STUDY_META[id],
  }))
}
