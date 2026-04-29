const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Hi');
    console.log('SUCCESS 2.5:', result.response.text());
  } catch (err) {
    console.error('GEMINI 2.5 FAILED:', err.message);
  }
}

test();
