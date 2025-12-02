import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@components/Header';
import { useUser } from '../context/UserContext';
import Layout from '@components/Layout';

export default function LoginPage() {
  const { login } = useUser();
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Use the new auth service directly
      const user = await login(apiKey);
      
      setMessage({
        type: 'success',
        text: 'Login successful! Welcome, ' + user.username,
      });

      // Redirect after short delay
      setTimeout(() => router.push('/'), 600);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Login failed. Please check your API key.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login" description="Login to GW2Style with your Guild Wars 2 API key">
      <div className="page-header">
        <h1 className="page-title">Login</h1>
        <p className="page-description">
          Enter your Guild Wars 2 API key to access your account
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Guide Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(36, 41, 56, 0.6), rgba(26, 31, 46, 0.6))',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            color: '#d4af37',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            How to Get Your API Key
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {/* Step 1 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              borderLeft: '4px solid #d4af37',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
                color: '#0a0e1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>1</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#e8e6e3', margin: 0 }}>
                  Visit{' '}
                  <a
                    href="https://account.arena.net/applications"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#4a7ba7',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    account.arena.net/applications
                  </a>
                  {' '}and click "New Key"
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              borderLeft: '4px solid #d4af37',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
                color: '#0a0e1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>2</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#e8e6e3', margin: '0 0 0.5rem 0' }}>
                  Name it <strong style={{ color: '#d4af37' }}>gw2style</strong> and check these permissions:
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#d4af37',
                  }}>✓ account</span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#d4af37',
                  }}>✓ characters</span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#d4af37',
                  }}>✓ builds</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              borderLeft: '4px solid #d4af37',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
                color: '#0a0e1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>3</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#e8e6e3', margin: 0 }}>
                  Copy your API key and paste it below
                </p>
              </div>
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            color: '#a8a29e',
            fontSize: '0.875rem',
            marginTop: '1.5rem',
            fontStyle: 'italic',
          }}>
            Already have an API key with these permissions? Use that instead!
          </p>
        </div>

        {/* Login Form */}
        <div style={{ maxWidth: 600, margin: '0 auto' }}></div>
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

          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }} autoComplete="off">
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="apiKey"
                style={{
                  display: 'block',
                  fontFamily: "'Cinzel', serif",
                  color: '#d4af37',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '0.5rem',
                }}
              >
                Guild Wars 2 API Key
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="apiKey"
                  name="search"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                  placeholder="Enter your GW2 API key"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-form-type="other"
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 1rem',
                    background: 'rgba(26, 31, 46, 0.6)',
                    border: '2px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '6px',
                    color: '#e8e6e3',
                    fontSize: '1rem',
                    fontFamily: "'Lato', 'Inter', sans-serif",
                    transition: 'all 0.3s ease',
                    WebkitTextSecurity: showApiKey ? 'none' : 'disc',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d4af37';
                    e.target.style.background = 'rgba(26, 31, 46, 0.8)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1), 0 0 15px rgba(212, 175, 55, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    e.target.style.background = 'rgba(26, 31, 46, 0.6)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#a8a29e',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#d4af37'}
                  onMouseLeave={(e) => e.target.style.color = '#a8a29e'}
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#a8a29e',
                marginTop: '0.5rem',
                fontStyle: 'italic',
              }}>
                Get your API key from{' '}
                <a
                  href="https://account.arena.net/applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#4a7ba7', textDecoration: 'none' }}
                >
                  account.arena.net
                </a>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: loading ? 'rgba(168, 162, 158, 0.2)' : 'linear-gradient(135deg, #d4af37, #cd7f32)',
                border: `2px solid ${loading ? 'rgba(168, 162, 158, 0.3)' : '#f4d03f'}`,
                borderRadius: '8px',
                color: loading ? 'rgba(168, 162, 158, 0.6)' : '#0a0e1a',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.4), 0 0 30px rgba(212, 175, 55, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          {message && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: message.type === 'error' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              border: `2px solid ${message.type === 'error' ? 'rgba(220, 38, 38, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
              borderLeft: `4px solid ${message.type === 'error' ? '#dc2626' : '#10b981'}`,
              borderRadius: '6px',
              color: message.type === 'error' ? '#fca5a5' : '#6ee7b7',
              position: 'relative',
              paddingLeft: '2.5rem',
            }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
              }}>
                {message.type === 'error' ? '⚠' : '✓'}
              </span>
              {message.text}
            </div>
          )}
        </div>
        </div>
    </Layout>
  );
}
