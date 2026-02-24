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
