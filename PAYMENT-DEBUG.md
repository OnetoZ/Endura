# [ENDURA] Payment Debug Cheatsheet 🛡️

Use this guide to diagnose and fix failures in the **Backend (Render)** ↔ **Razorpay** ↔ **Frontend (Vite)** pipeline.

## 1. Quick Diagnosis Table
| HTTP Status | message Snippet | [ENDURA-PAY] Diagnosis | 🔧 One-Line Fix |
| :--- | :--- | :--- | :--- |
| **401** | `Authentication required` | Session Cookie Missing | Set `axios.defaults.withCredentials = true` |
| **400** | `No order items` | Empty Cart Payload | Check `checkoutItems` in frontend before `startCheckout` |
| **400** | `invalid order item` | Incorrect Key (`product`) | Map carts items to use `asset: item.id` NOT `product: item.id` |
| **400** | `Missing required...` | Address Incomplete | Validation check failed on: `fullName, address, city, postalCode, country` |
| **400** | `Insufficient stock` | Inventory Conflict | Asset sold out. Refresh cart to sync with DB. |
| **500** | `Razorpay...not configured`| Missing Env Vars | Add `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` in Render dashboard |
| **(Any)** | `Razorpay API rejection` | Razorpay Account Issue | Check Razorpay Dashboard for "Account Verification" status |

---

## 2. Correct Payload Shape (Pre-flight Check)
The `POST /api/payment/create-order` endpoint **REQUIRES** this exact JSON structure:

```json
{
  "orderItems": [
    {
      "asset": "65f1...", 
      "quantity": 1,
      "selectedSize": "XL"
    }
  ],
  "shippingAddress": {
    "fullName": "Endura User",
    "address": "123 Cyber St",
    "city": "Mumbai",
    "postalCode": "400001",
    "country": "India"
  }
}
```
> [!IMPORTANT]
> Always verify the ID field is named `asset`. The Backend will reject `product: id` with a 400 error.

---

## 3. Critical Environment Variables (Render)
Go to **Render Dashboard** → **Environment** and ensure these are defined:
- `RAZORPAY_KEY_ID`: Your `rzp_test_...` or `rzp_live_...` key.
- `RAZORPAY_KEY_SECRET`: Your Razorpay secret.
- `CORS_ORIGIN`: Your frontend URL (e.g., `https://wearendura.com`).
- `COOKIE_DOMAIN`: `.onrender.com` (for production session sharing).

---

## 4. Real-time Debugging Tools
1. **Frontend Console:** Check for `[ENDURA-PAY ❌]` logs. The `paymentInterceptor.js` will automatically print the **Diagnosis** and **Fix**.
2. **Backend Health Check:** Visit `https://your-backend.onrender.com/api/payment/health` (Publicly accessible).
   - `testOrder: "pass"` means the backend ↔ Razorpay link is healthy.
   - `razorpayInstance: "initialized"` confirmed.
3. **Network Tab:** Look for the `create-order` request. Verify **Cookies** include `connect.sid` and **Payload** uses `asset`.

---

## 5. Log Monitoring
Run this in your terminal or check Render "Logs" tab:
- **Success:** `[payment/create-order] Order created successfully`
- **Verification:** `[payment/verify] Order status updated to PAID`
- **Error:** `[payment/create-order] Rejected: ...` (Search for "Rejected" to find the exact reason)
