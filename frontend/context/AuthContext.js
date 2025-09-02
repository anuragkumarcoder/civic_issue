import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api';
import { setToken, removeToken, getToken, isAuthenticated, getUser } from '../utils/auth';
import { useToast } from '../components/Toast';

// Create the auth context
const AuthContext = createContext();

/**
 * AuthProvider component for managing authentication state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  // Initialize auth state from token
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Get user data from token
          const userData = getUser();
          setUser(userData);
          
          // Optionally verify token with backend
          try {
            const response = await api.get('/auth/me');
            setUser(response.data);
          } catch (error) {
            // If token is invalid, log out
            if (error.status === 401) {
              logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Register a new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise resolving to the registration result
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      
      // Set token and user data
      setToken(response.data.token);
      setUser(response.data.user);
      
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      const message = error.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log in a user
   * 
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Promise resolving to the login result
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      
      // Set token and user data
      setToken(response.data.token);
      setUser(response.data.user);
      
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      const message = error.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    removeToken();
    setUser(null);
    router.push('/login');
    toast.info('You have been logged out.');
  };

  /**
   * Update the current user's profile
   * 
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise resolving to the update result
   */
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', userData);
      setUser(response.data);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.message || 'Failed to update profile. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change the current user's password
   * 
   * @param {Object} passwordData - Password change data
   * @returns {Promise} - Promise resolving to the password change result
   */
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/change-password', passwordData);
      toast.success('Password changed successfully!');
      return response.data;
    } catch (error) {
      const message = error.message || 'Failed to change password. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request a password reset for a user
   * 
   * @param {Object} emailData - Email data for password reset
   * @returns {Promise} - Promise resolving to the password reset request result
   */
  const requestPasswordReset = async (emailData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', emailData);
      toast.success('Password reset instructions sent to your email!');
      return response.data;
    } catch (error) {
      const message = error.message || 'Failed to request password reset. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset a user's password with a reset token
   * 
   * @param {Object} resetData - Password reset data
   * @returns {Promise} - Promise resolving to the password reset result
   */
  const resetPassword = async (resetData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', resetData);
      toast.success('Password reset successful! You can now log in with your new password.');
      return response.data;
    } catch (error) {
      const message = error.message || 'Failed to reset password. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has admin role
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: isAdmin(),
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for using authentication context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};