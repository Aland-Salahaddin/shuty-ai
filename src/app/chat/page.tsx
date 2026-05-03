'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Send, LogOut, Settings as SettingsIcon, Trash2, Edit2, Check, Menu, X, Rocket, Image as ImageIcon, ShieldAlert, RefreshCcw, ChevronDown } from 'lucide-react'
import Modal from '@/components/Modal'
import { newSessionId } from '@/lib/utils'
import { useUser, useClerk, UserButton } from '@clerk/nextjs'
import { SupportChat } from '@/components/support-chat'
import { Suspense } from 'react'
import { SHUTY_CONFIG } from '@/lib/shuty-config'
import Link from 'next/link'


/* Improved markdown parser to handle code blocks, bold, and italic */
function renderMarkdown(text: string) {
  // First, handle code blocks (```)
  const codeBlockParts = text.split(/(```[\s\S]*?```)/g);
  
  return codeBlockParts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).trim();
      const langMatch = code.match(/^\w+/);
      const language = langMatch ? langMatch[0] : '';
      const codeContent = language ? code.slice(language.length).trim() : code;
      
      return (
        <div key={i} style={{ 
          margin: '12px 0', 
          background: '#1C1A17', 
          color: '#F0E6D0', 
          border: '2px solid #1C1A17',
          boxShadow: '-4px 4px 0 0 #D4A53A',
          fontFamily: 'monospace',
          fontSize: 12,
          position: 'relative',
          direction: 'ltr',
          textAlign: 'left'
        }}>
          <div style={{ background: '#333', padding: '4px 10px', fontSize: 10, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #444' }}>
            <span>{language || 'code'}</span>
            <span style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => navigator.clipboard.writeText(codeContent)}>کۆپی</span>
          </div>
          <pre style={{ padding: 12, margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            <code>{codeContent}</code>
          </pre>
        </div>
      );
    }

    // Then, handle bold and italic for the remaining text
    const inlineParts = part.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return inlineParts.map((inlinePart, j) => {
      if (inlinePart.startsWith('**') && inlinePart.endsWith('**')) {
        return <strong key={`${i}-${j}`} style={{ fontWeight: 900, color: '#B5462E' }}>{inlinePart.slice(2, -2)}</strong>;
      }
      if (inlinePart.startsWith('*') && inlinePart.endsWith('*')) {
        return <em key={`${i}-${j}`}>{inlinePart.slice(1, -1)}</em>;
      }
      return inlinePart;
    });
  });
}

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

function Stamp({ label = 'شوتی', rotate = '-10deg', size = 72 }) {
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
interface Message { role: 'user' | 'assistant'; content: string; image?: string }
interface Session { id: string; title: string; created_at: string }

/* ── Main Component ─────────────────────────────────────── */
function ChatContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sessionId, setSessionId] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentSessionIdRef = useRef('') // NEW: Track the LATEST session ID
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const clerk = useClerk()
  const searchParams = useSearchParams()
  
  const metadata = user?.publicMetadata as any
  const isBanned = metadata?.is_banned
  const timeoutUntil = metadata?.timeout_until ? new Date(metadata.timeout_until) : null
  const isTimedOut = timeoutUntil && timeoutUntil > new Date()
  const currentPlan = metadata?.plan || 'FREE'

  if (isLoaded && isBanned) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', background: '#1C1A17', color: '#B5462E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Vazirmatn', padding: 20, textAlign: 'center' }}>
        <ShieldAlert size={80} style={{ marginBottom: 20 }} />
        <h1 style={{ fontSize: 40, fontWeight: 900 }}>هەژمارەکەت بلۆک کراوە</h1>
        <p style={{ fontSize: 18, fontWeight: 700, maxWidth: 500, marginTop: 10, color: '#F0E6D0' }}>بەهۆی سەرپێچی کردنی یاساکان، گەیشتنت بەم خزمەتگوزارییە نییە. ئەگەر پێتوایە هەڵەیەک ڕوویداوە پەیوەندیمان پێوە بکە.</p>
        <button onClick={() => clerk.signOut()} style={{ marginTop: 30, background: '#B5462E', color: '#F0E6D0', border: 'none', padding: '12px 30px', fontWeight: 900, cursor: 'pointer', boxShadow: '4px 4px 0 #F0E6D0' }}>چوونە دەرەوە</button>
      </div>
    )
  }


  useEffect(() => {
    if (user) {
      const sid = newSessionId()
      setSessionId(sid)
      currentSessionIdRef.current = sid
      fetchSessions()
    }
  }, [user])

  useEffect(() => {
    currentSessionIdRef.current = sessionId
  }, [sessionId])

  // Handle query params (like openSupport)
  useEffect(() => {
    if (isLoaded && searchParams.get('openSupport') === 'true') {
      setIsSupportOpen(true);
    }
  }, [isLoaded, searchParams]);

  // Scroll to bottom on messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/history?type=sessions')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load sessions");
      if (data.sessions) setSessions(data.sessions)
    } catch {}
  }

  const fetchMessages = async (sid: string) => {
    setLoading(true)
    setMessages([])
    try {
      const res = await fetch(`/api/history?session_id=${sid}`)
      if (!res.ok) throw new Error(`History API failed: ${res.status}`)
      const data = await res.json()
      console.log("History Load Success:", data)
      
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages.map((m: any) => ({ 
          role: m.role, 
          content: m.content,
          image: m.image 
        })))
      } else {
        setMessages([])
      }
    } catch (err) {
      console.error("Fetch Messages Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('قەبارەی وێنە نابێت لە ٢ مێگابایت زیاتر بێت');
        return;
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files = e.clipboardData.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          if (files[i].size > 2 * 1024 * 1024) {
            alert('قەبارەی وێنە نابێت لە ٢ مێگابایت زیاتر بێت');
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result as string);
          reader.readAsDataURL(files[i]);
          return;
        }
      }
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            alert('قەبارەی وێنە نابێت لە ٢ مێگابایت زیاتر بێت');
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result as string);
          reader.readAsDataURL(file);
          return;
        }
      }
    }
  }

  const handleSend = async (retryContent?: string, retryImage?: string) => {
    const sendingSessionId = sessionId // Capture the session ID when the request starts
    const contentToSend = retryContent !== undefined ? retryContent : input
    const imageToSend = retryImage !== undefined ? retryImage : selectedImage

    const safeInput = String(contentToSend || '')
    if ((!safeInput.trim() && !imageToSend) || loading) return
    
    const userMsg: Message = { role: 'user', content: safeInput, image: imageToSend || undefined }
    
    if (retryContent === undefined) {
      setMessages(prev => [...prev, userMsg])
      setInput('')
      setSelectedImage(null)
    }

    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], sessionId: sendingSessionId }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat API Error Detailed:", errorData);
        
        const errorMsg = errorData.message || errorData.error || "کێشەیەک لە پەیوەندی دروست بوو. تکایە دڵنیا بەرەوە کلیلەکانی API و داتابەیس جێگیر کراون.";
        
        // Only update UI if we are still in the same session
        if (currentSessionIdRef.current === sendingSessionId) {
          const errorBubble: Message = {
            role: 'assistant',
            content: `❌ **هەڵە:** ${errorMsg}`,
          };
          setMessages(prev => [...prev, errorBubble]);
        }
        return;
      }
      
      const data = await response.json();
      
      // ONLY update UI if we are still in the SAME session as when we started
      if (currentSessionIdRef.current === sendingSessionId) {
        if (data.text) setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
      }
      fetchSessions()
    } catch (err: any) {
      const errMsg = err.message || 'ببوورە، کێشەیەک لە پەیوەندی دروست بوو.';
      if (currentSessionIdRef.current === sendingSessionId) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `❌ **هەڵە:** ${errMsg}\n\nتکایە دووبارە هەوڵ بدەرەوە یان پەیوەندیمان پێوە بکە.` 
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  const retryLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    if (lastUserMsg) {
      handleSend(lastUserMsg.content, lastUserMsg.image)
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

  const startNewChat = () => {
    const sid = newSessionId()
    setSessionId(sid)
    currentSessionIdRef.current = sid
    setMessages([])
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  const selectSession = (sid: string) => { 
    if (sid === sessionId) return
    setSessionId(sid)
    currentSessionIdRef.current = sid
    fetchMessages(sid) 
    if (window.innerWidth < 768) setSidebarOpen(false)
  }
  const handleLogout = async () => {
    await clerk.signOut({ redirectUrl: '/' })
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
        overflow: sidebarOpen ? 'visible' : 'hidden',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        position: 'relative', zIndex: 50,
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

        {/* Profile & Support Section */}
        <div style={{ padding: '16px', borderTop: '3px solid #1C1A17', background: '#EDE0C5' }}>
          
          {/* LIVE CHAT BUTTON */}
          <button 
            onClick={() => setIsSupportOpen(true)}
            className="press-effect"
            style={{
              width: '100%',
              padding: '12px',
              background: '#B5462E',
              color: '#F0E6D0',
              border: '3px solid #1C1A17',
              boxShadow: '-4px 4px 0 0 #1C1A17',
              marginBottom: 16,
              cursor: 'pointer',
              fontFamily: 'Vazirmatn',
              fontWeight: 900,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <div className="live-pulse" style={{ width: 8, height: 8, background: '#F0E6D0', borderRadius: '50%' }} />
            کڕینی پڕۆ (چاتی ڕاستەوخۆ)
          </button>

          {/* PRICING LINK */}
          <Link 
            href="/pricing"
            className="press-effect"
            style={{
              width: '100%',
              padding: '10px',
              background: '#D4A53A',
              color: '#1C1A17',
              border: '2.5px solid #1C1A17',
              boxShadow: '-3px 3px 0 0 #1C1A17',
              marginBottom: 12,
              cursor: 'pointer',
              fontFamily: 'Vazirmatn',
              fontWeight: 800,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              textDecoration: 'none'
            }}
          >
            <Rocket size={16} />
            پلانەکان و نرخەکان
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px' }}>
            <div 
              onClick={() => clerk.openUserProfile()}
              style={{
                width: 36, height: 36, borderRadius: '50%', border: '2.5px solid #1C1A17',
                overflow: 'hidden', background: '#D4A53A', flexShrink: 0, cursor: 'pointer'
            }}>
              {user?.imageUrl ? <img src={user.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
            </div>
            <div 
              style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} 
              onClick={() => clerk.openUserProfile()}
              title="ڕێکخستنی هەژمار"
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1C1A17', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName || 'بەکارهێنەر'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 10, color: '#6B7341', fontWeight: 600 }}>
                  بەکارهێنەری {currentPlan === 'ULTRA' ? 'Ultra' : (currentPlan === 'PRO' ? 'Pro' : 'خۆڕایی')}
                </div>
                <div style={{ fontSize: 9, color: '#6B7341', opacity: 0.8, marginTop: 2 }}>
                  {toArabicDigits((user?.publicMetadata?.usage as any)?.tokens || 0)} / {toArabicDigits(((SHUTY_CONFIG as any)[currentPlan]).maxTokensPerDay.toLocaleString())} خاڵ
                </div>
                {user?.primaryEmailAddress?.emailAddress === 'alandkurd485@gmail.com' && (
                  <Link href="/admin/dashboard" onClick={(e) => e.stopPropagation()} style={{ 
                    fontSize: 10, color: '#B5462E', fontWeight: 900, textDecoration: 'none',
                    background: '#F0E6D0', padding: '1px 4px', border: '1px solid #1C1A17',
                    boxShadow: '-1px 1px 0 #1C1A17'
                  }}>
                    ADMIN
                  </Link>
                )}
              </div>
            </div>
            
            {/* LOGOUT BUTTON */}
            <button 
              onClick={() => clerk.signOut({ redirectUrl: '/' })}
              style={{
                background: 'none',
                border: '2px solid #1C1A17',
                padding: '6px',
                cursor: 'pointer',
                color: '#B5462E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '-2px 2px 0 0 #1C1A17'
              }}
              title="چوونە دەرەوە"
            >
              <LogOut size={16} />
            </button>
          </div>
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
            <Stamp label="شوتی" rotate="-8deg" size={48} />
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
                    <Stamp label="شوتی" rotate="5deg" size={80} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1A17', marginBottom: 8, fontFamily: 'Vazirmatn' }}>
                    بەخێربێیت بۆ شوتی
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

          {messages.map((m, i) => {
            const isUser = String(m.role).toLowerCase() === 'user'
            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start', gap: 12,
                maxWidth: '75%',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  border: '2.5px solid #1C1A17',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Vazirmatn', fontWeight: 800, fontSize: 14,
                  background: isUser ? '#B5462E' : '#EDE0C5',
                  color: isUser ? '#F0E6D0' : '#1C1A17',
                  transform: `rotate(${isUser ? '1deg' : '-1deg'})`,
                  boxShadow: isUser ? '-3px 3px 0 0 #1C1A17' : '-3px 3px 0 0 #1C1A17',
                }}>
                  {isUser ? 'ب' : 'ش'}
                </div>

                {/* Bubble */}
                <div style={{
                  padding: '14px 20px', 
                  background: m.content.includes('❌ **هەڵە:**') ? 'rgba(181,70,46,0.1)' : (isUser ? '#F0E6D0' : '#EDE0C5'), 
                  border: `2.5px solid ${isUser ? '#B5462E' : '#1C1A17'}`, 
                  boxShadow: '-5px 5px 0 0 #1C1A17',
                  fontSize: 14, lineHeight: 1.6, color: '#1C1A17',
                  fontFamily: 'Vazirmatn',
                  transform: `rotate(${isUser ? '0.5deg' : '-0.5deg'})`,
                }}>
                  <div style={{ marginBottom: m.content.includes('❌ **هەڵە:**') ? 12 : 0 }}>
                  {m.image && (
                    <img 
                      src={m.image} 
                      alt="attachment" 
                      style={{ 
                        maxWidth: 300, display: 'block', borderRadius: 6, marginBottom: 10, 
                        border: '2px solid #1C1A17', boxShadow: '-3px 3px 0 0 #1C1A17'
                      }} 
                    />
                  )}
                  {m.content.split('\n').map((line, li) => (
                    <p key={li} style={{ margin: li === 0 ? 0 : '4px 0 0' }}>{renderMarkdown(line)}</p>
                  ))}
                </div>
                {m.content.includes('❌ **هەڵە:**') && (
                  <button 
                    onClick={retryLastMessage}
                    style={{
                      background: '#1C1A17', color: '#F0E6D0', border: 'none', padding: '6px 12px',
                      fontSize: 11, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <RefreshCcw size={12} /> دووبارە هەوڵ بدەرەوە
                  </button>
                )}
                </div>
              </div>
            )
          })}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 12, maxWidth: '75%', alignSelf: 'flex-start' }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, border: '2.5px solid #1C1A17', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Vazirmatn', fontWeight: 800, fontSize: 14, background: '#EDE0C5', color: '#1C1A17', transform: 'rotate(-1deg)', boxShadow: '-3px 3px 0 0 #1C1A17' }}>ش</div>
              <div style={{ padding: '14px 20px', background: '#EDE0C5', border: '2.5px solid #1C1A17', boxShadow: '-5px 5px 0 0 #1C1A17', display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#6B7341', fontFamily: 'Vazirmatn', marginLeft: 4 }}>شوتی خەریکی بیرکردنەوەیە…</span>
                {[0, 1, 2].map(d => (
                  <div key={d} style={{ width: 6, height: 6, background: '#1C1A17', borderRadius: '50%', animation: 'dot-pulse 1.5s infinite ease-in-out', animationDelay: `${d * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Scroll to bottom floating button */}
        {messages.length > 5 && (
          <button 
            onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              position: 'absolute', bottom: 120, left: 30, background: '#D4A53A', border: '2.5px solid #1C1A17',
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '-4px 4px 0 0 #1C1A17', cursor: 'pointer', zIndex: 10
            }}
          >
            <ChevronDown size={20} />
          </button>
        )}

        {/* Composer */}
        <div style={{ padding: '0 32px 24px', position: 'relative', flexShrink: 0 }}>
          {/* Washi tape across top */}
          <div style={{
            position: 'absolute', top: -8, left: 60, right: 60, height: 16,
            background: 'rgba(212,165,58,0.45)',
            border: '1px solid rgba(212,165,58,0.7)',
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 12px)',
          }} />

          <div style={{ display: 'flex', gap: 0, border: '3px solid #1C1A17', boxShadow: '-6px 6px 0 0 #1C1A17', background: '#F0E6D0', marginTop: 16, flexDirection: 'column' }}>
            {selectedImage && (
              <div style={{ padding: 12, borderBottom: '3px solid #1C1A17', position: 'relative', background: '#EDE0C5' }}>
                <img src={selectedImage} alt="preview" style={{ maxHeight: 120, borderRadius: 8, border: '2px solid #1C1A17' }} />
                <button 
                  onClick={() => setSelectedImage(null)}
                  style={{ position: 'absolute', top: 20, left: 20, background: '#B5462E', color: '#F0E6D0', border: '2px solid #1C1A17', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div style={{ display: 'flex' }}>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                style={{ display: 'none' }} 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isTimedOut}
                className="press-effect"
                style={{
                  padding: '0 16px', background: 'transparent', border: 'none', borderLeft: '3px solid #1C1A17',
                  cursor: isTimedOut ? 'not-allowed' : 'pointer', color: '#1C1A17',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <ImageIcon size={20} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                onPaste={handlePaste}
                placeholder={isTimedOut ? "ناتوانیت نامە بنێریت تا کاتەکەت تەواو دەبێت..." : "پەیامەکەت لێرە بنووسە…"}
                rows={2}
                disabled={isTimedOut}
                maxLength={currentPlan === 'ULTRA' ? SHUTY_CONFIG.ULTRA.maxCharacters : (currentPlan === 'PRO' ? SHUTY_CONFIG.PRO.maxCharacters : SHUTY_CONFIG.FREE.maxCharacters)}
                style={{
                  flex: 1, padding: '14px 18px', background: 'transparent', border: 'none',
                  fontFamily: 'Vazirmatn', fontSize: 14, color: '#1C1A17', lineHeight: 1.6,
                  minHeight: 56, maxHeight: 160, resize: 'none',
                  opacity: isTimedOut ? 0.5 : 1
                }}
              />
              <div style={{ 
                position: 'absolute', bottom: -20, left: 0, fontSize: 10, fontWeight: 800, 
                color: input.length >= ((SHUTY_CONFIG as any)[currentPlan]?.maxCharacters || 250) ? '#B5462E' : '#6B7341' 
              }}>
                {toArabicDigits(input.length)} / {toArabicDigits((SHUTY_CONFIG as any)[currentPlan]?.maxCharacters || 250)} پیت
              </div>
              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && !selectedImage) || isTimedOut}
                className="press-effect"
                style={{
                  padding: '0 20px', background: loading || (!input.trim() && !selectedImage) || isTimedOut ? '#C8A882' : '#B5462E',
                  border: 'none', borderRight: '3px solid #1C1A17',
                  cursor: loading || (!input.trim() && !selectedImage) || isTimedOut ? 'not-allowed' : 'pointer',
                  color: '#F0E6D0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                  flexShrink: 0,
                }}
              >
                <Send size={20} style={{ transform: 'scaleX(-1)' }} />
              </button>
            </div>
          </div>
          <style>{`
            .press-effect:active {
              transform: translate(2px, 2px);
              box-shadow: 0 0 0 0 transparent !important;
            }
            @keyframes pulse-glow {
              0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(240, 230, 208, 0.7); }
              70% { transform: scale(1.2); opacity: 0.8; box-shadow: 0 0 0 10px rgba(240, 230, 208, 0); }
              100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(240, 230, 208, 0); }
            }
            .live-pulse {
              animation: pulse-glow 2s infinite;
            }
            @keyframes dot-pulse {
              0%, 100% { transform: scale(0.5); opacity: 0.3; }
              50% { transform: scale(1); opacity: 1; }
            }
          `}</style>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '0 4px' }}>
            <p style={{ fontSize: 10, color: '#6B7341', fontFamily: 'Vazirmatn', fontWeight: 600 }}>
              {isTimedOut ? `تۆ بێدەنگ کراویت تا: ${timeoutUntil?.toLocaleString('ku-IQ')}` : 'شوتی ژیری دەستکردە — لەوانەیە هەڵە بکات'}
            </p>
            <p style={{ fontSize: 10, color: '#6B7341', fontFamily: 'Vazirmatn', fontWeight: 800 }}>
              {toArabicDigits(input.length)} / {toArabicDigits(currentPlan === 'ULTRA' ? SHUTY_CONFIG.ULTRA.maxCharacters : (currentPlan === 'PRO' ? SHUTY_CONFIG.PRO.maxCharacters : SHUTY_CONFIG.FREE.maxCharacters))} پیت
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

      {/* SUPPORT CHAT MODAL */}
      <SupportChat isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#F0E6D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCcw className="animate-spin" size={48} />
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
