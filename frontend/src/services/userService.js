import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://user-service.agreeableriver-79a7139e.southeastasia.azurecontainerapps.io';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Login failed');
  }
};

/**
 * Register new user
 * @param {object} userData - User registration data
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Registration failed');
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch profile');
  }
};

/**
 * Update user profile
 * @param {object} userData - Updated user data
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to update profile');
  }
};

/**
 * Change password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post('/api/users/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to change password');
  }
};