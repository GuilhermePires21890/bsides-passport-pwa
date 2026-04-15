import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const res = http.get('https://passport-bsides-porto-production.up.railway.app/api/events/active');
  check(res, { 'status 200': (r) => r.status === 200 });
}