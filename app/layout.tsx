import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVars } from '@/lib/fonts'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { Nav } from '@/components/ui/Nav'
import { Loader } from '@/components/ui/Loader'

export const metadata: Metadata = {
  metadataBase: new URL('https://caratsense.in'),
  title: {
    default: 'CaratSense AI — Turn your business chaos into operational clarity',
    template: '%s — CaratSense AI',
  },
  description:
    'A consultative AI and software studio in Mumbai. We uncover the bottlenecks slowing your business down and build custom AI & ML, automation, and software systems that eliminate them.',
  keywords: [
    'AI consultancy Mumbai',
    'custom software India',
    'business automation',
    'ERP CRM development',
    'AI & ML models',
    'operational clarity',
  ],
  openGraph: {
    type: 'website',
    siteName: 'CaratSense AI',
    title: 'CaratSense AI — Turn your business chaos into operational clarity',
    description:
      'Real businesses. Real systems. Every business we work with was running on memory, spreadsheets, or WhatsApp before we got there.',
  },
  twitter: { card: 'summary_large_image' },
  // app/icon.png, app/apple-icon.png and app/favicon.ico are picked up by
  // Next's file conventions — all three generated from the official mark.
}

export const viewport: Viewport = {
  themeColor: '#050309',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVars}>
      <body className="grain">
        <Loader />
        <Nav />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
