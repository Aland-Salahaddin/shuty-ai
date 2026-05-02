'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Users, ShieldAlert, Clock, Star, Ban, Unlock, Trash2, Search, RefreshCcw } from 'lucide-react'

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'alandkurd485@gmail.com'

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push('/chat')
    } else if (isLoaded && isAdmin) {
      fetchUsers()
    }
  }, [isLoaded, isAdmin])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (targetUserId: string, action: string, value: any) => {
    setUpdating(targetUserId)
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        body: JSON.stringify({ targetUserId, action, value })
      })
      if (res.ok) fetchUsers()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  if (!isLoaded || loading) return (
    <div style={{ minHeight: '100vh', background: '#F0E6D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Vazirmatn' }}>
      <RefreshCcw className="animate-spin" size={48} />
    </div>
  )

  const filteredUsers = users.filter(u => 
    u.primaryEmailAddress?.emailAddress?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#F0E6D0', fontFamily: 'Vazirmatn', color: '#1C1A17', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 40, fontWeight: 900, textShadow: '3px 3px 0 #D4A53A' }}>کۆنترۆڵی ئەدمین</h1>
            <p style={{ fontWeight: 600, color: '#6B7341' }}>بەڕێوبەرایەتی بەکارهێنەران و پلانەکان</p>
          </div>
          <button onClick={fetchUsers} className="press-effect" style={{ 
            background: '#FFFFFF', border: '3px solid #1C1A17', padding: '12px 24px', fontWeight: 900, 
            boxShadow: '-4px 4px 0 0 #1C1A17', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 
          }}>
            <RefreshCcw size={20} /> نوێکردنەوە
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'کۆی بەکارهێنەران', val: users.length, icon: <Users />, color: '#FFFFFF' },
            { label: 'پلانی Ultra', val: users.filter(u => u.publicMetadata?.plan === 'ULTRA').length, icon: <Star />, color: '#B5462E', text: '#F0E6D0' },
            { label: 'پلانی Pro', val: users.filter(u => u.publicMetadata?.plan === 'PRO').length, icon: <Zap />, color: '#D4A53A' },
            { label: 'بلۆککراو', val: users.filter(u => u.publicMetadata?.is_banned).length, icon: <Ban />, color: '#1C1A17', text: '#F0E6D0' },
          ].map((s, i) => (
            <div key={i} style={{ 
              background: s.color, color: s.text || '#1C1A17', border: '3px solid #1C1A17', padding: 20, 
              boxShadow: '-6px 6px 0 0 #1C1A17', display: 'flex', alignItems: 'center', gap: 15 
            }}>
              <div style={{ opacity: 0.8 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900 }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div style={{ position: 'relative', marginBottom: 30 }}>
          <Search style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="گەڕان بەدوای ئیمەیڵ یان ناو..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', padding: '15px 50px 15px 15px', background: '#FFFFFF', border: '3px solid #1C1A17', 
              boxShadow: '-4px 4px 0 0 #1C1A17', fontFamily: 'Vazirmatn', fontWeight: 700, fontSize: 16
            }}
          />
        </div>

        {/* USER TABLE */}
        <div style={{ overflowX: 'auto', border: '3px solid #1C1A17', boxShadow: '-8px 8px 0 0 #1C1A17', background: '#FFFFFF' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead style={{ background: '#1C1A17', color: '#F0E6D0' }}>
              <tr>
                <th style={{ padding: 15 }}>بەکارهێنەر</th>
                <th style={{ padding: 15 }}>پلان</th>
                <th style={{ padding: 15 }}>بەسەرچوون</th>
                <th style={{ padding: 15 }}>بارودۆخ</th>
                <th style={{ padding: 15 }}>کردارەکان</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '2px solid #1C1A17', opacity: updating === u.id ? 0.5 : 1 }}>
                  <td style={{ padding: 15 }}>
                    <div style={{ fontWeight: 900 }}>{u.fullName || 'بێ ناو'}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{u.primaryEmailAddress?.emailAddress}</div>
                  </td>
                  <td style={{ padding: 15 }}>
                    <select 
                      value={u.publicMetadata?.plan || 'FREE'} 
                      onChange={(e) => handleUpdate(u.id, 'SET_PLAN', e.target.value)}
                      style={{ padding: '5px 10px', border: '2px solid #1C1A17', fontWeight: 800, background: '#F0E6D0' }}
                    >
                      <option value="FREE">FREE</option>
                      <option value="PRO">PRO</option>
                      <option value="ULTRA">ULTRA</option>
                    </select>
                  </td>
                  <td style={{ padding: 15, fontSize: 13, fontWeight: 700 }}>
                    {u.publicMetadata?.plan_expiry ? new Date(u.publicMetadata.plan_expiry).toLocaleDateString('ku-IQ') : '---'}
                  </td>
                  <td style={{ padding: 15 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {u.publicMetadata?.is_banned && <span style={{ background: '#B5462E', color: '#F0E6D0', padding: '2px 8px', fontSize: 10, fontWeight: 900 }}>BANNED</span>}
                      {u.publicMetadata?.timeout_until && new Date(u.publicMetadata.timeout_until) > new Date() && (
                        <span style={{ background: '#1C1A17', color: '#F0E6D0', padding: '2px 8px', fontSize: 10, fontWeight: 900 }}>TIMEOUT</span>
                      )}
                      {!u.publicMetadata?.is_banned && (!u.publicMetadata?.timeout_until || new Date(u.publicMetadata.timeout_until) <= new Date()) && (
                        <span style={{ background: '#6B7341', color: '#F0E6D0', padding: '2px 8px', fontSize: 10, fontWeight: 900 }}>ACTIVE</span>
                      )}
                    </div>
                  </td>
                   <td style={{ padding: 15 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      <button 
                        onClick={() => handleUpdate(u.id, 'BAN', !u.publicMetadata?.is_banned)}
                        style={{ 
                          background: u.publicMetadata?.is_banned ? '#6B7341' : '#B5462E', 
                          color: '#F0E6D0', border: '3px solid #1C1A17', padding: '8px 16px', 
                          fontWeight: 900, cursor: 'pointer', fontSize: 13,
                          boxShadow: '-3px 3px 0 0 #1C1A17'
                        }}
                      >
                        {u.publicMetadata?.is_banned ? 'UNLOCK' : 'BAN'}
                      </button>

                      <div style={{ display: 'flex', gap: 5 }}>
                        {['1H', '24H', '1W', 'NONE'].map((t) => (
                          <button
                            key={t}
                            onClick={() => handleUpdate(u.id, 'TIMEOUT', t)}
                            style={{
                              background: '#1C1A17', color: '#F0E6D0', border: '2px solid #1C1A17',
                              padding: '5px 10px', fontSize: 10, fontWeight: 900, cursor: 'pointer'
                            }}
                          >
                            {t === 'NONE' ? 'CLR' : t}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: 5 }}>
                        {['FREE', 'PRO', 'ULTRA'].map((p) => (
                          <button
                            key={p}
                            onClick={() => handleUpdate(u.id, 'SET_PLAN', p)}
                            style={{
                              background: u.publicMetadata?.plan === p ? '#D4A53A' : '#FFFFFF',
                              color: '#1C1A17', border: '2px solid #1C1A17',
                              padding: '5px 10px', fontSize: 10, fontWeight: 900, cursor: 'pointer'
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .press-effect:active { transform: translate(2px, 2px); box-shadow: 0 0 0 0 transparent !important; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function Zap(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  )
}
