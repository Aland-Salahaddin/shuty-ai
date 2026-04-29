'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, Lock, ArrowLeft } from 'lucide-react'
import Background from '@/components/Background'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
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
        body: JSON.stringify({ email, password, mode }),
      })
      const data = await res.json()

      if (data.error) {
        if (data.error.includes('Email not confirmed')) {
          setError('ئیمەیڵەکە پشتڕاست نەکراوەتەوە. تکایە سەیری نامەکانی ناو ئیمەیڵەکەت بکە.')
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
    } catch (err) {
      setError('هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەرەوە.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <Background />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-glow mb-4"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.25 240), oklch(0.78 0.22 235))' }}>
            <Sparkles size={32} className="text-[oklch(0.10_0.05_255)]" />
          </div>
          <h1 className="text-3xl font-black gradient-text">بەخێربێیت بۆ shuty.ai</h1>
          <p className="text-[oklch(0.65_0.02_240)] mt-2">
            {mode === 'login' ? 'بچۆ ژوورەوە بۆ دەستپێکردن' : 'هەژمارێکی نوێ دروست بکە'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-3xl p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium px-1 block">ئیمەیڵ</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.03_245)]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[oklch(0.10_0.05_255/0.5)] border border-[oklch(0.30_0.04_250)] rounded-xl py-3 pr-12 pl-4 outline-none focus:border-[oklch(0.78_0.22_235)] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium px-1 block">وشەی نهێنی</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.03_245)]" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[oklch(0.10_0.05_255/0.5)] border border-[oklch(0.30_0.04_250)] rounded-xl py-3 pr-12 pl-4 outline-none focus:border-[oklch(0.78_0.22_235)] transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 mt-4"
              style={{
                background: 'oklch(0.78 0.22 235)',
                color: 'oklch(0.10 0.05 255)',
                boxShadow: '0 0 40px oklch(0.78 0.22 235 / 0.3)',
              }}
            >
              {loading ? 'چاوەڕوان بە...' : mode === 'login' ? 'چوونەژوورەوە' : 'تۆمارکردن'}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-[oklch(0.78_0.22_235)] hover:underline"
            >
              {mode === 'login' ? 'هێشتا هەژمارت نییە؟ تۆماربە' : 'پێشتر هەژمارت دروست کردووە؟ بچۆ ژوورەوە'}
            </button>
          </div>
        </div>

        {/* Back link */}
        <Link href="/" className="flex items-center justify-center gap-2 mt-8 text-[oklch(0.65_0.02_240)] hover:text-white transition-colors">
          <ArrowLeft size={16} style={{ transform: 'scaleX(-1)' }} />
          گەڕانەوە بۆ سەرەکی
        </Link>
      </div>
    </div>
  )
}
