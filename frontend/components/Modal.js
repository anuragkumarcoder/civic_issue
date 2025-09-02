import React, { useEffect, useRef } from 'react';

/**
 * Modal component for displaying dialogs and popups
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {boolean} props.closeOnOutsideClick - Whether to close the modal when clicking outside
 * @param {boolean} props.showCloseButton - Whether to show the close button
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md', 
  closeOnOutsideClick = true,
  showCloseButton = true
}) => {
  const modalRef = useRef(null);
  
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Handle outside click
  const handleOutsideClick = (event) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  // Modal size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };
  
  const modalSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full ${modalSizeClass} transform transition-all`}
        ref={modalRef}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Modal Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Confirmation Modal component for confirming actions
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onConfirm - Function to call when the action is confirmed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Text for the confirm button
 * @param {string} props.cancelText - Text for the cancel button
 * @param {string} props.confirmButtonType - Type of the confirm button: 'primary', 'danger', 'warning', 'success'
 */
export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to perform this action?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmButtonType = 'primary'
}) => {
  // Button type classes
  const buttonTypes = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  };
  
  const buttonTypeClass = buttonTypes[confirmButtonType] || buttonTypes.primary;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          {message}
        </p>
      </div>
      
      <div className="mt-4 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onClose}
        >
          {cancelText}
        </button>
        
        <button
          type="button"
          className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonTypeClass}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

/**
 * Form Modal component for forms in a modal
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onSubmit - Function to call when the form is submitted
 * @param {React.ReactNode} props.children - Form content
 * @param {string} props.title - Modal title
 * @param {string} props.submitText - Text for the submit button
 * @param {string} props.cancelText - Text for the cancel button
 * @param {boolean} props.isSubmitting - Whether the form is submitting
 */
export const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  children, 
  title = 'Form', 
  submitText = 'Submit', 
  cancelText = 'Cancel',
  isSubmitting = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={onSubmit}>
        <div className="mt-2">
          {children}
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {cancelText}
          </button>
          
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Modal;