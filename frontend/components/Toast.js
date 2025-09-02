import React, { useState, useEffect, createContext, useContext } from 'react';

// Create a context for toast notifications
const ToastContext = createContext();

/**
 * Toast types and their corresponding styles
 */
const TOAST_TYPES = {
  SUCCESS: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    textColor: 'text-green-800',
    icon: (
      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  ERROR: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    textColor: 'text-red-800',
    icon: (
      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
  WARNING: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-800',
    icon: (
      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  INFO: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-800',
    icon: (
      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  },
};

/**
 * Toast component for displaying notifications
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the toast
 * @param {string} props.type - Type of toast: 'SUCCESS', 'ERROR', 'WARNING', 'INFO'
 * @param {string} props.message - Message to display
 * @param {Function} props.onClose - Function to call when the toast is closed
 * @param {number} props.autoClose - Time in milliseconds before auto-closing (0 to disable)
 */
const Toast = ({ id, type = 'INFO', message, onClose, autoClose = 5000 }) => {
  const toastStyle = TOAST_TYPES[type] || TOAST_TYPES.INFO;
  
  // Auto-close the toast after the specified time
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [id, autoClose, onClose]);

  return (
    <div className={`rounded-md border ${toastStyle.borderColor} ${toastStyle.bgColor} p-4 shadow-sm`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {toastStyle.icon}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${toastStyle.textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => onClose(id)}
              className={`inline-flex rounded-md p-1.5 ${toastStyle.bgColor} ${toastStyle.textColor} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${toastStyle.bgColor} focus:ring-blue-500`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ToastContainer component for displaying multiple toasts
 * 
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects
 * @param {Function} props.removeToast - Function to remove a toast
 * @param {string} props.position - Position of the toast container: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
 */
const ToastContainer = ({ toasts, removeToast, position = 'top-right' }) => {
  // Position classes
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };
  
  const positionClass = positionClasses[position] || positionClasses['top-right'];

  return (
    <div className={`fixed ${positionClass} z-50 m-4 w-72 space-y-4`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
          autoClose={toast.autoClose}
        />
      ))}
    </div>
  );
};

/**
 * ToastProvider component for managing toast state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.position - Position of the toast container
 */
export const ToastProvider = ({ children, position = 'top-right' }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = (type, message, autoClose = 5000) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, type, message, autoClose }]);
    return id;
  };

  // Remove a toast by ID
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Convenience methods for different toast types
  const success = (message, autoClose) => addToast('SUCCESS', message, autoClose);
  const error = (message, autoClose) => addToast('ERROR', message, autoClose);
  const warning = (message, autoClose) => addToast('WARNING', message, autoClose);
  const info = (message, autoClose) => addToast('INFO', message, autoClose);

  // Clear all toasts
  const clearToasts = () => setToasts([]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} position={position} />
    </ToastContext.Provider>
  );
};

/**
 * Hook for using toast notifications
 * @returns {Object} Toast methods: success, error, warning, info, clearToasts
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;