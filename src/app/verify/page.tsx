'use client'

import Link from 'next/link'
import { Sparkles, Mail, ArrowLeft } from 'lucide-react'

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Mail className="w-10 h-10 text-blue-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              ئیمەیڵەکەت پشتڕاست بکەرەوە
            </h1>
            <p className="text-slate-400 leading-relaxed">
              سوپاس بۆ ناوتۆمارکردن لە <span className="text-blue-400 font-semibold">shuty.ai</span>. 
              نامەیەکی پشتڕاستکردنەوەمان بۆ ناردوویت. تکایە سەیری ئیمەیڵەکەت بکە و کلیک لەسەر لینکەکە بکە بۆ ئەوەی دەستپێبکەیت.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <Link 
              href="/auth" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              گەڕانەوە بۆ چوونەژوورەوە
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
