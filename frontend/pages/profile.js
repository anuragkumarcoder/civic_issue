import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  UserIcon, 
  EnvelopeIcon, 
  KeyIcon, 
  BellIcon,
  MapPinIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userIssues, setUserIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: false,
    issueUpdates: true,
    comments: true,
    statusChanges: true,
    systemAnnouncements: true
  });
  
  const { user, getAuthHeader, loading } = useAuth();
  const { themeMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error('You must be logged in to view your profile');
        router.push('/login');
      } else {
        // Populate form with user data
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          location: user.location || '',
          bio: user.bio || ''
        }));
        setIsLoading(false);
      }
    }
  }, [user, loading, router]);
  
  // Fetch user's issues when the issues tab is active
  useEffect(() => {
    if (!loading && user && activeTab === 'issues') {
      fetchUserIssues();
    }
  }, [loading, user, activeTab]);
  
  // Fetch notification preferences when the notifications tab is active
  useEffect(() => {
    if (!loading && user && activeTab === 'notifications') {
      fetchNotificationPreferences();
    }
  }, [loading, user, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
    // Clear password fields when toggling
    if (!changePassword) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }
  };

  const fetchUserIssues = async () => {
    try {
      setLoadingIssues(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/issues`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      
      const data = await response.json();
      setUserIssues(data.issues || []);
    } catch (error) {
      console.error('Error fetching user issues:', error);
      toast.error('Failed to load your issues');
    } finally {
      setLoadingIssues(false);
    }
  };
  
  const fetchNotificationPreferences = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/notification-preferences`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
      }
      
      const data = await response.json();
      setNotificationPreferences(data.preferences || {
        email: true,
        push: false,
        issueUpdates: true,
        comments: true,
        statusChanges: true,
        systemAnnouncements: true
      });
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate passwords if changing password
      if (changePassword) {
        if (!formData.currentPassword) {
          throw new Error('Current password is required');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (formData.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters');
        }
      }

      // Prepare data for API
      const updateData = {
        name: formData.name,
        location: formData.location,
        bio: formData.bio
      };

      // Only include password fields if changing password
      if (changePassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      
      // Reset password fields if they were changed
      if (changePassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        setChangePassword(false);
      }
    } catch (error) {
      toast.error(error.message || 'Error updating profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNotificationPreferenceChange = async (key, value) => {
    try {
      const newPreferences = { ...notificationPreferences, [key]: value };
      setNotificationPreferences(newPreferences);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/notification-preferences`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: newPreferences }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }
      
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error(error.message || 'Failed to update notification preferences');
      // Revert the change
      fetchNotificationPreferences();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Profile | Civic Issue Reporting System</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600 mb-8">Manage your account information and settings</p>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-4 font-medium ${activeTab === 'security' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-4 font-medium ${activeTab === 'notifications' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`py-2 px-4 font-medium ${activeTab === 'issues' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              My Issues
            </button>
          </div>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden`}>
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="input pl-10 w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="input pl-10 w-full bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="input pl-10 w-full"
                          placeholder="Your city or neighborhood"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio (Optional)
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Tell us a bit about yourself"
                      />
                    </div>
                  
                    <div className="pt-6 flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden`}>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            className="input pl-10 w-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className="input pl-10 w-full"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Password must be at least 6 characters</p>
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="input pl-10 w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={isSubmitting}
                          onClick={() => setChangePassword(true)}
                        >
                          {isSubmitting ? 'Changing...' : 'Change Password'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden`}>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
                  <p className="mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        // Handle account deletion
                        toast.error('Account deletion is disabled in this demo');
                      }
                    }}
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
                  
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationPreferences.email}
                        onChange={(e) => handleNotificationPreferenceChange('email', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationPreferences.push}
                        onChange={(e) => handleNotificationPreferenceChange('push', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Issue Updates</h3>
                      <p className="text-sm text-gray-500">Notifications about issues you've reported or followed</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationPreferences.issueUpdates}
                        onChange={(e) => handleNotificationPreferenceChange('issueUpdates', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Comments</h3>
                      <p className="text-sm text-gray-500">Notifications about new comments on your issues</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationPreferences.comments}
                        onChange={(e) => handleNotificationPreferenceChange('comments', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Status Changes</h3>
                      <p className="text-sm text-gray-500">Notifications when issue status changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationPreferences.statusChanges}
                        onChange={(e) => handleNotificationPreferenceChange('statusChanges', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">System Announcements</h3>
                      <p className="text-sm text-gray-500">Important updates about the platform</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationPreferences.systemAnnouncements}
                        onChange={(e) => handleNotificationPreferenceChange('systemAnnouncements', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* My Issues Tab */}
          {activeTab === 'issues' && (
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">My Reported Issues</h2>
                  <button
                    onClick={fetchUserIssues}
                    className="flex items-center text-primary-600 hover:text-primary-800"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Refresh
                  </button>
                </div>
                
                {loadingIssues ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4">Loading your issues...</p>
                  </div>
                ) : userIssues.length > 0 ? (
                  <div className="space-y-4">
                    {userIssues.map((issue) => (
                      <div 
                        key={issue.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium mb-1">
                            <Link href={`/issues/${issue.id}`} className="hover:text-primary-600">
                              {issue.title}
                            </Link>
                          </h3>
                          <span className={`badge-${issue.status.toLowerCase().replace('_', '-')}`}>
                            {issue.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{issue.location}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm mb-3 line-clamp-2">{issue.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-xs">
                            {issue.category}
                          </span>
                          <div className="flex space-x-2">
                            <Link 
                              href={`/issues/${issue.id}`}
                              className="text-primary-600 hover:text-primary-800 text-sm"
                            >
                              View
                            </Link>
                            <Link 
                              href={`/issues/edit/${issue.id}`}
                              className="text-primary-600 hover:text-primary-800 text-sm"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="mb-4">You haven't reported any issues yet.</p>
                    <Link href="/issues/report" className="btn-primary py-2 px-4">
                      Report an Issue
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}