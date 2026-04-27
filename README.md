# 🎫 Event Passport PWA

> Open-source sponsor engagement system for tech events.  
> Attendees scan QR codes at sponsor booths, collect digital stamps, and qualify for prizes — no app install required.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Stack: NestJS + React](https://img.shields.io/badge/stack-NestJS%20%2B%20React-red.svg)]()
[![Deploy: Railway](https://img.shields.io/badge/deploy-Railway-blueviolet.svg)]()

---

## ✨ Features

- 📱 **PWA** — works on any mobile browser, no app install
- 🔲 **QR stamp collection** — attendees scan at sponsor booths
- 🏆 **Leaderboard & prize qualification** — configurable stamp threshold
- 👤 **Frictionless registration** — name + email, no password for attendees
- 🔗 **Session resume** — personal link to recover passport anytime
- 🛡️ **Staff/admin panel** — manage sponsors, view dashboard, export CSV
- 🌍 **i18n ready** — PT / EN / ES included out of the box
- ⚙️ **Fully configurable** — event name, dates, stamps required, all via env vars

---

## 🏗️ Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + i18next |
| Backend | NestJS + Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (attendees via token, staff via email/password) |
| QR Scan | html5-qrcode (mobile browser native) |
| Deploy | Railway (or any Node.js host) |

---

## 📁 Structure

```
event-passport-pwa/
├── backend/                # NestJS API
│   ├── src/
│   │   ├── modules/        # auth, attendees, sponsors, stamps, events, admin
│   │   └── prisma/         # PrismaService + PrismaModule
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
├── frontend/               # React + Vite PWA
│   └── src/
│       ├── pages/          # Landing, Register, Passport, Scan, Qualified, Admin
│       ├── services/       # API client (axios)
│       └── locales/        # PT / EN / ES translations
├── infra/
│   └── docker-compose.yml  # Local PostgreSQL
└── qa-tests/               # HTTP smoke + functional + security tests
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)
- npm

### 1. Clone the repo

```bash
git clone https://github.com/your-org/event-passport-pwa.git
cd event-passport-pwa
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env with your event details (see Configuration below)
```

### 3. Start the database

```bash
cd infra
docker compose up -d
```

### 4. Start the backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. Create first staff account

```bash
# Via curl or Thunder Client / Insomnia
curl -X POST http://localhost:3000/api/auth/staff/register \
  -H "Content-Type: application/json" \
  -d '{"email": "staff@yourevent.com", "password": "your-password", "name": "Staff Name"}'
```

App will be available at `http://localhost:5173`

---

## ⚙️ Configuration

All event-specific config is controlled via environment variables in `backend/.env`.

| Variable | Description | Example |
|---|---|---|
| `EVENT_NAME` | Event display name | `"BSides Porto"` |
| `EVENT_EDITION` | Edition year | `"2026"` |
| `EVENT_CITY` | City name | `"Porto"` |
| `EVENT_DATE` | Event dates | `"Jun 26-27, 2026"` |
| `EVENT_VENUE` | Venue name | `"ISEP"` |
| `EVENT_URL` | Event website | `"https://bsidesporto.pt"` |
| `STAMPS_REQUIRED` | Stamps needed for prize | `5` |
| `MAX_STAMPS` | Max stamps per attendee | `10` |
| `JWT_SECRET` | Auth secret (keep secret!) | `openssl rand -hex 64` |
| `JWT_EXPIRES_IN` | Attendee token expiry | `"24h"` |
| `DATABASE_URL` | PostgreSQL connection string | see `.env.example` |
| `FRONTEND_URL` | Frontend URL for CORS | `"https://your-app.com"` |
| `PORT` | Backend port | `3000` |
| `RESEND_API_KEY` | Email recovery (optional) | `"re_..."` |

See `backend/.env.example` for the full reference with comments.

---

## 🎨 Branding Your Event

### 1. Update translations

Edit the three locale files with your event details:

```
frontend/src/locales/pt/translation.json
frontend/src/locales/en/translation.json
frontend/src/locales/es/translation.json
```

Key fields to update:

```json
{
  "app_name": "Your Event Passport",
  "landing": {
    "title": "Your Event 2026",
    "rgpd": "I agree that my data may be used by Your Event..."
  }
}
```

### 2. Update colours

Edit `frontend/tailwind.config.js` — look for the `brand` colour palette.

### 3. Update event metadata

Edit `frontend/index.html` — update `<title>` and `<meta>` tags.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register attendee |
| GET | `/api/auth/resume?token=` | — | Resume session by token |
| POST | `/api/auth/staff/login` | — | Staff login |
| GET | `/api/events/active` | — | Get active event |
| GET | `/api/stamps/passport?token=` | Attendee | Get passport state |
| POST | `/api/stamps/scan` | Attendee | Scan QR code |
| GET | `/api/sponsors?eventId=` | — | List sponsors |
| POST | `/api/sponsors` | Staff | Create sponsor |
| DELETE | `/api/sponsors/:id` | Staff | Delete sponsor |
| GET | `/api/admin/dashboard?eventId=` | Staff | Dashboard stats |
| GET | `/api/admin/qualified?eventId=` | Staff | Qualified attendees |
| GET | `/api/admin/export?eventId=` | Staff | Export CSV |

---

## 🚂 Deploy to Railway

1. Fork this repo
2. Create a new project on [Railway](https://railway.app)
3. Add a PostgreSQL service
4. Add your backend repo as a service — set Root Directory to `/backend`
5. Add your frontend repo as a service — set Root Directory to `/frontend`
6. Set all environment variables from `.env.example`
7. Run migrations: add start command `npx prisma migrate deploy && node dist/main`

---

## 🧪 QA Tests

HTTP test suites are included in `qa-tests/`:

```bash
# Requires REST Client extension (VS Code) or httpYac
qa-tests/QA1-smoke.http       # Basic connectivity
qa-tests/QA2-functional.http  # Full attendee flow
qa-tests/QA3-boundary.http    # Edge cases
qa-tests/QA4-security.http    # Auth & rate limiting
```

---

## 📋 Checklist for New Events

- [ ] Clone repo
- [ ] Update `backend/.env` with event details
- [ ] Update translations in `frontend/src/locales/`
- [ ] Update colours in `tailwind.config.js`
- [ ] Update `frontend/index.html` metadata
- [ ] Run `npx prisma migrate dev` locally
- [ ] Create staff account
- [ ] Add sponsors via admin panel
- [ ] Test full attendee flow (register → scan → qualify)
- [ ] Deploy to Railway (or your host of choice)
- [ ] Set production env vars
- [ ] Run `npx prisma migrate deploy` in production

---

## 🤝 Contributing

PRs welcome. Please open an issue first for major changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🙏 Based on BSides Porto 2026

This template was extracted from the production system built for [BSides Porto 2026](https://bsidesporto.org/) — a community security conference in Porto, Portugal.

Built by [Guilherme Pires](https://github.com/GuilhermePires21890) — Solution Architect at [Cross Intel](https://cross-intel.com)
