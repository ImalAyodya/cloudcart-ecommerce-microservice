
import API from "../config/api";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API.users}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
  } catch (error) {
    throw { message: "Login failed" };
  }
};

/**
 * Register new user
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API.users}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
  } catch (error) {
    throw { message: "Registration failed" };
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API.users}/profile`, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  } catch (error) {
    throw { message: "Failed to fetch profile" };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await fetch(`${API.users}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return await response.json();
  } catch (error) {
    throw { message: "Failed to update profile" };
  }
};

/**
 * Change password
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await fetch(`${API.users}/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    if (!response.ok) throw new Error("Failed to change password");
    return await response.json();
  } catch (error) {
    throw { message: "Failed to change password" };
  }
};

/**
 * Get all users (Admin)
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API.users}/users`, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    throw { message: "Failed to fetch users" };
  }
};

/**
 * Get user by ID (Admin)
 */
export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API.users}/users/${id}`, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    return await response.json();
  } catch (error) {
    throw { message: "Failed to fetch user" };
  }
};

/**
 * Update user by ID (Admin)
 */
export const updateUserById = async (id, userData) => {
  try {
    const response = await fetch(`${API.users}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return await response.json();
  } catch (error) {
    throw { message: "Failed to update user" };
  }
};

/**
 * Delete user by ID (Admin)
 */
export const deleteUserById = async (id) => {
  try {
    const response = await fetch(`${API.users}/users/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return await response.json();
  } catch (error) {
    throw { message: "Failed to delete user" };
  }
};