import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL = 'https://passport-bsides-porto-production.up.railway.app/api';
const EVENT_ID = '2fca67a3-8b74-465c-b3fb-966cf185e4ec';
const TEST_QR  = 'c4285fcd-ea28-4f9f-9113-4889538e64e3';

export const options = {
  scenarios: {
    baseline: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 50 },
        { duration: '1m', target: 0 },
      ],
      tags: { scenario: 'baseline' },
    },
    peak: {
      executor: 'ramping-vus',
      startTime: '8m',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 200 },
        { duration: '2m', target: 200 },
        { duration: '30s', target: 0 },
      ],
      tags: { scenario: 'peak' },
    },
    stress: {
      executor: 'ramping-vus',
      startTime: '12m',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 800 },
        { duration: '3m', target: 800 },
        { duration: '1m', target: 0 },
      ],
      tags: { scenario: 'stress' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'],  // 95% dos pedidos abaixo de 3s
    http_req_failed:   ['rate<0.05'],   // menos de 5% de erros
  },
};

export default function () {
  const email = `test_${randomString(10)}@bsidestest.com`;

  // 1. Registo
  const registerRes = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify({
      name: `Test User ${randomString(5)}`,
      email,
      company: 'BSides Test',
      rgpdConsent: true,
      eventId: EVENT_ID,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(registerRes, {
    'register: status 201': (r) => r.status === 201,
    'register: tem token':  (r) => JSON.parse(r.body).token !== undefined,
  });

  if (registerRes.status !== 201) return;

  const token = JSON.parse(registerRes.body).token;
  sleep(1);

  // 2. Consultar passport
  const passportRes = http.get(
    `${BASE_URL}/stamps/passport?token=${token}`
  );

  check(passportRes, {
    'passport: status 200': (r) => r.status === 200,
  });

  sleep(1);

  // 3. Scan QR code
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