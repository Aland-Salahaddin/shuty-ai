import { Check, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Background from '@/components/Background'
import { toArabicIndic } from '@/lib/utils'

const tiers = [
  {
    name: 'خۆڕایی',
    price: `٠`,
    description: 'بۆ بەکارهێنانی سەرەتایی و تاقیکردنەوە',
    features: [
      'دەستڕاگەیشتن بە llama3-8b',
      '١٠ پەیام لە ڕۆژێکدا',
      'تێگەیشتنی سەرەتایی لە کوردی',
      'پشتیوانی کۆمەڵایەتی',
    ],
    cta: 'دەستپێکردنی بێبەرامبەر',
    featured: false,
  },
  {
    name: 'Pro',
    price: `١٩`,
    description: 'بۆ بەکارهێنەرانی پیشەگەر و پەرەپێدەران',
    features: [
      'دەستڕاگەیشتن بە llama3-70b-8192',
      'پەیامی بێسنوور',
      'تێگەیشتنی قووڵ و کلتووری',
      'پشتیوانی خێرا (Priority)',
      'بەدەستهێنانی API Key',
      'مۆدێلی وێنە (بەمنزیکانە)',
    ],
    cta: 'بەدەستهێنانی Pro',
    featured: true,
  },
]

export default function PricingPage() {
  return (
    <div className="relative min-h-screen">
      <Background />
      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-24 text-center">
        <h1 className="text-5xl font-black gradient-text mb-4">نرخەکان</h1>
        <p className="text-[oklch(0.65_0.02_240)] max-w-xl mx-auto mb-16">
          باشترین پلان هەڵبژێرە بۆ پێداویستییەکانی خۆت. هەموو پلانەکان پشتگیری زمانی کوردی دەکەن.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`glass rounded-3xl p-10 flex flex-col relative transition-all duration-300 hover:scale-[1.02] ${
                tier.featured ? 'border-[oklch(0.78_0.22_235/0.5)] bg-[oklch(0.78_0.22_235/0.05)]' : ''
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 right-1/2 translate-x-1/2 glass px-4 py-1.5 rounded-full flex items-center gap-2 border-[oklch(0.78_0.22_235/0.4)]">
                  <Sparkles size={14} className="text-[oklch(0.78_0.22_235)]" />
                  <span className="text-xs font-bold text-[oklch(0.78_0.22_235)]">زۆر بەکارهێنراو</span>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black font-mono-kd">{tier.price}</span>
                  <span className="text-[oklch(0.65_0.02_240)] font-medium">$/مانگ</span>
                </div>
                <p className="text-sm text-[oklch(0.45_0.03_245)] mt-4">{tier.description}</p>
              </div>

              <div className="space-y-4 flex-1 text-right mb-10">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-[oklch(0.95_0.01_240)]">
                    <div className="w-5 h-5 rounded-full bg-[oklch(0.78_0.22_235/0.1)] flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-[oklch(0.78_0.22_235)]" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  tier.featured
                    ? 'bg-[oklch(0.78_0.22_235)] text-[oklch(0.10_0.05_255)] shadow-[0_0_40px_oklch(0.78_0.22_235/0.4)]'
                    : 'glass hover:bg-[oklch(0.30_0.04_250/0.5)]'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
