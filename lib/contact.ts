/**
 * Real contact and social data, recovered from the previous site's compiled
 * bundle (public/assets/index-ghupCLVX.js) rather than retyped, so nothing is
 * guessed. Single source of truth for the footer, the CTA and the careers page.
 */

export const CONTACT = {
  /** primary — this is the address the old site put on every CTA */
  email: 'vk@caratsense.in',
  brandEmail: 'brand@caratsense.in',
  legalEmail: 'legal@caratsense.in',
  careersEmail: 'careers@caratsense.in',
  hiringEmail: 'akshat@caratsense.in',

  phoneDisplay: '+91 93091 37416',
  phoneHref: 'tel:+919309137416',

  location: 'Mumbai, Maharashtra, India',
  locationShort: 'Mumbai, India',

  /** the old site's prefilled enquiry text, kept verbatim */
  whatsapp:
    'https://api.whatsapp.com/send/?phone=919309137416&text=Hi%2C+I+want+to+build+custom+operational+software+for+my+business&type=phone_number&app_absent=0',
  whatsappShort:
    'https://api.whatsapp.com/send/?phone=919309137416&text=Hi+CaratSense&type=phone_number&app_absent=0',

  responseNote: 'Typically respond within 2 hours · 100% confidential',
} as const

/** Cal.com booking — 30 minute intro call */
export const CAL = {
  link: 'caratsense/30min',
  namespace: '30min',
  url: 'https://cal.com/caratsense/30min',
} as const

export const SOCIAL = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/caratsense' },
  { label: 'Instagram', href: 'https://instagram.com/caratsense' },
  { label: 'Medium', href: 'https://medium.com/@caratsenseAI' },
  { label: 'WhatsApp', href: CONTACT.whatsappShort },
] as const

/** Footer columns, matching the previous site's information architecture. */
export const FOOTER_NAV = {
  Company: [
    { label: 'About', href: '/#build' },
    { label: 'Case Studies', href: '/#work' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/#contact' },
  ],
  Industries: [
    { label: 'Food & Beverage', href: '/case-studies/01' },
    { label: 'Textile', href: '/case-studies/02' },
    { label: 'Jewellery', href: '/case-studies/03' },
    { label: 'PropTech', href: '/case-studies/04' },
    { label: 'D2C Fashion', href: '/case-studies/05' },
    { label: 'Specialty Chemicals', href: '/case-studies/06' },
    { label: 'Real Estate', href: '/case-studies/08' },
    { label: 'Construction', href: '/case-studies/09' },
  ],
} as const

/** Vision and mission, verbatim from the previous site's About modal. */
export const PURPOSE = {
  vision:
    'A world where every business — from a single workshop to a global enterprise — runs on intelligence, not intuition, and grows without ceiling.',
  mission:
    'We engineer the intelligent backbone of modern business, so every business, in every industry, can outthink, outpace, and outlast the old way of working.',
  team: "We're a small team that builds fast and ships faster. We're always open to sharp engineers, designers, and operators who care about solving real business problems — not building for the sake of it.",
} as const

export const BRAND = {
  tagline: 'See Beyond.',
  description:
    'CaratSense is a consultative AI and software studio that builds custom tech around your operations — not the other way around.',
  copyright: '© 2026 CaratSense. All rights reserved.',
} as const

/**
 * The open role, transcribed from the LinkedIn hiring post
 * linkedin.com/posts/caratsense-ai_hiring-softwaredeveloperintern-…
 */
export const ROLES = [
  {
    id: 'software-developer-intern',
    title: 'Software Developer Intern',
    type: 'Internship',
    location: 'Mumbai — on-site or remote',
    duration: '3–6 months',
    schedule: 'Monday to Saturday',
    stipend: 'Paid internship · stipend as per industry standards',
    intro:
      'You will work on real client systems, not sample projects. The things we build run somebody’s business the next morning, so the bar is that it has to actually work.',
    responsibilities: [
      'Develop frontend components and integrate them with backend services',
      'Create and test APIs',
      'Work with databases and resolve bugs',
      'Support deployment processes',
      'Use AI tools to move faster',
    ],
    requirements: [
      'JavaScript and React',
      'Backend experience in Python or Node.js',
      'Understanding of APIs, databases and web applications',
      'AWS knowledge, or familiarity with a cloud environment',
      'Git and collaborative workflows',
      'Comfortable working with Claude and ChatGPT',
      'Demonstrated academic, personal or professional projects',
    ],
    offer: ['Certificate on completion', 'PPO opportunity based on performance'],
    applyTo: ['careers@caratsense.in', 'akshat@caratsense.in'],
    applySubject: 'Software Developer Intern - [Your Name]',
    applyWith: ['Resume', 'GitHub profile', 'Portfolio'],
  },
] as const
