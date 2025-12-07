# Testing & Verification Guide

Complete checklist to verify all features are working correctly based on your requirements.

---
//
## 📋 Pre-Testing Setup
//
### 1. Environment Configuration
- [ ] Backend `.env` file configured with:
  - [ ] `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
  - [ ] `JWT_SECRET` (any random string, e.g., `your-secret-key-here`)
  - [ ] `FRONTEND_URL` (e.g., `http://localhost:5173`)
  - [ ] `YOOKASSA_SHOP_ID` (can be blank for testing)
  - [ ] `YOOKASSA_SECRET_KEY` (can be blank for testing)
- [ ] Database migrations run: `npm run migration:run` (if needed)
- [ ] Test data seeded: `npm run seed` (creates admin, partner, and 8 products)
- [ ] Backend running: `npm run start` (port 3000)
- [ ] Frontend running: `npm run dev` (port 5173)

### 2. Test Accounts
- [ ] Admin: `admin@example.com` / `admin123`
- [ ] Partner: `partner@example.com` / `partner123`
- [ ] Regular user: Create via registration

---
//
## 🔐 1. Authentication & User Management

### Registration
- [ ] Navigate to `/register`
- [ ] Fill in: email, password, full name
- [ ] Submit registration
- [ ] **Expected**: Redirected to login or home page
- [ ] **Verify**: User can log in with new credentials
- [ ] **Verify**: User role defaults to `USER`

### Login
- [ ] Navigate to `/login`
- [ ] Enter credentials: `admin@example.com` / `admin123`
- [ ] Submit login
- [ ] **Expected**: JWT token stored in localStorage
- [ ] **Expected**: Redirected to home/catalog
- [ ] **Verify**: Token persists on page refresh
- [ ] **Verify**: API calls include `Authorization: Bearer <token>` header

### Logout
- [ ] Click logout button
- [ ] **Expected**: Token removed from localStorage
- [ ] **Expected**: Redirected to login page
- [ ] **Verify**: Cannot access protected routes

### Profile
- [ ] While logged in, access `/account` or profile endpoint
- [ ] **Expected**: User details displayed (email, name, balance, role)

---

## 📦 2. Catalog & Product Pages

//
### Catalog View
- [ ] Navigate to `/catalog` or home page
- [ ] **Expected**: List of all active products displayed
- [ ] **Verify**: Product cards show:
  - [ ] Product name
  - [ ] Description
  - [ ] Image (if available)
  - [ ] "View Details" or similar button
- [ ] **Verify**: Clicking product navigates to product detail page

### Product Detail Page - Price Hidden
- [ ] Navigate to any product page (e.g., `/product/:id`)
- [ ] **Expected**: Price is **HIDDEN** (not displayed)
- [ ] **Expected**: Shows placeholder like "???" or "Click to reveal"
- [ ] **Verify**: Product details visible (name, description, image)
- [ ] **Verify**: "Reveal price" button visible (or "Login to reveal" if not logged in)

### Product Detail Page - After First Click
- [ ] Log in as regular user
- [ ] Navigate to product page
- [ ] Click "Reveal price — 30₽" button
- [ ] **Expected**: Redirected to payment (or auto-approved if mock mode)
- [ ] **Expected**: After payment confirmation, price becomes visible
- [ ] **Verify**: Price displayed matches current product price
- [ ] **Verify**: Price updates in real-time (polling every 5 seconds)

---

## 🖱️ 3. Click Logic

### Click Flow - Not Logged In
- [ ] Navigate to product page (not logged in)
- [ ] **Expected**: Button shows "ВОЙТИ ДЛЯ КЛИКА" or "Login to click"
- [ ] Click button
- [ ] **Expected**: Redirected to `/login`
- [ ] After login, redirected back to product page

### Click Flow - Logged In
- [ ] Log in as regular user
- [ ] Navigate to product page
- [ ] Note the current price (if visible) or that price is hidden
- [ ] Click "Reveal price — 30₽" button
- [ ] **Expected**: Processing state shows "ОБРАБОТКА..."
- [ ] **Expected**: Payment created (mock or real)
- [ ] **Expected**: After payment confirmation:
  - [ ] Price decreases by **30₽** (or becomes visible if first click)
  - [ ] Price does **NOT** go below `min_price`
  - [ ] User balance increases by **+40₽**
  - [ ] Click logged in database
  - [ ] Product `clickCount` increments

### Click Validation
- [ ] Try clicking on a product that's already at `min_price`
- [ ] **Expected**: Error message or button disabled
- [ ] Try clicking on a sold product (`is_sold = true`)
- [ ] **Expected**: Error message or button disabled
- [ ] Try clicking multiple times on same product
- [ ] **Expected**: Each click reduces price by 30₽ (until min_price)

### Real-Time Price Updates
- [ ] Open product page in two browser tabs
- [ ] Click "Reveal price" in one tab
- [ ] **Expected**: Price updates in both tabs within 5 seconds
- [ ] **Verify**: Price polling works (check network tab for periodic requests)

---

## 💰 4. Internal Balance System

### Balance Accumulation from Clicks
- [ ] Log in as regular user
- [ ] Note initial balance (should be 0 for new user)
- [ ] Click "Reveal price" on a product
- [ ] **Expected**: Balance increases by **+40₽**
- [ ] **Verify**: Balance visible in Account page
- [ ] **Verify**: Transaction logged in balance history

### Balance History
- [ ] Navigate to `/account` or balance section
- [ ] **Expected**: Full transaction history displayed
- [ ] **Verify**: Each transaction shows:
  - [ ] Type (CLICK_REWARD, ORDER_PAYMENT, etc.)
  - [ ] Amount (+ or -)
  - [ ] Date/time
  - [ ] Description/reference
- [ ] **Verify**: Transactions sorted by date (newest first)

### Balance Usage for Purchase
- [ ] Ensure user has balance (e.g., 100₽ from clicks)
- [ ] Navigate to product page
- [ ] Click "Buy" or purchase button
- [ ] **Expected**: Option to use balance appears
- [ ] **Verify**: Can enter amount to use (up to available balance)
- [ ] **Verify**: Final payment amount = product price - balance used
- [ ] Complete purchase
- [ ] **Expected**: Balance deducted from account
- [ ] **Expected**: Transaction logged as `ORDER_PAYMENT` (deduction)

### Balance Validation
- [ ] Try to use more balance than available
- [ ] **Expected**: Error message "Insufficient balance"
- [ ] Try to use more balance than product price
- [ ] **Expected**: Error message or validation prevents it

---

## 🛒 5. Product Purchase Flow

### Purchase - Without Balance
- [ ] Log in as regular user
- [ ] Navigate to product page
- [ ] Ensure price is visible (click if needed)
- [ ] Click "КУПИТЬ" (Buy) button
- [ ] **Expected**: Order created
- [ ] **Expected**: Product `is_sold` set to `true` immediately
- [ ] **Expected**: Payment redirect (or auto-approved if mock)
- [ ] **Expected**: After payment confirmation:
  - [ ] Order status = `PAID`
  - [ ] Receipt generated
  - [ ] Product no longer clickable
  - [ ] Order visible in user's order history

### Purchase - With Balance (Partial Payment)
- [ ] Ensure user has balance (e.g., 50₽)
- [ ] Navigate to product with price > 50₽ (e.g., 200₽)
- [ ] Click "Buy"
- [ ] Enter balance to use: 50₽
- [ ] **Expected**: Final payment = 150₽ (200₽ - 50₽)
- [ ] Complete purchase
- [ ] **Expected**: Balance deducted (50₽)
- [ ] **Expected**: YooKassa payment for remaining amount (150₽)

### Purchase - With Balance (Full Payment)
- [ ] Ensure user has balance >= product price
- [ ] Navigate to product
- [ ] Click "Buy"
- [ ] Use full balance
- [ ] **Expected**: No YooKassa payment needed
- [ ] **Expected**: Order marked as `PAID` immediately
- [ ] **Expected**: Balance deducted fully

### Purchase Validation
- [ ] Try to purchase a product that's already sold
- [ ] **Expected**: Error message "Product is already sold"
- [ ] Try to purchase without being logged in
- [ ] **Expected**: Redirected to login or button shows "Login to purchase"
- [ ] Try to purchase with invalid balance amount
- [ ] **Expected**: Validation error

### Product Locking
- [ ] Open product page in two browser tabs
- [ ] Start purchase in one tab (but don't complete)
- [ ] **Expected**: Product `is_sold = true` immediately
- [ ] Try to click "Reveal price" in second tab
- [ ] **Expected**: Error or button disabled
- [ ] Try to purchase in second tab
- [ ] **Expected**: Error "Product is already sold"

---

## 💳 6. YooKassa Payment Integration

### Mock Payment Mode (No Keys)
- [ ] Ensure `YOOKASSA_SHOP_ID` and `YOOKASSA_SECRET_KEY` are blank in `.env`
- [ ] Click "Reveal price" on a product
- [ ] **Expected**: Payment auto-approved immediately (no redirect)
- [ ] **Expected**: No `ECONNRESET` errors in backend logs
- [ ] **Expected**: Mock payment ID generated (starts with `mock_`)
- [ ] **Verify**: Click confirmed, balance added, price reduced

### Real Payment Mode (With Keys)
- [ ] Add real YooKassa credentials to `.env`
- [ ] Restart backend
- [ ] Click "Reveal price" on a product
- [ ] **Expected**: Redirected to YooKassa payment page
- [ ] Complete payment on YooKassa
- [ ] **Expected**: Redirected back to `/payment/callback`
- [ ] **Expected**: Payment confirmed, click processed

### Payment Status Checking
- [ ] Check backend endpoint: `GET /payments/status/:paymentId`
- [ ] **Expected**: Returns payment status (succeeded, pending, etc.)
- [ ] **Verify**: Mock payments return `succeeded` immediately

### Webhook Handling
- [ ] Configure YooKassa webhook URL: `http://your-backend-url/webhooks/yookassa`
- [ ] Complete a payment
- [ ] **Expected**: Webhook received and processed
- [ ] **Verify**: Order/click status updated based on webhook

### Receipt Generation
- [ ] Complete a purchase
- [ ] **Expected**: Receipt generated (mock or real)
- [ ] **Verify**: Receipt URL stored in order
- [ ] **Verify**: Receipt accessible (if real YooKassa)

---

## 👥 7. Partner Dashboard

### Partner Login
- [ ] Log in as `partner@example.com` / `partner123`
- [ ] Navigate to partner dashboard
- [ ] **Expected**: Dashboard accessible (role-based access)

### Product Management
- [ ] View "My Products" section
- [ ] **Expected**: List of products created by this partner
- [ ] **Verify**: Can create new product:
  - [ ] Name, description, price, min_price
  - [ ] Image upload (if implemented)
  - [ ] Product saved and visible in catalog
- [ ] **Verify**: Can edit existing products
- [ ] **Verify**: Can view product statistics

### Partner Statistics
- [ ] View statistics section
- [ ] **Expected**: Shows:
  - [ ] Total products
  - [ ] Total clicks
  - [ ] Total sales
  - [ ] Total revenue
  - [ ] Conversion rate
- [ ] **Verify**: Statistics update after clicks/sales

### Payout History
- [ ] View payouts section
- [ ] **Expected**: List of payouts received
- [ ] **Verify**: Each payout shows:
  - [ ] Amount
  - [ ] Order reference
  - [ ] Date
  - [ ] Status

---

## 🔧 8. Admin Panel

### Admin Login
- [ ] Log in as `admin@example.com` / `admin123`
- [ ] Navigate to admin panel
- [ ] **Expected**: Admin panel accessible (role-based access)

### Products Management
- [ ] View all products
- [ ] **Expected**: List of ALL products (not just own)
- [ ] **Verify**: Can edit any product
- [ ] **Verify**: Can view product details and statistics

### Partners Management
- [ ] View partners list
- [ ] **Expected**: List of all users with `PARTNER` role
- [ ] **Verify**: Can view partner details
- [ ] **Verify**: Can view partner statistics

### Orders Management
- [ ] View all orders
- [ ] **Expected**: List of ALL orders (not just own)
- [ ] **Verify**: Can view order details:
  - [ ] Order number
  - [ ] Product
  - [ ] User
  - [ ] Amount
  - [ ] Status
  - [ ] Payment ID
  - [ ] Receipt URL

### Clicks Overview
- [ ] View clicks section
- [ ] **Expected**: List of all clicks
- [ ] **Verify**: Each click shows:
  - [ ] Product
  - [ ] User
  - [ ] Price before/after
  - [ ] Amount paid
  - [ ] Date
  - [ ] Payment status

### Payouts Management
- [ ] View payouts section
- [ ] **Expected**: List of all payouts
- [ ] **Verify**: Can see payouts for all partners
- [ ] **Verify**: Payout details include order reference

### Overall Analytics
- [ ] View analytics dashboard
- [ ] **Expected**: Overall statistics:
  - [ ] Total clicks
  - [ ] Total sales
  - [ ] Total revenue
  - [ ] Total bonuses paid
  - [ ] Conversion rates
  - [ ] Top products
  - [ ] Top partners

---

## 💸 9. Partner Payouts (CRON)

### Payout Calculation - Sale > Min Price
- [ ] Create a product with:
  - [ ] `price` = 1000₽
  - [ ] `min_price` = 500₽
- [ ] Sell the product (complete purchase)
- [ ] Wait for CRON job (runs every hour) or trigger manually
- [ ] **Expected**: Payout calculated:
  - [ ] Profit = 1000₽ - 500₽ = 500₽
  - [ ] Partner receives = 500₽ + (500₽ / 2) = **750₽**
  - [ ] Platform receives = 500₽ / 2 = **250₽**
- [ ] **Verify**: Partner balance increased by 750₽
- [ ] **Verify**: Transaction logged as `PAYOUT`

### Payout Calculation - Sale = Min Price
- [ ] Create a product with:
  - [ ] `price` = 500₽
  - [ ] `min_price` = 500₽
- [ ] Sell the product (complete purchase)
- [ ] Wait for CRON job
- [ ] **Expected**: Partner receives = **500₽** (min_price only)
- [ ] **Verify**: Partner balance increased by 500₽
- [ ] **Verify**: No profit split (sale = min_price)

### Payout Timing
- [ ] Complete a purchase
- [ ] **Expected**: Order status = `PAID`
- [ ] **Expected**: Payout NOT processed immediately
- [ ] Wait for CRON job (or check logs)
- [ ] **Expected**: Payout processed within 1 hour
- [ ] **Verify**: Payout only processed once (idempotent)

### Payout History
- [ ] Check partner dashboard
- [ ] **Expected**: Payout visible in history
- [ ] Check admin panel
- [ ] **Expected**: Payout visible in all payouts list

---

## 📊 10. Analytics

### Overall Analytics (Admin)
- [ ] Log in as admin
- [ ] Navigate to `/analytics`
- [ ] **Expected**: Overall statistics displayed:
  - [ ] Total clicks
  - [ ] Total sales
  - [ ] Total revenue
  - [ ] Total bonuses paid
  - [ ] Conversion rate (sales/clicks)
  - [ ] Average order value
- [ ] **Verify**: Numbers match actual data

### Product Analytics
- [ ] Navigate to `/analytics/product/:id`
- [ ] **Expected**: Product-specific stats:
  - [ ] Click count
  - [ ] Sales count
  - [ ] Revenue
  - [ ] Conversion rate
- [ ] **Verify**: Stats update after clicks/sales

### Partner Analytics
- [ ] Log in as partner
- [ ] Navigate to `/analytics/my-stats` or partner dashboard
- [ ] **Expected**: Partner-specific stats:
  - [ ] Products count
  - [ ] Total clicks
  - [ ] Total sales
  - [ ] Total revenue
  - [ ] Payouts received
- [ ] **Verify**: Stats match partner's actual data

### Analytics Accuracy
- [ ] Perform actions (clicks, purchases)
- [ ] **Expected**: Analytics update in real-time or after refresh
- [ ] **Verify**: Numbers are accurate (manual calculation)

---

## 🔄 11. Real-Time Updates

### Price Polling
- [ ] Open product page
- [ ] **Expected**: Price polls every 5 seconds (check network tab)
- [ ] Click "Reveal price" in another tab/browser
- [ ] **Expected**: Price updates in first tab within 5 seconds
- [ ] **Verify**: No excessive API calls (throttling works)

### Balance Updates
- [ ] Open Account page
- [ ] Perform click (adds 40₽)
- [ ] **Expected**: Balance updates after refresh or polling
- [ ] **Verify**: Balance history updates

### Order Status Updates
- [ ] Create an order
- [ ] **Expected**: Order status updates after payment confirmation
- [ ] **Verify**: Order visible in order history

---

## 🛡️ 12. Security & Validation

### Authentication Guards
- [ ] Try accessing protected route without login
- [ ] **Expected**: Redirected to login or 401 error
- [ ] Try accessing admin panel as regular user
- [ ] **Expected**: 403 Forbidden or redirect
- [ ] Try accessing partner dashboard as regular user
- [ ] **Expected**: 403 Forbidden or redirect

### Input Validation
- [ ] Try registering with invalid email
- [ ] **Expected**: Validation error
- [ ] Try creating order with invalid product ID
- [ ] **Expected**: Validation error
- [ ] Try using negative balance amount
- [ ] **Expected**: Validation error

### Data Integrity
- [ ] Complete a click
- [ ] **Verify**: All related data updated:
  - [ ] Click record created
  - [ ] Product price reduced
  - [ ] User balance increased
  - [ ] Transaction logged
- [ ] **Verify**: No orphaned records

---

## 🐛 13. Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try clicking "Reveal price"
- [ ] **Expected**: Error message displayed
- [ ] **Expected**: No app crash

### Payment Failures
- [ ] Start payment flow
- [ ] Cancel payment (if possible)
- [ ] **Expected**: Order/click status remains `PENDING`
- [ ] **Expected**: Product not locked (if order) or click not confirmed

### Database Errors
- [ ] Check backend logs for errors
- [ ] **Expected**: Errors logged properly
- [ ] **Expected**: User-friendly error messages

---

## 📱 14. Frontend UI/UX

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] **Expected**: Layout adapts correctly
- [ ] **Expected**: Buttons/text readable

### Loading States
- [ ] Click "Reveal price"
- [ ] **Expected**: Loading spinner or "Processing..." text
- [ ] **Expected**: Button disabled during processing
- [ ] Complete purchase
- [ ] **Expected**: Loading states during payment

### Toast Notifications
- [ ] Complete a click
- [ ] **Expected**: Success toast "Click confirmed! +40₽ added"
- [ ] Complete a purchase
- [ ] **Expected**: Success toast "Order paid!"
- [ ] Try invalid action
- [ ] **Expected**: Error toast with message

### Navigation
- [ ] Test all navigation links
- [ ] **Expected**: All routes accessible
- [ ] **Expected**: Back button works
- [ ] **Expected**: Breadcrumbs (if implemented)

---

## ✅ Final Verification Checklist

### Backend API Endpoints
- [ ] `POST /auth/register` - Works
- [ ] `POST /auth/login` - Works
- [ ] `GET /auth/profile` - Works
- [ ] `GET /products` - Works
- [ ] `GET /products/:id` - Works
- [ ] `POST /products/:id/click` - Works
- [ ] `POST /products/:id/click/:clickId/confirm` - Works
- [ ] `POST /orders` - Works
- [ ] `GET /orders` - Works
- [ ] `GET /orders/:id` - Works
- [ ] `POST /orders/:id/confirm-payment` - Works
- [ ] `GET /balance` - Works
- [ ] `GET /balance/history` - Works
- [ ] `GET /analytics` - Works (admin)
- [ ] `GET /analytics/product/:id` - Works
- [ ] `GET /analytics/partner/:id` - Works
- [ ] `GET /payouts` - Works
- [ ] `POST /webhooks/yookassa` - Works
- [ ] `GET /payments/status/:paymentId` - Works

### Database Tables
- [ ] `users` - Has data
- [ ] `products` - Has data (8 test products)
- [ ] `clicks` - Records created on clicks
- [ ] `orders` - Records created on purchases
- [ ] `balance_transactions` - Records created for all balance operations

### CRON Jobs
- [ ] Payout scheduler runs every hour
- [ ] Payouts processed correctly

### Frontend Pages
- [ ] `/login` - Works
- [ ] `/register` - Works
- [ ] `/catalog` - Works
- [ ] `/product/:id` - Works
- [ ] `/account` - Works
- [ ] `/partner/dashboard` - Works (partner role)
- [ ] `/admin` - Works (admin role)
- [ ] `/payment/callback` - Works

---

## 🎯 Summary

After completing all checks above, your application should be:
- ✅ Fully functional
- ✅ Secure (authentication, authorization)
- ✅ Real-time updates working
- ✅ Payments working (mock or real)
- ✅ Analytics accurate
- ✅ Payouts automated
- ✅ All user flows complete

**If any check fails, note the issue and fix it before proceeding to production.**

---

## 📝 Notes

- Mock payment mode works without YooKassa keys
- Test data available via `npm run seed`
- CRON jobs run every hour (can be adjusted)
- Real-time polling is every 5 seconds (can be adjusted)
- All transactions are logged for audit trail

