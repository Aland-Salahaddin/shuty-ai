import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Brain, Zap, Shield, Languages, Cpu, Network, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Background from '@/components/Background'
import { toArabicIndic } from '@/lib/utils'
import type { Metadata } from 'next'
import torusImg from '@/assets/torus-3d.png'

export const metadata: Metadata = {
  title: 'shuty.ai — زیرەکی دەستکرد بە کوردی',
  description: 'platforma زیرەکی دەستکردی کوردی — بە زمانی سۆرانی. تێگەیشتنی قووڵ، وەڵامی خێرا.',
}

const features = [
  { num: '٠١', label: 'تێگەیشتنی قووڵ',    icon: Brain,     span: 'col-span-5' },
  { num: '٠٢', label: 'خێرایی ڕاستەقینە',   icon: Zap,       span: 'col-span-4' },
  { num: '٠٣', label: 'ئاسایشی تەواو',      icon: Shield,    span: 'col-span-3' },
  { num: '٠٤', label: 'فرە-زمانی',          icon: Languages, span: 'col-span-3' },
  { num: '٠٥', label: 'پرۆسیسۆری زانست',   icon: Cpu,       span: 'col-span-4' },
  { num: '٠٦', label: 'API ی کراوە',        icon: Network,   span: 'col-span-5' },
]

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-12 pt-40 pb-24">
        <div className="grid grid-cols-12 gap-8 items-center">

          {/* Left — copy */}
          <div className="col-span-7 space-y-8">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
              <span className="font-mono-kd text-xs tracking-[0.2em]" style={{ color: 'oklch(0.78 0.22 235)' }}>
                ◆ NEURAL FABRIC — نەوەی چوارەم
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-black leading-[1.05]" style={{ fontSize: '5.5rem' }}>
              <span className="gradient-text block">زیرەکی دەستکرد،</span>
              <span className="gradient-text block">
                بە زمانی{' '}
                <span className="glow-text" style={{ color: 'oklch(0.78 0.22 235)', WebkitTextFillColor: 'oklch(0.78 0.22 235)' }}>
                  کوردی
                </span>
                .
              </span>
            </h1>

            {/* Para */}
            <p className="max-w-xl text-lg leading-relaxed" style={{ color: 'oklch(0.65 0.02 240)' }}>
              "shuty.ai" زیرەکی دەستکردی تایبەتە بۆ زمانی کوردی سۆرانی. مۆدێلی ئێمە لەسەر میلیۆنها
              دەستنووسی کوردی فێر بووە و تێدەگات بە وردییە کلتووری و ڕێزمانی کە هیچ سیستەمی تری
              نایانزانێت.
            </p>

            {/* CTA row */}
            <div className="flex items-center gap-4">
              <Link
                href="/chat"
                className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'oklch(0.78 0.22 235)',
                  color: 'oklch(0.10 0.05 255)',
                  boxShadow: '0 0 40px oklch(0.78 0.22 235 / 0.5)',
                }}
              >
                دەستپێکردنی گفتوگۆ
                <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
              </Link>
              <Link
                href="/pricing"
                className="glass flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-[oklch(0.30_0.04_250/0.5)]"
              >
                بینینی نرخەکان
              </Link>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-0 glass rounded-2xl overflow-hidden mt-4">
              {[
                { val: `+${toArabicIndic(98)}٪`, label: 'وردبینی لە سۆرانیدا' },
                { val: `<${toArabicIndic(300)}ms`, label: 'خێرایی وەڵامدانەوە' },
                { val: `${toArabicIndic(24)}/${toArabicIndic(7)}`, label: 'بەردەستی بەردەوام' },
              ].map((stat, i) => (
                <div key={i} className={`px-8 py-6 text-center ${i < 2 ? 'border-l border-[oklch(0.30_0.04_250)]' : ''}`}>
                  <div className="font-mono-kd text-2xl font-bold" style={{ color: 'oklch(0.78 0.22 235)' }}>
                    {stat.val}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'oklch(0.65 0.02 240)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D torus */}
          <div className="col-span-5 relative aspect-square flex items-center justify-center">
            {/* Aurora backdrop */}
            <div className="absolute inset-0 aurora aurora-1 scale-75 opacity-60" />

            {/* Rotating rings */}
            <div
              className="absolute inset-4 rounded-full border animate-spin-slow"
              style={{ borderColor: 'oklch(0.78 0.22 235 / 0.2)' }}
            />
            <div
              className="absolute inset-10 rounded-full border animate-spin-slow-r"
              style={{ borderColor: 'oklch(0.78 0.22 235 / 0.1)' }}
            />

            {/* Torus image */}
            <div
              className="relative z-10 animate-float"
              style={{ 
                filter: 'drop-shadow(0 0 80px oklch(0.78 0.22 235 / 0.7))',
                mixBlendMode: 'screen',
                WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 95%)',
                maskImage: 'radial-gradient(circle, black 50%, transparent 95%)'
              }}
            >
              <Image
                src={torusImg}
                alt="Shuty.ai Neural Torus"
                width={420}
                height={420}
                priority
              />
            </div>

            {/* Floating data tags */}
            <div
              className="absolute top-[15%] right-[10%] glass rounded-xl px-4 py-2 font-mono-kd text-sm z-20 animate-float"
              style={{ animationDelay: '-1s', color: 'oklch(0.78 0.22 235)' }}
            >
              ◇ خێرایی
            </div>
            <div
              className="absolute bottom-[15%] left-[8%] glass rounded-xl px-4 py-2 font-mono-kd text-sm z-20 animate-float"
              style={{ animationDelay: '-3s', color: 'oklch(0.85 0.15 220)' }}
            >
              ◆ بیرەوەری
            </div>
            <div
              className="absolute top-[45%] left-[4%] glass rounded-xl px-4 py-2 font-mono-kd text-sm z-20 animate-float"
              style={{ animationDelay: '-2s', color: 'oklch(0.65 0.18 50)' }}
            >
              ▲ هێز
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-12 py-24">
        {/* Header */}
        <div className="flex items-start justify-between mb-16 gap-12">
          <div className="space-y-4">
            <p className="font-mono-kd text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.65 0.02 240)' }}>
              — تایبەتمەندییەکان —
            </p>
            <h2 className="text-5xl font-black gradient-text leading-tight">
              ئەندازیاریی تایبەت بۆ<br />وردەکارییەکانی زمانی کوردی
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed mt-4" style={{ color: 'oklch(0.65 0.02 240)' }}>
            هەر تایبەتمەندییەک بە وردی دیزاین کراوە بۆ تێگەیشتن و دەربڕینی ئاست-بەرز بە زمانی سۆرانی.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-12 gap-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.num}
                className={`${f.span} glass rounded-2xl p-8 group relative overflow-hidden cursor-default transition-all duration-500 hover:border-[oklch(0.78_0.22_235/0.4)]`}
              >
                {/* Hover aurora */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 50%, oklch(0.78 0.22 235 / 0.08) 0%, transparent 70%)' }} />

                {/* Mono number top-left (RTL = top-right visually) */}
                <span className="absolute top-5 left-5 font-mono-kd text-xs" style={{ color: 'oklch(0.45 0.03 245)' }}>
                  {f.num}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border"
                  style={{
                    background: 'oklch(0.10 0.05 255)',
                    borderColor: 'oklch(0.78 0.22 235 / 0.3)',
                  }}
                >
                  <Icon size={22} style={{ color: 'oklch(0.78 0.22 235)' }} />
                </div>

                <h3 className="text-lg font-bold">{f.label}</h3>
              </div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 glass rounded-3xl p-16 relative overflow-hidden text-center">
          <div className="absolute inset-0 aurora aurora-1 scale-110 opacity-30 pointer-events-none" />
          <p className="font-mono-kd text-xs tracking-[0.25em] mb-6" style={{ color: 'oklch(0.65 0.02 240)' }}>
            — ئامادەی دەستپێکردنیت؟ —
          </p>
          <h2 className="text-5xl font-black gradient-text mb-10 leading-tight relative z-10">
            زمانی کوردی شایانی<br />زیرەکییەکی شایستەیە.
          </h2>
          <Link
            href="/auth"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 relative z-10"
            style={{
              background: 'oklch(0.78 0.22 235)',
              color: 'oklch(0.10 0.05 255)',
              boxShadow: '0 0 60px oklch(0.78 0.22 235 / 0.5)',
            }}
          >
            دەستپێکردنی بێبەرامبەر
            <Sparkles size={20} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[oklch(0.30_0.04_250/0.5)] py-8 px-12 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <span className="font-mono-kd text-xs" style={{ color: 'oklch(0.45 0.03 245)' }}>
            © {toArabicIndic(2025)} shuty.ai — هەموو مافەکان پارێزراون
          </span>
          <span className="font-mono-kd text-xs" style={{ color: 'oklch(0.45 0.03 245)' }}>
            دروستکراوە لە کوردستان · v{toArabicIndic('2.4')}-beta
          </span>
        </div>
      </footer>
    </div>
  )
}
