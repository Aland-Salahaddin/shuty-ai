const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'llama3-8b-8192',
    });
    console.log('SUCCESS:', chatCompletion.choices[0].message.content);
  } catch (err) {
    console.error('GROQ TEST FAILED:', err.message);
  }
}

test();
