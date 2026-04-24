import type { Metadata } from 'next'
import { Geist, Geist_Mono, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-bebas-neue'
});

export const metadata: Metadata = {
  title: "Charity's Portfolio",
  description: "Creative Developer & Designer Portfolio",
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "Charity's Portfolio",
  },
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-03-17%20at%205.41.24%E2%80%AFPM.jpeg-IqAgTgZhAtj7ZVseWJ9tdnbTkwQk0b.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-03-17%20at%205.41.24%E2%80%AFPM.jpeg-IqAgTgZhAtj7ZVseWJ9tdnbTkwQk0b.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${bebasNeue.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
