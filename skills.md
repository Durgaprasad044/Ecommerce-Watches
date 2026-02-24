# Skills.md — Competency Blueprint
## WatchVault: Multi-Vendor Watch Ecommerce Platform

---

## Overview

This document defines the complete skill blueprint required to architect, build, and deploy the WatchVault platform. Skills are organized by domain and rated by criticality: **[CORE]** = non-negotiable, **[ADVANCED]** = strongly recommended, **[OPTIONAL]** = enhances the platform.

---

## 1. Technical Skills

---

### 1.1 Frontend — React, Tailwind CSS, ShadCN UI, Axios

#### React **[CORE]**
- Functional components exclusively — no class components
- `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef` hooks
- Context API for global state (AuthContext, CartContext, WishlistContext)
- Custom hooks: `useAuth()`, `useCart()`, `useFilters()`, `usePagination()`
- React Router v6: nested routes, protected routes, lazy loading with `React.lazy`
- Controlled form components for checkout, registration, watch CRUD
- Error boundaries for graceful failure handling
- Component composition patterns over prop drilling

#### Tailwind CSS **[CORE]**
- Utility-first styling — no inline styles, no external CSS files where avoidable
- Responsive design: `sm`, `md`, `lg`, `xl` breakpoints
- Custom theme extension in `tailwind.config.js` (luxury watch brand palette)
- Dark mode support using Tailwind's `dark:` variant
- CSS variables for brand color tokens
- Custom component classes via `@apply` in globals where needed

#### ShadCN UI **[CORE]**
- Component installation and customization (`Button`, `Dialog`, `Sheet`, `Dropdown`, `Badge`, `Card`, `Toast`, `Table`, `Select`, `Input`, `Slider`)
- Composing ShadCN components with custom Tailwind overrides
- Accessible UI patterns (ARIA attributes, keyboard navigation)
- Form validation integration with `react-hook-form` + `zod`
- Toast notification system (`useToast`)

#### Axios **[CORE]**
- Centralized Axios instance with `baseURL` from environment variable
- Request interceptors for automatic JWT header injection
- Response interceptors for 401 handling and token refresh
- Consistent error extraction from response payloads
- Cancellation tokens for unmounted component cleanup
- Service-layer abstraction: `authService.js`, `watchService.js`, `orderService.js`

---

### 1.2 Backend — Node.js, Express.js, MVC Architecture

#### Node.js **[CORE]**
- Async/await throughout — no callback patterns
- Environment configuration via `dotenv`
- Process error handling: `uncaughtException`, `unhandledRejection`
- Non-blocking I/O understanding for DB and storage operations
- `nodemon` for development, PM2 for production process management

#### Express.js **[CORE]**
- Router-level modularization: separate router files per domain
- Middleware stack: CORS, Helmet, rate limiting, JSON parser, compression
- Error-handling middleware as last registered middleware
- Request validation middleware using `zod` or `joi`
- File upload handling with `multer`
- Route-level auth and role guard middleware

#### MVC Architecture **[CORE]**
- **Models**: Supabase query abstractions (not ORM, but structured service functions)
- **Views**: JSON responses only — API is headless
- **Controllers**: Thin — extract params, call service, return response
- **Services**: All business logic lives here — reusable, testable
- **Agents**: Domain-specific automation logic (as defined in Agents.md)
- Strict separation: controllers never touch DB directly

---

### 1.3 Database — Supabase, PostgreSQL, Relationships

#### Supabase **[CORE]**
- Supabase JS client (`@supabase/supabase-js`) — server-side with service role key
- Row-level security (RLS) policies: vendors see own data, customers see public data
- Supabase Storage for watch images (bucket per vendor or shared)
- Supabase Auth optionally for supplementary user management
- Real-time subscriptions for inventory updates (optional)

#### PostgreSQL & Relational Design **[CORE]**
- Normalized schema design (3NF minimum)
- Primary keys as UUIDs across all tables
- Foreign key constraints with appropriate cascade rules
- Junction tables: `order_items`, `watch_images`, `cart_items`
- Indexes on frequently queried columns: `vendorId`, `watchId`, `customerId`, `status`
- `CHECK` constraints for enums: movementType, gender, orderStatus
- `TIMESTAMPTZ` for all timestamps

#### Core Table Relationships
```
users (1) ──────────── (1) vendor_profiles
users (1) ──────────── (1) customer_profiles
vendor_profiles (1) ── (N) watches
watches (N) ─────────── (N) orders [via order_items]
customers (1) ────────── (N) orders
orders (1) ──────────── (N) order_items
orders (1) ──────────── (N) order_timeline
watches (1) ──────────── (N) reviews
customers (1) ────────── (N) wishlist_items
customers (1) ────────── (1) referrals
```

---

### 1.4 DevOps — Render, Netlify, Environment Configuration

#### Netlify (Frontend) **[CORE]**
- Build command: `npm run build`, publish dir: `dist` or `build`
- Environment variables configured in Netlify dashboard (never in repo)
- `_redirects` file for React Router SPA fallback: `/* /index.html 200`
- Branch-based preview deployments for staging
- Custom domain + HTTPS configuration

#### Render (Backend) **[CORE]**
- Web Service deployment with `node src/index.js` start command
- Environment variables via Render dashboard
- Health check endpoint: `GET /health` returning `{ status: 'ok' }`
- Auto-deploy on push to `main` branch
- Free tier cold start handling — implement keepalive ping if needed

#### Environment Configuration **[CORE]**
- `.env` for local, `.env.example` committed to repo (no real values)
- Separate env files per environment: `.env.development`, `.env.production`
- All secrets in env vars: DB URL, JWT secret, API keys, Supabase keys
- Frontend uses `VITE_` prefix for Vite env variables
- Backend never exposes env vars to client

---

### 1.5 Security **[CORE]**

- **Password hashing**: `bcryptjs` with minimum 12 salt rounds
- **JWT**: Short-lived access tokens (15min), long-lived refresh tokens (7d)
- **Input validation**: `zod` schema validation on every incoming request
- **SQL injection prevention**: Parameterized queries via Supabase client only
- **XSS prevention**: Sanitize user-generated content before storage
- **Rate limiting**: `express-rate-limit` on auth routes (login, register)
- **CORS**: Strict origin whitelist from environment variable
- **Helmet.js**: HTTP header hardening
- **HTTPS**: Enforced on both Netlify and Render
- **Referral code security**: Cryptographically random codes via `nanoid`
- **Ownership validation**: Every vendor mutation verified against `vendorId` from JWT

---

## 2. Engineering Skills

---

### 2.1 REST API Design **[CORE]**

- RESTful resource naming: `/api/watches`, `/api/orders/:id/status`
- Correct HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
- Consistent URL structure: `/api/v1/{resource}` versioned from day one
- Query param conventions for filtering, sorting, pagination
- HTTP status codes used correctly: 200, 201, 400, 401, 403, 404, 409, 422, 500
- Standard response envelope on all endpoints

### 2.2 Role-Based Architecture **[CORE]**

- Roles defined at token level: `vendor` | `customer` | `admin`
- Route-level guards: `requireAuth`, `requireRole('vendor')`
- Data scoping: vendors query only their own watches and orders
- Admin endpoints separate and additionally protected
- No frontend-only role enforcement — always validated server-side

### 2.3 Database Normalization **[CORE]**

- Eliminate data duplication via proper foreign keys
- Watch attributes in dedicated `watches` table — no JSON blobs
- Order snapshots: capture price at time of order (not live price)
- Avoid storing computed values — calculate on read where feasible

### 2.4 Error Handling **[CORE]**

- Centralized error handler middleware in Express
- Custom error classes: `AppError`, `ValidationError`, `AuthError`, `NotFoundError`
- Never expose raw stack traces in production responses
- Log errors server-side with context (userId, route, timestamp)
- Frontend: Axios interceptor catches and normalizes all API errors

### 2.5 Scalable Folder Structure **[CORE]**

- Feature-based organization on frontend (`/features/watches`, `/features/orders`)
- Domain-driven structure on backend (`/modules/auth`, `/modules/inventory`)
- Shared utilities separate from feature code
- No God files — maximum 200 lines per file as guideline

### 2.6 Clean Code Principles **[CORE]**

- Descriptive variable and function names — no abbreviations
- Single responsibility per function
- DRY: extract repeated logic into shared utilities
- Functions under 30 lines as guideline
- Comments explain *why*, not *what*
- No commented-out dead code in production branches

### 2.7 Reusability & Modular Design **[CORE]**

- Frontend: Atomic component design — `WatchCard`, `PriceTag`, `RatingStars`, `StockBadge`
- Backend: Service functions composable across controllers
- Shared validation schemas used on both FE and BE (or mirrored)
- Generic hooks: `useFetch`, `useDebounce`, `useLocalStorage`

### 2.8 Performance Optimization **[ADVANCED]**

- Lazy loading routes with `React.lazy` + `Suspense`
- Image optimization: serve from Supabase Storage with size params
- Debounced search and filter inputs (300ms)
- Pagination on all list endpoints (default: 20 items/page)
- Memoization: `useMemo`, `useCallback` for expensive computations
- PostgreSQL indexes on hot query columns
- Response compression via `compression` middleware

---

## 3. Advanced / AI Skills (Optional)

---

### 3.1 Recommendation Logic **[OPTIONAL]**

- Collaborative filtering: users with similar purchase history
- Content-based filtering: watch attributes similarity scoring
- Cosine similarity on watch attribute vectors
- Behavioral event logging schema design

### 3.2 Behavioral Tracking **[OPTIONAL]**

- Event schema: `{ userId, watchId, eventType, timestamp, metadata }`
- Session-based tracking for anonymous users
- Privacy-compliant data collection (no PII in event logs)
- Aggregation pipeline for recommendation scoring

### 3.3 Data Aggregation **[ADVANCED]**

- PostgreSQL window functions for ranking top products
- TIME_BUCKET aggregations for time-series revenue charts
- Materialized views for expensive analytics queries
- Incremental aggregation on order completion events

### 3.4 Analytics Dashboards **[ADVANCED]**

- Recharts / Chart.js integration for frontend charts
- Real-time metrics refresh via polling or Supabase Realtime
- Export to CSV functionality for vendor reports
- KPI card components: Revenue, Orders, Avg. Order Value, Conversion Rate

---

## 4. Soft Skills

---

### 4.1 UI/UX Thinking — Luxury Watch Theme **[CORE]**

- Design sensibility aligned with premium watch brands (Rolex, Omega aesthetic)
- Color palette: deep navy, gold accents, white space, charcoal
- Typography: serif for headings, sans-serif for body (Google Fonts)
- Photography-first product display — large hero images, clean backgrounds
- Micro-interactions: hover effects on watch cards, smooth transitions
- Mobile-first responsive design — watches are impulse purchases on mobile
- Accessibility: WCAG AA compliance, sufficient color contrast

### 4.2 Scalability Thinking **[CORE]**

- Design data models to accommodate new watch attributes without schema rewrites
- API versioning from day one (`/api/v1/`)
- Feature flags approach for rolling out new features
- Anticipate multi-currency support in pricing model

### 4.3 Maintainability **[CORE]**

- Consistent code style enforced via ESLint + Prettier
- `.editorconfig` for cross-editor consistency
- Git branching strategy: `main` (prod), `develop` (staging), feature branches
- Meaningful commit messages following Conventional Commits format
- PR reviews before merging to `main`

### 4.4 Documentation Discipline **[CORE]**

- `README.md` in both repos: setup, env vars, scripts, architecture overview
- API documentation via Postman collection or Swagger/OpenAPI
- Inline JSDoc comments for complex service functions
- `CHANGELOG.md` maintained for release tracking
- `Agents.md`, `Skills.md`, `cursor.md` maintained and updated with platform evolution

---

## Skill Maturity Summary

| Domain | Required Level |
|--------|---------------|
| React + Hooks | Advanced |
| Tailwind + ShadCN | Intermediate |
| Node + Express MVC | Advanced |
| Supabase + PostgreSQL | Intermediate–Advanced |
| JWT Auth + Security | Advanced |
| REST API Design | Advanced |
| Git + CI/CD | Intermediate |
| UI/UX — Luxury Theme | Intermediate |
| AI Recommendations | Beginner–Intermediate |
| Analytics + Aggregation | Intermediate |