import React from 'react';

/**
 * Loading spinner component with different sizes and variants
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the spinner: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} props.variant - Variant of the spinner: 'primary', 'secondary', 'white' (default: 'primary')
 * @param {string} props.text - Optional text to display below the spinner
 * @param {boolean} props.fullScreen - Whether to display the spinner in full screen mode
 */
const Loading = ({ size = 'md', variant = 'primary', text, fullScreen = false }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };
  
  // Text size classes
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = variantClasses[variant] || variantClasses.primary;
  const textSize = textSizeClasses[size] || textSizeClasses.md;
  
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <svg 
        className={`animate-spin ${spinnerSize} ${spinnerColor}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      
      {text && (
        <p className={`mt-2 ${textSize} ${spinnerColor}`}>{text}</p>
      )}
    </div>
  );
  
  // If fullScreen, render the spinner in the center of the screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }
  
  // Otherwise, render the spinner inline
  return spinner;
};

/**
 * Loading skeleton component for content placeholders
 * 
 * @param {Object} props
 * @param {string} props.type - Type of skeleton: 'text', 'circle', 'rectangle' (default: 'text')
 * @param {string} props.width - Width of the skeleton (default: 'full')
 * @param {string} props.height - Height of the skeleton (default depends on type)
 * @param {number} props.count - Number of skeleton items to render (default: 1)
 */
export const Skeleton = ({ type = 'text', width = 'full', height, count = 1 }) => {
  // Default heights based on type
  const defaultHeights = {
    text: 'h-4',
    circle: 'h-12',
    rectangle: 'h-24',
  };
  
  // Width classes
  const widthClasses = {
    full: 'w-full',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    '1/4': 'w-1/4',
    '3/4': 'w-3/4',
  };
  
  const heightClass = height || defaultHeights[type] || 'h-4';
  const widthClass = widthClasses[width] || (type === 'circle' ? 'w-12' : widthClasses.full);
  
  // For circle type, ensure equal width and height and rounded-full
  const typeClasses = type === 'circle' ? 'rounded-full' : 'rounded';
  
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div 
          key={index} 
          className={`animate-pulse bg-gray-200 ${widthClass} ${heightClass} ${typeClasses} mb-2`}
        ></div>
      ))}
    </>
  );
};

/**
 * Page loading component for full page loading states
 */
export const PageLoading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Loading size="lg" text="Loading..." />
    </div>
  );
};

/**
 * Button loading component for showing loading state in buttons
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the spinner: 'sm', 'md' (default: 'sm')
 * @param {string} props.color - Color of the spinner: 'white', 'primary' (default: 'white')
 */
export const ButtonLoading = ({ size = 'sm', color = 'white' }) => {
  return <Loading size={size} variant={color} />;
};

export default Loading;