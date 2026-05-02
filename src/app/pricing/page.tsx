'use client'

import React from 'react'
import { PricingTable } from '@/components/pricing-table'
import { SHUTY_CONFIG } from '@/lib/shuty-config'
import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F0E6D0] py-20 px-4 font-['Vazirmatn'] rtl">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-black mb-6 uppercase tracking-tighter">
          نرخەکان و پلانەکان
        </h1>
        <p className="text-xl font-bold text-[#B5462E] max-w-2xl mx-auto leading-relaxed">
          هەموو هێز و زیرەکیی Shuty بخە خزمەت خۆت. پلانێک هەڵبژێرە کە لەگەڵ کارەکەتدا دەگونجێت.
        </p>
      </div>

      {/* Pricing Table Component */}
      <PricingTable />

      {/* Payment Info */}
      <div className="max-w-4xl mx-auto mt-20 border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(181,70,46,1)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-[#B5462E] text-white border-2 border-black">
            <Info size={24} />
          </div>
          <h2 className="text-3xl font-black">{SHUTY_CONFIG.paymentInstructions.title}</h2>
        </div>
        
        <p className="text-lg font-bold mb-8 leading-relaxed">
          {SHUTY_CONFIG.paymentInstructions.message}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHUTY_CONFIG.paymentInstructions.methods.map((method, idx) => (
            <div key={idx} className="border-2 border-black p-4 bg-[#F0E6D0]">
              <div className="font-black text-sm uppercase mb-1">{method.name}</div>
              <div className="font-black text-xl">{method.detail}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t-2 border-dashed border-black flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm font-bold uppercase opacity-60">پێویستت بە هاوکارییە؟</div>
            <div className="text-xl font-black">پەیوەندیمان پێوە بکە لە {SHUTY_CONFIG.paymentInstructions.supportContact}</div>
          </div>
          <Link 
            href="/chat"
            className="flex items-center gap-2 px-8 py-4 bg-black text-white font-black text-lg hover:bg-[#B5462E] transition-colors"
          >
            گەڕانەوە بۆ چات <ArrowRight size={20} className="rotate-180" />
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-20 font-bold opacity-40">
        Shuty AI © 2026 - هەموو مافەکان پارێزراوە
      </div>
    </div>
  )
}
