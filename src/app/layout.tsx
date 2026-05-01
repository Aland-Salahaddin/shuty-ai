import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import './globals.css'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'shuty.ai — زیرەکی دەستکرد بە کوردی',
  description: 'پلاتفۆرمی زیرەکی دەستکردی کوردی — بە زمانی سۆرانی. تێگەیشتنی قووڵ، وەڵامی خێرا.',
  metadataBase: new URL('https://shuty.ai'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ckb" dir="rtl" className={vazirmatn.variable}>
      <body style={{ fontFamily: 'Vazirmatn, sans-serif', background: '#F0E6D0', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
