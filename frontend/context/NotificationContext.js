import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from '../components/Toast';

// Create the notification context
const NotificationContext = createContext();

/**
 * NotificationProvider component for managing user notifications
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  /**
   * Fetch user notifications
   */
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
      
      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Mark a notification as read
   */
  const markAsRead = async (notificationId) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.put(`/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      
      return true;
    } catch (error) {
      setError(error.message || 'Failed to mark notification as read');
      console.error('Error marking notification as read:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await api.put('/notifications/read-all');
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          read: true
        }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      toast.success('All notifications marked as read');
      return true;
    } catch (error) {
      setError(error.message || 'Failed to mark all notifications as read');
      toast.error('Failed to mark all notifications as read');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a notification
   */
  const deleteNotification = async (notificationId) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/notifications/${notificationId}`);
      
      // Update local state
      const deletedNotification = notifications.find(
        notification => notification.id === notificationId
      );
      
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      
      // Update unread count if the deleted notification was unread
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      
      toast.success('Notification deleted');
      return true;
    } catch (error) {
      setError(error.message || 'Failed to delete notification');
      toast.error('Failed to delete notification');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear all notifications
   */
  const clearAllNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete('/notifications');
      
      // Update local state
      setNotifications([]);
      setUnreadCount(0);
      
      toast.success('All notifications cleared');
      return true;
    } catch (error) {
      setError(error.message || 'Failed to clear notifications');
      toast.error('Failed to clear notifications');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Set up polling for new notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Initial fetch
    fetchNotifications();
    
    // Set up polling interval (every 2 minutes)
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, fetchNotifications]);

  // Handle WebSocket notifications if implemented
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // This is a placeholder for WebSocket implementation
    // When a new notification arrives via WebSocket:
    const handleNewNotification = (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for new notification
      toast.info(newNotification.message, {
        title: 'New Notification',
        duration: 5000,
        onClick: () => markAsRead(newNotification.id)
      });
    };
    
    // Clean up function would disconnect from WebSocket
    return () => {
      // Disconnect from WebSocket
    };
  }, [isAuthenticated, toast]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook for using notification context
 * @returns {Object} Notification context value
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};