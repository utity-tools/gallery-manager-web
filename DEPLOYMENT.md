# v0.3.0-ecommerce Deployment Guide

## 🎯 Pre-Deployment Checklist

### Backend Setup
- [ ] `STRIPE_SECRET_KEY` configured in `.env`
- [ ] `STRIPE_WEBHOOK_SECRET` configured in `.env`
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Rate limiting active (Redis/memory store)
- [ ] Email service configured (SendGrid API key)
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm run test`)

### Frontend Setup
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
- [ ] Stripe depends installed (`@stripe/react-stripe-js`, `stripe`)
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm run test`)

---

## 📋 Environment Variables

### Backend (.env)
```
# Stripe (Test mode keys)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Email
SENDGRID_API_KEY=SG.YOUR_API_KEY

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/gallery_test

# Auth
JWT_SECRET=your-jwt-secret-min-32-chars
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY_HERE
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
```

---

## 🧪 Local Testing (Before Staging)

### 1. Start Both Services
```bash
# Terminal 1: Backend
cd gallery-manager-api
npm run dev

# Terminal 2: Frontend
cd gallery-manager-web
npm run dev
```

### 2. Test Complete Flow
1. Visit http://localhost:3000
2. Login / Create account
3. Create gallery + products
4. Visit public store
5. Add to cart
6. Checkout with test card: `4242 4242 4242 4242`
7. Verify order created in dashboard

### 3. Test Webhook Locally (Stripe CLI)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe account
stripe login

# Forward webhook events to local backend
stripe listen --forward-to localhost:3001/webhooks/stripe

# In another terminal, trigger test event
stripe trigger payment_intent.succeeded
```

---

## 🚀 Staging Deployment

### Backend Staging
```bash
# 1. Build production image
docker build -t gallery-api:v0.3.0 .

# 2. Push to registry
docker push your-registry/gallery-api:v0.3.0

# 3. Deploy to staging environment
kubectl apply -f k8s/staging/api-deployment.yaml

# 4. Run migrations
kubectl exec -it deployment/gallery-api -- npx prisma migrate deploy

# 5. Verify health
curl https://staging-api.gallery.local/health
# Expected: { status: 'ok', db: 'connected' }
```

### Frontend Staging
```bash
# 1. Build production bundle
npm run build

# 2. Push to CDN/hosting
vercel deploy --prod --scope=staging

# 3. Verify deployment
curl https://staging.gallery.local

# 4. Run smoke tests
npm run test:e2e
```

---

## 🔒 Stripe Webhook Testing

### Webhook URL Configuration
```
Stripe Dashboard → Webhooks → Add endpoint

Endpoint: https://staging-api.gallery.local/webhooks/stripe
Events to send:
  ✓ payment_intent.succeeded
  ✓ payment_intent.payment_failed
  ✓ charge.refunded
```

### Test Scenarios

#### Scenario 1: Successful Payment
```bash
# 1. Create product in staging
POST /api/galleries/:id/products
{
  "title": "Test Print",
  "price": 29.99,
  "stock": 100,
  "category": "print"
}

# 2. Checkout in public store
# - Use test card: 4242 4242 4242 4242
# - Exp: 12/25, CVC: 123

# 3. Verify order in dashboard
# - Order shows "paid" status
# - Email sent to customer
# - Stock decremented
```

#### Scenario 2: Failed Payment
```bash
# 1. Use test card: 4000 0000 0000 0002
# - This card always declines

# 2. Checkout
# - Should show error: "Your card was declined"

# 3. Verify order in dashboard
# - Order shows "failed" status
# - Stock NOT decremented (atomic!)
```

#### Scenario 3: Webhook Retry
```bash
# 1. Kill backend during webhook delivery
# 2. Stripe retries automatically (3 times over 24h)
# 3. When backend comes back online:
#    - Webhook replayed
#    - Order status updated

# Verify: All orders eventually reach "paid" status
```

---

## ✅ Staging Validation Checklist

### Backend
- [ ] Health endpoint responds (`/health`)
- [ ] Database migrations successful
- [ ] All endpoints respond with correct status codes
- [ ] Rate limiting active (test with 11 requests in 15 min)
- [ ] Webhook signature verification works
- [ ] Stock decremented atomically on payment
- [ ] Orders created with correct customer info

### Frontend
- [ ] Homepage loads with hero carousel
- [ ] Store grid loads with pagination
- [ ] Checkout form validates correctly
- [ ] Stripe CardElement mounts
- [ ] Payment succeeds (test card)
- [ ] Success page shows after payment
- [ ] Dashboard shows new order
- [ ] Email sent (check SendGrid logs)

### End-to-End
- [ ] User signup → login → create gallery
- [ ] Create products (3+)
- [ ] Visit public store → add to cart
- [ ] Checkout with Stripe test card
- [ ] Order appears in dashboard (within 5 sec)
- [ ] Status updates show in admin
- [ ] Email confirmation received

---

## 🚨 Troubleshooting

### Webhook Not Firing
```bash
# Check webhook logs in Stripe Dashboard
Webhook Endpoints → Recent Events

# Check backend logs
tail -f /var/log/gallery-api/webhooks.log

# Verify endpoint is responding
curl -X POST https://staging-api.gallery.local/webhooks/stripe \
  -H "stripe-signature: your-test-sig" \
  -d '{"type":"payment_intent.succeeded"}'
```

### Payment Declined
```
Test cards that work:
✅ 4242 4242 4242 4242 (always succeeds)

Test cards that fail:
❌ 4000 0000 0000 0002 (always declines)
❌ 4000 0025 0000 3155 (requires auth)
❌ 5555 5555 5555 4444 (invalid card)
```

### Stock Not Decremented
```
Check:
1. Is order status "paid"? 
   - If pending/failed, stock should NOT decrement
   
2. Are transactions atomic?
   - Verify in database logs

3. Did webhook fire?
   - Check Stripe dashboard webhook events
```

---

## 📊 Monitoring

### Key Metrics to Track
```
Backend:
- API response time (target: < 200ms)
- Webhook delivery latency (target: < 2s)
- Error rate (target: < 0.1%)
- Database connection pool (target: > 5 available)

Frontend:
- Page load time (target: < 3s)
- Stripe CardElement mount time (target: < 1s)
- Checkout completion rate (target: > 80%)

Stripe:
- Payment success rate (target: > 95%)
- Webhook delivery rate (target: 100%)
- Refund processing time (target: 1-2 hours)
```

### Logging
```bash
# Backend logs
docker logs -f gallery-api-staging

# Frontend logs (Vercel)
vercel logs --tail --scope=staging

# Stripe logs
stripe logs --live
```

---

## 🎯 Go Live Checklist

Before production deployment:
- [ ] All staging tests pass
- [ ] Load testing passed (100 req/s)
- [ ] Security audit passed
- [ ] Email delivery verified
- [ ] Rate limiting tested
- [ ] Stripe webhook retries working
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

---

## 📞 Support

For issues:
1. Check logs (backend + frontend + Stripe)
2. Verify environment variables
3. Test webhook locally with Stripe CLI
4. Check database connections
5. Review rate limiting rules
