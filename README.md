# ☕ RSN CAFE — Cafe Management System (Kalpitiya)

Full-stack cafe system: online menu, ordering, billing/payment, live order tracking,
SMS + in-app notifications, phone OTP login, and an admin/staff dashboard.

| Layer    | Tech |
|----------|------|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS v4 |
| Backend  | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth     | JWT + bcrypt (bcryptjs), phone OTP verification |
| Security | Helmet, rate limiting, NoSQL-injection sanitising, Zod validation, role-based protected routes |

## Features
**Customers** — browse menu (search, category, veg filter) · cart · dine-in / takeaway · pay by cash, card or wallet ·
live order tracking · printable bill · notifications bell · register with **SMS OTP** · forgot password via OTP.

**Admin / staff** — live orders board with new-order chime · status flow (new → preparing → ready → completed) ·
collect payments · **counter (walk-in) billing** · menu manager (add/edit/sold-out/delete) · sales dashboard.

**Location** — Home page has a map, address, hours, phone and a "Get directions" button (Kalpitiya, Sri Lanka).

**Notifications** — SMS to customer on: OTP, welcome, order placed, order ready, order cancelled, payment receipt.
SMS to owner (optional) on every new order. In-app notifications for all of them.

## Quick start

Requirements: Node.js 18.18+ and MongoDB (local install, or `docker compose up -d` using the included file).

```bash
# 1) Backend
cd backend
npm install
cp .env.example .env        # then edit .env (JWT_SECRET, admin phone/password…)
npm run seed                # creates the admin user + sample menu
npm run dev                 # API on http://localhost:5000

# 2) Frontend (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                 # site on http://localhost:3000
```

**Admin login:** the `ADMIN_PHONE` / `ADMIN_PASSWORD` from `.env` (preset: `0750519450` / `Rsn@4478`, name `rashkan`). Change the password after going live.

### Testing OTP without paying for SMS
With `SMS_PROVIDER=console` the OTP is printed in the backend terminal **and** shown on the verify page
(dev mode only — it is never exposed when `NODE_ENV=production` or a real SMS provider is set).

## Real SMS (phone messages + OTP)
Set `SMS_PROVIDER` in `backend/.env`:

* **notifylk** (Sri Lanka, cheap local SMS): set `NOTIFYLK_USER_ID`, `NOTIFYLK_API_KEY`, `NOTIFYLK_SENDER_ID`.
* **twilio**: set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` (number or Messaging Service SID `MG…`).
  Trial accounts can only text verified numbers.

Put the owner's number in `ADMIN_ALERT_PHONE` to get an SMS for every new order.
Then set `SHOW_DEV_OTP=false` and `NODE_ENV=production` when you go live.
Phone numbers are normalised automatically: `0771234567` → `+94771234567` (`DEFAULT_COUNTRY_CODE`).

## Online payment
The card/wallet button uses a **demo gateway** (`backend/src/routes/payments.js`) — it marks the order paid but
does not charge money. To take real payments (e.g. **PayHere** for Sri Lanka, or Stripe): create a checkout session in
`POST /api/payments/:id/online`, and call `markPaid()` only from the gateway's **verified webhook**.
Cash / counter payments work fully as-is.

## Customise your cafe
* Address, hours, coordinates: `backend/src/config/cafe.js` and `frontend/lib/cafe.js` (also `mapQuery` for the map pin).
* Service charge / tax / currency label: `backend/.env` (`SERVICE_CHARGE_RATE=0.10` applies to dine-in only, `TAX_RATE=0`).
* Colours & fonts: `frontend/app/globals.css` and `frontend/app/layout.js`.

## API overview
```
POST /api/auth/register | verify-otp | resend-otp | login | forgot-password | reset-password    GET /api/auth/me
GET  /api/menu   (public)          POST/PUT/PATCH/DELETE /api/menu…   (staff/admin; delete = admin)
POST /api/orders                   GET /api/orders/mine | /api/orders/:id   PATCH /api/orders/:id/cancel
POST /api/orders/counter           GET /api/orders   PATCH /api/orders/:id/status          (staff/admin)
POST /api/payments/:id/online      POST /api/payments/:id/counter (staff)
GET  /api/notifications  /unread-count   PATCH /read-all  /:id/read
GET  /api/admin/stats (staff)      GET /api/cafe/info (public)
```

## Security notes
* Passwords hashed with bcrypt (cost 12); JWT (7d) sent as `Authorization: Bearer`.
* OTPs are HMAC-hashed at rest, expire in 5 minutes, max 5 attempts, 60 s resend cooldown, auto-deleted (TTL index).
* Helmet headers, CORS locked to `CLIENT_URL`, 10 kb body limit, `express-mongo-sanitize`, Zod validation on every write.
* Global + stricter auth/OTP rate limits. Prices are always recalculated on the server from the database.
* Role checks (`customer` / `staff` / `admin`) enforced in the API; the Next.js route guards are only for UX.
* Before deploying: strong `JWT_SECRET`, HTTPS, change the admin password, set `CLIENT_URL` to your domain,
  use MongoDB Atlas or an authenticated MongoDB.

## Ideas for next steps
Socket.io instead of polling · PayHere/Stripe · QR code per table · email receipts · inventory & staff shifts.
