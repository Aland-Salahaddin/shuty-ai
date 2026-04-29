const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load keys from environment variable (comma separated string)
const keys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];

async function testKeys() {
  if (keys.length === 0) {
    console.log('No keys found in GEMINI_API_KEYS environment variable.');
    return;
  }

  for (let i = 0; i < keys.length; i++) {
    console.log(`Testing Key ${i+1}...`);
    try {
      const genAI = new GoogleGenerativeAI(keys[i].trim());
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Hi');
      console.log(`KEY ${i+1} SUCCESS!`);
    } catch (err) {
      console.log(`KEY ${i+1} FAILED: ${err.message}`);
    }
  }
}

testKeys();
