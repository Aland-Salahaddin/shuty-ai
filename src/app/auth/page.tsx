'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function Squiggle({ color = '#1C1A17' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 10" style={{ width: '100%', height: 10 }}>
      <path d="M0,5 C15,0 30,10 45,5 C60,0 75,10 90,5 C105,0 120,10 135,5 C150,0 165,10 180,5 C190,1 200,8 200,5"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Stamp() {
  return (
    <svg viewBox="0 0 80 80" width={72} height={72} style={{ transform: 'rotate(-8deg)' }}>
      <circle cx="40" cy="40" r="37" fill="none" stroke="#B5462E" strokeWidth="2.5" strokeDasharray="4 2" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#B5462E" strokeWidth="1.5" />
      <text x="40" y="36" textAnchor="middle" fontSize="10" fontFamily="Vazirmatn" fontWeight="700" fill="#B5462E">shuty</text>
      <text x="40" y="50" textAnchor="middle" fontSize="10" fontFamily="Vazirmatn" fontWeight="700" fill="#B5462E">.ai</text>
    </svg>
  )
}

function Tape() {
  return (
    <div style={{
      width: 80, height: 18, background: 'rgba(212,165,58,0.5)',
      border: '1px solid rgba(212,165,58,0.8)',
      transform: 'rotate(-2deg)',
      backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(255,255,255,0.25) 6px, rgba(255,255,255,0.25) 8px)',
      boxShadow: '-2px 2px 0 0 rgba(28,26,23,0.12)',
    }} />
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mode, fullName }),
      })
      const data = await res.json()
      if (data.error) {
        if (data.error.includes('Email not confirmed')) {
          setError('ئیمەیڵەکە پشتڕاست نەکراوەتەوە. تکایە سەیری نامەی ئیمەیڵەکەت بکە.')
        } else if (data.error.includes('Invalid login credentials')) {
          setError('ئیمەیڵ یان وشەی نهێنی هەڵەیە.')
        } else {
          setError(data.error)
        }
      } else {
        if (mode === 'signup') {
          router.push('/verify')
        } else {
          router.push('/chat')
          router.refresh()
        }
      }
    } catch {
      setError('هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەرەوە.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F0E6D0', padding: 24, direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Stamp />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1C1A17', marginBottom: 8 }}>
            بەخێربێیت بۆ shuty.ai
          </h1>
          <Squiggle color="#D4A53A" />
          <p style={{ marginTop: 8, fontSize: 13, color: '#6B7341', fontWeight: 500 }}>
            {mode === 'login' ? 'بچۆ ژوورەوە بۆ دەستپێکردن' : 'هەژمارێکی نوێ دروست بکە'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#EDE0C5', border: '3px solid #1C1A17',
          boxShadow: '-8px 8px 0 0 #1C1A17',
          padding: '32px 28px', position: 'relative',
        }}>
          {/* Tape */}
          <div style={{ position: 'absolute', top: -10, right: '30%', display: 'flex', gap: 12 }}>
            <Tape />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', background: 'rgba(181,70,46,0.1)',
              border: '2px solid #B5462E', color: '#B5462E',
              fontSize: 13, marginBottom: 20, fontWeight: 600, textAlign: 'center',
              boxShadow: '-3px 3px 0 0 #B5462E',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Full Name (Signup Only) */}
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1C1A17', marginBottom: 6 }}>
                  ناوی تەواو
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="ناو و پاشناوت بنووسە"
                  required
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: '#F0E6D0', border: '2.5px solid #1C1A17',
                    fontFamily: 'Vazirmatn', fontSize: 14, color: '#1C1A17',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1C1A17', marginBottom: 6 }}>
                ئیمەیڵ
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#F0E6D0', border: '2.5px solid #1C1A17',
                  fontFamily: 'Vazirmatn', fontSize: 14, color: '#1C1A17',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'box-shadow 0.15s',
                }}
                onFocus={e => e.target.style.boxShadow = '-3px 3px 0 0 #D4A53A'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1C1A17', marginBottom: 6 }}>
                وشەی نهێنی
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#F0E6D0', border: '2.5px solid #1C1A17',
                  fontFamily: 'Vazirmatn', fontSize: 14, color: '#1C1A17',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'box-shadow 0.15s',
                }}
                onFocus={e => e.target.style.boxShadow = '-3px 3px 0 0 #D4A53A'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', marginTop: 4,
                background: loading ? '#C8A882' : '#B5462E',
                color: '#F0E6D0', border: '2.5px solid #1C1A17',
                fontFamily: 'Vazirmatn', fontWeight: 800, fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '-5px 5px 0 0 #1C1A17',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={e => { if (!loading) { (e.target as HTMLButtonElement).style.transform = 'translate(-3px, 3px)'; (e.target as HTMLButtonElement).style.boxShadow = '-2px 2px 0 0 #1C1A17' } }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'none'; (e.target as HTMLButtonElement).style.boxShadow = loading ? 'none' : '-5px 5px 0 0 #1C1A17' }}
            >
              {loading ? 'چاوەڕوان بە...' : mode === 'login' ? 'چوونەژوورەوە' : 'تۆمارکردن'}
            </button>
          </form>

          {/* Squiggle divider */}
          <div style={{ margin: '20px 0' }}>
            <Squiggle color="#6B7341" />
          </div>

          {/* Mode toggle */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#B5462E', fontFamily: 'Vazirmatn', fontSize: 13, fontWeight: 700,
                textDecoration: 'underline', textDecorationStyle: 'wavy',
              }}
            >
              {mode === 'login' ? 'هێشتا هەژمارت نییە؟ تۆمار بە' : 'پێشتر هەژمارت دروست کردووە؟ بچۆ ژوورەوە'}
            </button>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/" style={{
            fontSize: 13, color: '#6B7341', fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            ← گەڕانەوە بۆ سەرەکی
          </Link>
        </div>
      </div>
    </div>
  )
}
