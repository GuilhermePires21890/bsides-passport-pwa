# Passport BSides Porto 2026

Digital sponsor engagement system for BSides Porto 2026.
Attendees scan QR codes at sponsor booths to collect stamps and qualify for prizes.

## Stack

- **Frontend**: React + Vite + Tailwind CSS + i18next (PT/EN/ES)
- **Backend**: NestJS + Prisma + PostgreSQL
- **Deploy**: Railway
- **QR Scan**: html5-qrcode (mobile browser, no app required)

## Structure

```
passport-bsides-porto/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── modules/  # auth, attendees, sponsors, stamps, events, admin
│   │   └── prisma/   # PrismaService + PrismaModule
│   └── prisma/       # schema.prisma
├── frontend/         # React + Vite PWA
│   └── src/
│       ├── pages/    # Landing, Register, Passport, Scan, Qualified, Admin
│       ├── services/ # API client (axios)
│       └── locales/  # PT / EN / ES translations
└── infra/
    └── docker-compose.yml  # Local PostgreSQL
```

## Getting Started

### 1. Start the database
```bash
cd infra
docker compose up -d
```

### 2. Start the backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Create first staff account
```bash
# Via Thunder Client or curl
POST http://localhost:3000/api/auth/staff/login
# First run: seed script coming soon
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register attendee |
| GET | /api/auth/resume?token= | Resume session |
| POST | /api/auth/staff/login | Staff login |
| GET | /api/events/active | Get active event |
| GET | /api/stamps/passport?token= | Get passport state |
| POST | /api/stamps/scan | Scan QR code |
| GET | /api/sponsors?eventId= | List sponsors |
| POST | /api/sponsors | Create sponsor (admin) |
| DELETE | /api/sponsors/:id | Delete sponsor (admin) |
| GET | /api/admin/dashboard?eventId= | Dashboard stats |
| GET | /api/admin/qualified?eventId= | Qualified attendees |
| GET | /api/admin/export?eventId= | Export CSV |

## Built by

Guilherme Pires — Solution Architect, Cross-Intel
