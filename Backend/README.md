# WatchVault Backend API

Production-ready RESTful API for the WatchVault e-commerce platform. Built with **Express.js** and **Supabase**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js |
| Database / Auth | Supabase (PostgreSQL + GoTrue) |
| Storage | Supabase Storage |
| Validation | Joi |
| Logging | Winston |
| File Upload | Multer (memory storage) |
| Rate Limiting | express-rate-limit |
| Payments | Stripe |

---

## Setup

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in .env with your actual values
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Production
```bash
npm start
```

---

## Folder Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── env.js           # Env vars — single source of truth
│   │   ├── supabase.js      # Supabase anon + admin clients
│   │   ├── db.js            # DB abstraction layer
│   │   └── constants.js     # App-wide config constants
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   ├── response.js
│   │   ├── logger.js
│   │   └── constants.js     # Runtime enums
│   ├── routes/
│   │   └── index.js         # Master router
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── watches/
│   │   ├── orders/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── reviews/
│   │   ├── coupons/
│   │   ├── referrals/
│   │   ├── inventory/
│   │   ├── analytics/
│   │   └── notifications/
│   ├── app.js               # Express app setup
│   └── server.js            # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## API Endpoints

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | — | Register new user |
| POST | `/api/v1/auth/login` | — | Login |
| POST | `/api/v1/auth/logout` | ✅ | Logout |
| POST | `/api/v1/auth/refresh-token` | — | Refresh access token |
| POST | `/api/v1/auth/forgot-password` | — | Send reset email |
| POST | `/api/v1/auth/reset-password` | ✅ | Reset password |
| GET | `/api/v1/auth/me` | ✅ | Get current user |

### Watches
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/watches` | — | List watches (with filters) |
| GET | `/api/v1/watches/featured` | — | Featured watches |
| GET | `/api/v1/watches/search?q=` | — | Full-text search |
| GET | `/api/v1/watches/:id` | — | Watch detail |
| POST | `/api/v1/watches` | 🔒 Admin | Create watch |
| PUT | `/api/v1/watches/:id` | 🔒 Admin | Update watch |
| DELETE | `/api/v1/watches/:id` | 🔒 Admin | Soft delete watch |
| POST | `/api/v1/watches/:id/images` | 🔒 Admin | Upload images |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/orders` | ✅ | Create order |
| GET | `/api/v1/orders` | ✅ | List orders (user's own / all for admin) |
| GET | `/api/v1/orders/:id` | ✅ | Order detail |
| PUT | `/api/v1/orders/:id/status` | 🔒 Admin | Update order status |
| POST | `/api/v1/orders/:id/cancel` | ✅ | Cancel order |
| GET | `/api/v1/orders/:id/invoice` | ✅ | Get invoice |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/cart` | ✅ | Get cart with totals |
| POST | `/api/v1/cart/items` | ✅ | Add item |
| PUT | `/api/v1/cart/items/:itemId` | ✅ | Update quantity |
| DELETE | `/api/v1/cart/items/:itemId` | ✅ | Remove item |
| DELETE | `/api/v1/cart` | ✅ | Clear cart |

### Wishlist / Reviews / Coupons / Referrals / Inventory / Analytics / Notifications
See source files in respective module directories.

---

## Supabase Tables Required

| Table | Purpose |
|-------|---------|
| `users` | User profiles |
| `watches` | Product catalog |
| `inventory` | Stock management (1:1 with watches) |
| `inventory_logs` | Audit trail for stock changes |
| `orders` | Order records |
| `order_items` | Line items per order |
| `carts` | Shopping carts (1 per user) |
| `cart_items` | Items in cart |
| `wishlist_items` | User wishlists |
| `reviews` | Product reviews |
| `coupons` | Coupon/discount codes |
| `referrals` | Referral tracking |
| `notifications` | In-app notifications |

---

## Response Format

All responses follow the standard format:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

Paginated responses include:
```json
{
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

## Error Format

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```
