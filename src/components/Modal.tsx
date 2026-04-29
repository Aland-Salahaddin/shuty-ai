'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md glass border border-[oklch(0.30_0.04_250/0.4)] rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={20} className="text-[oklch(0.65_0.02_240)]" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 rounded-full border-2 border-red-500/50 flex items-center justify-center text-red-500 font-bold text-xl">!</div>
          </div>
          
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-[oklch(0.65_0.02_240)] text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex gap-3 mt-10">
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              color: 'white'
            }}
          >
            سڕینەوە
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-bold glass border border-white/10 hover:bg-white/5 transition-all active:scale-95 text-white"
          >
            پاشگەزبوونەوە
          </button>
        </div>
      </div>
    </div>
  )
}
