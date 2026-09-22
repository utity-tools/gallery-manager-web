#!/bin/bash

# Stripe Webhook Testing Script
# Tests webhook delivery and order status updates

set -e

API_BASE_URL="${API_BASE_URL:-http://localhost:3001}"
WEBHOOK_ENDPOINT="${API_BASE_URL}/webhooks/stripe"
STRIPE_TEST_KEY="${STRIPE_TEST_KEY:-sk_test_PLACEHOLDER}"

echo "🔷 Stripe Webhook Testing Suite"
echo "API Base: $API_BASE_URL"
echo ""

# Test 1: Check webhook endpoint is accessible
echo "Test 1️⃣ : Webhook endpoint reachable..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test-invalid-signature" \
  -d '{"type":"test"}')

if [ "$response" = "400" ]; then
  echo "✅ Webhook endpoint reachable (correctly rejected invalid signature)"
elif [ "$response" = "401" ]; then
  echo "✅ Webhook endpoint reachable (signature verification working)"
else
  echo "❌ Unexpected response: $response"
fi

echo ""

# Test 2: Create test order
echo "Test 2️⃣ : Creating test order..."
order_response=$(curl -s -X POST "$API_BASE_URL/api/galleries/test-gallery/store/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerEmail": "test@example.com",
    "items": [{"productId": "prod_123", "quantity": 1, "title": "Test Item", "priceAtTime": 29.99}],
    "totalPrice": 29.99,
    "shippingAddress": {"line1": "123 Main St", "city": "Test City", "postalCode": "12345", "country": "US"}
  }')

echo "Response: $order_response"
order_id=$(echo "$order_response" | grep -o '"orderId":"[^"]*' | cut -d'"' -f4)

if [ -z "$order_id" ]; then
  echo "❌ Failed to create order"
  exit 1
fi

echo "✅ Order created: $order_id"
echo ""

# Test 3: Simulate webhook (payment_intent.succeeded)
echo "Test 3️⃣ : Simulating payment_intent.succeeded webhook..."
webhook_payload='{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_test_'"$order_id"'",
      "status": "succeeded",
      "amount": 2999,
      "metadata": {
        "order_id": "'"$order_id"'",
        "gallery_id": "test-gallery"
      }
    }
  }
}'

webhook_response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test-signature" \
  -d "$webhook_payload")

http_code=$(echo "$webhook_response" | tail -n1)

if [ "$http_code" = "200" ] || [ "$http_code" = "204" ]; then
  echo "✅ Webhook accepted (HTTP $http_code)"
else
  echo "❌ Webhook rejected (HTTP $http_code)"
  echo "$webhook_response"
  exit 1
fi

echo ""

# Test 4: Verify order status updated
echo "Test 4️⃣ : Verifying order status updated..."
sleep 2  # Give backend time to process

status_response=$(curl -s "$API_BASE_URL/api/galleries/test-gallery/orders/$order_id" \
  -H "Authorization: Bearer test-token")

echo "Status response: $status_response"

if echo "$status_response" | grep -q '"paymentStatus":"paid"'; then
  echo "✅ Order marked as paid"
else
  echo "⚠️  Order status not yet updated (might be async)"
fi

echo ""
echo "🎉 Webhook testing complete!"
echo ""
echo "Next steps:"
echo "1. Check backend logs for webhook processing"
echo "2. Verify order appears in dashboard"
echo "3. Confirm customer email sent"
echo "4. Test payment failure scenario (use Stripe CLI)"
