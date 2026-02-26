# WatchVault Backend — File Structure Guide

---

## `src/config/`

### `env.js`
Loads and validates environment variables using `dotenv`. Exports a config object with values like `PORT`, `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `FRONTEND_URL`, etc. Acts as the single source of truth for all env vars — never use `process.env` directly elsewhere.

### `supabase.js`
Initializes and exports two Supabase clients: one using the `anon` key (for client-level operations) and one using the `service_role` key (for admin/server-side operations that bypass RLS).

### `db.js`
A thin abstraction layer over the Supabase client for direct database queries. Exports helper methods like `query(table)`, or simply re-exports the Supabase admin client. Useful for swapping DB clients later.

### `constants.js`
App-wide config constants: `MAX_FILE_SIZE`, `ALLOWED_IMAGE_TYPES`, `PAGINATION_LIMIT`, `TOKEN_EXPIRY`, `ROLES`, `ORDER_STATUS`, `PAYMENT_STATUS` enums.

---

## `src/modules/auth/`

### `auth.routes.js`
Defines Express routes: `POST /register`, `POST /login`, `POST /logout`, `POST /refresh-token`, `POST /forgot-password`, `POST /reset-password`, `GET /me`. Attaches validator middleware before controllers.

### `auth.validator.js`
Joi or Zod schemas for auth inputs. Validates `email`, `password` strength, and `name` on register. Used by `validate.middleware.js`.

### `auth.controller.js`
Thin layer — calls `auth.service.js` methods and sends HTTP responses. Wrapped in `asyncHandler`. Methods: `register`, `login`, `logout`, `refreshToken`, `forgotPassword`, `resetPassword`, `getMe`.

### `auth.service.js`
All business logic. Talks to Supabase Auth (`signUp`, `signInWithPassword`, `signOut`, `resetPasswordForEmail`). Creates a user record in the `users` table post-registration. Handles referral code application on register.

---

## `src/modules/users/`

### `user.routes.js`
Routes: `GET /users` (admin), `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id`, `GET /users/:id/orders`, `GET /users/:id/wishlist`. Protected by `auth.middleware` and `role.middleware`.

### `user.validator.js`
Validates profile update fields: `name`, `phone`, `address` object (street, city, state, zip, country), `avatar_url`.

### `user.controller.js`
Handles HTTP layer for: `getAllUsers`, `getUserById`, `updateUser`, `deleteUser`, `getUserOrders`, `getUserWishlist`.

### `user.service.js`
Queries Supabase `users` table. Handles profile updates, soft deletes, fetching related orders/wishlist, and avatar upload URL generation.

---

## `src/modules/watches/`

### `watch.routes.js`
Public routes: `GET /watches`, `GET /watches/:id`, `GET /watches/featured`, `GET /watches/search`. Admin routes: `POST /watches`, `PUT /watches/:id`, `DELETE /watches/:id`, `POST /watches/:id/images`.

### `watch.validator.js`
Validates watch creation/update: `name`, `brand`, `model`, `price`, `description`, `category`, `sku`, `stock_quantity`, `specifications` (object), `images` (array).

### `watch.controller.js`
Methods: `getAllWatches`, `getWatchById`, `createWatch`, `updateWatch`, `deleteWatch`, `getFeaturedWatches`, `searchWatches`, `uploadWatchImages`.

### `watch.service.js`
Core catalog logic. Handles filtering (brand, price range, category), sorting, pagination, full-text search, image uploads to Supabase Storage, and inventory checks. Joins with `inventory` table for stock data.

---

## `src/modules/orders/`

### `order.routes.js`
`POST /orders`, `GET /orders`, `GET /orders/:id`, `PUT /orders/:id/status` (admin), `POST /orders/:id/cancel`, `GET /orders/:id/invoice`.

### `order.validator.js`
Validates order creation: `items` array (watch_id, quantity), `shipping_address`, `payment_method`, `coupon_code` (optional).

### `order.controller.js`
Methods: `createOrder`, `getAllOrders`, `getOrderById`, `updateOrderStatus`, `cancelOrder`, `getInvoice`.

### `order.service.js`
Most complex service. Handles: stock validation, price calculation, coupon and referral credit application, inventory deduction, order creation, payment intent creation, confirmation notification, and referral stats update.

---

## `src/modules/cart/`

### `cart.routes.js`
`GET /cart`, `POST /cart/items`, `PUT /cart/items/:itemId`, `DELETE /cart/items/:itemId`, `DELETE /cart` (clear). All protected.

### `cart.controller.js`
Methods: `getCart`, `addItem`, `updateItem`, `removeItem`, `clearCart`.

### `cart.service.js`
Manages `cart` and `cart_items` tables. Validates stock on add. Calculates cart totals. One cart per user, auto-created on first add.

---

## `src/modules/wishlist/`

### `wishlist.routes.js`
`GET /wishlist`, `POST /wishlist/:watchId`, `DELETE /wishlist/:watchId`. Protected.

### `wishlist.controller.js`
Methods: `getWishlist`, `addToWishlist`, `removeFromWishlist`.

### `wishlist.service.js`
Manages `wishlist_items` table. Toggle-style logic (add if not present, remove if present). Returns wishlist with full watch details via join.

---

## `src/modules/reviews/`

### `review.routes.js`
`GET /watches/:watchId/reviews`, `POST /watches/:watchId/reviews`, `PUT /reviews/:id`, `DELETE /reviews/:id`. Posting requires auth and a verified purchase.

### `review.validator.js`
Validates: `rating` (1–5 integer), `title` (optional), `body` (min 10 chars), `images` (optional array).

### `review.controller.js`
Methods: `getWatchReviews`, `createReview`, `updateReview`, `deleteReview`.

### `review.service.js`
Creates review records, checks for verified purchase before allowing submission, calculates and updates average rating on the watch record, handles review images.

---

## `src/modules/coupons/`

### `coupon.routes.js`
Admin: `POST /coupons`, `GET /coupons`, `PUT /coupons/:id`, `DELETE /coupons/:id`. Public: `POST /coupons/validate`.

### `coupon.controller.js`
Methods: `createCoupon`, `getAllCoupons`, `updateCoupon`, `deleteCoupon`, `validateCoupon`.

### `coupon.service.js`
Handles coupon types: `PERCENTAGE`, `FIXED_AMOUNT`, `FREE_SHIPPING`. Validates expiry, usage limits (`max_uses`, `uses_per_user`), minimum order value, and applicable watch/category restrictions. Returns discount amount for a given cart total.

---

## `src/modules/referrals/`

### `referral.routes.js`
`GET /referrals/my-code`, `GET /referrals/stats`, `GET /referrals` (admin).

### `referral.controller.js`
Methods: `getMyReferralCode`, `getReferralStats`, `getAllReferrals`.

### `referral.service.js`
Generates unique referral codes on user creation. Tracks referral relationships in `referrals` table. On referred user's first purchase, credits referrer with points or discount.

---

## `src/modules/inventory/`

### `inventory.routes.js`
Admin only: `GET /inventory`, `PUT /inventory/:watchId`, `POST /inventory/:watchId/adjust`, `GET /inventory/low-stock`.

### `inventory.controller.js`
Methods: `getAllInventory`, `updateStock`, `adjustStock`, `getLowStockAlerts`.

### `inventory.service.js`
Manages `inventory` table (1:1 with watches). Tracks `quantity`, `reserved_quantity`, `low_stock_threshold`. `adjustStock` logs to `inventory_logs`. Triggers admin notification on low stock.

---

## `src/modules/analytics/`

### `analytics.routes.js`
Admin only: `GET /analytics/dashboard`, `GET /analytics/sales`, `GET /analytics/top-products`, `GET /analytics/users`, `GET /analytics/revenue`.

### `analytics.controller.js`
Methods: `getDashboardStats`, `getSalesAnalytics`, `getTopProducts`, `getUserAnalytics`, `getRevenueReport`.

### `analytics.service.js`
Aggregates data via Supabase queries with date range filters. Dashboard stats: total revenue, orders, new users, conversion rate. Sales grouped by day/week/month. Top products by units sold and by revenue.

---

## `src/modules/notifications/`

### `notification.routes.js`
`GET /notifications`, `PUT /notifications/:id/read`, `PUT /notifications/read-all`, `DELETE /notifications/:id`. Admin: `POST /notifications/broadcast`.

### `notification.controller.js`
Methods: `getNotifications`, `markAsRead`, `markAllAsRead`, `deleteNotification`, `broadcastNotification`.

### `notification.service.js`
Creates notification records in `notifications` table. Types: `ORDER_PLACED`, `ORDER_SHIPPED`, `ORDER_DELIVERED`, `LOW_STOCK`, `REVIEW_APPROVED`, `REFERRAL_EARNED`. Optionally integrates with email or push services.

---

## `src/middleware/`

### `auth.middleware.js`
Extracts JWT from `Authorization: Bearer <token>`. Verifies with Supabase `getUser()` or `jwt.verify()`. Attaches `req.user` (id, email, role). Throws `401` if missing or invalid.

### `role.middleware.js`
Factory function: `requireRole('admin')`. Checks `req.user.role`. Throws `403` if insufficient. Used after `auth.middleware`.

### `validate.middleware.js`
Generic middleware factory that takes a Joi/Zod schema and validates `req.body`, `req.query`, or `req.params`. Returns `400` with validation errors on failure.

### `upload.middleware.js`
Configures `multer` with memory storage and file type/size filters. Exports `uploadSingle('image')` and `uploadMultiple('images', 5)`. Files are uploaded to Supabase Storage in the service layer.

### `rateLimiter.middleware.js`
Uses `express-rate-limit`. Exports: `generalLimiter` (100 req/15min), `authLimiter` (10 req/15min), `uploadLimiter` (20 req/hour). Applied per route group.

### `errorHandler.js`
Global Express error handler `(err, req, res, next)`. Handles `AppError` instances, Supabase/Postgres errors (unique violations → 409, not found → 404), and unexpected errors with 500. Logs via `logger.js`.

---

## `src/utils/`

### `AppError.js`
Custom error class extending `Error`. Constructor: `(message, statusCode, isOperational = true)`. Used throughout services to throw predictable HTTP errors.

### `asyncHandler.js`
Wrapper: `(fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)`. Eliminates try/catch boilerplate in controllers.

### `response.js`
Standardizes API responses. `sendSuccess(res, data, message, statusCode)` → `{ success: true, message, data }`. `sendError(res, message, statusCode)` → `{ success: false, message }`. `sendPaginated` adds pagination metadata.

### `logger.js`
Winston or Pino logger. Logs colorized to console in dev, to files in prod (`logs/error.log`, `logs/combined.log`). Exports `logger.info()`, `logger.warn()`, `logger.error()`.

### `constants.js`
Runtime constants shared across modules: `USER_ROLES`, `ORDER_STATUSES`, `PAYMENT_METHODS`, `NOTIFICATION_TYPES`, `COUPON_TYPES`.

---

## `src/routes/`

### `index.js`
Master router. Mounts all module routes under `/api/v1/`: auth, users, watches, orders, cart, wishlist, reviews, coupons, referrals, inventory, analytics, notifications. Also mounts `GET /api/v1/health`.

---

## `src/`

### `app.js`
Express app setup. Applies global middleware: `helmet`, `cors`, `express.json()`, `morgan`, `rateLimiter`. Mounts routes from `routes/index.js`. Registers global `errorHandler` as the last middleware. Exports `app`.

### `server.js`
Entry point. Imports `app` and calls `app.listen(PORT)`. Handles graceful shutdown on `SIGTERM`/`SIGINT`. Tests Supabase connection on startup.

---

## Root Files

### `.env`
Actual secrets: `PORT`, `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `FRONTEND_URL`, `STRIPE_SECRET_KEY`, etc. Never committed to git.

### `.env.example`
Same keys as `.env` with placeholder values. Committed to git as setup documentation.

### `.gitignore`
Ignores: `node_modules/`, `.env`, `logs/`, `dist/`, `.DS_Store`, `*.log`, `coverage/`.

### `package.json`
Scripts: `start`, `dev` (nodemon), `test`. Dependencies: `express`, `@supabase/supabase-js`, `dotenv`, `helmet`, `cors`, `morgan`, `multer`, `joi`, `winston`, `express-rate-limit`, `jsonwebtoken`, `stripe`, `nanoid`. Dev: `nodemon`, `jest`, `supertest`.

### `README.md`
Project overview, tech stack, setup instructions, API endpoint reference, folder structure, and Supabase table schema overview.