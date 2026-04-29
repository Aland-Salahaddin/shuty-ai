async function list() {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('MODELS:', JSON.stringify(data));
  } catch (err) {
    console.error('LIST FAILED:', err.message);
  }
}

list();
