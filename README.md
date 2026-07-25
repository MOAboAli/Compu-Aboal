# Compu-Aboali

Full-stack bilingual (EN/AR) computer store + services platform:

- **Frontend**: React + Vite (website `/` + admin `/admin`)
- **Backend**: Node.js + Express (layered: context → repository → service → controller)
- **Database**: MongoDB
- **Runtime**: Docker Compose
- **Integrations**: Payment / SMS / Email are **simulated**

## Recent changes

- Implemented BRD init structure on branch `init-structure`
- Public website: shop, services requests, cart, simulated checkout/payment, account
- Admin console: users, catalog, orders, services, CMS, reports, audit, backups
- Backend domains with RBAC roles and seed data (`admin@compu-aboali.com` / `Admin123!`)
- Added docs under `docs/`

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

```bash
docker compose up --build
```

- App: http://localhost:3000
- API: http://localhost:5000/api/health

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
