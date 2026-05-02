/**
 * SHUTY AI - CONFIGURATION FILE
 * You can change the limits and features here.
 */

export const SHUTY_CONFIG = {
  // --- FREE PLAN SETTINGS ---
  FREE: {
    displayName: 'Shuty 1.5',
    price: '٠ دینار',
    maxMessagesPerDay: 30,           
    maxImagesPerDay: 5,              
    maxCharacters: 250,
    model: 'google/gemini-2.0-flash-001', 
    hasSearch: true,                
    hasImageGen: false,             
    supportLevel: 'community',
  },

  // --- PRO PLAN SETTINGS ---
  PRO: {
    displayName: 'Shuty 2.5',
    price: '٧,٥٠٠ دینار',
    maxMessagesPerDay: 150,         
    maxImagesPerDay: 50,             
    maxCharacters: 750,
    model: 'anthropic/claude-3.5-sonnet', 
    hasSearch: true,
    hasImageGen: true,
    supportLevel: 'priority',
  },

  // --- ULTRA PLAN SETTINGS ---
  ULTRA: {
    displayName: 'Shuty 3.0',
    price: '١٥,٠٠٠ دینار',
    maxMessagesPerDay: 450,         
    maxImagesPerDay: 150,             
    maxCharacters: 1500,
    model: 'anthropic/claude-3.5-sonnet', 
    hasSearch: true,
    hasImageGen: true,
    supportLevel: 'direct',
  },

  // --- GLOBAL SETTINGS ---
  dailyResetHour: 0,                
  
  // --- PAYMENT INSTRUCTIONS (Shown to users) ---
  paymentInstructions: {
    title: 'نوێکردنەوەی هەژمارەکەت',
    message: 'بۆ ئەوەی گەیشتنت هەبێت بە ئاستە بەرزەکانی Shuty، تکایە بڕی دیاریکراو بنێرە بۆ ئەم ژمارانەی خوارەوە و پاشان وێنەی وەسڵەکە لێرە لە چاتی پشتگیری بنێرە.',
    methods: [
      { name: 'FastPay', detail: '0750 XXX XX XX' },
      { name: 'ZainCash', detail: '0780 XXX XX XX' },
      { name: 'FIB', detail: '0770 XXX XX XX' }
    ],
    supportContact: 'چاتی ڕاستەوخۆ'
  }
};
