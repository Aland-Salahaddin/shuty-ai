'use client'

import { Rocket, ShieldCheck, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SHUTY_CONFIG } from '@/lib/shuty-config'

const toArabicDigits = (num: number | string) => {
  return num.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])
}

export default function PricingPage() {
  return (
    <div dir="rtl" style={{ 
      minHeight: '100vh', 
      background: '#F0E6D0', 
      fontFamily: 'Vazirmatn',
      padding: '40px 20px',
      color: '#1C1A17'
    }}>
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, textShadow: '4px 4px 0 #D4A53A' }}>نرخەکان و پلانەکان</h1>
        <p style={{ fontSize: 18, fontWeight: 600, color: '#6B7341' }}>پلانی گونجاو بۆ خۆت هەڵبژێرە و دەست بکە بە بەکارهێنانی شوتی</p>
      </div>

      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: 30 
      }}>
        {/* FREE PLAN */}
        <div style={{ 
          background: '#FFFFFF', 
          border: '4px solid #1C1A17', 
          boxShadow: '-10px 10px 0 0 #1C1A17',
          padding: 30,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900 }}>Shuty 1.5</h2>
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 10 }}>بەخۆڕایی</div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1 }}>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
              <ShieldCheck size={20} color="#6B7341" /> {toArabicDigits(SHUTY_CONFIG.FREE.maxTokensPerDay.toLocaleString())} خاڵی ڕۆژانە
            </li>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
              <ShieldCheck size={20} color="#6B7341" /> {toArabicDigits(SHUTY_CONFIG.FREE.maxImagesPerDay)} شکاندنەوەی وێنە
            </li>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
              <ShieldCheck size={20} color="#6B7341" /> زیرەکی ئاستی سەرەتایی
            </li>
          </ul>
          <Link href="/chat" style={{ 
            background: '#1C1A17', color: '#F0E6D0', textAlign: 'center', padding: '14px', 
            textDecoration: 'none', fontWeight: 900, border: '2px solid #1C1A17'
          }}>دەستپێکردن</Link>
        </div>

        {/* PRO PLAN */}
        <div style={{ 
          background: '#D4A53A', 
          border: '4px solid #1C1A17', 
          boxShadow: '-10px 10px 0 0 #1C1A17',
          padding: 30,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transform: 'scale(1.05)',
          zIndex: 1
        }}>
          <div style={{ 
            position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)',
            background: '#1C1A17', color: '#D4A53A', padding: '4px 12px', fontWeight: 900, fontSize: 12, border: '2px solid #1C1A17'
          }}>بەناوبانگترین</div>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900 }}>Shuty 2.5</h2>
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 10 }}>٧,٥٠٠ دینار <span style={{ fontSize: 16 }}>/ مانگانە</span></div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1 }}>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <Zap size={20} /> {toArabicDigits(SHUTY_CONFIG.PRO.maxTokensPerDay.toLocaleString())} خاڵی ڕۆژانە
            </li>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <Zap size={20} /> {toArabicDigits(SHUTY_CONFIG.PRO.maxImagesPerDay)} شکاندنەوەی وێنە
            </li>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <Zap size={20} /> زیرەکی بەرزتر و خێراتر
            </li>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <Zap size={20} /> یارمەتیدەری کەسی
            </li>
          </ul>
          <Link href="/chat?openSupport=true" style={{ 
            background: '#1C1A17', color: '#D4A53A', textAlign: 'center', padding: '14px', 
            textDecoration: 'none', fontWeight: 900, border: '2px solid #1C1A17'
          }}>کڕینی پلانەکە</Link>
        </div>

        {/* ULTRA PLAN */}
        <div style={{ 
          background: '#B5462E', 
          border: '4px solid #1C1A17', 
          boxShadow: '-10px 10px 0 0 #1C1A17',
          padding: 30,
          display: 'flex',
          flexDirection: 'column',
          color: '#F0E6D0'
        }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900 }}>Shuty 3.0</h2>
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 10 }}>١٥,٠٠٠ دینار <span style={{ fontSize: 16 }}>/ مانگانە</span></div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1 }}>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <Rocket size={20} /> {toArabicDigits(SHUTY_CONFIG.ULTRA.maxTokensPerDay.toLocaleString())} خاڵی ڕۆژانە
            </li>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <Rocket size={20} /> {toArabicDigits(SHUTY_CONFIG.ULTRA.maxImagesPerDay)} شکاندنەوەی وێنە
            </li>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <Rocket size={20} /> بەهێزترین ئاستی زیرەکی
            </li>
            <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <Rocket size={20} /> پشتگیری تایبەت و خێرا
            </li>
          </ul>
          <Link href="/chat?openSupport=true" style={{ 
            background: '#F0E6D0', color: '#B5462E', textAlign: 'center', padding: '14px', 
            textDecoration: 'none', fontWeight: 900, border: '4px solid #1C1A17'
          }}>کڕینی پلانەکە</Link>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div style={{ 
        maxWidth: 800, margin: '60px auto 0 auto', background: '#FFFFFF', border: '3px solid #1C1A17', 
        boxShadow: '-6px 6px 0 0 #1C1A17', padding: 30, textAlign: 'center' 
      }}>
        <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 16 }}>چۆنیەتی کڕین؟</h3>
        <p style={{ fontWeight: 600, lineHeight: 1.8 }}>
          بۆ نوێکردنەوەی هەژمارەکەت، تکایە کلیک لەسەر "کڕینی پلانەکە" بکە و لە ڕێگەی چاتی ڕاستەوخۆوە پەیوەندیمان پێوە بکە. 
          دەتوانیت لە ڕێگەی <span style={{ color: '#B5462E', fontWeight: 900 }}>ZainCash, FastPay, FIB</span> پارەکە بنێریت و هەژمارەکەت چالاک بکەیت.
        </p>
        <Link href="/chat" style={{ 
          marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 10, 
          color: '#1C1A17', fontWeight: 900, textDecoration: 'none', borderBottom: '3px solid #D4A53A' 
        }}>
          <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /> گەڕانەوە بۆ چات
        </Link>
      </div>
    </div>
  )
}
