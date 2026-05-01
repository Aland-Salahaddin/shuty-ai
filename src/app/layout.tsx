import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'shuty.ai — زیرەکی دەستکرد بە کوردی',
  description: 'پلاتفۆرمی زیرەکی دەستکردی کوردی — بە زمانی سۆرانی. تێگەیشتنی قووڵ، وەڵامی خێرا.',
  metadataBase: new URL('https://shuty.ai'),
}

const kurdishLocalization = {
  signIn: {
    start: {
      title: 'چوونەژوورەوە',
      subtitle: 'بەخێربێیت! تکایە زانیارییەکانت بنووسە بۆ بەردەوامبوون.',
      actionLink: 'تۆمارکردن',
      actionText: 'هەژمارت نییە؟',
      formFieldInputPlaceholder__password: 'وشەی نهێنی بنووسە',
      formFieldInputPlaceholder__emailAddress: 'ئیمەیڵەکەت بنووسە',
    },
    emailCode: {
      title: 'کۆدی پشتڕاستکردنەوە',
      subtitle: 'کۆدێک نێردراوە بۆ ئیمەیڵەکەت، تکایە لێرە بینوسە.',
      formTitle: 'کۆدی ئیمەیڵ',
      resendButton: 'دووبارە ناردنەوەی کۆد',
    },
    password: {
      title: 'وشەی نهێنی بنووسە',
      subtitle: 'تکایە وشەی نهێنی هەژمارەکەت بنووسە بۆ بەردەوامبوون.',
      actionLink: 'وشەی نهێنیت لەبیرچووە؟',
    }
  },
  signUp: {
    start: {
      title: 'دروستکردنی هەژمار',
      subtitle: 'بەخێربێیت! تکایە زانیارییەکانت بنووسە بۆ دەستپێکردن.',
      actionLink: 'چوونەژوورەوە',
      actionText: 'هەژمارت هەیە؟',
      formFieldInputPlaceholder__signUpPassword: 'وشەی نهێنی بنووسە',
      formFieldInputPlaceholder__password: 'وشەی نهێنی بنووسە',
      formFieldInputPlaceholder__emailAddress: 'ئیمەیڵەکەت بنووسە',
    }
  },
  socialButtonsBlockButton: 'بەردەوامبوون بە {{provider|titleize}}',
  dividerText: 'یان',
  formFieldLabel__emailAddress: 'ناونیشانی ئیمەیڵ',
  formFieldLabel__password: 'وشەی نهێنی',
  formFieldLabel__firstName: 'ناوی یەکەم',
  formFieldLabel__lastName: 'ناوی کۆتایی',
  formButtonPrimary: 'بەردەوام بە',
  formFieldInputPlaceholder__emailAddress: 'ئیمەیڵەکەت بنووسە',
  formFieldInputPlaceholder__password: 'وشەی نهێنی بنووسە',
  formFieldInputPlaceholder__signUpPassword: 'وشەی نهێنی بنووسە',
  unstable__errors: {
    passwordComplexity: {
      sentencePrefix: 'پێویستە وشەی نهێنییەکەت',
      minimumLength: '{{length}} پیت یان زیاتر بێت',
    },
    form_password_pwned: 'ئەم وشەی نهێنییە پێشتر لە دزەپێکردنی داتاکاندا دۆزراوەتەوە، تکایە دانەیەکی تر بەکاربهێنە بۆ پاراستنی هەژمارەکەت.',
    zxcvbn: {
      goodPassword: 'وشەی نهێنییەکەت هەموو مەرجە پێویستەکانی تێدایە',
    },
  },
  userProfile: {
    title: 'زانیارییەکانی پڕۆفایل',
    formTitle__profile: 'زانیارییەکانی پڕۆفایل',
    formTitle__emailAddresses: 'ناونیشانەکانی ئیمەیڵ',
    formTitle__username: 'ناوی بەکارهێنەر',
    formTitle__connectedAccounts: 'هەژمارە بەستراوەکان',
    navbar: {
      title: 'هەژمار',
      description: 'زانیارییەکانی هەژمارەکەت بەڕێوەببە.',
      account: 'پڕۆفایل',
      security: 'پاراستن',
    },
    start: {
      title: 'زانیارییەکانی پڕۆفایل',
      profileSection: {
        title: 'زانیارییەکانی پڕۆفایل',
        description: 'زانیارییە کەسییەکانت دەستکاریکە.',
        actionLabel: 'دەستکاریکردنی پڕۆفایل',
      },
      passwordSection: {
        title: 'وشەی نهێنی',
        description: 'وشەی نهێنییەکەت نوێ بکەرەوە.',
        actionLabel: 'گۆڕینی وشەی نهێنی',
      },
      emailAddressesSection: {
        title: 'ناونیشانەکانی ئیمەیڵ',
        description: 'ئیمەیڵەکانت لێرە بەڕێوەببە.',
        addEmailAddress: 'زیادکردنی ئیمەیڵ',
        primary: 'سەرەکی',
        actionLabel: 'زیادکردنی ئیمەیڵ',
      },
      connectedAccountsSection: {
        title: 'هەژمارە بەستراوەکان',
        description: 'هەژمارە بەستراوەکانت لێرە ببەستەوە.',
        actionLabel: 'بەستنەوەی هەژمار',
      },
      usernameSection: {
        title: 'ناوی بەکارهێنەر',
        description: 'ناوی بەکارهێنەرەکەت لێرە نوێ بکەرەوە.',
        actionLabel: 'دیاریکردنی ناوی بەکارهێنەر',
      },
      activeDevicesSection: {
        title: 'ئامێرە چالاکەکان',
        description: 'ئەو ئامێرانەی ئێستا تێیدا چوویتەتە ژوورەوە.',
      },
      dangerSection: {
        title: 'سڕینەوەی هەژمار',
        description: 'هەژمارەکەت بە یەکجاری بسڕەوە.',
        actionLabel: 'سڕینەوەی هەژمار',
      },
    },
    profilePage: {
      title: 'زانیارییەکانی پڕۆفایل',
      subtitle: 'زانیارییەکانی پڕۆفایلەکەت لێرە بەڕێوەببە.',
      sectionTitle__profile: 'زانیارییەکانی پڕۆفایل',
      actionLabel__profile: 'دەستکاریکردنی پڕۆفایل',
      sectionTitle__username: 'ناوی بەکارهێنەر',
      actionLabel__username: 'دیاریکردنی ناوی بەکارهێنەر',
      sectionTitle__emailAddresses: 'ناونیشانەکانی ئیمەیڵ',
      actionLabel__emailAddresses: 'زیادکردنی ئیمەیڵ',
      sectionTitle__connectedAccounts: 'هەژمارە بەستراوەکان',
      actionLabel__connectedAccounts: 'بەستنەوەی هەژمار',
      badge__primary: 'سەرەکی',
      profileSection: {
        title: 'زانیارییەکانی پڕۆفایل',
        actionLabel: 'دەستکاریکردنی پڕۆفایل',
      },
      emailAddressesSection: {
        title: 'ناونیشانەکانی ئیمەیڵ',
        addEmailAddress: 'زیادکردنی ئیمەیڵ',
        primary: 'سەرەکی',
        actionLabel: 'زیادکردنی ئیمەیڵ',
      },
      connectedAccountsSection: {
        title: 'هەژمارە بەستراوەکان',
        actionLabel: 'بەستنەوەی هەژمار',
      },
      usernameSection: {
        title: 'ناوی بەکارهێنەر',
        actionLabel: 'دیاریکردنی ناوی بەکارهێنەر',
      }
    },
    securityPage: {
      title: 'پاراستن',
      subtitle: 'زانیارییەکانی پاراستنی هەژمارەکەت بەڕێوەببە.',
      sectionTitle__password: 'وشەی نهێنی',
      actionLabel__password: 'گۆڕینی وشەی نهێنی',
      sectionTitle__mfa: 'پشتڕاستکردنەوەی دوو قۆناغی',
      actionLabel__mfa: 'چالاککردن',
      passwordSection: {
        title: 'وشەی نهێنی',
        actionLabel: 'گۆڕینی وشەی نهێنی',
        primaryButton: 'گۆڕینی وشەی نهێنی',
      },
      dangerSection: {
        title: 'سڕینەوەی هەژمار',
        actionLabel: 'سڕینەوەی هەژمار',
        primaryButton: 'سڕینەوەی هەژمار',
      },
      activeDevicesSection: {
        title: 'ئامێرە چالاکەکان',
        subtitle: 'ئەو ئامێرانەی ئێستا تێیدا چوویتەتە ژوورەوە.',
      }
    },
    passwordPage: {
      title: 'گۆڕینی وشەی نهێنی',
      subtitle: 'وشەی نهێنییەکی نوێ هەڵبژێرە.',
      actionLabel: 'گۆڕینی وشەی نهێنی',
      formButtonPrimary: 'گۆڕینی وشەی نهێنی',
    },
    dangerPage: {
      title: 'سڕینەوەی هەژمار',
      subtitle: 'هەژمارەکەت بە یەکجاری بسڕەوە.',
      actionLabel: 'سڕینەوەی هەژمار',
      formButtonPrimary: 'سڕینەوەی هەژمار',
    },
    emailAddressPage: {
      title: 'ناونیشانی ئیمەیڵ',
      subtitle: 'ئیمەیڵەکانت بەڕێوەببە.',
      primary: 'سەرەکی',
      addEmailAddress: 'زیادکردنی ئیمەیڵ',
      actionLabel: 'زیادکردنی ئیمەیڵ',
    },
    connectedAccountsPage: {
      title: 'هەژمارە بەستراوەکان',
      subtitle: 'هەژمارە بەستراوەکانت بەڕێوەببە.',
      actionLabel: 'بەستنەوەی هەژمار',
    },
    accountPage: {
      title: 'پڕۆفایل',
      subtitle: 'زانیارییەکانی پڕۆفایلەکەت بەڕێوەببە.',
      actionLabel: 'دەستکاریکردنی پڕۆفایل',
    }
  },
  userButton: {
    action__manageAccount: 'بەڕێوەبردنی هەژمار',
    action__signOut: 'چوونەدەرەوە',
  },
  formFieldLabel__username: 'ناوی بەکارهێنەر',
  formFieldLabel__firstName: 'ناوی یەکەم',
  formFieldLabel__lastName: 'ناوی کۆتایی',
  formFieldLabel__emailAddress: 'ناونیشانی ئیمەیڵ',
  formFieldInputPlaceholder__username: 'ناوی بەکارهێنەر بنووسە',
  formFieldInputPlaceholder__firstName: 'ناوی یەکەم',
  formFieldInputPlaceholder__lastName: 'ناوی کۆتایی',
  formFieldInputPlaceholder__emailAddress: 'ئیمەیڵەکەت بنووسە',
  formButtonPrimary: 'بەردەوام بە',
  formButtonSecondary: 'پاشگەزبوونەوە',
  form_password_pwned: 'ئەم وشەی نهێنییە پێشتر لە دزەپێکردنی داتاکاندا دۆزراوەتەوە، تکایە دانەیەکی تر بەکاربهێنە بۆ پاراستنی هەژمارەکەت.',
  action__updatePassword: 'گۆڕینی وشەی نهێنی',
  action__deleteAccount: 'سڕینەوەی هەژمار',
  forgotPassword: {
    title: 'گەڕانەوەی وشەی نهێنی',
    subtitle: 'ئیمەیڵەکەت بنووسە بۆ وەرگرتنی کۆدی گۆڕینی وشەی نهێنی.',
    actionText: 'وشەی نهێنیت لەبیرچووە؟',
  },
  useAnotherMethod: 'ڕێگەیەکی تر بەکاربهێنە',
  formFieldInputPlaceholder__password: 'وشەی نهێنی بنووسە',
  formFieldErrorMessage__password: 'تکایە وشەی نهێنی بنووسە',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="ckb" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body style={{ fontFamily: 'Vazirmatn, sans-serif', background: '#F0E6D0', margin: 0, padding: 0 }}>
        <ClerkProvider
          localization={kurdishLocalization}
          appearance={{
            layout: {
              socialButtonsVariant: 'blockButton',
              shimmer: true,
              hideBranding: true,
              unsafe_disableDevelopmentModeWarnings: true,
            },

            variables: {
              colorPrimary: '#B5462E',
              colorText: '#1C1A17',
              colorBackground: '#F0E6D0',
              colorInputBackground: '#EDE0C5',
              colorInputText: '#1C1A17',
              borderRadius: '0',
            },
            elements: {
              card: {
                border: '3px solid #1C1A17',
                boxShadow: '-8px 8px 0 0 #1C1A17',
                background: '#F0E6D0',
                overflow: 'hidden',
              },
              socialButtonsBlockButton: {
                border: '2px solid #1C1A17',
                boxShadow: '-3px 3px 0 0 #1C1A17',
                '&:hover': {
                  background: '#EDE0C5',
                }
              },
              formButtonPrimary: {
                border: '3px solid #1C1A17',
                boxShadow: '-4px 4px 0 0 #1C1A17',
                textTransform: 'none',
                fontWeight: '800',
                '&:hover': {
                  background: '#9e3d28',
                }
              },
              formFieldInput: {
                border: '2px solid #1C1A17',
                background: '#EDE0C5',
                '&:focus': {
                  border: '2px solid #B5462E',
                }
              },
              footer: {
                background: '#F0E6D0',
                borderTop: '2px solid #1C1A17',
                position: 'relative',
                '&::after': {
                  content: '"shuty.ai"',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '60px',
                  background: '#F0E6D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: '900',
                  color: '#B5462E',
                  letterSpacing: '2px',
                  zIndex: '20',
                }
              },
              userProfileFooter: {
                background: '#F0E6D0',
                borderTop: '2px solid #1C1A17',
                position: 'relative',
                '&::after': {
                  content: '"shuty.ai"',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '60px',
                  background: '#F0E6D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: '900',
                  color: '#B5462E',
                  letterSpacing: '2px',
                  zIndex: '20',
                }
              },
              userButtonPopoverFooter: {
                background: '#F0E6D0',
                borderTop: '2px solid #1C1A17',
                position: 'relative',
                minHeight: '60px',
                '&::after': {
                  content: '"shuty.ai"',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  top: '0',
                  background: '#F0E6D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '900',
                  color: '#B5462E',
                  zIndex: '20',
                }
              },
              userProfileNavbar: {
                position: 'relative',
                background: '#EDE0C5',
                '&::after': {
                  content: '"shuty.ai"',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '100px',
                  background: '#EDE0C5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: '900',
                  color: '#B5462E',
                  zIndex: '50',
                }
              },
              dividerLine: {
                background: '#1C1A17',
              },
              identityPreviewTextPrimary: {
                color: '#1C1A17',
              }
            }
          }}
        >
          {children}
        </ClerkProvider>
      </body>

    </html>
  )
}
