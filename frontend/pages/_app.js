import { useEffect } from 'react';
import '@styles/globals.css';
import '../styles/logo-options.css';
import { UserProvider } from '../context/UserContext';
import { initializeSkinCache } from '../utils/skinCache';

function Application({ Component, pageProps }) {
  // Initialize skin cache on app load
  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      initializeSkinCache().catch(error => {
        console.error('Failed to initialize skin cache:', error);
      });
    }
  }, []);

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default Application;

