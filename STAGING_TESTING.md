# Staging Testing Guide — Stripe Webhooks End-to-End

## ⚡ Quick Start (15 minutes)

### Prerequisites
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Navigate to project directories
cd gallery-manager-api  # Terminal 1
cd gallery-manager-web  # Terminal 2
```

---

## 🎬 5-Step Testing Flow

### Step 1: Start Backend (Terminal 1)
```bash
cd gallery-manager-api
npm run dev
# Wait for: "Server running on :3001"
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd gallery-manager-web
npm run dev
# Wait for: "Ready in Xs"
```

### Step 3: Open Stripe CLI Webhook Listener (Terminal 3)
```bash
# Forward Stripe events to your local backend
stripe listen --forward-to localhost:3001/webhooks/stripe

# You'll see:
# ✓ Ready! Your webhook signing secret is: whsec_test_xxx
# (save this for .env)
```

### Step 4: Test Complete Checkout Flow
```
1. Open http://localhost:3000
2. Login (or create account)
3. Create a gallery
4. Add a product:
   - Name: "Test Print"
   - Price: 29.99
   - Stock: 100
5. Visit public store: http://localhost:3000/gallery/[slug]/store
6. Add product to cart
7. Checkout:
   - Name: "Test User"
   - Email: "test@example.com"
   - Address: "123 Main St"
   - Card: 4242 4242 4242 4242
   - Exp: 12/25
   - CVC: 123
8. Click "Pay"
```

### Step 5: Monitor Webhook
```
Terminal 3 (Stripe CLI) will show:
> 2026-09-25 14:32:10   Received: payment_intent.succeeded [evt_xxx]
> ✓ Sent to http://localhost:3001/webhooks/stripe [200]

✅ Success!

Check:
- Dashboard order status = "paid" ✓
- Stock decremented ✓
- Email queued (check backend logs) ✓
```

---

## 🧪 Test Scenarios

### Scenario A: Successful Payment (4242 card)
```bash
# Expected result:
✅ Order created
✅ Payment processed
✅ Webhook delivered
✅ Status updated to "paid"
✅ Stock decremented
✅ Email sent
```

### Scenario B: Payment Declined (4000 0000 0000 0002 card)
```bash
# Expected result:
❌ Payment declined
✅ Order created
✅ Status stays "pending"
❌ Stock NOT decremented (atomic!)
✅ Error message shown to user
```

### Scenario C: Webhook Retry
```bash
# 1. Create order
# 2. Kill backend: Ctrl+C in Terminal 1
# 3. Wait 5 seconds
# 4. Restart backend: npm run dev
# 5. Stripe retries webhook automatically

# Expected result:
✅ Webhook replayed on reconnect
✅ Order status updated
✅ No double-charge (idempotent)
```

---

## ✅ Success Criteria

### Frontend Checks
- [ ] Homepage loads (http://localhost:3000)
- [ ] Can add products to store
- [ ] Store grid displays products
- [ ] Checkout form validates
- [ ] Stripe CardElement loads
- [ ] Payment succeeds with test card
- [ ] Success page shows order confirmation
- [ ] Redirect to store after 2 seconds

### Backend Checks
- [ ] Health endpoint: `curl http://localhost:3001/health`
- [ ] Webhook endpoint receives events
- [ ] Order created in database
- [ ] Stock decremented after payment
- [ ] Order status = "paid" after webhook
- [ ] Email queued (check logs)
- [ ] No database errors in logs
- [ ] Rate limiting working (test with 11 requests)

### Webhook Checks
- [ ] Stripe CLI shows webhook delivery (200 status)
- [ ] Signature verification passes
- [ ] Order status updates immediately
- [ ] Webhook retries if backend down
- [ ] No duplicate processing (idempotent)

---

## 📊 Monitoring During Test

### Terminal 1 (Backend) — Watch for:
```
✅ POST /webhooks/stripe 200 5ms (payment_intent.succeeded)
✅ Order status updated: pending → paid
✅ Stock decremented: 100 → 99
✅ Email queued: test@example.com
```

### Terminal 2 (Frontend) — Watch for:
```
✅ Checkout form submitted
✅ Payment processing...
✅ Success! Order #xxx created
✅ Redirecting to store...
```

### Terminal 3 (Stripe CLI) — Watch for:
```
> 2026-09-25 14:32:10   Received: payment_intent.succeeded [evt_xxx]
> ✓ Sent to http://localhost:3001/webhooks/stripe [200]
```

---

## 🚨 Troubleshooting

### "Webhook endpoint not found" (404)
```
❌ Problem: Backend not running or URL wrong

✅ Fix:
1. Verify backend running: curl http://localhost:3001/health
2. Check Stripe CLI endpoint: --forward-to localhost:3001/webhooks/stripe
3. Restart Stripe CLI: stripe listen --forward-to localhost:3001/webhooks/stripe
```

### "Signature verification failed" (401)
```
❌ Problem: Webhook signing secret mismatch

✅ Fix:
1. Get secret from Stripe CLI output
2. Add to .env: STRIPE_WEBHOOK_SECRET=whsec_test_xxx
3. Restart backend: npm run dev
```

### "Order status not updated" (still pending)
```
❌ Problem: Webhook not processed or error in handler

✅ Fix:
1. Check backend logs for webhook error
2. Verify database connection
3. Check order table for webhook_id (idempotency)
4. Restart backend and retry webhook from Stripe CLI
```

### "CardElement not loading"
```
❌ Problem: Stripe publishable key missing or wrong

✅ Fix:
1. Verify .env.local: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
2. Check console (F12 → Console) for Stripe load errors
3. Restart frontend: npm run dev
```

---

## 📋 Testing Checklist

- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Stripe CLI listening (`stripe listen --forward-to localhost:3001/webhooks/stripe`)
- [ ] Create gallery in dashboard
- [ ] Add product (name, price, stock)
- [ ] Visit public store
- [ ] Add product to cart
- [ ] Checkout form fills
- [ ] Stripe CardElement mounts
- [ ] Enter test card (4242 4242 4242 4242)
- [ ] Click "Pay"
- [ ] Success page appears
- [ ] Stripe CLI shows webhook ✓ [200]
- [ ] Dashboard order status = "paid"
- [ ] Stock decremented
- [ ] No backend errors in logs

---

## 🎯 Next Steps (if all passing)

1. ✅ Deploy backend to staging
2. ✅ Deploy frontend to staging
3. ✅ Configure Stripe webhook endpoint in dashboard
4. ✅ Run full staging test suite
5. ✅ Monitor webhook delivery for 1 hour
6. ✅ Go live to production

---

## 📞 Quick Help

**Backend logs:** `npm run dev` (watch output)  
**Frontend logs:** `npm run dev` (watch output)  
**Stripe logs:** `stripe logs --live` (Terminal 3)  
**Webhook secret:** From Stripe CLI output  
**Test card:** 4242 4242 4242 4242 (12/25, 123)  
**Database:** Check `orders` table for new records  
**Email:** Check backend logs for "Email queued"  

---

Done testing? Move to staging deployment →
