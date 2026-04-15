import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://passport-bsides-porto-production.up.railway.app/api';
const TEST_QR  = '9d0a3185-3e1d-48a5-97de-57c1e977b7c8';

const tokens = JSON.parse(open('./tokens.json'));

export const options = {
  scenarios: {
    peak: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 200 },
        { duration: '2m', target: 200 },
        { duration: '30s', target: 0 },
      ],
      tags: { scenario: 'peak' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed:   ['rate<0.05'],
  },
};

const params = {
  headers: { 'Content-Type': 'application/json' },
  responseCallback: http.expectedStatuses(200, 201, 409),
};

export default function () {
  const token = tokens[Math.floor(Math.random() * tokens.length)];

  // 1. Consultar passport
  const passportRes = http.get(
    `${BASE_URL}/stamps/passport?token=${token}`,
    { responseCallback: http.expectedStatuses(200) }
  );

  check(passportRes, {
    'passport: status 200': (r) => r.status === 200,
  });

  sleep(1);

  // 2. Scan QR code — 409 é esperado e válido
  const scanRes = http.post(
    `${BASE_URL}/stamps/scan`,
    JSON.stringify({ token, qrCode: TEST_QR }),
    params
  );

  check(scanRes, {
    'scan: status 201 ou 409': (r) => r.status === 201 || r.status === 409,
  });

  sleep(2);
}