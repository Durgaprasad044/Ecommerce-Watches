# WatchVault — Frontend File Guide
## What Each File Does for a Top‑Notch Watch Store

> This document maps **every key frontend file** to its purpose in building a premium, luxury‑style ecommerce experience for watches.

---

## 1. Root & Config

### `package.json`
- **Role**: Project manifest.
- **Key pieces**:
  - **Dependencies**: React, React Router, Axios, Tailwind, ShadCN, react-hook-form, zod, Recharts, lucide-react, date-fns.
  - **Scripts**: `dev`, `build`, `preview`, `lint`.
- **Why it matters**: Defines the app’s capabilities and how we run and build it.

### `vite.config.js`
- **Role**: Vite build + dev server config.
- **Key pieces**:
  - React plugin and Fast Refresh.
  - Path aliases: `@` → `src`, `@components`, `@api`, `@hooks`, `@utils`, `@context`.
  - Dev server port and optional API proxy.
  - Basic chunk splitting for faster reloads.
- **Impact on UX**: Faster builds and smart caching keep the app snappy.

### `tailwind.config.js`
- **Role**: Design system configuration.
- **Key pieces**:
  - Color palette (dark background, gold accents, warm neutrals).
  - Typography stacks for headings and body.
  - Reusable utilities (shadows, animations, component classes).
- **Impact on UX**: Ensures a unified “luxury watch boutique” look across all pages.

### `.env` / `.env.example`
- **Role**: Environment configuration.
- **Main keys**:
  - `VITE_API_BASE_URL`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Rule**: Only `VITE_*` keys are exposed to the browser; secrets stay on backend.

### `.gitignore`
- **Role**: Keeps build artifacts, `node_modules`, and secrets out of git.

---

## 2. Public Assets

### `public/_redirects`
- **Role**: Netlify SPA routing.
- **Content**: `/* /index.html 200`
- **Why**: Allows deep links like `/catalog` to load via React Router instead of 404.

### `public/favicon.ico`, `public/logo.svg`, OG images
- **Role**: Branding and social preview.
- **Impact**: Professional browser tab icon, header logo, and link previews.

---

## 3. Entry Points

### `src/main.jsx`
- **Role**: App bootstrap.
- **Key actions**:
  - Mounts `App` into `#root`.
  - Wraps with `BrowserRouter`.
  - Wraps with `AuthProvider`, `CartProvider`, `WishlistProvider`.
  - Imports `globals.css`.
- **Impact**: Sets up routing and global state for the entire UI.

### `src/App.jsx`
- **Role**: Root component shell.
- **Key actions**:
  - Renders `AppRouter`.
  - Renders global toast provider.
  - Optionally handles global loading/scroll restoration.

---

## 4. API Layer — `src/api`

> All files here focus on **HTTP communication only**. No React, no UI logic.

### `src/api/axiosInstance.js`
- **Role**: Single configured Axios client.
- **Key features**:
  - Uses `VITE_API_BASE_URL`.
  - Attaches `Authorization` header from stored token.
  - Handles 401 → refresh token → retry flow.
  - Normalizes error messages.

### `src/api/authService.js`
- **Role**: Authentication.
- **Main functions**:
  - `register`, `login`, `logout`, `refreshToken`.
  - `forgotPassword`, `resetPassword`, `getMe`.

### `src/api/watchService.js`
- **Role**: Watch catalog + vendor watch CRUD.
- **Main functions**:
  - Catalog: `getWatches`, `getWatchById`, `getFeaturedWatches`, `getTrendingWatches`, `searchWatches`.
  - Vendor: `createWatch`, `updateWatch`, `deleteWatch`, `getVendorWatches`.

### `src/api/orderService.js`
- **Role**: Orders, checkout, and payments.
- **Main functions**:
  - `checkout`, `getOrders`, `getOrderById`, `cancelOrder`.
  - Vendor: `getVendorOrders`, `updateOrderStatus`.
  - Payment: `createPaymentIntent`.

### `src/api/cartService.js`
- **Role**: Server-backed shopping cart.
- **Main functions**:
  - `getCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`, `mergeCart`.

### `src/api/wishlistService.js`
- **Role**: Wishlist persistence.
- **Main functions**:
  - `getWishlist`, `addToWishlist`, `removeFromWishlist`.

### `src/api/reviewService.js`
- **Role**: Reviews and ratings.
- **Main functions**:
  - `getReviewsByWatch`, `submitReview`, `getMyReviews`.

### `src/api/couponService.js`
- **Role**: Coupons and discounts.
- **Main functions**:
  - `validateCoupon`, `getVendorCoupons`, `createCoupon`, `deactivateCoupon`.

### `src/api/referralService.js`
- **Role**: Referral program.
- **Main functions**:
  - `getReferralCode`, `getReferralStats`.

### `src/api/vendorService.js`
- **Role**: Vendor analytics and inventory.
- **Main functions**:
  - `getDashboardStats`, `getRevenueByRange`, `getTopWatches`, `getInventorySummary`, `updateLowStockThreshold`.

---

## 5. Components — Common (`src/components/common`)

> Reusable primitives used across the app.

### `Button.jsx`
- **Role**: Single source of truth for buttons.
- **Key props**: `variant`, `size`, `loading`, `fullWidth`, `leftIcon`, `rightIcon`.
- **Impact**: Consistent CTA look and interaction everywhere.

### `Input.jsx`
- **Role**: Labeled input with error/hint states.
- **Key props**: `label`, `error`, `hint`, `leftIcon`, `rightIcon`, `type`, etc.
- **Impact**: Clean, accessible forms across login, checkout, vendor forms.

### `Badge.jsx`
- **Role**: Status/label chips.
- **Usage**: Stock status, order status, tags like movement type.

### `Modal.jsx`
- **Role**: Accessible dialog wrapper (based on ShadCN).
- **Usage**: Confirmations, forms, detail overlays.

### `Spinner.jsx`
- **Role**: Loading indicators.
- **Usage**: Buttons, page loaders, data fetching states.

### `Pagination.jsx`
- **Role**: Paginated navigation.
- **Usage**: Catalog, order lists, admin/vendor tables.

### `EmptyState.jsx`
- **Role**: Friendly empty list placeholder.
- **Usage**: Empty catalog, cart, wishlist, orders, etc.

### `ErrorMessage.jsx`
- **Role**: Inline or banner-style error display.

### `ConfirmDialog.jsx`
- **Role**: Confirm destructive actions.
- **Usage**: Delete watch, cancel order, etc.

---

## 6. Components — Watch (`src/components/watch`)

> The core of the product browsing experience.

### `WatchCard.jsx`
- **Role**: Main product tile in catalog and carousels.
- **Shows**: Image, brand, model, price, rating, stock, wishlist/add-to-cart actions.

### `WatchGrid.jsx`
- **Role**: Responsive grid wrapper for `WatchCard`.
- **Handles**: Loading skeletons and “no results” states.

### `WatchFilters.jsx`
- **Role**: Filter sidebar / sheet on catalog.
- **Includes**: Brand, movement, gender, price, size, materials, rating.

### `WatchImages.jsx`
- **Role**: Image gallery on product detail.
- **Features**: Thumbnails, main image, lightbox/fullscreen.

### `WatchAttributes.jsx`
- **Role**: Specification table (movement, size, materials, water resistance, warranty, etc).

### `StockBadge.jsx`
- **Role**: “In Stock / Low Stock / Out of Stock” display.

### `PriceTag.jsx`
- **Role**: Consistent price formatting/display.

### `RatingStars.jsx`
- **Role**: Star ratings (read-only or interactive).

---

## 7. Components — Order (`src/components/order`)

### `OrderSummary.jsx`
- **Role**: Price breakdown (items, discounts, shipping, total).

### `OrderTimeline.jsx`
- **Role**: Visual order progress tracker (Pending → Delivered).

### `OrderStatus.jsx`
- **Role**: Compact status badge for lists.

### `OrderCard.jsx`
- **Role**: Row/card in order history views.

---

## 8. Components — Cart (`src/components/cart`)

### `CartItem.jsx`
- **Role**: Single cart line item with quantity controls.

### `CartDrawer.jsx`
- **Role**: Slide-out cart panel from navbar.

### `CartSummary.jsx`
- **Role**: Summary panel on `/cart` page (with coupon input and totals).

---

## 9. Components — Layout (`src/components/layout`)

### `Navbar.jsx`
- **Role**: Global top navigation.
- **Includes**: Logo, main nav links, search, wishlist, cart trigger, auth dropdowns.

### `Footer.jsx`
- **Role**: Global footer with navigation and legal links.

### `Sidebar.jsx`
- **Role**: Vendor dashboard side navigation.

### `PageWrapper.jsx`
- **Role**: Consistent page width and padding wrapper.

### `DashboardLayout.jsx`
- **Role**: Shell for vendor pages combining `Navbar`, `Sidebar`, and content.

---

## 10. Components — Vendor (`src/components/vendor`)

### `VendorStats.jsx`
- **Role**: KPI cards (revenue, orders, AOV, listings).

### `RevenueChart.jsx`
- **Role**: Revenue over time chart for analytics.

### `InventoryTable.jsx`
- **Role**: Editable stock table (stock, threshold, actions).

### `LowStockAlert.jsx`
- **Role**: Banner for low-stock watches.

### `TopWatches.jsx`
- **Role**: Best-performing watches table.

---

## 11. Context — Global State (`src/context`)

### `AuthContext.jsx`
- **Role**: Authentication state and methods.
- **Provides**: `user`, `isAuthenticated`, `isLoading`, `login`, `logout`, `updateUser`.

### `CartContext.jsx`
- **Role**: Cart state and operations.
- **Provides**: `cartItems`, `itemCount`, `subtotal`, plus CRUD and drawer controls.

### `WishlistContext.jsx`
- **Role**: Wishlist state and operations.
- **Provides**: `wishlistItems`, `toggleWishlist`, `isWishlisted`.

---

## 12. Hooks — Custom (`src/hooks`)

### `useAuth.js`
- **Role**: Convenience hook around `AuthContext`.

### `useCart.js`
- **Role**: Convenience hook around `CartContext`.

### `useWishlist.js`
- **Role**: Convenience hook around `WishlistContext`.

### `useFilters.js`
- **Role**: Catalog filters state + URL sync.

### `usePagination.js`
- **Role**: Page/limit state and props for `Pagination`.

### `useDebounce.js`
- **Role**: Debounced values for search and sliders.

---

## 13. Pages — Auth (`src/pages/auth`)

### `Login.jsx`
- **Role**: Login form for customers and vendors.
- **Features**: form validation, forgot password, redirects by role.

### `Register.jsx`
- **Role**: Registration for customer/vendor.
- **Features**: role selection, optional referral code, vendor-specific fields.

---

## 14. Pages — Customer (`src/pages/customer`)

### `Home.jsx`
- **Role**: Landing page with hero, featured watches, categories, and trust sections.

### `Catalog.jsx`
- **Role**: Full product listing with filters and sorting.

### `WatchDetail.jsx`
- **Role**: Product detail page with gallery, specs, price, actions, and related items.

### `Cart.jsx`
- **Role**: Full-page cart view.

### `Checkout.jsx`
- **Role**: Address, review, and payment flow.

### `OrderList.jsx`
- **Role**: Customer order history.

### `OrderDetail.jsx`
- **Role**: Single order details with timeline and summary.

### `Wishlist.jsx`
- **Role**: Saved watches list.

### `Profile.jsx`
- **Role**: Account details, addresses, security, referral link.

---

## 15. Pages — Vendor (`src/pages/vendor`)

### `Dashboard.jsx`
- **Role**: Vendor overview (stats, charts, recent orders, alerts).

### `ManageWatches.jsx`
- **Role**: Table-based watch listing manager.

### `AddWatch.jsx`
- **Role**: New watch listing form.

### `EditWatch.jsx`
- **Role**: Edit existing watch listing.

### `VendorOrders.jsx`
- **Role**: Manage incoming orders.

### `Inventory.jsx`
- **Role**: Focused stock management view.

### `Analytics.jsx`
- **Role**: Deep-dive vendor analytics.

---

## 16. Pages — Admin (`src/pages/admin`)

### `AdminDashboard.jsx`
- **Role**: High-level platform metrics.

### `Users.jsx`
- **Role**: Manage customers and vendors.

### `Reviews.jsx`
- **Role**: Review moderation queue.

---

## 17. Routes (`src/routes`)

### `AppRouter.jsx`
- **Role**: Central route configuration for all public, customer, vendor, and admin pages.

### `ProtectedRoute.jsx`
- **Role**: Blocks unauthenticated access and redirects to `/login`.

### `RoleRoute.jsx`
- **Role**: Restricts certain routes to specific roles (`vendor`, `customer`, `admin`).

---

## 18. Utils (`src/utils`)

### `constants.js`
- **Role**: Shared enums/config (roles, movement types, order status, pagination, etc).

### `formatCurrency.js`
- **Role**: Locale-aware price formatting.

### `formatDate.js`
- **Role**: Date and time formatting helpers.

### `validateSchema.js`
- **Role**: Shared zod schemas for frontend forms (login, register, watch, review, checkout).

---

## 19. Styles (`src/styles`)

### `globals.css`
- **Role**: Global styling and Tailwind setup.
- **Includes**:
  - Google font imports.
  - Tailwind base/components/utilities.
  - CSS variables for brand colors.
  - Global scroll, selection, and scrollbar styles.
  - Reusable CSS utility classes (e.g., `.glass-card`, `.section-title`).

---

## 20. High-Level Dependency Flow

main.jsx
└─ App.jsx
   └─ AppRouter.jsx
      ├─ Layout (Navbar, Footer, PageWrapper, DashboardLayout, Sidebar)
      ├─ Auth pages (Login, Register)
      ├─ Customer pages (Home, Catalog, WatchDetail, Cart, Checkout, Orders, Wishlist, Profile)
      ├─ Vendor pages (Dashboard, ManageWatches, Add/EditWatch, VendorOrders, Inventory, Analytics)
      └─ Admin pages (AdminDashboard, Users, Reviews)
