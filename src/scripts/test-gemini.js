const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello');
    console.log('SUCCESS:', result.response.text());
  } catch (err) {
    console.error('GEMINI TEST FAILED:', err.message);
  }
}

test();
