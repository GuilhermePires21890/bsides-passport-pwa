const https = require('https');
const fs = require('fs');

const BASE_URL = 'passport-bsides-porto-production.up.railway.app';
const EVENT_ID = '2fca67a3-8b74-465c-b3fb-966cf185e4ec';

function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function register(i) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      name: `Load Test User ${i}`,
      email: `load_${randomString(12)}@bsidestest.com`,
      company: 'Load Test',
      rgpdConsent: true,
      eventId: EVENT_ID,
    });

    const req = https.request({
      hostname: BASE_URL,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.token || null);
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(body);
    req.end();
  });
}

async function main() {
  const tokens = [];
  for (let i = 0; i < 800; i++) {
    const token = await register(i);
    if (token) tokens.push(token);
    if ((i + 1) % 10 === 0) console.log(`Registados: ${tokens.length}/${i + 1}`);
    await new Promise(r => setTimeout(r, 200)); // 200ms entre requests
  }
  fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));
  console.log(`\nTotal tokens guardados: ${tokens.length}`);
}

main();