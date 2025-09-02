/**
 * Pagination utility functions
 */

/**
 * Calculates pagination information
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} - Pagination information
 */
export const getPaginationInfo = (totalItems, currentPage = 1, itemsPerPage = 10) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  
  return {
    totalItems,
    currentPage: validCurrentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1,
  };
};

/**
 * Generates an array of page numbers for pagination UI
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} maxPageButtons - Maximum number of page buttons to show
 * @returns {Array} - Array of page numbers and ellipsis indicators
 */
export const getPageNumbers = (currentPage, totalPages, maxPageButtons = 5) => {
  if (totalPages <= maxPageButtons) {
    // If total pages is less than max buttons, show all pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  // Always show first page, last page, current page, and pages around current page
  const pages = [1];
  
  const leftSideCount = Math.floor((maxPageButtons - 3) / 2);
  const rightSideCount = maxPageButtons - 3 - leftSideCount;
  
  let startPage = Math.max(2, currentPage - leftSideCount);
  let endPage = Math.min(totalPages - 1, currentPage + rightSideCount);
  
  // Adjust if we're near the beginning
  if (currentPage - leftSideCount < 2) {
    endPage = Math.min(totalPages - 1, maxPageButtons - 2);
  }
  
  // Adjust if we're near the end
  if (currentPage + rightSideCount > totalPages - 1) {
    startPage = Math.max(2, totalPages - maxPageButtons + 2);
  }
  
  // Add ellipsis before start page if needed
  if (startPage > 2) {
    pages.push('...');
  }
  
  // Add pages in the middle
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  // Add ellipsis after end page if needed
  if (endPage < totalPages - 1) {
    pages.push('...');
  }
  
  // Add last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
};

/**
 * Calculates the API query parameters for pagination
 * @param {number} page - Current page number (1-based)
 * @param {number} limit - Number of items per page
 * @returns {Object} - Query parameters for API request
 */
export const getPaginationParams = (page = 1, limit = 10) => {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, limit);
  
  return {
    page: validPage,
    limit: validLimit,
    skip: (validPage - 1) * validLimit,
  };
};

/**
 * Creates a URL with pagination parameters
 * @param {string} baseUrl - Base URL
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} additionalParams - Additional query parameters
 * @returns {string} - URL with pagination parameters
 */
export const createPaginationUrl = (baseUrl, page, limit, additionalParams = {}) => {
  const params = new URLSearchParams();
  
  // Add pagination parameters
  params.append('page', page);
  params.append('limit', limit);
  
  // Add additional parameters
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Parses pagination parameters from URL query string
 * @param {Object} query - Next.js router query object
 * @param {number} defaultPage - Default page number
 * @param {number} defaultLimit - Default items per page
 * @returns {Object} - Parsed pagination parameters
 */
export const parsePaginationParams = (query, defaultPage = 1, defaultLimit = 10) => {
  const page = query.page ? parseInt(query.page, 10) : defaultPage;
  const limit = query.limit ? parseInt(query.limit, 10) : defaultLimit;
  
  return {
    page: isNaN(page) ? defaultPage : Math.max(1, page),
    limit: isNaN(limit) ? defaultLimit : Math.max(1, limit),
  };
};

const pagination = {
  getPaginationInfo,
  getPageNumbers,
  getPaginationParams,
  createPaginationUrl,
  parsePaginationParams,
};

export default pagination;