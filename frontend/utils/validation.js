/**
 * Form validation utility functions
 */

/**
 * Validates a required field
 * @param {string} value - The field value
 * @returns {string|null} - Error message or null if valid
 */
export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required';
  }
  return null;
};

/**
 * Validates an email field
 * @param {string} value - The email value
 * @returns {string|null} - Error message or null if valid
 */
export const validateEmail = (value) => {
  if (!value) return validateRequired(value);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validates a password field
 * @param {string} value - The password value
 * @returns {string|null} - Error message or null if valid
 */
export const validatePassword = (value) => {
  if (!value) return validateRequired(value);
  
  if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Password must contain at least one letter and one number';
  }
  
  return null;
};

/**
 * Validates password confirmation
 * @param {string} value - The confirmation password
 * @param {string} password - The original password
 * @returns {string|null} - Error message or null if valid
 */
export const validatePasswordConfirmation = (value, password) => {
  if (!value) return validateRequired(value);
  
  if (value !== password) {
    return 'Passwords do not match';
  }
  
  return null;
};

/**
 * Validates a name field
 * @param {string} value - The name value
 * @returns {string|null} - Error message or null if valid
 */
export const validateName = (value) => {
  if (!value) return validateRequired(value);
  
  if (value.length < 2) {
    return 'Name must be at least 2 characters';
  }
  
  if (value.length > 50) {
    return 'Name must be less than 50 characters';
  }
  
  return null;
};

/**
 * Validates a title field
 * @param {string} value - The title value
 * @returns {string|null} - Error message or null if valid
 */
export const validateTitle = (value) => {
  if (!value) return validateRequired(value);
  
  if (value.length < 5) {
    return 'Title must be at least 5 characters';
  }
  
  if (value.length > 100) {
    return 'Title must be less than 100 characters';
  }
  
  return null;
};

/**
 * Validates a description field
 * @param {string} value - The description value
 * @returns {string|null} - Error message or null if valid
 */
export const validateDescription = (value) => {
  if (!value) return validateRequired(value);
  
  if (value.length < 10) {
    return 'Description must be at least 10 characters';
  }
  
  if (value.length > 1000) {
    return 'Description must be less than 1000 characters';
  }
  
  return null;
};

/**
 * Validates a location field
 * @param {string} value - The location value
 * @returns {string|null} - Error message or null if valid
 */
export const validateLocation = (value) => {
  if (!value) return validateRequired(value);
  
  if (value.length < 5) {
    return 'Location must be at least 5 characters';
  }
  
  if (value.length > 100) {
    return 'Location must be less than 100 characters';
  }
  
  return null;
};

/**
 * Validates a comment field
 * @param {string} value - The comment value
 * @returns {string|null} - Error message or null if valid
 */
export const validateComment = (value) => {
  if (!value) return validateRequired(value);
  
  if (value.length < 3) {
    return 'Comment must be at least 3 characters';
  }
  
  if (value.length > 500) {
    return 'Comment must be less than 500 characters';
  }
  
  return null;
};

/**
 * Validates an image file
 * @param {File} file - The image file
 * @returns {string|null} - Error message or null if valid
 */
export const validateImage = (file) => {
  if (!file) return null; // Image is optional
  
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'File must be a valid image (JPEG, PNG, GIF, or WEBP)';
  }
  
  // 5MB max size
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'Image must be less than 5MB';
  }
  
  return null;
};

/**
 * Validates a form object with multiple fields
 * @param {Object} values - The form values
 * @param {Object} validationRules - The validation rules for each field
 * @returns {Object} - Object with errors for each field
 */
export const validateForm = (values, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = values[field];
    const validator = validationRules[field];
    
    if (typeof validator === 'function') {
      const error = validator(value, values);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

/**
 * Checks if a form has any validation errors
 * @param {Object} errors - The form errors object
 * @returns {boolean} - Whether the form has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};