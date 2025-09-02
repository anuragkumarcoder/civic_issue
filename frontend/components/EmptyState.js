import React from 'react';
import Link from 'next/link';

/**
 * Empty state component for displaying when there is no data
 * 
 * @param {Object} props
 * @param {string} props.title - Title text
 * @param {string} props.message - Message text
 * @param {string} props.icon - Icon component or element
 * @param {string} props.actionText - Text for the action button
 * @param {string} props.actionLink - Link for the action button
 * @param {Function} props.onAction - Function to call when action button is clicked
 */
const EmptyState = ({ 
  title = 'No data found', 
  message = 'There are no items to display at this time.', 
  icon, 
  actionText, 
  actionLink, 
  onAction 
}) => {
  // Default icon if none provided
  const defaultIcon = (
    <svg 
      className="w-12 h-12 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      ></path>
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-4">
        {icon || defaultIcon}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      
      <p className="text-sm text-gray-500 mb-6 max-w-md">{message}</p>
      
      {(actionText && actionLink) && (
        <Link 
          href={actionLink} 
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionText}
        </Link>
      )}
      
      {(actionText && onAction) && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

/**
 * Empty Issues component for displaying when there are no issues
 * 
 * @param {Object} props
 * @param {boolean} props.isFiltered - Whether the empty state is due to filtering
 * @param {boolean} props.showCreateAction - Whether to show the create action button
 */
export const EmptyIssues = ({ isFiltered = false, showCreateAction = true }) => {
  const title = isFiltered ? 'No matching issues found' : 'No issues yet';
  const message = isFiltered 
    ? 'Try adjusting your filters to find what you\'re looking for.'
    : 'Be the first to report an issue in your community.';
  
  const icon = (
    <svg 
      className="w-12 h-12 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      ></path>
    </svg>
  );

  return (
    <EmptyState 
      title={title}
      message={message}
      icon={icon}
      actionText={showCreateAction && !isFiltered ? 'Report an Issue' : undefined}
      actionLink={showCreateAction && !isFiltered ? '/issues/create' : undefined}
    />
  );
};

/**
 * Empty Comments component for displaying when there are no comments
 */
export const EmptyComments = () => {
  const icon = (
    <svg 
      className="w-12 h-12 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      ></path>
    </svg>
  );

  return (
    <EmptyState 
      title="No comments yet"
      message="Be the first to leave a comment on this issue."
      icon={icon}
    />
  );
};

/**
 * Empty Search component for displaying when search returns no results
 * 
 * @param {Object} props
 * @param {string} props.searchTerm - The search term that returned no results
 */
export const EmptySearch = ({ searchTerm }) => {
  const icon = (
    <svg 
      className="w-12 h-12 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      ></path>
    </svg>
  );

  return (
    <EmptyState 
      title="No results found"
      message={searchTerm ? `No results found for "${searchTerm}". Try a different search term.` : 'No results found for your search.'}
      icon={icon}
    />
  );
};

export default EmptyState;