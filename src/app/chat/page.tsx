'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Send, LogOut, Settings as SettingsIcon, Home, Trash2, Edit2, Check, Menu, X } from 'lucide-react'
import Modal from '@/components/Modal'
import { newSessionId } from '@/lib/utils'

/* ── helpers ───────────────────────────────────────────── */
function toArabicDigits(n: string | number): string {
  return String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ── SVG accent components ─────────────────────────────── */
function Squiggle({ color = '#1C1A17', className = '' }) {
  return (
    <svg viewBox="0 0 300 12" className={className} style={{ width: '100%', height: 12, overflow: 'visible' }}>
      <path
        d="M0,6 C20,0 40,12 60,6 C80,0 100,12 120,6 C140,0 160,12 180,6 C200,0 220,12 240,6 C260,0 280,12 300,6"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
      />
    </svg>
  )
}

function Tape({ rotate = '-2deg', top = '-10px', right = '20%' }) {
  return (
    <div style={{
      position: 'absolute', top, right,
      transform: `rotate(${rotate})`,
      width: 80, height: 20,
      background: 'rgba(212,165,58,0.55)',
      border: '1px solid rgba(212,165,58,0.8)',
      zIndex: 10,
      pointerEvents: 'none',
      boxShadow: '-2px 2px 0 0 rgba(28,26,23,0.15)',
    }}>
      {/* stripe texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(255,255,255,0.25) 6px, rgba(255,255,255,0.25) 8px)',
      }} />
    </div>
  )
}

function Stamp({ label = 'شتی', rotate = '-10deg', size = 72 }) {
  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      transform: `rotate(${rotate})`,
      userSelect: 'none',
      pointerEvents: 'none',
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 72 72" width={size} height={size}>
        <circle cx="36" cy="36" r="34" fill="none" stroke="#B5462E" strokeWidth="2.5" strokeDasharray="4 2" />
        <circle cx="36" cy="36" r="28" fill="none" stroke="#B5462E" strokeWidth="1.5" />
        <text x="36" y="40" textAnchor="middle" fontSize="16" fontFamily="Vazirmatn" fontWeight="700" fill="#B5462E">
          {label}
        </text>
      </svg>
      {/* ink roughness overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 60% 40%, rgba(181,70,46,0.08), transparent 70%)',
      }} />
    </div>
  )
}

function HandFrame({ children, tilt = '0deg', className = '' }: {
  children: React.ReactNode; tilt?: string; className?: string
}) {
  return (
    <div style={{ position: 'relative', transform: `rotate(${tilt})`, display: 'inline-block' }} className={className}>
      <svg style={{ position: 'absolute', inset: -4, width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', pointerEvents: 'none', zIndex: 1 }}
        viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M2,3 Q50,-1 98,2 Q102,50 99,98 Q50,102 2,99 Q-2,50 2,3 Z"
          fill="none" stroke="#1C1A17" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

/* ── Types ──────────────────────────────────────────────── */
interface Message { role: 'user' | 'assistant'; content: string }
interface Session { id: string; title: string; created_at: string }

/* ── Main Component ─────────────────────────────────────── */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const sid = newSessionId()
    setSessionId(sid)
    fetchSessions()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/history?type=sessions')
      const data = await res.json()
      if (data.sessions) setSessions(data.sessions)
    } catch {}
  }

  const fetchMessages = async (sid: string) => {
    try {
      const res = await fetch(`/api/history?session_id=${sid}`)
      const data = await res.json()
      setMessages(data.messages ? data.messages.map((m: any) => ({ role: m.role, content: m.content })) : [])
    } catch {}
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], sessionId }),
      })
      const data = await res.json()
      if (data.text) setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
      fetchSessions()
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'ببوورە، پەیوەندی پچڕا. دووبارە هەوڵ بدەرەوە.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = (sid: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessionToDelete(sid)
    setModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!sessionToDelete) return
    try {
      await fetch(`/api/history?session_id=${sessionToDelete}`, { method: 'DELETE' })
      if (sessionToDelete === sessionId) startNewChat()
      setModalOpen(false)
      setSessionToDelete(null)
      fetchSessions()
    } catch {}
  }

  const handleRename = (sid: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const s = sessions.find(s => s.id === sid)
    if (s) { setEditingId(sid); setEditTitle(s.title) }
  }

  const saveRename = async (sid: string) => {
    try {
      await fetch('/api/history', { method: 'PATCH', body: JSON.stringify({ sessionId: sid, title: editTitle }) })
      setEditingId(null)
      fetchSessions()
    } catch {}
  }

  const startNewChat = () => { setSessionId(newSessionId()); setMessages([]) }
  const selectSession = (sid: string) => { setSessionId(sid); fetchMessages(sid) }
  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ mode: 'logout' }) })
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', overflow: 'hidden',
      background: '#F0E6D0', direction: 'rtl', position: 'relative', zIndex: 1,
    }}>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <div style={{
        width: sidebarOpen ? 280 : 0,
        minWidth: sidebarOpen ? 280 : 0,
        background: '#EDE0C5',
        borderLeft: '3px solid #1C1A17',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        position: 'relative', zIndex: 20,
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '2px solid #1C1A17', position: 'relative' }}>
          <Tape top="-8px" right="30%" rotate="-2deg" />
          <div style={{ fontFamily: 'Vazirmatn', fontWeight: 800, fontSize: 22, color: '#1C1A17', letterSpacing: '-0.5px' }}>
            shuty.ai
          </div>
          <div style={{ width: 60, height: 4, background: '#D4A53A', marginTop: 4, transform: 'rotate(-0.5deg)' }} />
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'absolute', top: 20, left: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#1C1A17', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* New chat */}
        <div style={{ padding: '16px 20px' }}>
          <button
            onClick={startNewChat}
            className="press-effect"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 16px', background: '#D4A53A', color: '#1C1A17', border: '2px solid #1C1A17',
              fontFamily: 'Vazirmatn', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: '-4px 4px 0 0 #1C1A17',
            }}
          >
            <Plus size={16} />
            گفتوگۆی نوێ
          </button>
        </div>

        <Squiggle className="px-4" color="#1C1A17" />

        {/* Sessions */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#6B7341', letterSpacing: '0.15em', padding: '4px 8px 8px', textTransform: 'uppercase' }}>
            گفتوگۆکان
          </p>
          {sessions.map((s, idx) => (
            <div key={s.id} style={{ position: 'relative', marginBottom: 4 }}>
              {editingId === s.id ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 6, background: 'rgba(28,26,23,0.06)', border: '1.5px solid #1C1A17' }}>
                  <input
                    autoFocus value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveRename(s.id); if (e.key === 'Escape') setEditingId(null) }}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, fontFamily: 'Vazirmatn', color: '#1C1A17' }}
                  />
                  <button onClick={() => saveRename(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7341' }}><Check size={14} /></button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <button
                    onClick={() => selectSession(s.id)}
                    style={{
                      flex: 1, textAlign: 'right', padding: '8px 10px', fontSize: 12, fontFamily: 'Vazirmatn',
                      background: sessionId === s.id ? 'rgba(181,70,46,0.12)' : 'transparent',
                      border: sessionId === s.id ? '1.5px solid #B5462E' : '1.5px solid transparent',
                      color: sessionId === s.id ? '#B5462E' : '#1C1A17',
                      cursor: 'pointer', fontWeight: sessionId === s.id ? 700 : 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      transform: `rotate(${idx % 2 === 0 ? '0.2deg' : '-0.2deg'})`,
                    }}
                  >
                    {s.title || 'گفتوگۆی بێ ناو'}
                  </button>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button onClick={e => handleRename(s.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7341', padding: 4 }}><Edit2 size={11} /></button>
                    <button onClick={e => handleDeleteSession(s.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B5462E', padding: 4 }}><Trash2 size={11} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Squiggle color="#6B7341" />

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '2px solid #1C1A17' }}>
          <button onClick={() => router.push('/')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#1C1A17', fontFamily: 'Vazirmatn', fontSize: 13, marginBottom: 2 }}>
            <Home size={15} /> سەرەکی
          </button>
          <button onClick={() => router.push('/settings')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#1C1A17', fontFamily: 'Vazirmatn', fontSize: 13, marginBottom: 2 }}>
            <SettingsIcon size={15} /> ڕێکخستن
          </button>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#B5462E', fontFamily: 'Vazirmatn', fontSize: 13, fontWeight: 700 }}>
            <LogOut size={15} /> چوونەدەرەوە
          </button>
        </div>
      </div>

      {/* ── MAIN CHAT ───────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        {/* Header */}
        <div style={{
          padding: '0 24px', height: 64, borderBottom: '3px solid #1C1A17',
          display: 'flex', alignItems: 'center', gap: 16,
          background: '#EDE0C5', position: 'relative', flexShrink: 0,
        }}>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1A17', padding: 4 }}
            >
              <Menu size={20} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Stamp label="شتی" rotate="-8deg" size={48} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#1C1A17', fontFamily: 'Vazirmatn' }}>گفتوگۆ</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6B7341', border: '1.5px solid #1C1A17', animation: 'blink 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 10, color: '#6B7341', fontWeight: 700, letterSpacing: '0.1em' }}>ئۆنلاین</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', padding: 40 }}>
              <HandFrame tilt="-1deg">
                <div style={{ padding: '32px 40px', background: '#EDE0C5', border: '3px solid #1C1A17', boxShadow: '-8px 8px 0 0 #1C1A17', position: 'relative' }}>
                  <Tape top="-10px" right="25%" rotate="-3deg" />
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                    <Stamp label="شتی" rotate="5deg" size={80} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1A17', marginBottom: 8, fontFamily: 'Vazirmatn' }}>
                    بەخێربێیت بۆ شتی
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B7341', fontWeight: 500, fontFamily: 'Vazirmatn' }}>
                    پرسیارەکەت لێرە بنووسە…
                  </p>
                  {/* Squiggle underline */}
                  <div style={{ marginTop: 8 }}>
                    <Squiggle color="#B5462E" />
                  </div>
                </div>
              </HandFrame>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: m.role === 'user' ? 'row' : 'row-reverse',
              alignItems: 'flex-start', gap: 12,
              maxWidth: '75%',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, flexShrink: 0,
                border: '2.5px solid #1C1A17',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Vazirmatn', fontWeight: 800, fontSize: 14,
                background: m.role === 'user' ? '#B5462E' : '#EDE0C5',
                color: m.role === 'user' ? '#F0E6D0' : '#1C1A17',
                transform: `rotate(${m.role === 'user' ? '1deg' : '-1deg'})`,
                boxShadow: m.role === 'user' ? '-3px 3px 0 0 #1C1A17' : '-3px 3px 0 0 #1C1A17',
              }}>
                {m.role === 'user' ? 'ب' : 'ش'}
              </div>

              {/* Bubble */}
              <div style={{
                padding: '12px 16px',
                background: m.role === 'user' ? '#F0E6D0' : '#EDE0C5',
                border: `2.5px solid ${m.role === 'user' ? '#B5462E' : '#1C1A17'}`,
                boxShadow: m.role === 'user'
                  ? '-5px 5px 0 0 #B5462E'
                  : '-5px 5px 0 0 #1C1A17',
                fontSize: 14, lineHeight: 1.7,
                fontFamily: 'Vazirmatn', color: '#1C1A17',
                transform: `rotate(${m.role === 'user' ? '0.5deg' : '-0.5deg'})`,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 12, maxWidth: '75%', alignSelf: 'flex-start' }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, border: '2.5px solid #1C1A17', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Vazirmatn', fontWeight: 800, fontSize: 14, background: '#EDE0C5', color: '#1C1A17', transform: 'rotate(-1deg)', boxShadow: '-3px 3px 0 0 #1C1A17' }}>ش</div>
              <div style={{ padding: '14px 20px', background: '#EDE0C5', border: '2.5px solid #1C1A17', boxShadow: '-5px 5px 0 0 #1C1A17', display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#6B7341', fontFamily: 'Vazirmatn', marginLeft: 4 }}>شتی لە وەڵامدانەدایە…</span>
                {[0, 1, 2].map(d => (
                  <div key={d} style={{ width: 8, height: 8, background: '#1C1A17', borderRadius: '50%' }} className={`dot-${d + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div style={{ padding: '0 32px 24px', position: 'relative', flexShrink: 0 }}>
          {/* Washi tape across top */}
          <div style={{
            position: 'absolute', top: -8, left: 60, right: 60, height: 16,
            background: 'rgba(212,165,58,0.45)',
            border: '1px solid rgba(212,165,58,0.7)',
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 12px)',
          }} />

          <div style={{ display: 'flex', gap: 0, border: '3px solid #1C1A17', boxShadow: '-6px 6px 0 0 #1C1A17', background: '#F0E6D0', marginTop: 16 }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="پەیامەکەت لێرە بنووسە…"
              rows={2}
              style={{
                flex: 1, padding: '14px 18px', background: 'transparent', border: 'none',
                fontFamily: 'Vazirmatn', fontSize: 14, color: '#1C1A17', lineHeight: 1.6,
                minHeight: 56, maxHeight: 160, resize: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="press-effect"
              style={{
                padding: '0 20px', background: loading || !input.trim() ? '#C8A882' : '#B5462E',
                border: 'none', borderRight: '3px solid #1C1A17',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                color: '#F0E6D0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <Send size={20} style={{ transform: 'scaleX(-1)' }} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '0 4px' }}>
            <p style={{ fontSize: 10, color: '#6B7341', fontFamily: 'Vazirmatn', fontWeight: 600 }}>
              شتی ژیری دەستکردە — لەوانەیە هەڵە بکات
            </p>
            <p style={{ fontSize: 10, color: '#6B7341', fontFamily: 'Vazirmatn' }}>
              {toArabicDigits(input.length)} پیت
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="سڕینەوەی گفتوگۆ"
        message="ئایا دڵنیایت لە سڕینەوەی ئەم گفتوگۆیە؟ هەموو پەیامەکان بە یەکجاری دەسڕدرێنەوە."
      />
    </div>
  )
}
