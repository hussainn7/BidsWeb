# Connection Status

## ✅ Database Connection (Backend ↔ PostgreSQL)

**Status: CONFIGURED** - Ready to connect when you provide credentials

### Configuration:
- **Location**: `backend/src/config/database.config.ts`
- **Module**: `backend/src/database/database.module.ts`
- **TypeORM**: Configured with all entities
- **Migrations**: Ready (migration file exists)

### Required Environment Variables (`.env` in `backend/`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=figma_replica
NODE_ENV=development
```

### Entities Registered:
- ✅ User
- ✅ Product  
- ✅ Click
- ✅ Order
- ✅ BalanceTransaction

### To Connect:
1. Create `.env` file in `backend/` directory
2. Add database credentials (see above)
3. Run migrations: `npm run migration:run` (if you have a migration script)
4. Start backend: `npm run start:dev`

---

## ✅ Frontend ↔ Backend Connection

**Status: CONFIGURED** - Ready to connect

### Configuration:
- **API Client**: `src/lib/api.ts`
- **Base URL**: `http://localhost:3000` (default) or `VITE_API_URL` env variable
- **CORS**: Enabled in backend (`backend/src/main.ts`)

### Frontend API Client:
- ✅ All endpoints defined
- ✅ JWT token handling
- ✅ Error handling
- ✅ Auto-loads token from localStorage

### Backend CORS:
- ✅ Enabled for `http://localhost:5173` (Vite default)
- ✅ Configurable via `FRONTEND_URL` env variable
- ✅ Credentials enabled

### Required Setup:

**Frontend** (optional `.env` in root):
```env
VITE_API_URL=http://localhost:3000
```

**Backend** (`.env` in `backend/`):
```env
FRONTEND_URL=http://localhost:5173
PORT=3000
```

---

## 🔧 Quick Start Guide

### 1. Database Setup:
```bash
# Make sure PostgreSQL is running
# Create database
createdb figma_replica

# Or use your existing database
```

### 2. Backend Setup:
```bash
cd backend
# Create .env file with database credentials
npm install
npm run start:dev
```

### 3. Frontend Setup:
```bash
# In root directory
npm install
npm run dev
```

### 4. Verify Connections:

**Test Database:**
- Backend should start without errors
- Check console for "Database connected" or similar message
- Try registering a user via API

**Test Frontend-Backend:**
- Open browser console
- Check Network tab for API calls
- Try logging in/registering
- Should see requests to `http://localhost:3000`

---

## ⚠️ Common Issues

### Database Connection Fails:
- Check PostgreSQL is running
- Verify credentials in `.env`
- Check database exists
- Verify port 5432 is accessible

### Frontend Can't Reach Backend:
- Check backend is running on port 3000
- Check CORS settings match frontend URL
- Check browser console for CORS errors
- Verify `VITE_API_URL` matches backend URL

### Migration Issues:
- Run: `npm run typeorm migration:run` (if script exists)
- Or manually run SQL from migration file
- Check database connection first

---

## 📝 Summary

| Connection | Status | Action Needed |
|------------|--------|--------------|
| Backend ↔ Database | ✅ Configured | Add `.env` with DB credentials |
| Frontend ↔ Backend | ✅ Configured | Both servers running |
| Migrations | ✅ Ready | Run migrations or use existing DB |

**Everything is configured and ready - you just need to:**
1. Add database credentials to `backend/.env`
2. Start PostgreSQL
3. Run backend server
4. Run frontend server

