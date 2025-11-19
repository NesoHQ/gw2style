// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { syncLikedPostsFromBackend, clearLikedCache } from '../utils/likes';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', {
          signal: controller.signal,
        });
        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.username) {
            setUser({ username: data.data.username });
            
            // Sync liked posts from backend to localStorage
            syncLikedPostsFromBackend().catch(err => {
              console.error('Failed to sync liked posts:', err);
            });
          } else {
            setUser(null);
            clearLikedCache(); // Clear cache when logged out
          }
        } else {
          setUser(null);
          clearLikedCache(); // Clear cache when logged out
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch user:', err);
        if (isMounted) {
          setUser(null);
          clearLikedCache();
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
