const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Try without explicit version if possible or check models
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Try pro as fallback
    const result = await model.generateContent('Hello');
    console.log('SUCCESS PRO:', result.response.text());
  } catch (err) {
    console.error('GEMINI PRO FAILED:', err.message);
  }
}

test();
