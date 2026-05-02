'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Send, MessageSquare, User, Clock, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Room {
  id: string
  user_id: string
  user_email: string
  user_name: string
  last_message: string
}

interface Message {
  id: string
  content: string
  is_admin: boolean
  created_at: string
}

export default function AdminSupportPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. Security Check
  useEffect(() => {
    if (isLoaded && (!user || user.primaryEmailAddress?.emailAddress !== 'alandkurd485@gmail.com')) {
      router.push('/chat')
    }
  }, [user, isLoaded])

  // 2. Fetch Rooms
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress === 'alandkurd485@gmail.com') {
      fetchRooms()
      
      // Realtime for new rooms
      const channel = supabase
        .channel('admin-rooms')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'support_rooms' }, () => {
          fetchRooms()
        })
        .subscribe()
        
      return () => { supabase.removeChannel(channel) }
    }
  }, [user])

  const fetchRooms = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('support_rooms')
      .select('*')
      .order('last_message', { ascending: false })
    if (data) setRooms(data)
  }

  // 3. Fetch Messages for Selected Room
  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id)

      const channel = supabase
        .channel(`admin-room-${selectedRoom.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `room_id=eq.${selectedRoom.id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }
  }, [selectedRoom])

  const fetchMessages = async (rid: string) => {
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('room_id', rid)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  // 4. Send Message
  const handleSend = async () => {
    if (!supabase || !input.trim() || !selectedRoom || !user) return
    const msgContent = input.trim()
    setInput('')

    const { error } = await supabase.from('support_messages').insert({
      room_id: selectedRoom.id,
      sender_id: user.id,
      content: msgContent,
      is_admin: true
    })

    if (!error) {
      await supabase.from('support_rooms').update({ last_message: new Date().toISOString() }).eq('id', selectedRoom.id)
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!isLoaded || user?.primaryEmailAddress?.emailAddress !== 'alandkurd485@gmail.com') {
    return <div style={{ background: '#F0E6D0', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Vazirmatn', fontWeight: 900 }}>Loading Admin Panel...</p>
    </div>
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F0E6D0', fontFamily: 'Vazirmatn' }}>
      
      {/* Sidebar: Rooms List */}
      <div style={{ width: 350, borderRight: '4px solid #1C1A17', display: 'flex', flexDirection: 'column', background: '#EDE0C5' }}>
        <div style={{ padding: 24, borderBottom: '3px solid #1C1A17', background: '#B5462E', color: '#F0E6D0' }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={24} /> Admin Support
          </h1>
          <p style={{ fontSize: 11, opacity: 0.8, marginTop: 4, fontWeight: 700 }}>Sales & Upgrades Dashboard</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              style={{
                width: '100%', padding: 16, marginBottom: 12, textAlign: 'left',
                background: selectedRoom?.id === room.id ? '#D4A53A' : '#F0E6D0',
                border: '3px solid #1C1A17',
                boxShadow: selectedRoom?.id === room.id ? '0 0 0 0 transparent' : '-4px 4px 0 0 #1C1A17',
                cursor: 'pointer',
                transition: 'all 0.1s',
                display: 'flex', flexDirection: 'column', gap: 4
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 14, color: '#1C1A17' }}>{room.user_name}</div>
              <div style={{ fontSize: 11, color: '#6B7341', fontWeight: 700 }}>{room.user_email}</div>
              <div style={{ fontSize: 9, color: '#B5462E', fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={10} /> Last active: {new Date(room.last_message).toLocaleTimeString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main: Chat View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedRoom ? (
          <>
            {/* Room Header */}
            <div style={{ padding: '20px 32px', borderBottom: '3px solid #1C1A17', background: '#F0E6D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>{selectedRoom.user_name}</h2>
                <p style={{ fontSize: 12, color: '#6B7341', fontWeight: 700 }}>{selectedRoom.user_email}</p>
              </div>
              <div style={{ background: '#EDE0C5', border: '2px solid #1C1A17', padding: '6px 12px', fontSize: 10, fontWeight: 800 }}>
                ID: {selectedRoom.user_id}
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 16, background: '#F0E6D0' }}>
              {messages.map((m) => (
                <div key={m.id} style={{
                  alignSelf: m.is_admin ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  display: 'flex', flexDirection: 'column', gap: 6
                }}>
                  <div style={{
                    padding: '14px 20px',
                    background: m.is_admin ? '#B5462E' : '#EDE0C5',
                    color: m.is_admin ? '#F0E6D0' : '#1C1A17',
                    border: '3px solid #1C1A17',
                    boxShadow: m.is_admin ? '-6px 6px 0 0 #1C1A17' : '-6px 6px 0 0 #D4A53A',
                    fontSize: 14, fontWeight: 700, lineHeight: 1.6
                  }}>
                    {m.content}
                  </div>
                  <div style={{ fontSize: 9, color: '#6B7341', fontWeight: 800, alignSelf: m.is_admin ? 'flex-end' : 'flex-start' }}>
                    {new Date(m.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div style={{ padding: 24, borderTop: '3px solid #1C1A17', background: '#EDE0C5', display: 'flex', gap: 16 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Reply to user..."
                style={{
                  flex: 1, padding: '16px 24px', background: '#F0E6D0',
                  border: '3.5px solid #1C1A17', outline: 'none',
                  fontFamily: 'Vazirmatn', fontWeight: 800, fontSize: 15,
                  boxShadow: 'inset 4px 4px 0 0 rgba(0,0,0,0.05)'
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  padding: '0 32px', background: '#B5462E', color: '#F0E6D0',
                  border: '3.5px solid #1C1A17', boxShadow: '-6px 6px 0 0 #1C1A17',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontWeight: 900
                }}
                className="press-effect"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
            <MessageSquare size={80} color="#6B7341" opacity={0.2} />
            <p style={{ color: '#6B7341', fontWeight: 800, fontSize: 18 }}>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
