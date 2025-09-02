import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Filter component for filtering data
 * 
 * @param {Object} props
 * @param {Array} props.filters - Array of filter objects
 * @param {Object} props.activeFilters - Object of active filter values
 * @param {Function} props.onFilterChange - Function to call when filters change
 * @param {boolean} props.showClearButton - Whether to show the clear button
 */
const Filters = ({ 
  filters = [], 
  activeFilters = {}, 
  onFilterChange,
  showClearButton = true
}) => {
  const router = useRouter();
  const [localFilters, setLocalFilters] = useState(activeFilters);
  
  // Update local filters when active filters change
  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);
  
  // Handle filter change
  const handleFilterChange = (filterId, value) => {
    const newFilters = { ...localFilters, [filterId]: value };
    
    // If value is empty, remove the filter
    if (value === '' || value === null || value === undefined) {
      delete newFilters[filterId];
    }
    
    setLocalFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setLocalFilters({});
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };
  
  // Check if any filters are active
  const hasActiveFilters = Object.keys(localFilters).length > 0;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        
        {showClearButton && hasActiveFilters && (
          <button 
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id} className="flex flex-col">
            <label htmlFor={filter.id} className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            
            {filter.type === 'select' && (
              <select
                id={filter.id}
                value={localFilters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">{filter.placeholder || 'All'}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {filter.type === 'radio' && (
              <div className="mt-1 space-y-2">
                {filter.options.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`${filter.id}-${option.value}`}
                      name={filter.id}
                      type="radio"
                      value={option.value}
                      checked={localFilters[filter.id] === option.value}
                      onChange={() => handleFilterChange(filter.id, option.value)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor={`${filter.id}-${option.value}`} className="ml-3 block text-sm font-medium text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
            
            {filter.type === 'checkbox' && (
              <div className="mt-1 space-y-2">
                {filter.options.map((option) => {
                  // For checkbox groups, the value is an array
                  const values = localFilters[filter.id] || [];
                  const isChecked = Array.isArray(values) ? values.includes(option.value) : false;
                  
                  return (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`${filter.id}-${option.value}`}
                        name={filter.id}
                        type="checkbox"
                        value={option.value}
                        checked={isChecked}
                        onChange={() => {
                          let newValues;
                          
                          if (isChecked) {
                            // Remove value if already checked
                            newValues = values.filter(v => v !== option.value);
                          } else {
                            // Add value if not checked
                            newValues = [...values, option.value];
                          }
                          
                          handleFilterChange(filter.id, newValues.length > 0 ? newValues : undefined);
                        }}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`${filter.id}-${option.value}`} className="ml-3 block text-sm font-medium text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
            
            {filter.type === 'text' && (
              <input
                type="text"
                id={filter.id}
                value={localFilters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                placeholder={filter.placeholder || 'Search...'}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            )}
            
            {filter.type === 'date' && (
              <input
                type="date"
                id={filter.id}
                value={localFilters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * IssueFilters component for filtering issues
 * 
 * @param {Object} props
 * @param {Object} props.activeFilters - Object of active filter values
 * @param {Function} props.onFilterChange - Function to call when filters change
 */
export const IssueFilters = ({ activeFilters = {}, onFilterChange }) => {
  // Define issue filters
  const issueFilters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'OPEN', label: 'Open' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'RESOLVED', label: 'Resolved' },
        { value: 'CLOSED', label: 'Closed' },
      ],
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'ROADS', label: 'Roads' },
        { value: 'WATER', label: 'Water' },
        { value: 'ELECTRICITY', label: 'Electricity' },
        { value: 'SANITATION', label: 'Sanitation' },
        { value: 'SAFETY', label: 'Safety' },
        { value: 'OTHER', label: 'Other' },
      ],
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Search by location...',
    },
  ];

  return (
    <Filters 
      filters={issueFilters} 
      activeFilters={activeFilters} 
      onFilterChange={onFilterChange} 
    />
  );
};

/**
 * SearchBar component for searching data
 * 
 * @param {Object} props
 * @param {string} props.value - Search value
 * @param {Function} props.onChange - Function to call when search value changes
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.autoSubmit - Whether to auto-submit the form on change
 */
export const SearchBar = ({ 
  value = '', 
  onChange, 
  placeholder = 'Search...', 
  autoSubmit = true 
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(value);
  
  // Update search term when value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);
  
  // Handle search change
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    if (autoSubmit) {
      // Debounce search to avoid too many requests
      const timeoutId = setTimeout(() => {
        if (onChange) {
          onChange(newValue);
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  };
  
  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (onChange) {
      onChange(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
        />
        
        {!autoSubmit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="submit"
              className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Search</span>
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default Filters;