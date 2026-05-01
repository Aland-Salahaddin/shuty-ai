import Link from 'next/link'
import type { Metadata } from 'next'
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"



export const metadata: Metadata = {
  title: 'shuty.ai — زیرەکی دەستکرد بە کوردی',
  description: 'پلاتفۆرمی زیرەکی دەستکردی کوردی — بە زمانی سۆرانی. تێگەیشتنی قووڵ، وەڵامی خێرا.',
}

function toArabicDigits(n: string | number) {
  return String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])
}

function Squiggle({ color = '#1C1A17' }: { color?: string }) {
  return (
    <svg viewBox="0 0 300 12" style={{ width: '100%', height: 12 }}>
      <path d="M0,6 C20,0 40,12 60,6 C80,0 100,12 120,6 C140,0 160,12 180,6 C200,0 220,12 240,6 C260,0 280,12 300,6"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Stamp({ label = 'شوتی', rotate = '-10deg', size = 80 }: { label?: string; rotate?: string; size?: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} style={{ transform: `rotate(${rotate})`, flexShrink: 0 }}>
      <circle cx="40" cy="40" r="38" fill="none" stroke="#B5462E" strokeWidth="2.5" strokeDasharray="4 2" />
      <circle cx="40" cy="40" r="32" fill="none" stroke="#B5462E" strokeWidth="1.5" />
      <text x="40" y="45" textAnchor="middle" fontSize="17" fontFamily="Vazirmatn" fontWeight="800" fill="#B5462E">{label}</text>
    </svg>
  )
}

function Tape({ rotate = '-2deg', width = 80 }: { rotate?: string; width?: number }) {
  return (
    <div style={{
      width, height: 20, background: 'rgba(212,165,58,0.55)',
      border: '1px solid rgba(212,165,58,0.8)',
      transform: `rotate(${rotate})`,
      position: 'relative', overflow: 'hidden',
      boxShadow: '-2px 2px 0 0 rgba(28,26,23,0.12)',
      flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(255,255,255,0.25) 6px, rgba(255,255,255,0.25) 8px)' }} />
    </div>
  )
}

const features = [
  { num: '٠١', title: 'تێگەیشتنی قووڵ', desc: 'تێدەگات بە وردییە کلتووری و ڕێزمانی زمانی کوردی' },
  { num: '٠٢', title: 'گەڕانی ڕاستەوخۆ', desc: 'پێش هەر وەڵامێک لە گووگڵ دەگەڕێت بۆ زانیاری نوێ' },
  { num: '٠٣', title: 'خێرایی ڕاستەقینە', desc: 'سیستەمی چەندین کلیل و چەندین مۆدێل بۆ کاری بەردەوام' },
  { num: '٠٤', title: 'ئاسایشی تەواو', desc: 'داتاکەت پارێزراوە و بەسەردەستی کەسی تر ناچێت' },
]

export default function HomePage() {
  const today = new Date()
  const kurdishMonths = ['کانوونی دووەم','شوبات','ئازار','نیسان','ئایار','حوزەیران','تەممووز','ئاب','ئەیلوول','تشرینی یەکەم','تشرینی دووەم','کانوونی یەکەم']
  const dateStr = `${toArabicDigits(today.getDate())}ی ${kurdishMonths[today.getMonth()]} ${toArabicDigits(today.getFullYear())}`

  return (
    <div style={{ minHeight: '100vh', background: '#F0E6D0', color: '#1C1A17', direction: 'rtl', position: 'relative', zIndex: 1, fontFamily: 'Vazirmatn, sans-serif' }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{ borderBottom: '3px solid #1C1A17', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EDE0C5', position: 'relative' }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>shuty.ai</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/pricing" style={{ fontSize: 14, fontWeight: 600, color: '#1C1A17', textDecoration: 'none' }}>نرخەکان</Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button style={{ fontSize: 14, fontWeight: 600, color: '#1C1A17', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>چوونەژوورەوە</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                style={{
                  padding: '8px 20px', background: '#B5462E', color: '#F0E6D0',
                  border: '2px solid #1C1A17', fontWeight: 700, fontSize: 14,
                  boxShadow: '-4px 4px 0 0 #1C1A17',
                  cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
                  fontFamily: 'inherit'
                }}
              >
                دەستپێکردن
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/chat"
              style={{
                padding: '8px 24px', background: '#D4A53A', color: '#1C1A17',
                border: '2px solid #1C1A17', fontWeight: 800, fontSize: 14,
                boxShadow: '-4px 4px 0 0 #1C1A17',
                textDecoration: 'none', transition: 'transform 0.1s, box-shadow 0.1s',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              چوونە ناو چات ←
            </Link>
          </Show>

        </div>

      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 48px 64px' }}>
        {/* Date chip */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <Tape rotate="-2deg" width={60} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7341', letterSpacing: '0.1em' }}>
            ئەمڕۆ • {dateStr}
          </span>
          <Tape rotate="2deg" width={50} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
              زیرەکی دەستکرد،
              <br />
              <span style={{ color: '#B5462E', display: 'inline-block', transform: 'rotate(-0.5deg)' }}>
                بە زمانی کوردی.
              </span>
            </h1>
            {/* Squiggle under headline */}
            <div style={{ marginBottom: 24, maxWidth: 400 }}>
              <Squiggle color="#D4A53A" />
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: '#3A3730', maxWidth: 480, marginBottom: 40, fontWeight: 400 }}>
              shuty.ai پلاتفۆرمی زیرەکی دەستکردییە کە تایبەت بۆ زمانی کوردی سۆرانی دروستکراوە. گەڕانی ڕاستەوخۆ لە ئینتەرنێت و وەڵامی درووست بە کوردی.
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/auth?mode=signup"
                style={{
                  padding: '14px 32px', background: '#B5462E', color: '#F0E6D0',
                  border: '3px solid #1C1A17', fontWeight: 800, fontSize: 16,
                  textDecoration: 'none', boxShadow: '-6px 6px 0 0 #1C1A17',
                  display: 'inline-block', transition: 'transform 0.1s, box-shadow 0.1s',
                }}
              >
                دەستپێکردنی گفتوگۆ ←
              </Link>
              <Link
                href="/pricing"
                style={{
                  padding: '14px 28px', background: 'transparent', color: '#1C1A17',
                  border: '3px solid #1C1A17', fontWeight: 700, fontSize: 15,
                  textDecoration: 'none', boxShadow: '-5px 5px 0 0 #D4A53A',
                  display: 'inline-block',
                }}
              >
                نرخەکان
              </Link>
            </div>
          </div>
          {/* Stamp decoration */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 16 }}>
            <Stamp label="شوتی" rotate="-8deg" size={100} />
            <Stamp label="کوردی" rotate="5deg" size={72} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginTop: 56, border: '3px solid #1C1A17', boxShadow: '-6px 6px 0 0 #1C1A17' }}>
          {[
            { val: `+${toArabicDigits(98)}٪`, label: 'تێگەیشتنی سۆرانی' },
            { val: toArabicDigits('٢٤/٧'), label: 'بەردەستی بەردەوام' },
            { val: toArabicDigits(2500), label: 'گەڕانی بەخۆڕایی' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '24px 20px', textAlign: 'center', background: i === 1 ? '#EDE0C5' : '#F0E6D0',
              borderRight: i > 0 ? '3px solid #1C1A17' : undefined,
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#B5462E', marginBottom: 4 }}>{stat.val}</div>
              <div style={{ fontSize: 12, color: '#6B7341', fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SQUIGGLE DIVIDER ─────────────────────────────── */}
      <div style={{ padding: '0 48px', maxWidth: 900, margin: '0 auto' }}>
        <Squiggle color="#B5462E" />
      </div>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '64px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <Tape rotate="-3deg" width={40} />
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>تایبەتمەندییەکان</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div
              key={f.num}
              style={{
                padding: '28px 24px', background: '#EDE0C5', border: '2.5px solid #1C1A17',
                boxShadow: '-5px 5px 0 0 #1C1A17',
                transform: `rotate(${i % 2 === 0 ? '0.4deg' : '-0.4deg'})`,
                position: 'relative',
              }}
            >
              {i === 0 && <div style={{ position: 'absolute', top: -10, right: 24 }}><Tape rotate="-4deg" width={60} /></div>}
              <div style={{ fontSize: 11, fontWeight: 700, color: '#B5462E', letterSpacing: '0.1em', marginBottom: 8 }}>{f.num}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#3A3730', lineHeight: 1.6, fontWeight: 400 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA STAMP BLOCK ──────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 48px' }}>
        <div style={{
          padding: '48px 40px', background: '#EDE0C5', border: '3px solid #1C1A17',
          boxShadow: '-8px 8px 0 0 #6B7341', textAlign: 'center', position: 'relative',
        }}>
          <Tape rotate="-2deg" width={80} />
          <div style={{ position: 'absolute', top: 16, left: 20 }}>
            <Stamp label="شوتی" rotate="-12deg" size={72} />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>زمانی کوردی شایانی زیرەکییەکی شایستەیە.</h2>
          <Squiggle color="#B5462E" />
          <div style={{ marginTop: 28 }}>
            <Link
              href="/auth?mode=signup"
              style={{
                padding: '14px 36px', background: '#D4A53A', color: '#1C1A17',
                border: '3px solid #1C1A17', fontWeight: 800, fontSize: 16,
                textDecoration: 'none', boxShadow: '-6px 6px 0 0 #1C1A17',
                display: 'inline-block',
              }}
            >
              دەستپێکردنی بێبەرامبەر
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ borderTop: '3px solid #1C1A17', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EDE0C5' }}>
        <span style={{ fontSize: 11, color: '#6B7341', fontWeight: 600 }}>
          © {toArabicDigits(2025)} shuty.ai — هەموو مافەکان پارێزراون
        </span>
        <span style={{ fontSize: 11, color: '#6B7341', fontWeight: 600 }}>
          دروستکراوە لە کوردستان · v{toArabicDigits('2.5')}
        </span>
      </footer>
    </div>
  )
}
