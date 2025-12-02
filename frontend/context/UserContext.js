// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/auth';
import { syncLikedPostsFromBackend, clearLikedCache } from '../utils/likes';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate it
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      // Sync liked posts from backend to localStorage
      syncLikedPostsFromBackend().catch(err => {
        console.error('Failed to sync liked posts:', err);
      });
    } else {
      clearLikedCache();
    }
    
    setLoading(false);
  }, []);

  const login = async (apiKey) => {
    try {
      const userData = await auth.login(apiKey);
      setUser(userData);
      
      // Sync liked posts after successful login
      await syncLikedPostsFromBackend().catch(err => {
        console.error('Failed to sync liked posts:', err);
      });
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setUser(null);
      clearLikedCache();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if backend call fails
      setUser(null);
      clearLikedCache();
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
