import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import Header from '@components/Header';
import Footer from '@components/Footer';
import styles from '../styles/User.module.css';

export default function UserPage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        // Clear the user from context
        setUser(null);
        // Redirect to home page
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container">
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>User Profile</h1>
        <div className={styles.profile}>
          <h2>Welcome, {user.username}!</h2>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
