import { Geist, Geist_Mono, Kalam } from 'next/font/google'

/**
 * Geist / Geist Mono — the closest free face to Terminal Industries' grotesque.
 * Metric-designed as a pair, variable, subset to latin.
 */
export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

/**
 * Kalam — handwriting with full Devanagari support. This is what makes
 * `kal ka order confirm hai?` render correctly in either script.
 * See docs/assets/A-13-text-in-assets.md
 */
export const kalam = Kalam({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '700'],
  variable: '--font-kalam',
  display: 'swap',
})

export const fontVars = `${geist.variable} ${geistMono.variable} ${kalam.variable}`
