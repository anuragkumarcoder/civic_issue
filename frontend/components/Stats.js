import React from 'react';

/**
 * StatCard component for displaying a single statistic
 * 
 * @param {Object} props
 * @param {string} props.title - Stat title
 * @param {string|number} props.value - Stat value
 * @param {string} props.icon - Optional icon component
 * @param {string} props.change - Optional change value (e.g., '+10%')
 * @param {boolean} props.isPositive - Whether the change is positive
 * @param {string} props.bgColor - Background color class
 * @param {string} props.textColor - Text color class
 */
export const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  isPositive = true,
  bgColor = 'bg-white',
  textColor = 'text-gray-900'
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-sm border border-gray-200 p-6`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className={`mt-1 text-3xl font-semibold ${textColor}`}>{value}</p>
          
          {change && (
            <p className={`mt-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        
        {icon && (
          <div className="p-3 bg-gray-100 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * StatsGrid component for displaying multiple statistics in a grid
 * 
 * @param {Object} props
 * @param {Array} props.stats - Array of stat objects
 * @param {number} props.columns - Number of columns (default: 3)
 */
export const StatsGrid = ({ stats = [], columns = 3 }) => {
  // Grid column classes
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  
  const gridClass = gridClasses[columns] || gridClasses[3];

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

/**
 * ProgressBar component for displaying progress
 * 
 * @param {Object} props
 * @param {number} props.value - Current value
 * @param {number} props.max - Maximum value
 * @param {string} props.label - Label text
 * @param {string} props.color - Color class
 * @param {string} props.size - Size class: 'sm', 'md', 'lg'
 */
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  label, 
  color = 'bg-blue-600', 
  size = 'md' 
}) => {
  // Calculate percentage
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  // Size classes
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };
  
  const heightClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">{value}/{max}</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${heightClass}`}>
        <div 
          className={`${color} rounded-full ${heightClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

/**
 * DashboardWidget component for displaying a widget with a title and content
 * 
 * @param {Object} props
 * @param {string} props.title - Widget title
 * @param {React.ReactNode} props.children - Widget content
 * @param {boolean} props.loading - Whether the widget is loading
 * @param {boolean} props.error - Whether there was an error loading the widget
 * @param {Function} props.onRefresh - Function to call when the widget is refreshed
 */
export const DashboardWidget = ({ 
  title, 
  children, 
  loading = false, 
  error = false, 
  onRefresh 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            disabled={loading}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="sr-only">Refresh</span>
            <svg className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-base text-gray-500">Failed to load data</p>
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

/**
 * Stats component for displaying dashboard statistics
 * 
 * @param {Object} props
 * @param {Object} props.data - Statistics data
 * @param {boolean} props.loading - Whether the stats are loading
 * @param {boolean} props.error - Whether there was an error loading the stats
 * @param {Function} props.onRefresh - Function to call when the stats are refreshed
 */
const Stats = ({ data = {}, loading = false, error = false, onRefresh }) => {
  // Default stats icons
  const icons = {
    users: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    issues: (
      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    resolved: (
      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    comments: (
      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  };
  
  // Format stats data
  const formatStats = () => {
    if (!data || loading || error) {
      return [];
    }
    
    return [
      {
        title: 'Total Users',
        value: data.totalUsers || 0,
        icon: icons.users,
        change: data.userGrowth,
        isPositive: true,
      },
      {
        title: 'Total Issues',
        value: data.totalIssues || 0,
        icon: icons.issues,
        change: data.issueGrowth,
        isPositive: true,
      },
      {
        title: 'Resolved Issues',
        value: data.resolvedIssues || 0,
        icon: icons.resolved,
        change: data.resolvedPercentage ? `${data.resolvedPercentage}%` : undefined,
        isPositive: true,
      },
      {
        title: 'Total Comments',
        value: data.totalComments || 0,
        icon: icons.comments,
        change: data.commentGrowth,
        isPositive: true,
      },
    ];
  };

  return (
    <DashboardWidget 
      title="Dashboard Statistics" 
      loading={loading} 
      error={error} 
      onRefresh={onRefresh}
    >
      <StatsGrid stats={formatStats()} columns={4} />
    </DashboardWidget>
  );
};

export default Stats;