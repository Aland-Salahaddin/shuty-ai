'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Shield, LogOut, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Background from '@/components/Background'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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
    await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ mode: 'logout' }),
    })
    router.push('/')
    router.refresh()
  }

  if (loading) return null

  return (
    <div className="relative min-h-screen">
      <Background />
      <Navbar />

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-40 pb-24">
        <h1 className="text-4xl font-black gradient-text mb-12">ڕێکخستنەکان</h1>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="glass rounded-3xl p-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[oklch(0.30_0.04_250)] flex items-center justify-center border border-white/10">
              <User size={40} className="text-[oklch(0.65_0.02_240)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user?.email?.split('@')[0]}</h2>
              <p className="text-[oklch(0.65_0.02_240)] text-sm">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold mt-2 uppercase tracking-widest">
                Active Session
              </div>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <Shield size={20} className="text-[oklch(0.78_0.22_235)]" />
                </div>
                <div>
                  <h3 className="font-bold">ئاسایشی هەژمار</h3>
                  <p className="text-xs text-[oklch(0.45_0.03_245)]">گۆڕینی وشەی نهێنی و پاراستن</p>
                </div>
              </div>
              <button className="text-sm font-medium text-[oklch(0.78_0.22_235)] hover:underline">بەڕێوەبردن</button>
            </div>

          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full glass rounded-2xl p-6 flex items-center justify-between group hover:bg-red-500/5 transition-all border-red-500/10 hover:border-red-500/30"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                 <LogOut size={20} />
               </div>
               <div className="text-right">
                 <h3 className="font-bold text-red-400">چوونەدەرەوە</h3>
                 <p className="text-xs text-red-500/50">داخستنی هەژمار لەم ئامێرەدا</p>
               </div>
            </div>
            <ArrowLeft size={20} className="text-red-500/30" style={{ transform: 'scaleX(-1)' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
