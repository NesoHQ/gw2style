import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import Header from '@components/Header';
import Footer from '@components/Footer';
import styles from '../styles/User.module.css';
import Layout from '@components/Layout';

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
    <Layout title="Profile" description="Your GW2Style profile">
      <div className="page-header">
        <h1 className="page-title">User Profile</h1>
        <p className="page-description">
          Manage your account and preferences
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(36, 41, 56, 0.9))',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            color: '#d4af37',
            fontSize: '1rem',
            opacity: 0.6,
          }}>◆</div>
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: '#d4af37',
            fontSize: '1rem',
            opacity: 0.6,
          }}>◆</div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid rgba(212, 175, 55, 0.5)',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a0e1a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '2rem',
              color: '#d4af37',
              marginBottom: '0.5rem',
            }}>
              {user.username}
            </h2>
            
            <p style={{
              color: '#a8a29e',
              fontSize: '1rem',
              marginBottom: '2rem',
            }}>
              Guild Wars 2 Account
            </p>

            <div style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
              margin: '2rem 0',
            }}></div>

            <button
              onClick={handleLogout}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                border: '2px solid #ef4444',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
