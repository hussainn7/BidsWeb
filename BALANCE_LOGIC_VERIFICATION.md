# Balance Deduction Logic Verification

## Current Implementation Analysis

### 1. Order Purchase Flow

**When order is created:**
- ✅ Balance IS deducted immediately if `balanceToUse > 0` (line 79-86 in orders.service.ts)
- ✅ Product is locked (isSold = true)
- ✅ Order created with status PENDING
- ✅ YooKassa payment created for remaining amount

**When YooKassa payment succeeds:**
- ✅ Order status updated to PAID
- ✅ Receipt generated
- ⚠️ Balance was already deducted at order creation, so no additional deduction needed

**Potential Issue:**
- If YooKassa payment fails/cancelled, balance is NOT refunded (product stays locked)
- This might be intentional, but could be improved

### 2. Click Payment Flow

**Current behavior:**
- ❌ Always creates YooKassa payment for 30₽
- ❌ Does NOT use user balance even if available
- ✅ Adds +40₽ bonus after payment succeeds

**Should be:**
- Option to use balance if available for clicks
- OR always use YooKassa (current behavior)

### 3. Balance Top-Up

**Current behavior:**
- ✅ Creates YooKassa payment
- ✅ Adds balance when payment succeeds (via webhook or mock confirmation)
- ✅ Works correctly

## Issues Found

1. **Click payments don't use balance** - They always go through YooKassa
2. **No refund logic** - If order payment fails, balance isn't refunded
3. **Balance deduction happens at order creation** - This is correct, but we should verify it's working

## Recommendations

1. Keep current order flow (balance deducted at creation) - this is correct
2. Add option for clicks to use balance if available
3. Add refund logic for failed payments (optional)
4. Add better logging to track balance changes

