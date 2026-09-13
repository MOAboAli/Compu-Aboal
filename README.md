# Compu-Aboali

Full-stack bilingual (EN/AR) computer store + services platform:

- **Frontend**: React + Vite (website `/` + admin `/admin`)
- **Backend**: Node.js + Express (layered: context → repository → service → controller)
- **Database**: MongoDB
- **Runtime**: Docker Compose
- **Integrations**: Payment / SMS / Email are **simulated**

## Recent changes

- Let customers register, sign in, and manage a My Account area
- Require an account for purchases and appointment bookings (guests can still browse)
- Support personal and company profiles, order receipts, and booking reschedule/cancel

## Branching strategy

```text
feature/*  --PR-->  develop  --PR-->  main
```

- Default branch: `develop`
- No direct pushes to `develop` or `main`

## Project structure

```text
Code/
├── frontend/src/
│   ├── website/     # public ecommerce + services
│   ├── admin/       # RBAC admin console
│   ├── app/         # router, auth, i18n
│   └── shared/      # API client
├── backend/src/
│   ├── context/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── controllers/
│   ├── routes/
│   ├── adapters/    # payment/sms/email simulators
│   └── middleware/
├── docs/
├── docker-compose.yml
└── .env.example
```

## Run with Docker

Uses **MongoDB Atlas** (no local Mongo container). Copy env and set your Atlas URI:

```bash
cp .env.example .env
# Edit .env → set MONGODB_URI to your Atlas connection string
docker compose up --build
```

In Atlas → **Network Access**, allow your current IP (or `0.0.0.0/0` while developing).

- App: http://localhost
- API: http://localhost:5000/api/health (loopback only)

## Run locally

### Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docs

- [API](docs/API.md)
- [Admin guide](docs/ADMIN_GUIDE.md)
- [User guide](docs/USER_GUIDE.md)
- [Backup](docs/BACKUP.md)
