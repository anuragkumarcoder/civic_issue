import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import Layout from '../components/Layout';
import { useEffect } from 'react';

// Import services for initialization
import configService from '../services/config';
import errorReportingService from '../services/errorReporting';
import i18nService from '../services/i18n';

function MyApp({ Component, pageProps }) {
  // Initialize services on app mount
  useEffect(() => {
    // Initialize configuration service
    configService.initialize();
    
    // Initialize error reporting service
    if (process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true') {
      errorReportingService.initialize();
    }
    
    // Initialize internationalization service
    i18nService.initialize();
  }, []);
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster position="top-right" />
          </Layout>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;