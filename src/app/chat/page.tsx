'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Send, User, Bot, LogOut, Settings as SettingsIcon, Menu, X, Sparkles, Trash2, Edit2, Check, Home } from 'lucide-react'
import Background from '@/components/Background'
import Modal from '@/components/Modal'
import { toArabicIndic, newSessionId, cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Session {
  id: string
  title: string
  created_at: string
}

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
    } catch (err) {
      console.error('Failed to fetch sessions')
    }
  }

  const fetchMessages = async (sid: string) => {
    try {
      const res = await fetch(`/api/history?session_id=${sid}`)
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages.map((m: any) => ({ role: m.role, content: m.content })))
      } else {
        setMessages([])
      }
    } catch (err) {
      console.error('Failed to fetch messages')
    }
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

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Error' }))
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `❌ هەڵە: ${errData.details || errData.error || 'پەیوەندی پچڕا'}` 
        }])
        return
      }

      const data = await res.json()
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
      }
      fetchSessions()
    } catch (err) {
      console.error('Chat error', err)
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
    } catch (err) {
      console.error('Delete failed')
    }
  }

  const handleRename = async (sid: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const session = sessions.find(s => s.id === sid)
    if (session) {
      setEditingId(sid)
      setEditTitle(session.title)
    }
  }

  const saveRename = async (sid: string) => {
    try {
      await fetch('/api/history', {
        method: 'PATCH',
        body: JSON.stringify({ sessionId: sid, title: editTitle })
      })
      setEditingId(null)
      fetchSessions()
    } catch (err) {
      console.error('Rename failed')
    }
  }

  const startNewChat = () => {
    const sid = newSessionId()
    setSessionId(sid)
    setMessages([])
  }

  const selectSession = (sid: string) => {
    setSessionId(sid)
    fetchMessages(sid)
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ mode: 'logout' }) })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative h-screen flex overflow-hidden bg-background">
      <Background />

      {/* Sidebar */}
      <div className={cn(
        "relative z-20 flex flex-col glass border-l border-[oklch(0.30_0.04_250/0.4)] transition-all duration-300",
        sidebarOpen ? "w-80" : "w-0"
      )}>
        <div className="p-6 flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.25 240), oklch(0.78 0.22 235))' }}>
            <Sparkles size={16} className="text-[oklch(0.10_0.05_255)]" />
          </div>
          <span className="font-bold text-lg">shuty.ai</span>
        </div>

        <div className="px-4 mb-6 overflow-hidden">
          <button onClick={startNewChat} title="New Chat" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[oklch(0.78_0.22_235/0.3)] hover:bg-[oklch(0.78_0.22_235/0.1)] transition-all text-[oklch(0.78_0.22_235)] font-medium">
            <Plus size={18} />
            گفتوگۆی نوێ
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 overflow-x-hidden">
          <p className="text-[oklch(0.45_0.03_245)] text-xs font-mono-kd uppercase tracking-widest px-2 mb-2">گفتوگۆکان</p>
          {sessions.map((s) => (
            <div key={s.id} className="group relative">
              {editingId === s.id ? (
                <div className="flex items-center gap-1 p-1 bg-white/10 rounded-xl">
                  <input 
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename(s.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-xs px-2"
                  />
                  <button onClick={() => saveRename(s.id)} title="Save" className="p-1 hover:text-green-400"><Check size={14}/></button>
                </div>
              ) : (
                <button
                  onClick={() => selectSession(s.id)}
                  title={s.title || 'Chat'}
                  className={cn(
                    "w-full text-right p-3 rounded-xl text-sm transition-all truncate hover:bg-white/5 pr-4 pl-12",
                    sessionId === s.id ? "bg-white/10 text-white" : "text-[oklch(0.65_0.02_240)]"
                  )}
                >
                  {s.title || 'گفتوگۆی بێ ناو'}
                </button>
              )}
              {editingId !== s.id && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleRename(s.id, e)} title="Rename" className="p-1.5 hover:bg-white/10 rounded-md text-[oklch(0.65_0.02_240)]"><Edit2 size={14}/></button>
                  <button onClick={(e) => handleDeleteSession(s.id, e)} title="Delete" className="p-1.5 hover:bg-red-500/20 rounded-md text-red-400"><Trash2 size={14}/></button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[oklch(0.30_0.04_250/0.4)] overflow-hidden">
          <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-[oklch(0.65_0.02_240)] mb-1">
            <Home size={18} />
            <span>سەرەکی</span>
          </button>
          <button onClick={() => router.push('/settings')} className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-[oklch(0.65_0.02_240)] mb-1">
            <SettingsIcon size={18} />
            <span>ڕێکخستن</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400">
            <LogOut size={18} />
            <span>چوونەدەرەوە</span>
          </button>
        </div>
      </div>

      {/* Main Chat */}
      <div className="relative flex-1 flex flex-col min-w-0">
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} title="Open Sidebar" className="absolute top-6 right-6 z-30 p-2 glass rounded-lg hover:bg-white/10"><Menu size={20}/></button>
        )}

        <div className="h-20 border-b border-[oklch(0.30_0.04_250/0.4)] flex items-center justify-between px-8 bg-background/50 backdrop-blur-md relative z-10">
          <div className="flex flex-col">
             <h2 className="font-bold">گفتوگۆ</h2>
             <div className="flex items-center gap-2 mt-0.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-mono-kd text-[oklch(0.45_0.03_245)]">online</span>
             </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-[oklch(0.30_0.04_250/0.2)]">
                <Bot size={40} className="text-[oklch(0.78_0.22_235)]" />
              </div>
              <h3 className="text-xl font-bold">چۆن دەتوانم یارمەتیت بدەم؟</h3>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn("flex w-full max-w-4xl", m.role === 'user' ? "mr-auto flex-row-reverse" : "ml-auto")}>
              <div className={cn("w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center", m.role === 'user' ? "ml-4 bg-[oklch(0.78_0.22_235/0.2)]" : "mr-4 glass")}>
                {m.role === 'user' ? <User size={20} className="text-[oklch(0.78_0.22_235)]" /> : <Bot size={20} />}
              </div>
              <div className={cn("p-4 rounded-2xl text-sm leading-relaxed", m.role === 'user' ? "bg-[oklch(0.78_0.22_235)] text-[oklch(0.10_0.05_255)] font-medium" : "glass text-foreground")}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
             <div className="flex w-full max-w-4xl ml-auto">
               <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center glass mr-4"><Bot size={20} /></div>
               <div className="glass p-4 rounded-2xl flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.22_235)] animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.22_235)] animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.22_235)] animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
        </div>

        <div className="p-8 relative z-10">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="پرسیارەکەت لێرە بنووسە..."
              rows={1}
              className="w-full glass rounded-2xl py-4 pr-6 pl-16 outline-none focus:border-[oklch(0.78_0.22_235/0.5)] transition-all resize-none text-sm"
              style={{ minHeight: '56px', maxHeight: '200px' }}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} title="Send Message" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30" style={{ background: 'oklch(0.78 0.22 235)', color: 'oklch(0.10 0.05 255)' }}>
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-[10px] text-[oklch(0.45_0.03_245)] mt-3">
            شوتی ژیری دەستکردە و لەوانەیە هەڵە بکات
          </p>
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
