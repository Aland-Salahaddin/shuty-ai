'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { ArrowRight, Settings as SettingsIcon, MessageSquare } from 'lucide-react'

function Squiggle({ color = '#1C1A17' }: { color?: string }) {
  return (
    <svg viewBox="0 0 300 12" style={{ width: '100%', height: 12 }}>
      <path d="M0,6 C20,0 40,12 60,6 C80,0 100,12 120,6 C140,0 160,12 180,6 C200,0 220,12 240,6 C260,0 280,12 300,6"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Tape({ rotate = '-2deg', width = 80 }: { rotate?: string; width?: number }) {
  return (
    <div style={{
      width, height: 20, background: 'rgba(212,165,58,0.55)',
      border: '1px solid rgba(212,165,58,0.8)',
      transform: `rotate(${rotate})`,
      backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(255,255,255,0.25) 6px, rgba(255,255,255,0.25) 8px)',
      boxShadow: '-2px 2px 0 0 rgba(28,26,23,0.12)',
      flexShrink: 0,
    }} />
  )
}

function Stamp({ label = 'شوتی', rotate = '-10deg', size = 64 }: { label?: string; rotate?: string; size?: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} style={{ transform: `rotate(${rotate})`, flexShrink: 0 }}>
      <circle cx="40" cy="40" r="38" fill="none" stroke="#B5462E" strokeWidth="2.5" strokeDasharray="4 2" />
      <circle cx="40" cy="40" r="32" fill="none" stroke="#B5462E" strokeWidth="1.5" />
      <text x="40" y="45" textAnchor="middle" fontSize="16" fontFamily="Vazirmatn" fontWeight="800" fill="#B5462E">{label}</text>
    </svg>
  )
}

const tiers = [
  {
    name: 'خۆڕایی',
    price: '٠',
    sub: 'بەخۆڕایی بۆ هەمیشە',
    description: 'بۆ بەکارهێنانی سەرەتایی و تاقیکردنەوە',
    features: [
      'دەستڕاگەیشتن بە مۆدێلی سەرەتایی',
      '١٠ پەیام لە ڕۆژێکدا',
      'گەڕانی ئینتەرنێت',
      'پشتیوانی کۆمەڵایەتی',
    ],
    cta: 'دەستپێکردنی بێبەرامبەر',
    href: '/chat',
    featured: false,
  },
  {
    name: 'Pro',
    price: '١٩',
    sub: '$/مانگ',
    description: 'بۆ بەکارهێنەرانی پیشەگەر و پەرەپێدەران',
    features: [
      'دەستڕاگەیشتن بە هەموو مۆدێلەکان',
      'پەیامی بێسنوور',
      'گەڕانی بێسنوور لە ئینتەرنێت',
      'تێگەیشتنی قووڵ و کلتووری',
      'پشتیوانی خێرا (Priority)',
      'بەدەستهێنانی API Key',
    ],
    cta: 'بەدەستهێنانی Pro',
    href: '/auth?mode=signup',
    featured: true,
  },
]

export default function PricingPage() {
  const { user, isLoaded } = useUser()
  const loading = !isLoaded

  return (
    <div style={{ minHeight: '100vh', background: '#F0E6D0', color: '#1C1A17', direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif', position: 'relative', zIndex: 1 }}>

      {/* Nav */}
      <nav style={{ borderBottom: '3px solid #1C1A17', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EDE0C5' }}>
        <div style={{ fontWeight: 800, fontSize: 20 }}>shuty.ai</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {!loading && (
            user ? (
              <>
                <Link href="/chat" style={{ fontSize: 14, fontWeight: 700, color: '#1C1A17', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageSquare size={16} /> گفتوگۆ
                </Link>
                <Link href="/settings" style={{ fontSize: 14, fontWeight: 700, color: '#1C1A17', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SettingsIcon size={16} /> ڕێکخستنەکان
                </Link>
              </>
            ) : (
              <>
                <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: '#1C1A17', textDecoration: 'none' }}>سەرەکی</Link>
                <Link href="/auth?mode=login" style={{ padding: '8px 20px', background: '#B5462E', color: '#F0E6D0', border: '2px solid #1C1A17', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '-4px 4px 0 0 #1C1A17', display: 'inline-block' }}>
                  چوونەژوورەوە
                </Link>
              </>
            )
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 48px 48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Tape rotate="-3deg" width={60} />
          <h1 style={{ fontSize: 52, fontWeight: 800, color: '#1C1A17', margin: 0 }}>نرخەکان</h1>
          <Tape rotate="3deg" width={60} />
        </div>
        <Squiggle color="#B5462E" />
        <p style={{ marginTop: 16, fontSize: 15, color: '#6B7341', fontWeight: 500, maxWidth: 420, margin: '16px auto 0' }}>
          باشترین پلان هەڵبژێرە بۆ پێداویستییەکانی خۆت. هەموو پلانەکان پشتگیری زمانی کوردی و گەڕانی ئینتەرنێت دەکەن.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 48px 80px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
        {tiers.map((tier, idx) => (
          <div
            key={tier.name}
            style={{
              background: tier.featured ? '#EDE0C5' : '#F0E6D0',
              border: `3px solid #1C1A17`,
              boxShadow: tier.featured ? '-8px 8px 0 0 #B5462E' : '-8px 8px 0 0 #1C1A17',
              padding: '36px 28px',
              position: 'relative',
              transform: `rotate(${idx % 2 === 0 ? '0.4deg' : '-0.4deg'})`,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Tape on featured */}
            {tier.featured && (
              <div style={{ position: 'absolute', top: -10, right: '28%' }}>
                <Tape rotate="-3deg" width={100} />
              </div>
            )}

            {/* Badge */}
            {tier.featured && (
              <div style={{
                position: 'absolute', top: -16, left: 24,
                background: '#B5462E', color: '#F0E6D0',
                border: '2px solid #1C1A17', padding: '3px 12px',
                fontSize: 11, fontWeight: 800, letterSpacing: '0.08em',
                boxShadow: '-3px 3px 0 0 #1C1A17',
                transform: 'rotate(-1deg)',
              }}>
                زۆر بەکارهێنراو
              </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{tier.name}</h2>
              <Stamp label={tier.name === 'Pro' ? 'Pro' : 'خۆ'} rotate={idx % 2 === 0 ? '-8deg' : '6deg'} size={56} />
            </div>

            {/* Price */}
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 56, fontWeight: 800, color: tier.featured ? '#B5462E' : '#1C1A17', lineHeight: 1 }}>
                {tier.price}
              </span>
              <span style={{ fontSize: 16, color: '#6B7341', fontWeight: 600, marginRight: 4 }}>
                {tier.sub}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#6B7341', marginBottom: 24, fontWeight: 500 }}>{tier.description}</p>

            <Squiggle color={tier.featured ? '#B5462E' : '#6B7341'} />

            {/* Features */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 28px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {tier.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 500 }}>
                  <span style={{
                    width: 20, height: 20, border: '2px solid #1C1A17',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: tier.featured ? '#B5462E' : '#D4A53A',
                    flexShrink: 0, fontSize: 11, color: '#F0E6D0', fontWeight: 900,
                  }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={user ? (tier.name === 'Pro' ? '/settings' : '/chat') : tier.href}
              style={{
                display: 'block', textAlign: 'center',
                padding: '14px 20px',
                background: tier.featured ? '#B5462E' : '#D4A53A',
                color: tier.featured ? '#F0E6D0' : '#1C1A17',
                border: '2.5px solid #1C1A17',
                fontWeight: 800, fontSize: 15,
                textDecoration: 'none',
                boxShadow: '-5px 5px 0 0 #1C1A17',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 48px 64px', textAlign: 'center' }}>
        <Squiggle color="#6B7341" />
        <p style={{ marginTop: 16, fontSize: 12, color: '#6B7341', fontWeight: 500 }}>
          هەموو نرخەکان بە دۆلاری ئەمریکییەوە — دەتوانیت هەر کاتێک هەڵبدەیتەوە
        </p>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '3px solid #1C1A17', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EDE0C5' }}>
        <span style={{ fontSize: 11, color: '#6B7341', fontWeight: 600 }}>© ٢٠٢٥ shuty.ai — هەموو مافەکان پارێزراون</span>
        <Link href="/" style={{ fontSize: 11, color: '#6B7341', fontWeight: 600, textDecoration: 'none' }}>← گەڕانەوە بۆ سەرەکی</Link>
      </footer>
    </div>
  )
}
