/**
 * Canonical content. Every figure here reconciles — see
 * docs/BUILD-PLAN.md §7. An operator will check them.
 */

export const CANONICAL_ORDER = {
  id: 'ORD-4471',
  customer: 'Anjali M.',
  item: 'Black Forest · 1.5 kg',
  rate: 1660,
  cgst: 99.6,
  sgst: 99.6,
  total: 1859.2,
  rounded: 1860,
  slot: 'Sat 14:00',
  status: 'Confirmed',
} as const

/* ============================================================
   §3 — the sixteen panels
   Named after case study 03, "Sixteen Problems, One Screen".
   Panel 16 does not become a widget. It becomes the frame.
   ============================================================ */

export type PanelKind = 'chat' | 'sheet' | 'file' | 'alert' | 'badge' | 'plate' | 'sticky'

export type PanelDef = {
  id: number
  kind: PanelKind
  area: string
  /** scattered: hand-placed. procedural randomness always looks like a bug. */
  pos: { top: string; left: string; rot: number; scale: number }
  before: Record<string, unknown>
  after: { label: string; value: string; gold?: boolean }
}

export const PANELS: PanelDef[] = [
  {
    id: 1, kind: 'chat', area: 'ord',
    pos: { top: '6%', left: '4%', rot: -7, scale: 0.82 },
    before: { text: 'did u get my last msg?', time: '21:44', ticks: 2 },
    after: { label: 'Orders inbox', value: '47 open' },
  },
  {
    id: 2, kind: 'sheet', area: 'ord',
    pos: { top: '21%', left: '69%', rot: 5, scale: 0.74 },
    before: { preset: 'xl01' },
    after: { label: 'Stock table', value: '1,284 units' },
  },
  {
    id: 3, kind: 'alert', area: 'feed',
    pos: { top: '58%', left: '11%', rot: 11, scale: 0.9 },
    before: { label: '3 missed calls', sub: '09:41' },
    after: { label: 'Customer record', value: 'Anjali M.' },
  },
  {
    id: 4, kind: 'sticky', area: 'ord',
    pos: { top: '37%', left: '82%', rot: -9, scale: 0.6 },
    before: { text: 'Anjali — black forest 1.5kg — Sat 2pm', tone: 'yellow' },
    after: { label: 'ORD-4471', value: '₹ 1,860' },
  },
  {
    id: 5, kind: 'plate', area: 'kpi',
    pos: { top: '11%', left: '38%', rot: 3, scale: 0.7 },
    before: { value: '₹ ?' },
    after: { label: 'Revenue today', value: '₹ 4,21,900', gold: true },
  },
  {
    id: 6, kind: 'chat', area: 'map',
    pos: { top: '72%', left: '58%', rot: -5, scale: 0.86 },
    before: { text: 'where is order 41', time: '15:02', ticks: 1 },
    after: { label: 'ORD-0041', value: 'Out for delivery · 14:20' },
  },
  {
    id: 7, kind: 'sticky', area: 'kpi',
    pos: { top: '80%', left: '30%', rot: 13, scale: 0.55 },
    before: { text: 'STOCK CHECK???', tone: 'yellow' },
    after: { label: 'Inventory', value: '1,284' },
  },
  {
    id: 8, kind: 'plate', area: 'kpi',
    pos: { top: '48%', left: '46%', rot: -3, scale: 0.66 },
    before: { value: '11 s' },
    after: { label: 'Quote time', value: '0.4s' },
  },
  {
    id: 9, kind: 'sticky', area: 'map',
    pos: { top: '26%', left: '20%', rot: -12, scale: 0.58 },
    before: { text: 'Sat 2pm clash!!', tone: 'pink' },
    after: { label: 'Dispatch', value: '6 slots' },
  },
  {
    id: 10, kind: 'chat', area: 'ord',
    pos: { top: '88%', left: '70%', rot: 8, scale: 0.78 },
    before: { text: 'batch no.?', time: '11:20', ticks: 1 },
    after: { label: 'Batch', value: 'TM-3L · Plant 2' },
  },
  {
    id: 11, kind: 'file', area: 'feed',
    pos: { top: '4%', left: '58%', rot: -6, scale: 0.9 },
    before: { name: 'Sales_Report_v2_FINAL_final.xlsx' },
    after: { label: 'Payables', value: '₹ 84,200' },
  },
  {
    id: 12, kind: 'chat', area: 'nav',
    pos: { top: '63%', left: '78%', rot: 6, scale: 0.8 },
    before: { text: 'which plant made this', time: '17:55', ticks: 2 },
    after: { label: 'Plant filter', value: '3 plants' },
  },
  {
    id: 13, kind: 'sheet', area: 'feed',
    pos: { top: '43%', left: '4%', rot: 9, scale: 0.68 },
    before: { preset: 'xl02' },
    after: { label: 'Reorder alert', value: '4 SKUs' },
  },
  {
    id: 14, kind: 'sticky', area: 'ord',
    pos: { top: '16%', left: '88%', rot: 15, scale: 0.5 },
    before: { text: 'Anjali / Anjli / Angali?', tone: 'orange' },
    after: { label: 'Customer', value: '1 profile' },
  },
  {
    id: 15, kind: 'plate', area: 'nav',
    pos: { top: '90%', left: '12%', rot: -8, scale: 0.62 },
    before: { value: '₹ 22,020' },
    after: { label: 'Ledger', value: 'Reconciled' },
  },
  // the point of the whole section — this one becomes the container
  {
    id: 16, kind: 'plate', area: 'stage',
    pos: { top: '52%', left: '32%', rot: 4, scale: 0.9 },
    before: { value: 'the founder remembers everything' },
    after: { label: '', value: '' },
  },
]

export const SHEET_PRESETS = {
  xl01: {
    rows: 5, cols: 4, tab: 'Sheet3',
    cells: {
      A1: { v: '24/04' }, B1: { v: '1,660' }, C1: { v: '#REF!', err: true }, D1: { v: '1' },
      A2: { v: '24/04' }, B2: { v: '680' }, C2: { v: '680' }, D2: { v: '1' },
      A3: { v: '25/04' }, B3: { v: '3,100' }, C3: { v: '3,100' }, D3: { v: '2' },
      A4: { v: '25/04' }, B4: { v: '420' }, C4: { v: '420' }, D4: { v: '1' },
      A5: { v: '26/04' }, B5: { v: '1,240' }, C5: { v: '#REF!', err: true }, D5: { v: '1' },
    },
  },
  xl02: {
    rows: 6, cols: 2,
    cells: {
      A1: { v: '16/04' }, B1: { v: '18,100', fill: 'y' as const },
      A2: { v: '18/04' }, B2: { v: '20,800' },
      A3: { v: '21/04' }, B3: { v: '610', fill: 'r' as const },
      A4: { v: '24/04' }, B4: { v: '22,020', fill: 'y' as const },
      A5: { v: '25/04' }, B5: { v: '19,400' },
      A6: { v: '26/04' }, B6: { v: '21,150', fill: 'g' as const },
    },
  },
}

export const TILES = [
  { label: 'Revenue today', value: 421900, prefix: '₹ ', gold: true },
  { label: 'Orders open', value: 47 },
  { label: 'Stock value', value: 1840200, prefix: '₹ ' },
  { label: 'On-time delivery', value: 94, suffix: '%' },
] as const

/* ============================================================
   §4 — the six chapters. Straight from the orbit section on the
   existing site, reordered to how an engagement actually happens.
   ============================================================ */

export type Chapter = { n: string; title: string; body: string; chip: string }

export const CHAPTERS: Chapter[] = [
  {
    n: '01',
    title: 'We start where it hurts',
    body: 'Not with a platform. With the one thing that breaks every week. We sit with the people doing the work and find the step where the business stops being able to answer its own questions.',
    chip: 'BOTTLENECK: ORDER INTAKE',
  },
  {
    n: '02',
    title: 'Your data, in one place',
    body: 'Orders, stock, customers, costs. Usually these live in four places and agree with each other never. First we make one version true.',
    chip: 'SYNCING · 3 SOURCES',
  },
  {
    n: '03',
    title: 'The workflows that run themselves',
    body: 'The follow-up that always gets forgotten. The reorder nobody flagged. The status update that needed a phone call. These stop being someone’s job.',
    chip: '14 WORKFLOWS ACTIVE',
  },
  {
    n: '04',
    title: 'Models that know your business',
    body: 'Generic AI knows language. Yours needs to know that a 1.5kg black forest takes four hours and that Plant 2 runs slow on Fridays. We build on your data, not the internet’s.',
    chip: 'MODEL v4 · 41,882 ORDERS',
  },
  {
    n: '05',
    title: 'One screen for the people who run it',
    body: 'The owner should not need to ask three people to know how the business is doing. One screen, current, honest.',
    chip: 'QUOTE GENERATED · 0.4s',
  },
  {
    n: '06',
    title: 'It grows when you do',
    body: 'Start with what hurts most. Add the rest when it starts to matter — not before.',
    chip: '+6 NODES AVAILABLE',
  },
]

/* ============================================================
   §5 — the thread. Boring and true. The tedium of
   "did u get my last msg?" is what makes it land.
   ============================================================ */

export const THREAD = [
  { text: 'Hi need a cake for saturday', time: '14:02', out: true, ticks: 2 as const },
  { text: 'ok! what flavour?', time: '14:09', out: false, ticks: 2 as const },
  { text: 'black forest 1kg', time: '14:11', out: true, ticks: 2 as const },
  { text: '₹1660 ok?', time: '14:31', out: false, ticks: 2 as const },
  { text: 'ok. and delivery?', time: '15:47', out: true, ticks: 2 as const },
  { text: 'actually make it 1.5kg sorry', time: '16:20', out: true, ticks: 2 as const },
  { text: 'kal ka order confirm hai?', time: '08:12', out: true, ticks: 1 as const, hand: true },
  { text: 'did u get my last msg?', time: '21:44', out: true, ticks: 2 as const },
  { text: 'hello?', time: '23:16', out: true, ticks: 1 as const },
]

/** The same information, once it can be asked a question. */
export const RESOLVED_ROWS = [
  { id: 'ORD-4471', who: 'Anjali M.', what: 'Black Forest · 1.5kg', amt: '₹ 1,860', slot: 'Sat 14:00', status: 'Confirmed' },
  { id: 'ORD-4472', who: 'Rehan S.', what: 'Red Velvet · 500g', amt: '₹ 680', slot: 'Sat 11:00', status: 'In oven' },
  { id: 'ORD-4473', who: 'Priya K.', what: 'Custom · 2 tier', amt: '₹ 3,100', slot: 'Sun 16:00', status: 'Quoted' },
]

/* ============================================================
   §6 — the nine case studies. Client pairing is inference and
   needs confirming; see docs/BUILD-PLAN.md §6.
   ============================================================ */

export type CaseStudy = {
  id: string
  title: string
  client: string | null
  industry: string
  metric: string
}

export const CASE_STUDIES: CaseStudy[] = [
  { id: '01', title: 'Running a Home Bakery Like a Logistics Company', client: 'Cake O Clock', industry: 'Home bakery · Mumbai', metric: '40 orders/day off WhatsApp' },
  { id: '02', title: 'Turning Dead Stock into Matched Demand', client: 'Éclat Diamonds', industry: 'Diamonds & jewellery', metric: '41 parcels matched' },
  { id: '03', title: 'Sixteen Problems, One Screen', client: null, industry: 'Multi-vertical group', metric: '16 systems → 1' },
  { id: '04', title: 'Student Housing, Off WhatsApp', client: 'The Commun', industry: 'Student housing', metric: '204 tenancies tracked' },
  { id: '05', title: 'Selling Everywhere, Remembering Nothing', client: null, industry: 'Omnichannel retail', metric: '4 channels, 1 ledger' },
  { id: '06', title: 'Multiple Plants, Thousands of Batches, No Single View', client: 'TDM Fabrics', industry: 'Textile manufacturing', metric: '3 plants · 1,284 batches' },
  { id: '07', title: 'The Quote That Used to Require an Expert', client: 'Suntek Group', industry: 'Industrial supply', metric: '11s → 0.4s per quote' },
  { id: '08', title: 'Now Selling Trust, Not Just Flats', client: 'Samruddhi Developers', industry: 'Real estate', metric: '12 units held, live' },
  { id: '09', title: 'The Manager Who Knows', client: null, industry: 'Operations management', metric: 'One screen, current' },
]

/* ============================================================
   §7 — the clients. Files already in public/assets/.
   ============================================================ */

export type Client = { name: string; src: string; study?: string }

export const CLIENTS: Client[] = [
  { name: 'Babey Infratech', src: '/assets/babey-infratech-G_RYaT83.png' },
  { name: 'BFC', src: '/assets/bfc-DQSx5pX7.png' },
  { name: 'Blup', src: '/assets/blup-BFdEJOc8.png' },
  { name: 'Cake O Clock', src: '/assets/cake-o-clock-BhZNsj1F.png', study: '01' },
  { name: 'Éclat Diamonds', src: '/assets/eclat-diamonds-HU4uVl9C.png', study: '02' },
  { name: 'Ivory Rose', src: '/assets/ivory-rose-e28synTD.png' },
  { name: 'KCC', src: '/assets/kcc-CG4_qt9x.png' },
  { name: 'Landspeaks', src: '/assets/landspeaks-Cl1yJ99n.png' },
  { name: 'Samruddhi Developers', src: '/assets/samruddhi-developers-BnbYfta7.png', study: '08' },
  { name: 'Suntek Group', src: '/assets/suntek-group-DsYY8RBE.png', study: '07' },
  { name: 'TDM Fabrics', src: '/assets/tdm-fabrics-2iFDiXNl.png', study: '06' },
  { name: 'The Commun', src: '/assets/the-commun-DlX1DNVl.png', study: '04' },
  { name: 'Wild Over Words', src: '/assets/wild-over-words-2nH9CjLB.png' },
]

/* ============================================================
   §8 — the spectrum. One input, every answer. Violet→gold ramp
   rather than a literal rainbow, so it stays on brand.
   ============================================================ */

export const SPECTRUM = [
  { y: 210, c: '#c9a6ff', label: 'orders, tracked' },
  { y: 260, c: '#a855f7', label: 'stock, live' },
  { y: 310, c: '#e879b8', label: 'quotes, instant' },
  { y: 360, c: '#f2ce5b', label: 'delivery, visible' },
  { y: 410, c: '#d4af37', label: 'margin, known' },
] as const
