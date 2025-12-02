# Authentication Fix

## Problem
Users were getting 401 Unauthorized errors when trying to:
- Click on products (reveal price)
- Check balance
- Purchase products

## Solution

### 1. Updated API Client
- Now checks localStorage for token on every request (not just at initialization)
- Automatically clears token on 401 errors
- Better error handling

### 2. Updated Product Detail Page
- Checks if user is logged in before allowing clicks/purchases
- Shows "ВОЙТИ ДЛЯ КЛИКА" / "ВОЙТИ ДЛЯ ПОКУПКИ" buttons if not logged in
- Redirects to login on 401 errors

### 3. Better User Experience
- Clear messaging when authentication is required
- Automatic redirect to login when needed
- Token is properly synced between localStorage and API client

## How to Test

1. **Without Login:**
   - Browse products ✅ (works - no auth needed)
   - View product details ✅ (works - no auth needed)
   - Try to click "Reveal price" → Should show "ВОЙТИ ДЛЯ КЛИКА" button
   - Click that button → Redirects to login

2. **After Login:**
   - Click "Reveal price" ✅ (works with auth)
   - Purchase products ✅ (works with auth)
   - Check balance ✅ (works with auth)

## Test Accounts

- **Admin:** `admin@example.com` / `admin123`
- **Partner:** `partner@example.com` / `partner123`
- **Or register a new user**

