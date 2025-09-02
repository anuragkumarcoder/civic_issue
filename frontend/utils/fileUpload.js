/**
 * File upload utility functions
 */

/**
 * Converts a file to a base64 string for preview
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - A promise that resolves to the base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a FormData object with file and additional data
 * @param {Object} data - The form data
 * @param {File} file - The file to upload
 * @param {string} fileFieldName - The name of the file field
 * @returns {FormData} - The FormData object
 */
export const createFormDataWithFile = (data, file, fileFieldName = 'image') => {
  const formData = new FormData();
  
  // Add the file if it exists
  if (file) {
    formData.append(fileFieldName, file);
  }
  
  // Add other form data
  Object.keys(data).forEach(key => {
    // Skip the file field and null/undefined values
    if (key !== fileFieldName && data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

/**
 * Validates a file type
 * @param {File} file - The file to validate
 * @param {Array<string>} allowedTypes - The allowed MIME types
 * @returns {boolean} - Whether the file type is valid
 */
export const isValidFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validates a file size
 * @param {File} file - The file to validate
 * @param {number} maxSizeInBytes - The maximum file size in bytes
 * @returns {boolean} - Whether the file size is valid
 */
export const isValidFileSize = (file, maxSizeInBytes = 5 * 1024 * 1024) => { // Default 5MB
  if (!file) return false;
  return file.size <= maxSizeInBytes;
};

/**
 * Formats a file size for display
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - The number of decimal places
 * @returns {string} - The formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Gets the file extension from a file name
 * @param {string} filename - The file name
 * @returns {string} - The file extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

/**
 * Checks if a file is an image
 * @param {File} file - The file to check
 * @returns {boolean} - Whether the file is an image
 */
export const isImageFile = (file) => {
  if (!file) return false;
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return imageTypes.includes(file.type);
};

const fileUpload = {
  fileToBase64,
  createFormDataWithFile,
  isValidFileType,
  isValidFileSize,
  formatFileSize,
  getFileExtension,
  isImageFile,
};

export default fileUpload;