import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);

  // Get cart key unique per user
  const cartKey = (userData) => `cart_${userData?._id || userData?.id || "guest"}`;

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAuthenticated(true);
      const storedCart = localStorage.getItem(cartKey(parsed));
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
    setLoading(false);
  }, []);

  // Persist cart whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(cartKey(user), JSON.stringify(cart));
    }
  }, [cart, user]);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    const storedCart = localStorage.getItem(cartKey(userData));
    setCart(storedCart ? JSON.parse(storedCart) : []);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCart([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Add item to cart (or increase qty if already exists)
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const id = product._id || product.id;
      const existing = prev.find((item) => (item._id || item.id) === id);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  // Update item quantity
  const updateCartQty = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev) =>
      prev.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => setCart([]);

  // Total item count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Total price
  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartCount,
    cartTotal,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
