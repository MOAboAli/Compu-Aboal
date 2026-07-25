# Compu-Aboali

Full-stack computer store inventory app:

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Runtime**: Docker Compose

## Recent changes

- Restructured the backend into layered architecture: **context → repository → service → controller**
- Added composition root (`container.js`) and Express app factory (`app.js`)
- Added project Cursor skill `.cursor/skills/push` for README update + commit + push workflow
- Kept product API routes compatible (`/api/products`, `/api/health`)

## Project structure

```text
Code/
├── frontend/          # React app
├── backend/
│   └── src/
│       ├── context/        # DB context
│       ├── models/         # Mongoose schemas
│       ├── repositories/   # Data access
│       ├── services/       # Business logic
│       ├── controllers/    # HTTP / presentation
│       ├── routes/         # Thin route wiring
│       ├── container.js
│       ├── app.js
│       └── index.js
├── .cursor/skills/push/    # Push workflow skill
├── docker-compose.yml
└── .env.example
```

## Run with Docker

```bash
docker compose up --build
```

Then open:

- App: http://localhost:3000
- API: http://localhost:5000/api/health
- MongoDB: localhost:27017

## Run locally (without Docker)

### Backend

```bash
cd backend
npm install
cp ../.env.example ../.env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
