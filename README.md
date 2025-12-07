# BidsWeb

Auction platform with NestJS backend and React frontend.

## Project Structure

```
.
├── backend/          # NestJS backend API
├── frontend/         # React + Vite frontend
└── package.json      # Root package.json for development
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL
- npm >= 9.0.0

### Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
   - Backend: Create `backend/.env` with database and API credentials
   - Frontend: Create `frontend/.env` with `VITE_API_URL`

3. Run both backend and frontend:
```bash
npm run dev:all
```

Or run separately:
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## Production Build

```bash
npm run build
```

## Deployment

### Render.com

The project includes a `render.yaml` configuration file. For manual setup:

**Backend Service:**
- Build Command: `cd backend && npm install && npm run build`
- Start Command: `cd backend && npm run start:prod`
- Environment: Node

**Frontend Service (Static Site):**
- Build Command: `cd frontend && npm install && npm run build`
- Publish Directory: `frontend/dist`

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=figma_replica
JWT_SECRET=your-secret-key
YOOKASSA_SHOP_ID=your-shop-id
YOOKASSA_SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## License

Private

