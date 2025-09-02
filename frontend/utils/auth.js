/**
 * Authentication utility functions for token management
 */

import jwtDecode from 'jwt-decode';

// Token storage keys
const TOKEN_KEY = 'civic_auth_token';

/**
 * Saves the authentication token to localStorage
 * @param {string} token - The JWT token
 */
export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieves the authentication token from localStorage
 * @returns {string|null} - The JWT token or null if not found
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Removes the authentication token from localStorage
 */
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Checks if a user is authenticated (has a valid token)
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    removeToken();
    return false;
  }
};

/**
 * Gets the current user information from the token
 * @returns {Object|null} - The user object or null if not authenticated
 */
export const getCurrentUser = () => {
  if (!isAuthenticated()) return null;
  
  try {
    const token = getToken();
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Checks if the current user has admin role
 * @returns {boolean} - Whether the user is an admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'ADMIN';
};

/**
 * Gets the authorization header with the token
 * @returns {Object} - The authorization header object
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Refreshes the authentication token
 * @param {string} newToken - The new JWT token
 */
export const refreshToken = (newToken) => {
  setToken(newToken);
};

const auth = {
  setToken,
  getToken,
  removeToken,
  isAuthenticated,
  getCurrentUser,
  isAdmin,
  getAuthHeader,
  refreshToken,
};

export default auth;