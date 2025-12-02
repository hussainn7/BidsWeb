# Keys & Secrets Setup Guide

## 🔑 Required Keys

You need to set up **2 types of keys**:

1. **JWT Secret** - For authentication tokens
2. **YooKassa Credentials** - For payment processing

---

## 1. JWT Secret Key

### What it is:
A secret string used to sign and verify JWT authentication tokens. This ensures tokens can't be tampered with.

### Where to get it:
**You generate it yourself** - it's just a random string.

### How to generate:
You can use any of these methods:

**Option 1: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Or: https://randomkeygen.com/
- Copy a 32+ character random string

**Option 2: Command Line (Node.js)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 3: Command Line (OpenSSL)**
```bash
openssl rand -hex 32
```

**Option 4: Python**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Option 5: Just use a long random string**
```
my-super-secret-jwt-key-2024-production-do-not-share-abc123xyz789
```

### Add to `.env`:
```env
JWT_SECRET=your-generated-secret-key-here-minimum-32-characters
```

**⚠️ Important:**
- Keep it secret! Never commit to git
- Use different keys for development and production
- Minimum 32 characters recommended

---

## 2. YooKassa Credentials

### What it is:
YooKassa is a Russian payment processor (like Stripe). You need:
- **Shop ID** - Your merchant ID
- **Secret Key** - API key for authentication

### Where to get it:

#### Step 1: Create YooKassa Account
1. Go to: https://yookassa.ru/
2. Click "Регистрация" (Registration)
3. Fill out business information
4. Complete verification process

#### Step 2: Get Test Credentials (For Development)
1. Log into YooKassa dashboard
2. Go to **Settings** → **API**
3. Find **Test Mode** section
4. Copy:
   - **shopId** (looks like: `123456`)
   - **Secret Key** (looks like: `live_ABC123...` or `test_ABC123...`)

#### Step 3: Get Production Credentials (For Production)
1. Complete business verification
2. Go to **Settings** → **API**
3. Find **Production Mode** section
4. Copy:
   - **shopId**
   - **Secret Key**

### Add to `.env`:
```env
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_ABC123xyz789...
YOOKASSA_RETURN_URL=http://localhost:5173/payment/callback
```

**⚠️ Important:**
- Use **test** keys for development
- Use **live** keys only in production
- Never commit keys to git
- Test keys start with `test_`, live keys start with `live_`

---

## 📝 Complete `.env` File Template

Create `backend/.env` with all required variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
DB_NAME=figma_replica

# JWT Authentication
JWT_SECRET=your-generated-jwt-secret-key-minimum-32-chars

# YooKassa Payment
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_your_secret_key_here
YOOKASSA_RETURN_URL=http://localhost:5173/payment/callback

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Quick Setup Steps

### 1. Generate JWT Secret:
```bash
# In terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output.

### 2. Get YooKassa Test Credentials:
- Sign up at https://yookassa.ru/
- Get test shopId and secretKey from dashboard

### 3. Create `.env` file:
```bash
cd backend
touch .env
```

### 4. Add all variables to `.env`:
Use the template above, filling in your actual values.

### 5. Test:
```bash
cd backend
npm run start:dev
```

If it starts without errors, you're good! ✅

---

## 🔒 Security Best Practices

1. **Never commit `.env` to git**
   - Add to `.gitignore`
   - Use `.env.example` for templates

2. **Use different keys for dev/prod**
   - Development: Test YooKassa keys
   - Production: Live YooKassa keys

3. **Rotate keys periodically**
   - Especially if compromised

4. **Use environment variables in production**
   - Don't hardcode secrets
   - Use services like AWS Secrets Manager, etc.

---

## 🧪 Testing Without YooKassa

If you want to test without YooKassa setup:

1. You can temporarily mock the YooKassa service
2. Or use YooKassa's test mode (recommended)
3. Test payments will work but won't charge real money

---

## ❓ Common Issues

**"JWT_SECRET is not defined"**
- Add `JWT_SECRET` to `.env` file
- Restart backend server

**"YooKassa credentials not configured"**
- Check `.env` has `YOOKASSA_SHOP_ID` and `YOOKASSA_SECRET_KEY`
- Verify keys are correct (no extra spaces)

**"Invalid YooKassa credentials"**
- Make sure you're using test keys for development
- Check keys are copied correctly (no line breaks)

---

## 📚 Additional Resources

- **YooKassa Documentation**: https://yookassa.ru/developers/api
- **JWT Info**: https://jwt.io/introduction
- **Environment Variables**: https://www.twilio.com/blog/environment-variables-nodejs

