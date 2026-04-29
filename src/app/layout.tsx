import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import './globals.css'

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'shuty.ai — زیرەکی دەستکرد بە کوردی',
  description: 'platforma زیرەکی دەستکردی کوردی — بە زمانی سۆرانی. تێگەیشتنی قووڵ، وەڵامی خێرا.',
  metadataBase: new URL('https://shuty.ai'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ckb" dir="rtl" className={`${vazirmatn.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-vazirmatn bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
