import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getPageNumbers } from '../utils/pagination';

/**
 * Pagination component for navigating through paginated data
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current page number (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {string} props.baseUrl - Base URL for pagination links
 * @param {Object} props.queryParams - Additional query parameters to include in pagination links
 * @param {number} props.maxPageButtons - Maximum number of page buttons to show (default: 5)
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  baseUrl = '', 
  queryParams = {}, 
  maxPageButtons = 5 
}) => {
  const router = useRouter();
  
  // If there's only one page or no pages, don't render pagination
  if (totalPages <= 1) return null;
  
  // Get the array of page numbers to display
  const pageNumbers = getPageNumbers(currentPage, totalPages, maxPageButtons);
  
  // Create URL for a specific page
  const createPageUrl = (page) => {
    const query = { ...queryParams, page };
    // Remove undefined or null values
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === null || query[key] === '') {
        delete query[key];
      }
    });
    
    return {
      pathname: baseUrl || router.pathname,
      query
    };
  };

  return (
    <div className="flex justify-center my-8">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {/* Previous Page Button */}
        <Link 
          href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${currentPage > 1 ? 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50' : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'} text-sm font-medium`}
          aria-disabled={currentPage <= 1}
          onClick={(e) => currentPage <= 1 && e.preventDefault()}
        >
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        
        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          // If page is ellipsis, render a span instead of a link
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            );
          }
          
          // Otherwise render a link to the page
          return (
            <Link
              key={`page-${page}`}
              href={createPageUrl(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
            >
              {page}
            </Link>
          );
        })}
        
        {/* Next Page Button */}
        <Link 
          href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${currentPage < totalPages ? 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50' : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'} text-sm font-medium`}
          aria-disabled={currentPage >= totalPages}
          onClick={(e) => currentPage >= totalPages && e.preventDefault()}
        >
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;