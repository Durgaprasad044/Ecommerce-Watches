# cursor.md — Strict System Instructions for Cursor AI
## WatchVault: Multi-Vendor Watch Ecommerce Platform
### Authority: Senior Full Stack Architect
### Status: ENFORCED — Production Grade

---

> **READ THIS FIRST.** Every line of code generated, modified, or suggested in this project must comply with the rules defined in this file. Non-compliance is a build failure. There are no exceptions. If a rule conflicts with convenience, the rule wins.

---

## 1. Project Overview

**Platform**: WatchVault — Multi-Vendor Watch Ecommerce Marketplace  
**Frontend**: React + Tailwind CSS + ShadCN UI + Axios (deployed to Netlify)  
**Backend**: Node.js + Express.js + MVC Architecture (deployed to Render)  
**Database**: Supabase (PostgreSQL)  
**Repos**: Two separate GitHub repositories — `watchvault-frontend` and `watchvault-backend`  
**Roles**: `vendor`, `customer`, `admin`

---

## 2. Frontend Folder Structure

**ENFORCE THIS EXACTLY. Do not deviate.**

```
watchvault-frontend/
├── public/
├── src/
│   ├── api/                    # Axios instance + service files only
│   │   ├── axiosInstance.js
│   │   ├── authService.js
│   │   ├── watchService.js
│   │   ├── orderService.js
│   │   ├── cartService.js
│   │   ├── reviewService.js
│   │   └── vendorService.js
│   ├── components/             # Reusable, dumb UI components
│   │   ├── common/             # Button, Input, Badge, Modal, Spinner
│   │   ├── watch/              # WatchCard, WatchGrid, WatchFilters, WatchImages
│   │   ├── order/              # OrderSummary, OrderTimeline, OrderStatus
│   │   ├── layout/             # Navbar, Footer, Sidebar, PageWrapper
│   │   └── vendor/             # VendorStats, RevenueChart, InventoryTable
│   ├── context/                # Global state via Context API
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── WishlistContext.jsx
│   ├── hooks/                  # Custom hooks only
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useFilters.js
│   │   ├── usePagination.js
│   │   └── useDebounce.js
│   ├── pages/                  # Route-level page components
│   │   ├── auth/               # Login.jsx, Register.jsx
│   │   ├── customer/           # Home, Catalog, WatchDetail, Cart, Checkout, Orders, Wishlist
│   │   ├── vendor/             # Dashboard, ManageWatches, AddWatch, EditWatch, Orders, Analytics
│   │   └── admin/              # AdminDashboard, Users, Reviews
│   ├── routes/                 # Route definitions and guards
│   │   ├── AppRouter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleRoute.jsx
│   ├── utils/                  # Pure utility functions
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   ├── validateSchema.js
│   │   └── constants.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

**DO NOT:**
- Put API calls inside page or component files
- Create a `/services` folder inside `/pages`
- Mix context logic into page components
- Create a single monolithic `App.css`

---

## 3. Backend Folder Structure

**ENFORCE THIS EXACTLY. MVC is mandatory.**

```
watchvault-backend/
├── src/
│   ├── config/
│   │   ├── supabase.js         # Supabase client initialization
│   │   └── env.js              # Validated env variable exports
│   ├── modules/                # Feature modules (MVC per domain)
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validator.js
│   │   ├── watches/
│   │   │   ├── watch.controller.js
│   │   │   ├── watch.service.js
│   │   │   ├── watch.routes.js
│   │   │   └── watch.validator.js
│   │   ├── orders/
│   │   │   ├── order.controller.js
│   │   │   ├── order.service.js
│   │   │   ├── order.routes.js
│   │   │   └── order.validator.js
│   │   ├── inventory/
│   │   ├── reviews/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── coupons/
│   │   ├── referrals/
│   │   ├── analytics/
│   │   └── notifications/
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── role.middleware.js   # Role guard factory
│   │   ├── validate.middleware.js
│   │   ├── errorHandler.js      # Global error handler
│   │   └── rateLimiter.js
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── asyncHandler.js      # Wraps async controllers
│   │   ├── response.js          # Standard response formatter
│   │   └── logger.js
│   ├── routes/
│   │   └── index.js             # Mounts all module routers
│   └── index.js                 # Entry point
├── .env
├── .env.example
└── package.json
```

**DO NOT:**
- Write database queries inside controllers
- Write business logic inside routes
- Create a single `routes.js` file for everything
- Mix middleware logic into service files

---

## 4. Coding Standards

**All code must comply. No exceptions.**

### General
- Use `async/await` everywhere. No `.then()/.catch()` chains.
- No `var`. Use `const` by default, `let` only when reassignment is required.
- No unused imports, variables, or parameters.
- Destructure objects immediately: `const { id, role } = req.user`
- Export one thing per file where possible.
- Maximum function length: 40 lines. Extract if longer.

### Frontend
- Functional components only. No class components.
- All components use named exports unless they are page-level defaults.
- Props must be destructured in the function signature.
- No logic inside JSX return blocks — compute values above the return.
- No direct DOM manipulation. React controls the DOM.

### Backend
- All controller functions wrapped in `asyncHandler()`
- No try/catch in controllers — `asyncHandler` handles it
- Services throw `AppError` instances — controllers do not throw
- All routes use explicit HTTP method functions: `router.get`, `router.post`, not `router.use`

---

## 5. Naming Conventions

**Strict. Enforced. Non-negotiable.**

| Item | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `WatchCard.jsx` |
| React hooks | camelCase with `use` prefix | `useCart.js` |
| Context files | PascalCase + Context suffix | `AuthContext.jsx` |
| Service files (FE) | camelCase + Service suffix | `watchService.js` |
| Page files | PascalCase | `WatchDetail.jsx` |
| Backend controllers | camelCase + `.controller.js` | `watch.controller.js` |
| Backend services | camelCase + `.service.js` | `watch.service.js` |
| Backend routes | camelCase + `.routes.js` | `watch.routes.js` |
| Database tables | snake_case plural | `watches`, `order_items` |
| DB columns | snake_case | `vendor_id`, `stock_quantity` |
| Environment variables | SCREAMING_SNAKE_CASE | `SUPABASE_URL` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_IMAGES_PER_WATCH` |
| CSS classes | Tailwind utilities only | `text-gray-800 font-semibold` |

**DO NOT** mix conventions. A file named `watchservice.js` or `Watch_Card.jsx` is wrong.

---

## 6. API Design Standards

### URL Structure
```
/api/v1/{resource}
/api/v1/{resource}/:id
/api/v1/{resource}/:id/{sub-resource}
```

### Examples
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/watches                    # Public catalog
GET    /api/v1/watches/:id                # Single watch
POST   /api/v1/vendor/watches             # Vendor creates watch
PUT    /api/v1/vendor/watches/:id         # Vendor updates watch
DELETE /api/v1/vendor/watches/:id         # Vendor deletes watch
GET    /api/v1/vendor/analytics           # Vendor dashboard data
POST   /api/v1/orders/checkout
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id/status          # Vendor updates status
GET    /api/v1/reviews/watch/:watchId
POST   /api/v1/reviews
```

### Rules
- Nouns only in URLs. No verbs. `/watches/create` is WRONG. `POST /watches` is correct.
- Lowercase, hyphen-separated for multi-word: `/order-timeline`, not `/orderTimeline`
- Version prefix from day one: `/api/v1/`
- Filter/sort/paginate via query params: `?brand=Seiko&movementType=Automatic&page=2&limit=20`

---

## 7. Supabase Integration Rules

- **NEVER** import Supabase client in controllers or routes. Only in service files.
- Use **service role key** on backend only — never expose to frontend.
- Frontend uses **anon key** only, and only if calling Supabase Storage directly.
- All queries use parameterized Supabase JS syntax — no raw SQL string interpolation.
- Enable **Row Level Security (RLS)** on all tables. Disable only with documented reason.
- Use Supabase Storage for watch images. Store only the URL in the `watches` table.
- Image bucket names must come from environment variables.
- All Supabase calls must have error checking: `if (error) throw new AppError(...)`

```javascript
// CORRECT
const { data, error } = await supabase.from('watches').select('*').eq('vendor_id', vendorId);
if (error) throw new AppError(error.message, 500);

// WRONG
const result = await supabase.from('watches').select('*').eq('vendor_id', vendorId);
return result.data; // No error check — forbidden
```

---

## 8. Authentication Rules

- JWT access token expiry: **15 minutes**
- JWT refresh token expiry: **7 days**
- JWT secret must be at minimum 64 characters, stored in env var `JWT_SECRET`
- Refresh tokens stored in `refresh_tokens` table, invalidated on logout
- Password hashing: `bcryptjs`, salt rounds: **12 minimum**
- Never store plain text passwords. Ever.
- Auth middleware extracts user from token and attaches to `req.user`
- Role guard middleware reads `req.user.role` — never trust role from request body

```javascript
// CORRECT — role from verified token
const { userId, role } = req.user;

// WRONG — never trust client-sent role
const { role } = req.body; // FORBIDDEN
```

- Login brute force protection: rate limit to 5 attempts per 15 minutes per IP
- Password reset tokens expire in 30 minutes

---

## 9. Error Handling Standards

### Backend

```javascript
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

- All operational errors thrown as `AppError` instances
- `asyncHandler` wrapper catches async errors and passes to Express error handler
- Global error handler middleware is the ONLY place that sends error responses
- Error responses follow the standard response format (see Section 10)
- In production: never expose stack traces or internal error messages
- In development: include stack trace in error response for debugging

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Frontend

- Axios response interceptor handles all HTTP errors centrally
- 401 responses trigger token refresh or logout flow
- User-facing errors displayed via ShadCN Toast — not `console.error` only
- Never expose raw error objects in UI

---

## 10. Response Format Standard

**Every API response must follow this envelope. No exceptions.**

### Success Response
```json
{
  "success": true,
  "message": "Watches retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Watch not found",
  "errors": []
}
```

### Rules
- `success`: always boolean
- `message`: always present, human-readable
- `data`: present on success, omitted on error
- `meta`: present when paginating, omitted otherwise
- `errors`: array of field-level validation errors when applicable
- HTTP status code must match the semantic of the response (200, 201, 400, 401, 403, 404, 422, 500)

---

## 11. Environment Variable Rules

### Frontend (Vite)
```
VITE_API_BASE_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Backend
```
PORT=
NODE_ENV=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=
STORAGE_BUCKET_WATCHES=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
PAYMENT_SECRET_KEY=
```

### Rules
- `.env` is in `.gitignore` in both repos. Always.
- `.env.example` is committed with all keys and empty values
- Backend validates all required env vars on startup — fail fast if missing
- Frontend accesses env vars only via `import.meta.env.VITE_*`
- Backend accesses env vars only via `process.env.*` from `src/config/env.js`

```javascript
// src/config/env.js — validate on boot
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];
required.forEach(key => {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
});
```

---

## 12. Deployment Rules

### Netlify (Frontend)
- Build command: `npm run build`
- Publish directory: `dist`
- `public/_redirects` must contain: `/* /index.html 200`
- All env vars set in Netlify dashboard — never in repo
- Production branch: `main`
- Preview deployments enabled for `develop` branch

### Render (Backend)
- Start command: `node src/index.js`
- Health check endpoint mandatory: `GET /health` → `{ status: 'ok', timestamp: ... }`
- Auto-deploy on push to `main`
- Environment variables set in Render dashboard only
- If free tier: implement external cron ping every 10min to prevent cold starts

### General
- No production deployments from local machine
- Deployments only via CI/CD from protected branches
- Test build locally before pushing to `main`

---

## 13. Security Rules

- `helmet()` must be the first middleware registered
- CORS must whitelist only `FRONTEND_URL` from env var — no `*` in production
- `express-rate-limit` on all auth routes: 5 req/15min per IP
- All user inputs validated server-side — client validation is UX only, not security
- File uploads: validate MIME type and file size on server. Accept only `image/jpeg`, `image/png`, `image/webp`. Max 5MB per image.
- No `eval()`, no `new Function()`, no dynamic `require()`
- All vendor mutation endpoints verify `vendorId` from JWT matches resource owner
- Sensitive fields (`password`, `refreshToken`) never included in API responses
- Supabase service role key **NEVER** sent to or used on the frontend

---

## 14. No Hardcoding Policy

**Zero tolerance. If it's configurable, it goes in env or constants.**

**NEVER hardcode:**
- URLs or base paths
- Port numbers
- JWT secrets or expiry times
- API keys of any service
- Supabase bucket names
- Role strings scattered in code (define in `constants.js`)
- Pagination defaults (define in `constants.js`)
- Low-stock threshold default values (configurable per vendor)
- Price or currency symbols (support multi-currency from design)

```javascript
// CORRECT — src/utils/constants.js
export const ROLES = { VENDOR: 'vendor', CUSTOMER: 'customer', ADMIN: 'admin' };
export const PAGINATION = { DEFAULT_PAGE: 1, DEFAULT_LIMIT: 20, MAX_LIMIT: 100 };
export const WATCH = { MAX_IMAGES: 8, LOW_STOCK_DEFAULT_THRESHOLD: 5 };

// WRONG — hardcoded in component
if (user.role === 'vendor') { ... } // Use ROLES.VENDOR
```

---

## 15. Component Reusability Policy

- If a UI pattern appears more than twice, it becomes a shared component
- Components accept props for all variable content — zero hardcoded text in reusable components
- Components do not fetch data themselves unless they are page-level or explicitly data components
- Data fetching lives in: page components, custom hooks, or Context
- Shared components live in `src/components/common/`
- Watch-specific components live in `src/components/watch/`
- Do not build a new component for something ShadCN already provides

---

## 16. Scalability Enforcement

- Every list endpoint must support pagination. No unlimited result sets.
- Database queries must specify `select()` columns — never `select('*')` in production code
- Add indexes before going live on all foreign key columns and filter columns
- Avoid N+1 queries — use joins or batch queries
- Analytics queries must not run on the OLTP path — use aggregated/cached results
- Design all data models to accommodate future fields without destructive migrations
- API is versioned from day one — breaking changes go in `/api/v2/`

---

## 17. Watch-Specific Data Validation Rules

**All watch submissions must pass these validations server-side.**

```javascript
// Enforced in watch.validator.js
{
  brand: string, required, minLength: 2, maxLength: 100,
  modelName: string, required, minLength: 2, maxLength: 150,
  movementType: enum['Automatic', 'Quartz', 'Mechanical', 'Smart'], required,
  dialSize: number, required, min: 20, max: 60,         // mm
  strapMaterial: enum['Leather', 'Stainless Steel', 'Rubber', 'Nylon', 'Ceramic', 'Titanium'], required,
  caseMaterial: enum['Stainless Steel', 'Titanium', 'Gold', 'Ceramic', 'Plastic'], required,
  waterResistance: string, required,                    // e.g., "100m", "30m", "3ATM"
  gender: enum['Men', 'Women', 'Unisex'], required,
  warranty: string, required,                           // e.g., "2 Years International"
  price: number, required, min: 0.01, precision: 2,
  stockQuantity: integer, required, min: 0,
  images: array, required, minItems: 1, maxItems: 8,   // URLs after upload
}
```

- `movementType`, `gender`, `strapMaterial`, `caseMaterial` must be validated against defined enums
- Reject any watch submission with `price: 0` — use `stockQuantity: 0` for unavailable items
- `dialSize` stored as numeric (mm) — no unit string in DB
- `waterResistance` stored as string to accommodate multiple formats (ATM, m, bar)

---

## 18. Stock Handling Rules

- Stock deduction must be **atomic** — use Supabase RPC or transaction-equivalent pattern
- Never trust client-submitted quantity — always re-validate against DB on checkout
- Order placement must fail immediately if `requestedQty > currentStock`
- Stock is restored on order cancellation — only for statuses `PENDING` or `CONFIRMED`
- Low-stock threshold triggers notification when `stockQuantity <= threshold` after deduction
- `stockQuantity` column must have a `CHECK (stock_quantity >= 0)` DB constraint
- No negative stock. Ever. At database level.
- Stock updates from multiple concurrent orders must be handled safely:

```javascript
// CORRECT — atomic stock check and decrement via Supabase RPC
const { data, error } = await supabase.rpc('deduct_stock', {
  p_watch_id: watchId,
  p_quantity: quantity
});
// RPC raises exception if stock insufficient — caught by error handler
```

---

## 19. Referral Link Security Rules

- Referral codes generated using `nanoid(10)` minimum — cryptographically random
- Referral codes stored hashed or as-is with uniqueness constraint in DB
- Self-referral is forbidden: `referrerId !== referredUserId` enforced at service level
- One reward per referral relationship — check `rewardGranted` flag before crediting
- Referral reward granted only on first purchase completion (`DELIVERED` status)
- Referral codes expire after 90 days if unclaimed (configurable)
- Rate limit referral code lookups: 10 req/minute per IP to prevent enumeration
- Referral chains capped at depth 1 — no multi-level MLM-style referrals
- Referral code in registration URL param: `?ref=CODE` — stripped before storing user data

---

*End of cursor.md — Senior Architect Authority. All rules are in effect.*