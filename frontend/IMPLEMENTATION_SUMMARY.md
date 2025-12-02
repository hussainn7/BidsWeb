# Implementation Summary

## Backend (NestJS + PostgreSQL)

### Modules Created:
1. **Auth Module** - JWT authentication, registration, login
2. **Products Module** - Product CRUD, click logic, price management
3. **Orders Module** - Order creation, payment processing, receipts
4. **Balance Module** - User balance management, transaction history
5. **Analytics Module** - Statistics for clicks, sales, revenue, conversion
6. **Payouts Module** - Automatic partner payouts via CRON (runs every hour)
7. **Payments Module** - YooKassa integration, webhook handling

### Key Features Implemented:

#### Click Logic:
- Each click deducts 30₽ through YooKassa
- Product price decreases by 30₽ (not below min_price)
- User receives +40₽ in internal balance
- Click is logged in database
- Real-time price updates via polling

#### Product Purchase:
- Product is locked (is_sold = true) when order is created
- Payment through YooKassa
- Order creation with receipt generation
- Balance can be used for partial/full payment
- Automatic partner payouts via CRON

#### Partner Payouts:
- If sale price > min_price → 50/50 profit split
- If sale price = min_price → partner receives only min_price
- CRON job runs every hour to process payouts
- All payouts logged in balance_transactions

#### YooKassa Integration:
- Payment creation for clicks and purchases
- Receipt generation
- Webhook handling for payment confirmations
- Payment status polling

## Frontend (React + Vite)

### Pages Created/Updated:
1. **Catalog** - Displays all active products from API
2. **Product Detail** - Shows product with hidden price, click button, purchase flow
3. **Login/Register** - Authentication with API integration
4. **Account** - User balance, transaction history, orders
5. **Partner Dashboard** - Product management, statistics, payouts
6. **Admin Panel** - Overall statistics, products, orders, payouts

### Features:
- Real-time price updates (polling every 5 seconds)
- Balance display and history
- Order management
- Click-to-reveal price functionality
- Purchase with balance usage
- Partner product creation and management

## API Endpoints

### Auth:
- POST `/auth/register` - User registration
- POST `/auth/login` - User login
- GET `/auth/profile` - Get user profile

### Products:
- GET `/products` - Get all products
- GET `/products/:id` - Get product details
- POST `/products` - Create product (partner/admin)
- PATCH `/products/:id` - Update product (partner/admin)
- POST `/products/:id/click` - Click to reveal price
- GET `/products/partner/my-products` - Get partner's products

### Orders:
- POST `/orders` - Create order
- GET `/orders` - Get user orders
- GET `/orders/:id` - Get order details
- POST `/orders/:id/confirm-payment` - Confirm payment

### Balance:
- GET `/balance` - Get user balance
- GET `/balance/history` - Get balance transaction history

### Analytics:
- GET `/analytics` - Overall statistics (admin)
- GET `/analytics/product/:id` - Product statistics
- GET `/analytics/partner/:id` - Partner statistics
- GET `/analytics/my-stats` - Current user stats (partner)

### Payouts:
- GET `/payouts` - Get payout history

### Webhooks:
- POST `/webhooks/yookassa` - YooKassa webhook handler

## Environment Variables Needed

### Backend (.env):
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=figma_replica
JWT_SECRET=your_jwt_secret
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key
YOOKASSA_RETURN_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

### Frontend (.env):
```
VITE_API_URL=http://localhost:3000
```

## Database Schema

All tables are created via migration:
- `users` - User accounts with balance and role
- `products` - Products with price, min_price, click_count
- `orders` - Orders with payment info and status
- `clicks` - Click records with payment tracking
- `balance_transactions` - All balance operations

## Running the Application

### Backend:
```bash
cd backend
npm install
npm run start:dev
```

### Frontend:
```bash
npm install
npm run dev
```

## Notes

- Real-time updates are implemented via polling (5-second intervals)
- WebSocket/SSE can be added for true real-time if needed
- YooKassa credentials need to be configured in backend .env
- CRON job for payouts runs every hour automatically
- All transactions are logged in balance_transactions table

