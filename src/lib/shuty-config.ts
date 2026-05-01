/**
 * SHUTY AI - CONFIGURATION FILE
 * You can change the limits and features here.
 */

export const SHUTY_CONFIG = {
  // --- FREE PLAN SETTINGS ---
  FREE: {
    maxMessagesPerDay: 10,           // Number of free messages per 24h
    model: 'google/gemini-2.0-flash-001', // Faster, cheaper model for free users
    hasSearch: true,                // Does free plan have web search?
    hasImageGen: false,             // Does free plan have image generation? (If added later)
    supportLevel: 'community',
  },

  // --- PRO PLAN SETTINGS ---
  PRO: {
    maxMessagesPerDay: 1000,         // Basically unlimited
    model: 'anthropic/claude-3.5-sonnet', // Premium high-reasoning model
    hasSearch: true,
    hasImageGen: true,
    supportLevel: 'priority',
  },

  // --- GLOBAL SETTINGS ---
  dailyResetHour: 0,                // Hour of the day (0-23) to reset message counts
  
  // --- PAYMENT INSTRUCTIONS (Shown to users) ---
  paymentInstructions: {
    title: 'بەدەستهێنانی پلانی Pro',
    message: 'بۆ ئەوەی هەژمارەکەت بکەیت بە Pro، تکایە بڕی ١٩$ (یان هاوتاکەی بە دینار) بنێرە بۆ ئەم ژمارەیەی خوارەوە و پاشان وێنەی وەسڵەکە و ئیمەیڵەکەت بنێرە بۆ پشتگیری.',
    methods: [
      { name: 'FastPay', detail: '0750 XXX XX XX' },
      { name: 'FIB', detail: '0770 XXX XX XX' }
    ],
    supportContact: '@shuty_support (Telegram)'
  }
};
