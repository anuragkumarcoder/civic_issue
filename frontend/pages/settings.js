import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon, EyeIcon, ArrowPathIcon, LanguageIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const { user } = useAuth();
  const { themeMode, setThemeMode, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('appearance');
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: false,
    issueUpdates: true,
    comments: true,
    statusChanges: true,
    systemAnnouncements: true
  });
  const router = useRouter();
  
  useEffect(() => {
    // Load saved preferences from localStorage
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setFontSize(savedFontSize);
    setReducedMotion(savedReducedMotion);
    setHighContrast(savedHighContrast);
    setLanguage(savedLanguage);
    
    // Apply preferences to document
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    document.documentElement.setAttribute('data-reduced-motion', savedReducedMotion);
    document.documentElement.setAttribute('data-high-contrast', savedHighContrast);
    document.documentElement.setAttribute('lang', savedLanguage);
    
    // Fetch notification preferences if user is logged in
    if (user) {
      fetchNotificationPreferences();
    }
  }, [user]);
  
  const fetchNotificationPreferences = async () => {
    try {
      // This would be an API call in a real application
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/notification-preferences`, {
      //   headers: { Authorization: `Bearer ${user.token}` }
      // });
      // const data = await response.json();
      // setNotificationPreferences(data.preferences);
      
      // For demo purposes, we'll use localStorage
      const savedPreferences = localStorage.getItem('notificationPreferences');
      if (savedPreferences) {
        setNotificationPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };
  
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.setAttribute('data-font-size', size);
  };
  
  const handleReducedMotionChange = (e) => {
    const value = e.target.checked;
    setReducedMotion(value);
    localStorage.setItem('reducedMotion', value);
    document.documentElement.setAttribute('data-reduced-motion', value);
  };
  
  const handleHighContrastChange = (e) => {
    const value = e.target.checked;
    setHighContrast(value);
    localStorage.setItem('highContrast', value);
    document.documentElement.setAttribute('data-high-contrast', value);
  };
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    // In a real app, you would also update your i18n context/service here
  };
  
  const handleNotificationPreferenceChange = (key, value) => {
    const newPreferences = { ...notificationPreferences, [key]: value };
    setNotificationPreferences(newPreferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
    
    // In a real app, you would also make an API call to update the user's preferences
    // updateNotificationPreferences(newPreferences);
  };
  
  const resetAllSettings = () => {
    // Reset theme
    setThemeMode('system');
    
    // Reset font size
    setFontSize('medium');
    localStorage.setItem('fontSize', 'medium');
    document.documentElement.setAttribute('data-font-size', 'medium');
    
    // Reset reduced motion
    setReducedMotion(false);
    localStorage.setItem('reducedMotion', false);
    document.documentElement.setAttribute('data-reduced-motion', false);
    
    // Reset high contrast
    setHighContrast(false);
    localStorage.setItem('highContrast', false);
    document.documentElement.setAttribute('data-high-contrast', false);
    
    // Reset language
    setLanguage('en');
    localStorage.setItem('language', 'en');
    document.documentElement.setAttribute('lang', 'en');
    
    // Reset notification preferences
    const defaultNotificationPreferences = {
      email: true,
      push: false,
      issueUpdates: true,
      comments: true,
      statusChanges: true,
      systemAnnouncements: true
    };
    setNotificationPreferences(defaultNotificationPreferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(defaultNotificationPreferences));
  };
  
  return (
    <>
      <Head>
        <title>Settings | Civic Issue Reporting System</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Customize your experience</p>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`py-2 px-4 font-medium ${activeTab === 'appearance' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Appearance
            </button>
            <button
              onClick={() => setActiveTab('language')}
              className={`py-2 px-4 font-medium ${activeTab === 'language' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Language
            </button>
            {user && (
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-4 font-medium ${activeTab === 'notifications' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Notifications
              </button>
            )}
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-2 px-4 font-medium ${activeTab === 'privacy' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Privacy
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setThemeMode('light')}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${themeMode === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <SunIcon className="h-8 w-8 text-amber-500 mb-2" />
                        <span>Light</span>
                      </button>
                      
                      <button
                        onClick={() => setThemeMode('dark')}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${themeMode === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <MoonIcon className="h-8 w-8 text-indigo-500 mb-2" />
                        <span>Dark</span>
                      </button>
                      
                      <button
                        onClick={() => setThemeMode('system')}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${themeMode === 'system' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <ComputerDesktopIcon className="h-8 w-8 text-gray-500 mb-2" />
                        <span>System</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Font Size</h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleFontSizeChange('small')}
                        className={`px-4 py-2 rounded-md ${fontSize === 'small' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        Small
                      </button>
                      <button
                        onClick={() => handleFontSizeChange('medium')}
                        className={`px-4 py-2 rounded-md ${fontSize === 'medium' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => handleFontSizeChange('large')}
                        className={`px-4 py-2 rounded-md ${fontSize === 'large' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <EyeIcon className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <h3 className="font-medium">High Contrast</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better readability</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={highContrast}
                          onChange={handleHighContrastChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ArrowPathIcon className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <h3 className="font-medium">Reduced Motion</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Minimize animations throughout the interface</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={reducedMotion}
                          onChange={handleReducedMotionChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Language Tab */}
            {activeTab === 'language' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <LanguageIcon className="h-6 w-6 mr-2 text-primary-600" />
                    <h2 className="text-xl font-semibold">Language Settings</h2>
                  </div>
                  
                  <p className="mb-4 text-gray-600 dark:text-gray-400">Select your preferred language for the application interface.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`flex items-center p-3 rounded-lg border ${language === 'en' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <span className="text-xl mr-2">🇺🇸</span>
                      <span>English</span>
                    </button>
                    
                    <button
                      onClick={() => handleLanguageChange('es')}
                      className={`flex items-center p-3 rounded-lg border ${language === 'es' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <span className="text-xl mr-2">🇪🇸</span>
                      <span>Español</span>
                    </button>
                    
                    <button
                      onClick={() => handleLanguageChange('fr')}
                      className={`flex items-center p-3 rounded-lg border ${language === 'fr' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <span className="text-xl mr-2">🇫🇷</span>
                      <span>Français</span>
                    </button>
                    
                    <button
                      onClick={() => handleLanguageChange('de')}
                      className={`flex items-center p-3 rounded-lg border ${language === 'de' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <span className="text-xl mr-2">🇩🇪</span>
                      <span>Deutsch</span>
                    </button>
                    
                    <button
                      onClick={() => handleLanguageChange('zh')}
                      className={`flex items-center p-3 rounded-lg border ${language === 'zh' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <span className="text-xl mr-2">🇨🇳</span>
                      <span>中文</span>
                    </button>
                    
                    <button
                      onClick={() => handleLanguageChange('ja')}
                      className={`flex items-center p-3 rounded-lg border ${language === 'ja' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <span className="text-xl mr-2">🇯🇵</span>
                      <span>日本語</span>
                    </button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Note: Changing the language will reload the application. Any unsaved changes may be lost.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && user && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <BellIcon className="h-6 w-6 mr-2 text-primary-600" />
                    <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications in your browser</p>
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
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium mb-3">Notify me about:</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">Issue Updates</p>
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
                            <p className="text-sm">Comments</p>
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
                            <p className="text-sm">Status Changes</p>
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
                            <p className="text-sm">System Announcements</p>
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
                </div>
              </div>
            )}
            
            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <ShieldCheckIcon className="h-6 w-6 mr-2 text-primary-600" />
                    <h2 className="text-xl font-semibold">Privacy Settings</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Analytics Cookies</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow us to collect anonymous usage data to improve the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          defaultChecked={true}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Location Sharing</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow precise location for issue reporting</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          defaultChecked={true}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show My Name on Reports</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Display your name on issues you report</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          defaultChecked={true}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Data Management</h3>
                    <div className="flex flex-col space-y-2">
                      <button className="text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md">
                        Download My Data
                      </button>
                      <button className="text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md">
                        View Privacy Policy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reset Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Reset Settings</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">Restore all settings to their default values.</p>
                <button
                  onClick={resetAllSettings}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                >
                  Reset All Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}