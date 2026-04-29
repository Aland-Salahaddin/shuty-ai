const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '../../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
const DB_ID = env.CLOUDFLARE_D1_DATABASE_ID;
const TOKEN = env.CLOUDFLARE_API_TOKEN;

const sql = `
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user','assistant')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

async function init() {
  console.log('Initializing D1 database...');
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params: [] }),
    }
  );
  const json = await res.json();
  if (json.success) {
    console.log('Database initialized successfully!');
  } else {
    console.error('Failed to initialize database:', JSON.stringify(json.errors));
  }
}

init();
