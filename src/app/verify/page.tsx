'use client'

import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

function Squiggle({ color = '#1C1A17' }: { color?: string }) {
  return (
    <svg viewBox="0 0 300 12" style={{ width: '100%', height: 12 }}>
      <path d="M0,6 C20,0 40,12 60,6 C80,0 100,12 120,6 C140,0 160,12 180,6 C200,0 220,12 240,6 C260,0 280,12 300,6"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Tape() {
  return (
    <div style={{
      width: 80, height: 18, background: 'rgba(212,165,58,0.55)',
      border: '1px solid rgba(212,165,58,0.8)',
      transform: 'rotate(-2deg)',
      backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(255,255,255,0.25) 6px, rgba(255,255,255,0.25) 8px)',
      boxShadow: '-2px 2px 0 0 rgba(28,26,23,0.12)',
      flexShrink: 0,
    }} />
  )
}

export default function VerifyPage() {
  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F0E6D0', padding: 24, direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{
          background: '#EDE0C5', border: '3px solid #1C1A17',
          boxShadow: '-10px 10px 0 0 #1C1A17',
          padding: '48px 32px', position: 'relative',
          textAlign: 'center',
        }}>
          {/* Decorative Tape */}
          <div style={{ position: 'absolute', top: -10, left: '20%' }}>
            <Tape />
          </div>
          <div style={{ position: 'absolute', bottom: -10, right: '15%' }}>
            <Tape />
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center',
            width: 80, height: 80, background: '#D4A53A', border: '3px solid #1C1A17',
            boxShadow: '-4px 4px 0 0 #1C1A17', marginBottom: 24,
            justifyContent: 'center'
          }}>
            <Mail size={40} color="#1C1A17" />
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1C1A17', marginBottom: 12 }}>
            ئیمەیڵەکەت پشتڕاست بکەرەوە
          </h1>
          
          <div style={{ marginBottom: 24 }}>
            <Squiggle color="#B5462E" />
          </div>

          <p style={{ fontSize: 15, color: '#3A3730', lineHeight: 1.7, marginBottom: 32, fontWeight: 500 }}>
            سوپاس بۆ ناوتۆمارکردن لە <strong style={{ color: '#B5462E' }}>shuty.ai</strong>. 
            نامەیەکی پشتڕاستکردنەوەمان بۆ ناردوویت. تکایە سەیری ئیمەیڵەکەت بکە و کلیک لەسەر لینکەکە بکە بۆ ئەوەی دەستپێبکەیت.
          </p>

          <div style={{ borderTop: '3px solid #1C1A17', paddingTop: 24 }}>
            <Link 
              href="/auth?mode=login" 
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: '#B5462E', fontWeight: 800, textDecoration: 'none',
                fontSize: 14,
              }}
            >
              ← گەڕانەوە بۆ چوونەژوورەوە
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
