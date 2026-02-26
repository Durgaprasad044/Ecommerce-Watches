import { createContext, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // ADD
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity:
            (updated[existingIndex].quantity || 0) + quantity,
        };
        return updated;
      }

      return [...prev, { ...product, quantity }];
    });
  };

  // UPDATE QUANTITY
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity drops below 1
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // REMOVE
  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== productId)
    );
  };

  // CLEAR
  const clearCart = () => setCartItems([]);

  // ⭐ CART COUNT (for Navbar)
  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  }, [cartItems]);

  // ⭐ CART TOTAL (for Order Summary)
  const cartTotal = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;