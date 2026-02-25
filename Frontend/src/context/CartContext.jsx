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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;