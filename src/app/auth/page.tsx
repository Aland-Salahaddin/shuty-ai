"use client"

import { SignIn } from '@clerk/nextjs'

export default function AuthPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 20px', background: '#F0E6D0',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%', background: '#B5462E',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          border: '3px solid #1C1A17', color: '#F0E6D0', fontSize: 14, fontWeight: 900,
          boxShadow: '4px 4px 0 #1C1A17',
        }}>
          shuty
          .ai
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1C1A17', margin: 0, letterSpacing: '-1px', fontFamily: 'Vazirmatn' }}>
          بەخێربێیت بۆ shuty.ai
        </h1>
      </div>

      <SignIn 
        appearance={{
          elements: {
            rootBox: {
              width: '100%',
              maxWidth: '420px',
            },
            card: {
              backgroundColor: '#F0E6D0',
              border: '3.5px solid #1C1A17',
              boxShadow: '12px 12px 0 #1C1A17',
              borderRadius: '0',
              padding: '20px',
            },
            headerTitle: {
              color: '#1C1A17',
              fontFamily: 'Vazirmatn',
              fontWeight: '900',
            },
            headerSubtitle: {
              color: '#1C1A17',
              fontFamily: 'Vazirmatn',
              opacity: '0.7',
            },
            formButtonPrimary: {
              backgroundColor: '#B5462E',
              border: '3px solid #1C1A17',
              borderRadius: '0',
              boxShadow: '4px 4px 0 #1C1A17',
              fontSize: '16px',
              fontWeight: '900',
              fontFamily: 'Vazirmatn',
              '&:hover': {
                backgroundColor: '#9a3b27',
              },
              '&:active': {
                transform: 'translate(2px, 2px)',
                boxShadow: '2px 2px 0 #1C1A17',
              }
            },
            formFieldLabel: {
              color: '#1C1A17',
              fontFamily: 'Vazirmatn',
              fontWeight: '700',
            },
            formFieldInput: {
              backgroundColor: '#F0E6D0',
              border: '2.5px solid #1C1A17',
              borderRadius: '0',
              fontFamily: 'Vazirmatn',
              '&:focus': {
                border: '2.5px solid #B5462E',
                boxShadow: 'none',
              }
            },
            footerActionLink: {
              color: '#B5462E',
              fontWeight: '700',
              '&:hover': {
                color: '#9a3b27',
              }
            },
            identityPreviewText: {
              color: '#1C1A17',
            },
            identityPreviewEditButtonIcon: {
              color: '#B5462E',
            }
          }
        }}
        signUpUrl="/auth"
        forceRedirectUrl="/chat"
      />

      <a href="/" style={{
        marginTop: 30, color: '#1C1A17', textDecoration: 'none', fontSize: 13,
        fontWeight: 600, opacity: 0.6, fontFamily: 'Vazirmatn'
      }}>
        ← گەڕانەوە بۆ سەرەکی
      </a>
    </div>
  )
}
