# WatchVault — Multi-Vendor Watch Ecommerce Platform

> A production-grade, full-stack multi-vendor marketplace built exclusively for watches. Vendors list and manage their inventory; customers browse, filter, purchase, and review timepieces.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, ShadCN UI, Axios, Context API |
| Backend | Node.js, Express.js, MVC Architecture |
| Database | Supabase (PostgreSQL) |
| Frontend Deploy | Netlify |
| Backend Deploy | Render |

---

## Repositories

| Repo | Description |
|------|-------------|
| `watchvault-frontend` | React SPA — customer and vendor interfaces |
| `watchvault-backend` | Express REST API — MVC, auth, business logic |

---

## Table of Contents

- [Project Structure — Frontend](#project-structure--frontend)
- [Project Structure — Backend](#project-structure--backend)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Roles & Access](#roles--access)
- [Core Features](#core-features)
- [Database Schema Overview](#database-schema-overview)
- [Deployment](#deployment)
- [Architecture Documents](#architecture-documents)
- [Contributing](#contributing)

---

## Project Structure — Frontend

```
watchvault-frontend/
│
├── public/
│   └── _redirects                  # Netlify SPA fallback: /* /index.html 200
│
├── src/
│   │
│   ├── api/                        # All API communication — Axios only
│   │   ├── axiosInstance.js        # Axios instance with interceptors + base URL
│   │   ├── authService.js          # register, login, logout, refresh token
│   │   ├── watchService.js         # getWatches, getWatchById, createWatch, updateWatch, deleteWatch
│   │   ├── orderService.js         # checkout, getOrders, getOrderById, updateStatus
│   │   ├── cartService.js          # getCart, addToCart, removeFromCart, clearCart
│   │   ├── wishlistService.js      # getWishlist, addToWishlist, removeFromWishlist
│   │   ├── reviewService.js        # getReviews, submitReview
│   │   ├── couponService.js        # validateCoupon, applyCoupon
│   │   ├── referralService.js      # getReferralCode, getReferralStats
│   │   └── vendorService.js        # getAnalytics, getInventory, getVendorOrders
│   │
│   ├── components/                 # Reusable, presentational UI components
│   │   │
│   │   ├── common/                 # Generic, domain-agnostic components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   │
│   │   ├── watch/                  # Watch-specific display components
│   │   │   ├── WatchCard.jsx       # Grid card with image, name, price, rating
│   │   │   ├── WatchGrid.jsx       # Responsive grid wrapper for WatchCard
│   │   │   ├── WatchFilters.jsx    # Brand, movement, gender, price, size filters
│   │   │   ├── WatchImages.jsx     # Image gallery with zoom
│   │   │   ├── WatchAttributes.jsx # Movement, dial size, strap, case, water resistance
│   │   │   ├── StockBadge.jsx      # In Stock / Low Stock / Out of Stock badge
│   │   │   ├── PriceTag.jsx        # Formatted price display with currency
│   │   │   └── RatingStars.jsx     # Star rating display (read + interactive)
│   │   │
│   │   ├── order/                  # Order flow components
│   │   │   ├── OrderSummary.jsx    # Line items + totals card
│   │   │   ├── OrderTimeline.jsx   # Status step tracker
│   │   │   ├── OrderStatus.jsx     # Status badge with color coding
│   │   │   └── OrderCard.jsx       # Compact order row for lists
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartDrawer.jsx      # Slide-out cart panel (ShadCN Sheet)
│   │   │   └── CartSummary.jsx
│   │   │
│   │   ├── layout/                 # Page-level structural components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx         # Vendor dashboard sidebar
│   │   │   ├── PageWrapper.jsx     # Consistent page padding/max-width
│   │   │   └── DashboardLayout.jsx # Vendor layout with sidebar
│   │   │
│   │   └── vendor/                 # Vendor dashboard components
│   │       ├── VendorStats.jsx     # KPI cards: revenue, orders, avg value
│   │       ├── RevenueChart.jsx    # Line/bar chart (Recharts)
│   │       ├── InventoryTable.jsx  # Watch stock table with low-stock highlight
│   │       ├── LowStockAlert.jsx   # Alert banner for low inventory
│   │       └── TopWatches.jsx      # Best performing watches table
│   │
│   ├── context/                    # Global state management
│   │   ├── AuthContext.jsx         # user, token, login(), logout(), isAuthenticated
│   │   ├── CartContext.jsx         # cartItems, addItem(), removeItem(), clearCart()
│   │   └── WishlistContext.jsx     # wishlistItems, toggleWishlist()
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.js              # Consumes AuthContext
│   │   ├── useCart.js              # Consumes CartContext
│   │   ├── useWishlist.js          # Consumes WishlistContext
│   │   ├── useFilters.js           # Watch filter state + query string sync
│   │   ├── usePagination.js        # Page, limit, total state management
│   │   └── useDebounce.js          # Debounced value (search inputs)
│   │
│   ├── pages/                      # Route-level page components
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx        # Role selection: Vendor or Customer
│   │   │
│   │   ├── customer/
│   │   │   ├── Home.jsx            # Hero + featured + trending watches
│   │   │   ├── Catalog.jsx         # Watch listing with filters + pagination
│   │   │   ├── WatchDetail.jsx     # Full product page + reviews
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx        # Address + payment + coupon
│   │   │   ├── OrderList.jsx       # Customer order history
│   │   │   ├── OrderDetail.jsx     # Order timeline + items
│   │   │   ├── Wishlist.jsx
│   │   │   └── Profile.jsx         # Account info + referral code
│   │   │
│   │   ├── vendor/
│   │   │   ├── Dashboard.jsx       # Analytics overview
│   │   │   ├── ManageWatches.jsx   # Watch listing table with actions
│   │   │   ├── AddWatch.jsx        # Create watch form
│   │   │   ├── EditWatch.jsx       # Edit existing watch
│   │   │   ├── VendorOrders.jsx    # Incoming orders management
│   │   │   ├── Inventory.jsx       # Stock levels + low stock alerts
│   │   │   └── Analytics.jsx       # Revenue charts + top products
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── Users.jsx
│   │       └── Reviews.jsx         # Review moderation
│   │
│   ├── routes/                     # Routing configuration
│   │   ├── AppRouter.jsx           # All route definitions
│   │   ├── ProtectedRoute.jsx      # Redirects unauthenticated users
│   │   └── RoleRoute.jsx           # Restricts route to specific role
│   │
│   ├── utils/                      # Pure utility functions (no side effects)
│   │   ├── formatCurrency.js       # formatCurrency(amount, currency)
│   │   ├── formatDate.js           # formatDate(isoString)
│   │   ├── validateSchema.js       # Zod schema wrappers
│   │   └── constants.js            # ROLES, MOVEMENT_TYPES, GENDER, ORDER_STATUS, etc.
│   │
│   ├── styles/
│   │   └── globals.css             # Tailwind base + custom CSS variables
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env                            # Local environment (git-ignored)
├── .env.example                    # Committed — all keys, no values
├── .gitignore
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## Project Structure — Backend

```
watchvault-backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── supabase.js             # Supabase client (service role key)
│   │   └── env.js                  # Validates + exports all env variables on boot
│   │
│   ├── modules/                    # Feature modules — each is self-contained MVC unit
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.js  # register, login, logout, refreshToken, forgotPassword
│   │   │   ├── auth.service.js     # Business logic: hash, token signing, DB ops
│   │   │   ├── auth.routes.js      # POST /auth/register, /auth/login, /auth/logout
│   │   │   └── auth.validator.js   # Zod schemas for auth payloads
│   │   │
│   │   ├── watches/
│   │   │   ├── watch.controller.js # getAll, getById, create, update, delete
│   │   │   ├── watch.service.js    # Filter logic, ownership check, image URL handling
│   │   │   ├── watch.routes.js     # Public + vendor-protected routes
│   │   │   └── watch.validator.js  # Full watch attribute validation (enums, ranges)
│   │   │
│   │   ├── orders/
│   │   │   ├── order.controller.js # checkout, getOrders, getById, updateStatus, cancel
│   │   │   ├── order.service.js    # Cart validation, coupon apply, total calc, state machine
│   │   │   ├── order.routes.js     # Customer + vendor order routes
│   │   │   └── order.validator.js
│   │   │
│   │   ├── inventory/
│   │   │   ├── inventory.controller.js  # getInventory, updateThreshold
│   │   │   ├── inventory.service.js     # deductStock, restoreStock, checkLowStock
│   │   │   └── inventory.routes.js      # Vendor-only routes
│   │   │
│   │   ├── cart/
│   │   │   ├── cart.controller.js
│   │   │   ├── cart.service.js
│   │   │   └── cart.routes.js
│   │   │
│   │   ├── wishlist/
│   │   │   ├── wishlist.controller.js
│   │   │   ├── wishlist.service.js
│   │   │   └── wishlist.routes.js
│   │   │
│   │   ├── reviews/
│   │   │   ├── review.controller.js  # submit, getByWatch, moderate (admin)
│   │   │   ├── review.service.js     # Purchase verification, content filter, rating update
│   │   │   ├── review.routes.js
│   │   │   └── review.validator.js
│   │   │
│   │   ├── coupons/
│   │   │   ├── coupon.controller.js  # validate, create (vendor/admin), deactivate
│   │   │   ├── coupon.service.js     # Expiry check, usage limit, discount calculation
│   │   │   └── coupon.routes.js
│   │   │
│   │   ├── referrals/
│   │   │   ├── referral.controller.js  # getReferralCode, getStats
│   │   │   ├── referral.service.js     # Generate code, track signup, grant reward
│   │   │   └── referral.routes.js
│   │   │
│   │   ├── analytics/
│   │   │   ├── analytics.controller.js # getDashboard, getRevenue, getTopWatches
│   │   │   ├── analytics.service.js    # PostgreSQL aggregation queries
│   │   │   └── analytics.routes.js     # Vendor-only
│   │   │
│   │   └── notifications/
│   │       ├── notification.controller.js  # getNotifications, markRead
│   │       ├── notification.service.js     # dispatch(), email sending, in-app insert
│   │       └── notification.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js      # Verifies JWT, attaches req.user
│   │   ├── role.middleware.js      # requireRole('vendor') factory function
│   │   ├── validate.middleware.js  # Zod schema validation middleware
│   │   ├── upload.middleware.js    # Multer config for watch images
│   │   ├── rateLimiter.js          # express-rate-limit config per route group
│   │   └── errorHandler.js         # Global Express error handler (last middleware)
│   │
│   ├── utils/
│   │   ├── AppError.js             # Custom operational error class
│   │   ├── asyncHandler.js         # Wraps async controller functions
│   │   ├── response.js             # sendSuccess(), sendError() helpers
│   │   ├── logger.js               # Structured console/file logger
│   │   └── constants.js            # ROLES, ORDER_STATUS, MOVEMENT_TYPES, etc.
│   │
│   ├── routes/
│   │   └── index.js                # Mounts all module routers under /api/v1
│   │
│   └── index.js                    # Express app setup + server boot
│
├── .env                            # Local environment (git-ignored)
├── .env.example                    # Committed — all keys, no values
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- Supabase project (free tier works)
- Git

---

### 1. Clone Repositories

```bash
# Frontend
git clone https://github.com/your-org/watchvault-frontend.git
cd watchvault-frontend

# Backend (separate terminal)
git clone https://github.com/your-org/watchvault-backend.git
cd watchvault-backend
```

---

### 2. Install Dependencies

```bash
# Frontend
cd watchvault-frontend
npm install

# Backend
cd watchvault-backend
npm install
```

---

### 3. Configure Environment Variables

```bash
# Frontend
cp .env.example .env
# Fill in values (see Environment Variables section)

# Backend
cp .env.example .env
# Fill in values (see Environment Variables section)
```

---

### 4. Run Development Servers

```bash
# Frontend — runs on http://localhost:5173
npm run dev

# Backend — runs on http://localhost:5000
npm run dev
```

---

## Environment Variables

### Frontend — `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Backend — `.env`

```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT
JWT_SECRET=your_64_char_minimum_secret_here
JWT_REFRESH_SECRET=your_64_char_minimum_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# App
FRONTEND_URL=http://localhost:5173

# Storage
STORAGE_BUCKET_WATCHES=watch-images

# Email (SMTP)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your_smtp_password_here

# Payment
PAYMENT_SECRET_KEY=your_stripe_or_razorpay_secret_key
```

---

## Available Scripts

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check |

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run lint` | ESLint check |

---

## API Overview

All endpoints are prefixed with `/api/v1`

### Auth
```
POST   /auth/register          # Register as vendor or customer
POST   /auth/login             # Login, returns access + refresh token
POST   /auth/logout            # Invalidate refresh token
POST   /auth/refresh           # Get new access token
POST   /auth/forgot-password   # Send reset OTP
POST   /auth/reset-password    # Reset with token
```

### Watches (Public)
```
GET    /watches                # Paginated catalog with filters
GET    /watches/:id            # Single watch detail
```

### Watches (Vendor)
```
POST   /vendor/watches         # Create new watch listing
PUT    /vendor/watches/:id     # Update watch
DELETE /vendor/watches/:id     # Soft delete watch
GET    /vendor/watches         # Vendor's own listings
```

### Orders
```
POST   /orders/checkout        # Place order from cart
GET    /orders                 # Customer order history
GET    /orders/:id             # Order detail + timeline
PATCH  /orders/:id/status      # Vendor updates order status
POST   /orders/:id/cancel      # Customer cancels order
```

### Cart
```
GET    /cart                   # Get current cart
POST   /cart                   # Add item
PATCH  /cart/:itemId           # Update quantity
DELETE /cart/:itemId           # Remove item
DELETE /cart                   # Clear cart
```

### Wishlist
```
GET    /wishlist               # Get wishlist
POST   /wishlist               # Add watch
DELETE /wishlist/:watchId      # Remove watch
```

### Reviews
```
GET    /reviews/watch/:watchId # Get approved reviews
POST   /reviews                # Submit review (purchase required)
```

### Coupons
```
POST   /coupons/validate       # Validate coupon code
POST   /vendor/coupons         # Vendor creates coupon
DELETE /vendor/coupons/:id     # Deactivate coupon
```

### Referrals
```
GET    /referrals/code         # Get personal referral code
GET    /referrals/stats        # Referral stats + rewards
```

### Vendor Analytics
```
GET    /vendor/analytics       # Dashboard: revenue, orders, top watches
GET    /vendor/analytics/revenue?from=&to=   # Revenue by date range
GET    /vendor/analytics/top-watches         # Best sellers
GET    /vendor/inventory       # Inventory table with stock levels
```

### Notifications
```
GET    /notifications          # Inbox (paginated)
PATCH  /notifications/:id/read # Mark as read
```

---

## Roles & Access

| Feature | Customer | Vendor | Admin |
|---------|----------|--------|-------|
| Browse watches | ✅ | ✅ | ✅ |
| Purchase watches | ✅ | ❌ | ❌ |
| Create watch listings | ❌ | ✅ | ❌ |
| Manage own listings | ❌ | ✅ | ❌ |
| View own orders | ✅ | ✅ | ✅ |
| Update order status | ❌ | ✅ | ✅ |
| Submit reviews | ✅ | ❌ | ❌ |
| Moderate reviews | ❌ | ❌ | ✅ |
| View analytics | ❌ | ✅ (own) | ✅ |
| Referral codes | ✅ | ❌ | ❌ |
| Create coupons | ❌ | ✅ | ✅ |

---

## Core Features

- **Role-Based Authentication** — JWT + refresh token flow for Vendors and Customers
- **Watch CRUD** — Full listing management with attribute validation and image upload
- **Advanced Filters** — Brand, movement type, gender, price range, dial size, strap material
- **Cart & Checkout** — Real-time stock validation, coupon application, payment integration
- **Order Management** — State machine: Pending → Confirmed → Processing → Shipped → Delivered
- **Order Tracking Timeline** — Step-by-step status history per order
- **Reviews & Ratings** — Purchase-verified reviews with aggregate rating updates
- **Wishlist** — Save watches for later, price drop notifications ready
- **Coupons** — Vendor-created codes with expiry, usage limits, and percentage/fixed discounts
- **Inventory Monitoring** — Real-time stock tracking with configurable low-stock alerts
- **Referral Tracking** — Unique codes, conversion tracking, reward credit system
- **Vendor Analytics Dashboard** — Revenue charts, top products, order metrics
- **AI Recommendations** *(optional)* — Behavioral tracking + similarity scoring

---

## Database Schema Overview

```
users
  id, email, password_hash, role, created_at

vendor_profiles
  id, user_id (FK), store_name, description, logo_url

customer_profiles
  id, user_id (FK), full_name, phone, default_address_id

watches
  id, vendor_id (FK), brand, model_name, movement_type,
  dial_size, strap_material, case_material, water_resistance,
  gender, warranty, price, stock_quantity, average_rating,
  review_count, is_active, created_at

watch_images
  id, watch_id (FK), image_url, is_primary, sort_order

orders
  id, customer_id (FK), status, subtotal, discount, total,
  coupon_id (FK), address_id (FK), created_at

order_items
  id, order_id (FK), watch_id (FK), vendor_id (FK),
  quantity, unit_price, snapshot_name

order_timeline
  id, order_id (FK), status, note, created_at

reviews
  id, customer_id (FK), watch_id (FK), rating, title,
  body, status, created_at

cart_items
  id, customer_id (FK), watch_id (FK), quantity

wishlist_items
  id, customer_id (FK), watch_id (FK), created_at

coupons
  id, vendor_id (FK), code, discount_type, discount_value,
  min_order_value, usage_limit, used_count, expires_at, is_active

referrals
  id, referrer_id (FK), referred_user_id (FK), code,
  status, reward_granted, converted_at

notifications
  id, user_id (FK), type, message, is_read, created_at

refresh_tokens
  id, user_id (FK), token_hash, expires_at, revoked
```

---

## Deployment

### Frontend → Netlify

1. Connect `watchvault-frontend` repo in Netlify dashboard
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add all `VITE_*` environment variables in Netlify → Site Settings → Environment Variables
5. Ensure `public/_redirects` contains: `/* /index.html 200`
6. Deploy from `main` branch

### Backend → Render

1. Create a new **Web Service** in Render dashboard
2. Connect `watchvault-backend` repo
3. Build command: `npm install`
4. Start command: `node src/index.js`
5. Add all environment variables in Render → Environment tab
6. Auto-deploy on push to `main`
7. Use health check path: `/health`

---

## Architecture Documents

| Document | Description |
|----------|-------------|
| [`Agents.md`](./Agents.md) | Multi-agent system architecture — all 9 automation agents with flows |
| [`Skills.md`](./Skills.md) | Competency blueprint — technical, engineering, and soft skills required |
| [`cursor.md`](./cursor.md) | Strict Cursor AI system instructions — coding standards, rules, enforcement |

---

## Contributing

1. Fork the relevant repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit using Conventional Commits: `git commit -m "feat: add watch filter by dial size"`
4. Push and open a Pull Request against `develop`
5. PRs to `main` require review approval

---

## License

MIT License — see `LICENSE` file for details.

---

*Built with precision. Just like the watches it sells.*