async function test() {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hi' }] }]
      })
    });
    const data = await res.json();
    console.log('CURL SUCCESS:', JSON.stringify(data));
  } catch (err) {
    console.error('CURL FAILED:', err.message);
  }
}

test();
