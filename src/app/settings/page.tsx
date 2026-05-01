'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, ArrowRight, Lock, Settings, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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

function Stamp({ label = 'ش' }: { label?: string }) {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64} style={{ transform: 'rotate(-8deg)', flexShrink: 0 }}>
      <circle cx="40" cy="40" r="37" fill="none" stroke="#B5462E" strokeWidth="2.5" strokeDasharray="4 2" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#B5462E" strokeWidth="1.5" />
      <text x="40" y="46" textAnchor="middle" fontSize="22" fontFamily="Vazirmatn" fontWeight="800" fill="#B5462E">{label}</text>
    </svg>
  )
}

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pwOpen, setPwOpen] = useState(false)
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ mode: 'logout' }) })
    router.push('/')
    router.refresh()
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg(null)
    if (newPw.length < 6) {
      setPwMsg({ text: 'وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت.', ok: false })
      return
    }
    if (newPw !== confirmPw) {
      setPwMsg({ text: 'وشەی نهێنییەکان یەک نین. دووبارە بنووسە.', ok: false })
      return
    }
    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwLoading(false)
    if (error) {
      setPwMsg({ text: `هەڵە: ${error.message}`, ok: false })
    } else {
      setPwMsg({ text: 'وشەی نهێنی بەسەرکەوتوویی گۆڕدرا! ✓', ok: true })
      setNewPw('')
      setConfirmPw('')
      setTimeout(() => { setPwOpen(false); setPwMsg(null) }, 2000)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F0E6D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Vazirmatn, sans-serif', color: '#6B7341', fontSize: 14 }}>
      چاوەڕوان بە…
    </div>
  )

  const username = user?.email?.split('@')[0] ?? 'بەکارهێنەر'

  return (
    <div style={{
      minHeight: '100vh', background: '#F0E6D0', color: '#1C1A17',
      direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif',
      position: 'relative', zIndex: 1,
    }}>

      {/* Nav */}
      <nav style={{ borderBottom: '3px solid #1C1A17', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', background: '#EDE0C5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Settings size={18} />
          <span style={{ fontWeight: 800, fontSize: 17 }}>ڕێکخستنەکان</span>
        </div>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 32px 80px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tape />
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>ڕێکخستنەکان</h1>
        </div>
        <Squiggle color="#B5462E" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 32 }}>

          {/* Profile card */}
          <div style={{
            background: '#EDE0C5', border: '3px solid #1C1A17',
            boxShadow: '-7px 7px 0 0 #1C1A17',
            padding: '28px 24px', position: 'relative',
            transform: 'rotate(0.3deg)',
          }}>
            <div style={{ position: 'absolute', top: -10, right: 32 }}><Tape /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Avatar stamp */}
              <Stamp label={username[0]?.toUpperCase() ?? 'ب'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{username}</div>
                <div style={{ fontSize: 12, color: '#6B7341', marginBottom: 10, fontWeight: 500 }}>{user?.email}</div>
                {/* Session badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '3px 10px', background: 'rgba(107,115,65,0.15)',
                  border: '1.5px solid #6B7341', fontSize: 10, fontWeight: 800,
                  color: '#6B7341', letterSpacing: '0.1em',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6B7341', display: 'inline-block' }} />
                  ناستینی چالاک
                </div>
              </div>
            </div>
          </div>

          {/* Password change card */}
          <div style={{
            background: '#F0E6D0', border: '3px solid #1C1A17',
            boxShadow: '-7px 7px 0 0 #D4A53A',
            padding: '24px', transform: 'rotate(-0.3deg)',
          }}>
            {/* Header row — always visible */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, border: '2.5px solid #1C1A17', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE0C5' }}>
                  <Lock size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>گۆڕینی وشەی نهێنی</div>
                  <div style={{ fontSize: 11, color: '#6B7341', fontWeight: 500, marginTop: 2 }}>وشەی نهێنیی نوێ دیاری بکە</div>
                </div>
              </div>
              <button
                onClick={() => { setPwOpen(o => !o); setPwMsg(null) }}
                style={{
                  padding: '6px 14px', background: pwOpen ? '#1C1A17' : '#D4A53A',
                  color: pwOpen ? '#F0E6D0' : '#1C1A17',
                  border: '2px solid #1C1A17', fontFamily: 'Vazirmatn', fontWeight: 700,
                  fontSize: 12, cursor: 'pointer', boxShadow: '-3px 3px 0 0 #1C1A17',
                }}
              >
                {pwOpen ? 'داخستن' : 'گۆڕین'}
              </button>
            </div>

            {/* Expandable form */}
            {pwOpen && (
              <form onSubmit={handleChangePassword} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* New password */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>وشەی نهێنیی نوێ</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      placeholder="لانیکەم ٦ پیت"
                      required
                      style={{
                        width: '100%', padding: '10px 40px 10px 12px', boxSizing: 'border-box',
                        background: '#EDE0C5', border: '2.5px solid #1C1A17',
                        fontFamily: 'Vazirmatn', fontSize: 14, color: '#1C1A17', outline: 'none',
                      }}
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#6B7341' }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>دووبارە بنووسە</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    placeholder="وشەی نهێنی دووبارە بنووسە"
                    required
                    style={{
                      width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                      background: '#EDE0C5', border: '2.5px solid #1C1A17',
                      fontFamily: 'Vazirmatn', fontSize: 14, color: '#1C1A17', outline: 'none',
                    }}
                  />
                </div>

                {/* Feedback */}
                {pwMsg && (
                  <div style={{
                    padding: '10px 14px', fontSize: 12, fontWeight: 700,
                    background: pwMsg.ok ? 'rgba(107,115,65,0.12)' : 'rgba(181,70,46,0.10)',
                    border: `2px solid ${pwMsg.ok ? '#6B7341' : '#B5462E'}`,
                    color: pwMsg.ok ? '#6B7341' : '#B5462E',
                    boxShadow: `-3px 3px 0 0 ${pwMsg.ok ? '#6B7341' : '#B5462E'}`,
                  }}>
                    {pwMsg.text}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={pwLoading}
                  style={{
                    padding: '12px', background: pwLoading ? '#C8A882' : '#B5462E',
                    color: '#F0E6D0', border: '2.5px solid #1C1A17',
                    fontFamily: 'Vazirmatn', fontWeight: 800, fontSize: 14,
                    cursor: pwLoading ? 'not-allowed' : 'pointer',
                    boxShadow: pwLoading ? 'none' : '-4px 4px 0 0 #1C1A17',
                  }}
                >
                  {pwLoading ? 'چاوەڕوان بە...' : 'پاشەکەوتکردن'}
                </button>
              </form>
            )}
          </div>

          {/* Pricing card */}
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#EDE0C5', border: '3px solid #1C1A17',
              boxShadow: '-7px 7px 0 0 #6B7341',
              padding: '24px', transform: 'rotate(0.3deg)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, border: '2.5px solid #1C1A17', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0E6D0', fontSize: 18 }}>
                  ✦
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#1C1A17' }}>نرخەکان</div>
                  <div style={{ fontSize: 11, color: '#6B7341', fontWeight: 500, marginTop: 2 }}>بینینی پلانەکان و بەرزکردنەوەی هەژمار</div>
                </div>
              </div>
              <span style={{ fontSize: 20, color: '#6B7341', fontWeight: 800 }}>←</span>
            </div>
          </Link>

          <Squiggle color="#6B7341" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '18px 24px', background: '#F0E6D0',
              border: '3px solid #B5462E', boxShadow: '-6px 6px 0 0 #B5462E',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', fontFamily: 'Vazirmatn',
              transition: 'transform 0.1s, box-shadow 0.1s',
              transform: 'rotate(0.2deg)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translate(-3px, 3px) rotate(0.2deg)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '-3px 3px 0 0 #B5462E' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0.2deg)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '-6px 6px 0 0 #B5462E' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, border: '2.5px solid #B5462E', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(181,70,46,0.08)' }}>
                <LogOut size={18} color="#B5462E" />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#B5462E' }}>چوونەدەرەوە</div>
                <div style={{ fontSize: 11, color: '#B5462E', opacity: 0.7, marginTop: 2 }}>داخستنی هەژمار لەم ئامێرەدا</div>
              </div>
            </div>
            <ArrowRight size={18} color="#B5462E" />
          </button>

          {/* Back */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Link href="/chat" style={{ fontSize: 13, color: '#6B7341', fontWeight: 600, textDecoration: 'none' }}>
              ← گەڕانەوە بۆ گفتوگۆ
            </Link>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: 12, color: '#B5462E', fontWeight: 600, textDecoration: 'none' }}>
              ← گەڕانەوە بۆ سەرەکی
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
