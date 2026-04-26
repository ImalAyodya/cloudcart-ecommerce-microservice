import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as loginAPI, registerUser as registerAPI, getUserProfile as getProfileAPI } from '../services/userService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);

  // Get cart key unique per user
  const cartKey = (userData) => `cart_${userData?._id || userData?.id || "guest"}`;

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
        const storedCart = localStorage.getItem(cartKey(parsed));
        setCart(storedCart ? JSON.parse(storedCart) : []);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setLoading(false);
    } else if (token) {
      // Token exists but no stored user — fetch profile from API
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Persist cart whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(cartKey(user), JSON.stringify(cart));
    }
  }, [cart, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfileAPI();
      setUser(data);
      setIsAuthenticated(true);
      setError(null);
      // Load cart for this user
      const storedCart = localStorage.getItem(cartKey(data));
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginAPI(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      // Load cart for this user
      const storedCart = localStorage.getItem(cartKey(response.user));
      setCart(storedCart ? JSON.parse(storedCart) : []);
      return response;
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await registerAPI(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      setCart([]);
      return response;
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setCart([]);
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
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
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
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUserProfile,
    updateUser,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
