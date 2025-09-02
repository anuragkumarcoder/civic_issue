import React from 'react';
import Link from 'next/link';
import { formatDate } from '../utils/helpers';

/**
 * UserAvatar component for displaying user avatar
 * 
 * @param {Object} props
 * @param {string} props.name - User name
 * @param {string} props.size - Avatar size: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {string} props.bgColor - Background color class
 */
export const UserAvatar = ({ name, size = 'md', bgColor = 'bg-blue-500' }) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };
  
  const avatarSize = sizeClasses[size] || sizeClasses.md;
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className={`${avatarSize} ${bgColor} rounded-full flex items-center justify-center text-white font-medium`}>
      {getInitials(name)}
    </div>
  );
};

/**
 * UserInfo component for displaying user information
 * 
 * @param {Object} props
 * @param {Object} props.user - User data
 * @param {boolean} props.showRole - Whether to show user role
 * @param {boolean} props.showJoinDate - Whether to show user join date
 * @param {boolean} props.showEmail - Whether to show user email
 */
export const UserInfo = ({ user, showRole = true, showJoinDate = true, showEmail = false }) => {
  if (!user) return null;

  return (
    <div className="flex items-center">
      <UserAvatar name={user.name} size="md" />
      
      <div className="ml-3">
        <h3 className="text-base font-medium text-gray-900">{user.name}</h3>
        
        <div className="text-sm text-gray-500">
          {showEmail && user.email && (
            <p>{user.email}</p>
          )}
          
          {showRole && user.role && (
            <p className="capitalize">{user.role.toLowerCase()}</p>
          )}
          
          {showJoinDate && user.createdAt && (
            <p>Joined {formatDate(user.createdAt)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * UserCard component for displaying user information in a card
 * 
 * @param {Object} props
 * @param {Object} props.user - User data
 * @param {boolean} props.showStats - Whether to show user stats
 * @param {boolean} props.linkToProfile - Whether to link to user profile
 */
const UserProfile = ({ user, showStats = true, linkToProfile = true }) => {
  if (!user) return null;
  
  const userContent = (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center text-center">
        <UserAvatar name={user.name} size="xl" />
        
        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          
          {user.email && (
            <p className="text-gray-500 mt-1">{user.email}</p>
          )}
          
          {user.role && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2 capitalize">
              {user.role.toLowerCase()}
            </span>
          )}
        </div>
        
        {showStats && user.stats && (
          <div className="mt-6 grid grid-cols-2 gap-4 w-full">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-2xl font-bold text-gray-900">{user.stats.issuesCount || 0}</p>
              <p className="text-sm text-gray-500">Issues Reported</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-2xl font-bold text-gray-900">{user.stats.commentsCount || 0}</p>
              <p className="text-sm text-gray-500">Comments</p>
            </div>
          </div>
        )}
        
        {user.createdAt && (
          <p className="text-sm text-gray-500 mt-4">
            Member since {formatDate(user.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
  
  if (linkToProfile && user.id) {
    return (
      <Link href={`/admin/users/${user.id}`} className="block hover:opacity-90 transition-opacity">
        {userContent}
      </Link>
    );
  }
  
  return userContent;
};

export default UserProfile;