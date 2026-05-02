'use client'

import React from 'react'
import { SHUTY_CONFIG } from '@/lib/shuty-config'
import { Check, Zap, Rocket, Star } from 'lucide-react'

export const PricingTable = () => {
  const tiers = [
    {
      id: 'FREE',
      name: SHUTY_CONFIG.FREE.displayName,
      price: SHUTY_CONFIG.FREE.price,
      icon: <Zap className="w-6 h-6" />,
      features: [
        `${SHUTY_CONFIG.FREE.maxMessagesPerDay} نامەی ڕۆژانە`,
        `${SHUTY_CONFIG.FREE.maxImagesPerDay} شیکردنەوەی وێنە`,
        'گەڕانی ئۆنلاین',
        'یارمەتی کۆمەڵایەتی'
      ],
      color: 'bg-white'
    },
    {
      id: 'PRO',
      name: SHUTY_CONFIG.PRO.displayName,
      price: SHUTY_CONFIG.PRO.price,
      icon: <Rocket className="w-6 h-6" />,
      features: [
        `${SHUTY_CONFIG.PRO.maxMessagesPerDay} نامەی ڕۆژانە`,
        `${SHUTY_CONFIG.PRO.maxImagesPerDay} شیکردنەوەی وێنە`,
        'ژیریی بەرزتر و خێراتر',
        'گەڕانی پێشکەوتوو',
        'یارمەتی تایبەت'
      ],
      color: 'bg-yellow-400',
      popular: true
    },
    {
      id: 'ULTRA',
      name: SHUTY_CONFIG.ULTRA.displayName,
      price: SHUTY_CONFIG.ULTRA.price,
      icon: <Star className="w-6 h-6" />,
      features: [
        `${SHUTY_CONFIG.ULTRA.maxMessagesPerDay} نامەی ڕۆژانە`,
        `${SHUTY_CONFIG.ULTRA.maxImagesPerDay} شیکردنەوەی وێنە`,
        'بەرزترین ئاستی ژیریی Shuty',
        'یادەوەری زۆر قووڵ',
        'یارمەتی ڕاستەوخۆ'
      ],
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto p-4 rtl">
      {tiers.map((tier) => (
        <div 
          key={tier.id}
          className={`relative border-4 border-black p-6 ${tier.color} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none`}
        >
          {tier.popular && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 font-bold border-2 border-black">
              بەناوبانگترین
            </div>
          )}
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 border-2 border-black bg-white rounded-none">
              {tier.icon}
            </div>
            <h3 className="text-2xl font-black">{tier.name}</h3>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-black">{tier.price}</span>
            <span className="text-sm font-bold block mt-1">بۆ یەک مانگ</span>
          </div>

          <ul className="space-y-3 mb-8">
            {tier.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 font-bold text-sm">
                <Check className="w-4 h-4 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <button className="w-full py-3 border-4 border-black bg-black text-white font-black text-lg hover:bg-white hover:text-black transition-colors">
            کڕینی پلانەکە
          </button>
        </div>
      ))}
    </div>
  )
}
