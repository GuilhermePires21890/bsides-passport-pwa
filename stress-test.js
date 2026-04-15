import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://passport-bsides-porto-production.up.railway.app/api';
const EVENT_ID = '2fca67a3-8b74-465c-b3fb-966cf185e4ec';
const TEST_QR  = '9d0a3185-3e1d-48a5-97de-57c1e977b7c8';

function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const options = {
  scenarios: {
    baseline: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '3m', target: 50 },
        { duration: '1m', target: 0 },
      ],
      tags: { scenario: 'baseline' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed:   ['rate<0.05'],
  },
};

// setup: corre 1 vez antes do teste — regista 50 attendees
export function setup() {
  const tokens = [];
  for (let i = 0; i < 50; i++) {
    const email = `load_${randomString(12)}@bsidestest.com`;
    const res = http.post(
      `${BASE_URL}/auth/register`,
      JSON.stringify({
        name: `Load Test User ${i}`,
        email,
        company: 'Load Test',
        rgpdConsent: true,
        eventId: EVENT_ID,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (res.status === 201) {
      tokens.push(JSON.parse(res.body).token);
    }
    sleep(0.2);
  }
  console.log(`Tokens registados: ${tokens.length}`);
  return { tokens };
}

// default: simula comportamento real — consultar passport e scanar
export default function (data) {
  const tokens = data.tokens;
  if (!tokens || tokens.length === 0) return;

  // cada VU usa um token aleatório da pool
  const token = tokens[Math.floor(Math.random() * tokens.length)];

  // 1. Consultar passport
  const passportRes = http.get(
    `${BASE_URL}/stamps/passport?token=${token}`
  );

  check(passportRes, {
    'passport: status 200': (r) => r.status === 200,
  });

  sleep(1);

  // 2. Scan QR code
  const scanRes = http.post(
    `${BASE_URL}/stamps/scan`,
    JSON.stringify({ token, qrCode: TEST_QR }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(scanRes, {
    'scan: status 201 ou 409': (r) => r.status === 201 || r.status === 409,
  });

  sleep(2);
}

// teardown: limpa attendees de teste após o load test
export function teardown(data) {
  console.log('Load test concluído. Limpa os attendees via cleanup.js após o teste.');
}