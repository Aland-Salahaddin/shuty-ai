const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Hi');
    console.log('SUCCESS 2.0:', result.response.text());
  } catch (err) {
    console.error('GEMINI 2.0 FAILED:', err.message);
  }
}

test();
