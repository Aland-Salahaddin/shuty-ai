'use client'

import { X, AlertTriangle } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export default function Modal({ isOpen, onClose, onConfirm, title, message }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1C1A17]/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content - Shuty Style */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 420,
        background: '#F0E6D0',
        border: '4px solid #1C1A17',
        boxShadow: '-12px 12px 0 0 #1C1A17',
        padding: 32,
        direction: 'rtl',
        fontFamily: 'Vazirmatn'
      }} className="animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'none',
            border: '2px solid #1C1A17',
            padding: 4,
            cursor: 'pointer',
            color: '#1C1A17',
            boxShadow: '-2px 2px 0 0 #1C1A17'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center' }}>
          {/* Alert Icon */}
          <div style={{
            width: 64,
            height: 64,
            background: 'rgba(181, 70, 46, 0.1)',
            border: '2.5px dashed #B5462E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            transform: 'rotate(-3deg)'
          }}>
            <AlertTriangle size={32} color="#B5462E" />
          </div>
          
          <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1C1A17', marginBottom: 12 }}>{title}</h3>
          <p style={{ fontSize: 13, color: '#6B7341', fontWeight: 700, lineHeight: 1.6, marginBottom: 32 }}>
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={onConfirm}
            className="press-effect"
            style={{
              flex: 1,
              padding: '12px',
              background: '#B5462E',
              color: '#F0E6D0',
              border: '3px solid #1C1A17',
              boxShadow: '-4px 4px 0 0 #1C1A17',
              fontWeight: 900,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            سڕینەوە
          </button>
          <button
            onClick={onClose}
            className="press-effect"
            style={{
              flex: 1,
              padding: '12px',
              background: '#D4A53A',
              color: '#1C1A17',
              border: '3px solid #1C1A17',
              boxShadow: '-4px 4px 0 0 #1C1A17',
              fontWeight: 900,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            پاشگەزبوونەوە
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .press-effect:active {
          transform: translate(2px, 2px);
          box-shadow: 0 0 0 0 transparent !important;
        }
      `}</style>
    </div>
  )
}
