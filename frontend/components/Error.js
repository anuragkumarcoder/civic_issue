import React from 'react';
import Link from 'next/link';

/**
 * Error message component for displaying error states
 * 
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {string} props.code - Error code (e.g., '404', '500')
 * @param {string} props.title - Error title
 * @param {boolean} props.showHomeLink - Whether to show a link to the home page
 * @param {boolean} props.showRetry - Whether to show a retry button
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 */
const Error = ({ 
  message = 'An error occurred', 
  code, 
  title = 'Error', 
  showHomeLink = true,
  showRetry = false,
  onRetry = () => {}
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      {code && (
        <div className="text-6xl font-bold text-red-500 mb-4">{code}</div>
      )}
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      
      <p className="text-gray-600 mb-6">{message}</p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        {showRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
        
        {showHomeLink && (
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
            Go to Home
          </Link>
        )}
      </div>
    </div>
  );
};

/**
 * Not Found component for displaying 404 errors
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message to display
 */
export const NotFound = ({ message = 'The page you are looking for does not exist.' }) => {
  return (
    <Error 
      code="404" 
      title="Page Not Found" 
      message={message} 
      showHomeLink={true}
    />
  );
};

/**
 * Server Error component for displaying 500 errors
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message to display
 * @param {boolean} props.showRetry - Whether to show a retry button
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 */
export const ServerError = ({ 
  message = 'Something went wrong on our server. Please try again later.', 
  showRetry = true,
  onRetry = () => window.location.reload()
}) => {
  return (
    <Error 
      code="500" 
      title="Server Error" 
      message={message} 
      showHomeLink={true}
      showRetry={showRetry}
      onRetry={onRetry}
    />
  );
};

/**
 * Access Denied component for displaying 403 errors
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message to display
 */
export const AccessDenied = ({ message = 'You do not have permission to access this page.' }) => {
  return (
    <Error 
      code="403" 
      title="Access Denied" 
      message={message} 
      showHomeLink={true}
    />
  );
};

/**
 * Form Error component for displaying form validation errors
 * 
 * @param {Object} props
 * @param {string} props.message - Error message to display
 */
export const FormError = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="text-red-500 text-sm mt-1">{message}</div>
  );
};

/**
 * API Error component for displaying API errors
 * 
 * @param {Object} props
 * @param {Object|string} props.error - Error object or message
 * @param {boolean} props.showRetry - Whether to show a retry button
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 */
export const ApiError = ({ error, showRetry = true, onRetry }) => {
  let errorMessage = 'An error occurred while fetching data';
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.error) {
    errorMessage = error.error;
  }
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{errorMessage}</span>
      
      {showRetry && onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 text-sm text-red-700 underline hover:text-red-800"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;