Prompt:

You are a Senior React Frontend Architect.

My Watch Ecommerce project has two major problems:

1️⃣ Catalog page shows:
- 0 results
- No watches found
- Brand filters empty

2️⃣ Cart icon does not work.
- When I click "Add to Cart", nothing persists.
- Clicking cart icon does not show added items.
- Cart should dynamically show items and quantity.

I want a COMPLETE frontend fix.

Tech Stack:
- React
- React Router
- Tailwind CSS
- Context API (for cart)
- Local mock data (no backend yet)

-----------------------------------------
PART 1 — FIX CATALOG
-----------------------------------------

1. Create a mock data file:
   src/data/watches.js

Include at least 3–4 watches for each:
- Rolex
- Omega
- Patek Philippe
- Audemars Piguet

Structure:

{
  id,
  brand,
  model,
  price,
  image
}

Images should be imported from:
src/assets/

2. Fix filter logic so that:
- All watches show by default
- Brand filter works
- Search works (case-insensitive)
- Price filter works
- No filter removes everything by mistake

3. Ensure brands are dynamically derived:

const brands = [...new Set(watches.map(w => w.brand))];

4. Ensure watch grid renders correctly even if no filters are applied.

-----------------------------------------
PART 2 — FIX CART SYSTEM
-----------------------------------------

Implement a proper CartContext.

Create:
src/context/CartContext.jsx

Cart must:

- Store cartItems array
- Add item
- Increase quantity if already exists
- Remove item
- Clear cart
- Calculate total price

Structure:

{
  id,
  model,
  price,
  image,
  quantity
}

-----------------------------------------

Wrap App with CartProvider in main.jsx:

<CartProvider>
   <App />
</CartProvider>

-----------------------------------------

PART 3 — ADD TO CART LOGIC

Inside WatchCard:

- Add "Add to Cart" button
- Use useContext(CartContext)
- Call addToCart(watch)

-----------------------------------------

PART 4 — CART ICON

Navbar must:

- Show cart item count badge
- Be clickable
- Navigate to "/cart"

-----------------------------------------

PART 5 — CART PAGE

Create:
src/pages/Cart.jsx

Cart page must:

- Show all cart items
- Show image
- Show model name
- Show price
- Show quantity
- Increase / decrease quantity
- Remove item
- Show total price
- Show empty cart state if none

-----------------------------------------

ROUTING

Ensure:

<Route path="/cart" element={<Cart />} />

-----------------------------------------

OUTPUT FORMAT

Provide:

- watches.js mock data
- CartContext.jsx
- Updated Catalog.jsx filtering logic
- WatchCard with add to cart
- Navbar cart badge logic
- Cart.jsx page
- App.jsx routing updates

Make it modular.
Make it clean.
Make it production-ready.
No shortcuts.