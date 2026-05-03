'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Send, X, MessageSquare, ShieldCheck, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react'

interface Message {
  id: string
  content: string
  is_admin: boolean
  created_at: string
}

export function SupportChat({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [roomId, setRoomId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. Get or Create Support Room
  useEffect(() => {
    if (!supabase || (user && isOpen)) {
      if (!supabase) return;
      
      const getRoom = async () => {
        if (!user?.id) return

        // Find existing room
        const { data: existing } = await supabase
          .from('support_rooms')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (existing) {
          setRoomId(existing.id)
          fetchMessages(existing.id)
        } else {
          // Create new room
          const { data: created } = await supabase
            .from('support_rooms')
            .insert({
              user_id: user.id,
              user_email: user.primaryEmailAddress?.emailAddress,
              user_name: user.fullName || 'Anonymous'
            })
            .select()
            .single()

          if (created) {
            setRoomId(created.id)
          }
        }
      }
      getRoom()
    }
  }, [user, isOpen])

  // 2. Fetch Messages
  const fetchMessages = async (rid: string) => {
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('room_id', rid)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
  }

  // 3. Realtime Subscription
  useEffect(() => {
    if (!roomId) return

    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  // 4. Send Message
  const handleSend = async (imgOverride?: string) => {
    const msgContent = input.trim().substring(0, 500)
    const imageToSend = selectedImage || imgOverride || null
    
    const metadata = user?.publicMetadata as any
    const timeoutUntil = metadata?.timeout_until ? new Date(metadata.timeout_until) : null
    const isTimedOut = timeoutUntil && timeoutUntil > new Date()

    if (!supabase || (!msgContent && !imageToSend) || !roomId || !user || isSending || isTimedOut) return

    setInput('')
    setSelectedImage(null)
    setIsSending(true)

    const { error } = await supabase.from('support_messages').insert({
      room_id: roomId,
      content: msgContent,
      image: imageToSend,
      is_admin: false
    })

    if (!error) {
      await supabase.from('support_rooms').update({ last_message: new Date().toISOString() }).eq('id', roomId)
      setTimeout(() => setIsSending(false), 2000)
    } else {
      console.error('Support Chat Error:', error)
      alert(`هەڵە لە ناردنی نامە: ${error.message}. ئەگەر وێنە دەنێریت، دڵنیا بەرەوە کە ستوونی 'image' لە Supabase زیاد کراوە.`)
      setInput(msgContent)
      setIsSending(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('قەبارەی وێنەکە نابێت لە ٢ مێگابایت زیاتر بێت.')
        return
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
            alert('قەبارەی وێنەکە نابێت لە ٢ مێگابایت زیاتر بێت.');
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
            alert('قەبارەی وێنەکە نابێت لە ٢ مێگابایت زیاتر بێت.');
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

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', 
      bottom: isMaximized ? 20 : 30, 
      right: isMaximized ? 20 : 30, 
      zIndex: 1000,
      width: isMaximized ? 'calc(100vw - 40px)' : 380, 
      height: isMaximized ? 'calc(100vh - 40px)' : 500, 
      maxWidth: isMaximized ? 1000 : 380,
      background: '#F0E6D0',
      border: '4px solid #1C1A17', 
      boxShadow: isMaximized ? '-16px 16px 0 0 #1C1A17' : '-12px 12px 0 0 #1C1A17',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px', background: '#B5462E', color: '#F0E6D0',
        borderBottom: '3px solid #1C1A17', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MessageSquare size={18} />
          <span style={{ fontFamily: 'Vazirmatn', fontWeight: 900, fontSize: 15 }}>چاتی ڕاستەوخۆ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => setIsMaximized(!isMaximized)} 
            style={{ background: 'none', border: 'none', color: '#F0E6D0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title={isMaximized ? "بچووککردنەوە" : "گەورەکردنەوە"}
          >
            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#F0E6D0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: isMaximized ? 32 : 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
            background: '#EDE0C5', border: '2px dashed #6B7341', padding: 12,
            fontSize: 11, color: '#6B7341', textAlign: 'center', fontWeight: 700, marginBottom: 8
        }}>
            پەیامێک بنووسە بۆ پەیوەندی کردن بە ئەدمین سەبارەت بە کڕینی پلانی پڕۆ.
        </div>

        {messages.map((m) => (
          <div key={m.id} style={{
            alignSelf: m.is_admin ? 'flex-start' : 'flex-end',
            maxWidth: isMaximized ? '70%' : '85%',
            display: 'flex', flexDirection: 'column', gap: 4
          }}>
             <div style={{
                padding: '10px 14px',
                background: m.is_admin ? '#D4A53A' : '#F0E6D0',
                color: '#1C1A17',
                border: '2px solid #1C1A17',
                boxShadow: m.is_admin ? '-4px 4px 0 0 #1C1A17' : '-4px 4px 0 0 #B5462E',
                fontSize: isMaximized ? 15 : 13, fontWeight: 600, fontFamily: 'Vazirmatn',
                lineHeight: 1.5
             }}>
                {(m as any).image && (
                  <div style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden', border: '2px solid #1C1A17', maxWidth: isMaximized ? 600 : 300 }}>
                    <img src={(m as any).image} alt="attachment" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}
                {m.content}
             </div>
             {m.is_admin && (
                <div style={{ fontSize: 9, color: '#B5462E', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>
                   <ShieldCheck size={10} /> ئەدمین
                </div>
             )}
          </div>
        ))}
      </div>

      {/* Preview */}
      {selectedImage && (
        <div style={{ padding: '8px 16px', background: '#EDE0C5', borderTop: '2px solid #1C1A17', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 4, overflow: 'hidden', border: '2px solid #1C1A17' }}>
            <img src={selectedImage} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#B5462E', flex: 1 }}>وێنە ئامادەیە بۆ ناردن</span>
          <button onClick={() => setSelectedImage(null)} style={{ background: '#B5462E', color: '#F0E6D0', border: '1.5px solid #1C1A17', padding: '2px 6px', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      {(() => {
        const metadata = user?.publicMetadata as any
        const tUntil = metadata?.timeout_until ? new Date(metadata.timeout_until) : null
        const timedOut = tUntil && tUntil > new Date()
        
        if (timedOut) {
          return (
            <div style={{ padding: 20, background: '#1C1A17', color: '#F0E6D0', textAlign: 'center', borderTop: '3px solid #1C1A17', fontFamily: 'Vazirmatn' }}>
              <ShieldCheck size={24} style={{ marginBottom: 8, color: '#B5462E', margin: '0 auto' }} />
              <div style={{ fontWeight: 900, fontSize: 14 }}>تۆ بۆ ماوەیەکی کاتی لە چاتی ڕاستەوخۆ بێبەش کراویت</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>کاتی کۆتایی هاتن: {tUntil?.toLocaleString('ku-IQ')}</div>
            </div>
          )
        }

        return (
          <div style={{ padding: 16, borderTop: '3px solid #1C1A17', background: '#EDE0C5', display: 'flex', gap: 8 }}>
            <input
              type="file"
              id="support-img"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="support-img"
              style={{
                width: 44, height: 44, background: '#FFFFFF', border: '2.5px solid #1C1A17',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: '-3px 3px 0 0 #1C1A17'
              }}
            >
              <ImageIcon size={20} color="#6B7341" />
            </label>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              onPaste={handlePaste}
              maxLength={500}
              placeholder="لێرە بنووسە..."
              style={{
                flex: 1, padding: '10px 14px', background: '#F0E6D0',
                border: '2.5px solid #1C1A17', outline: 'none',
                fontFamily: 'Vazirmatn', fontWeight: 700, fontSize: isMaximized ? 15 : 13
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isSending}
              style={{
                width: 44, height: 44, background: '#B5462E', color: '#F0E6D0',
                border: '2.5px solid #1C1A17', boxShadow: '-3px 3px 0 0 #1C1A17',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isSending ? 'not-allowed' : 'pointer',
                opacity: isSending ? 0.6 : 1
              }}
              className="press-effect"
            >
              <Send size={18} />
            </button>
          </div>
        )
      })()}
    </div>
  )
}
