'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { toArabicIndic } from '@/lib/utils'

const navLinks = [
  { href: '/',         label: 'سەرەکی' },
  { href: '/chat',     label: 'گفتوگۆ' },
  { href: '/pricing',  label: 'نرخەکان' },
  { href: '/settings', label: 'ڕێکخستن' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-12 py-4 border-b border-[oklch(0.30_0.04_250/0.4)] glass">
      {/* Logo — RIGHT side in RTL */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center animate-pulse-glow"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.25 240), oklch(0.78 0.22 235))' }}>
          <Sparkles size={18} className="text-[oklch(0.10_0.05_255)]" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          shuty<span style={{ color: 'oklch(0.78 0.22 235)' }}>.ai</span>
        </span>
      </Link>

      {/* Center nav */}
      <div className="flex items-center gap-1">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === link.href
                ? 'text-[oklch(0.78_0.22_235)] bg-[oklch(0.78_0.22_235/0.1)]'
                : 'text-[oklch(0.65_0.02_240)] hover:text-[oklch(0.95_0.01_240)] hover:bg-[oklch(0.30_0.04_250/0.4)]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side — version + CTA */}
      <div className="flex items-center gap-4">
        <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2 font-mono-kd text-xs text-[oklch(0.65_0.02_240)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.22_235)] animate-pulse-dot" />
          v{toArabicIndic('2.4')} — beta
        </div>
        <Link
          href="/auth"
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 animate-pulse-glow"
          style={{
            background: 'oklch(0.78 0.22 235)',
            color: 'oklch(0.10 0.05 255)',
            boxShadow: '0 0 24px oklch(0.78 0.22 235 / 0.4)',
          }}
        >
          دەستپێکردن
        </Link>
      </div>
    </nav>
  )
}
